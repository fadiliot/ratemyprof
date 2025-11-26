# app/routes/auth.py
from fastapi import APIRouter, HTTPException, Response, Cookie, Request
from fastapi.concurrency import run_in_threadpool
from datetime import datetime

from app.services.academia_login import verify_srm_login_sync
from app.db import users_col
from app.utils.jwt_handler import create_access_token, decode_access_token

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
            "createdAt": datetime.utcnow(),
        })

    token = create_access_token(email)

    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=False,   # True in production
        samesite="Lax",
        max_age=60 * 60 * 24 * 7,
    )

    return {"message": "Login successful", "email": email}


@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=False,
        samesite="Lax",
    )
    return {"message": "Logout successful"}


@router.get("/me")
async def get_me(request: Request, access_token: str = Cookie(None)):
    print("🔹 /auth/me called")
    print("🔹 Raw cookies:", request.cookies)
    print("🔹 access_token param:", access_token)

    if not access_token:
        print("🔴 No access_token cookie, returning 401")
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_access_token(access_token)
        print("🔹 Decoded payload:", payload)
    except Exception as e:
        print("🔴 Error decoding token:", repr(e))
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    email = payload.get("sub")
    if not email:
        print("🔴 No 'sub' in payload")
        raise HTTPException(status_code=401, detail="Invalid token payload")

    print("✅ Authenticated as:", email)
    return {"email": email}
