# app/utils/jwt_handler.py
import jwt
from datetime import datetime, timedelta

SECRET_KEY = "SUPER_SECRET_KEY_CHANGE_THIS"
ALGORITHM = "HS256"
EXPIRATION_MINUTES = 60 * 24 * 7   # 7 days


def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(minutes=EXPIRATION_MINUTES),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """
    Decode a JWT and return its payload.
    Raises jwt.ExpiredSignatureError / jwt.InvalidTokenError if invalid.
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
