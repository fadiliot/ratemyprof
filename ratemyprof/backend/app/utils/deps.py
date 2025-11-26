# app/utils/deps.py
from fastapi import Cookie, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt

from app.utils.jwt_handler import decode_access_token, SECRET_KEY, ALGORITHM

# --- Cookie-based auth (for browser / frontend) ---

def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
        )

    try:
        payload = decode_access_token(access_token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
        )

    # You can optionally look up the user in users_col here
    return {"email": email}


# --- Optional: Bearer-token auth (for tools / Postman, etc.) ---

security = HTTPBearer()

def verify_token(auth: HTTPAuthorizationCredentials = Depends(security)):
    token = auth.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["sub"]  # email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
