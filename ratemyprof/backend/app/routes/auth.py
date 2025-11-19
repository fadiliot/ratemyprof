from fastapi import APIRouter, HTTPException, Response
from fastapi.concurrency import run_in_threadpool
from app.services.academia_login import verify_srm_login_sync
from app.db import users_col
from app.utils.jwt_handler import create_access_token
from datetime import datetime

router = APIRouter()

@router.post("/login")
async def srm_login(data: dict, response: Response):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    if not (email.endswith("@srmist.edu.in") or email.endswith("@ktr.srmuniv.edu.in")):
        raise HTTPException(status_code=403, detail="Only SRM institutional emails are allowed")

    result = await run_in_threadpool(verify_srm_login_sync, email, password)
    if result["status"] == "error":
        raise HTTPException(status_code=401, detail=result["message"])

    user = users_col.find_one({"email": email})
    if not user:
        users_col.insert_one({
            "email": email,
            "createdAt": datetime.utcnow()
        })

    # Create JWT
    token = create_access_token(email)

    # Set HttpOnly Cookie
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,   # set True in production (HTTPS)
        samesite="Lax",
        max_age=60*60*24*7,  # 7 days
    )

    return {"message": "Login successful", "email": email}
