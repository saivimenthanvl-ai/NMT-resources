from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    source_lang = Column(String(16), nullable=False)
    target_lang = Column(String(16), nullable=False)
    source_text = Column(Text, nullable=False)
    model_translation = Column(Text, nullable=False)
    user_correction = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)  # 1..5 optional
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
