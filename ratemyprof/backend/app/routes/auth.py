# app/routes/auth.py

from fastapi import APIRouter, HTTPException
from fastapi.concurrency import run_in_threadpool
from app.services.academia_login import verify_srm_login_sync

router = APIRouter()

@router.post("/login")
async def srm_login(data: dict):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    # Only allow official SRM domains
    if not (email.endswith("@srmist.edu.in") or email.endswith("@ktr.srmuniv.edu.in")):
        raise HTTPException(status_code=403, detail="Only SRM institutional emails are allowed")

    # Run Playwright (sync) inside a thread pool so FastAPI does not block
    result = await run_in_threadpool(verify_srm_login_sync, email, password)

    if result["status"] == "error":
        raise HTTPException(status_code=401, detail=result["message"])

    return {"message": "Login successful", "email": email}
