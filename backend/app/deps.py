from fastapi import Depends, HTTPException
from jose import jwt
import os
from fastapi.security import HTTPBearer
security = HTTPBearer()
SECRET = os.getenv("JWT_SECRET", "devsecret")
ALGO = "HS256"

def get_current_user(token=Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET, [ALGO])
        return payload["sub"]
    except Exception:
        raise HTTPException(401, "Invalid or expired token")
