from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.hash import bcrypt
from jose import jwt
import os, datetime
from .database import get_db
from .models import User
from .schemas import UserCreate, Token

router = APIRouter(prefix="/auth", tags=["auth"])

SECRET = os.getenv("JWT_SECRET", "devsecret")
ALGO = "HS256"

@router.post("/signup", response_model=Token)
def signup(payload: UserCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(400, "Email already registered")
    user = User(email=payload.email, password_hash=bcrypt.hash(payload.password))
    db.add(user); db.commit()
    token = jwt.encode({"sub": user.email, "exp": datetime.datetime.utcnow()+datetime.timedelta(days=7)}, SECRET, ALGO)
    return {"access_token": token}

@router.post("/login", response_model=Token)
def login(payload: UserCreate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not bcrypt.verify(payload.password, user.password_hash):
        raise HTTPException(401, "Invalid credentials")
    token = jwt.encode({"sub": user.email, "exp": datetime.datetime.utcnow()+datetime.timedelta(days=7)}, SECRET, ALGO)
    return {"access_token": token}
