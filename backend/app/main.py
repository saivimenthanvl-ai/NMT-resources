from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os

from .database import Base, engine, get_db
from . import models
from .schemas import TranslationReq, TranslationResp, FeedbackReq

# --- create tables ---
Base.metadata.create_all(bind=engine)

app = FastAPI(title="NMT Agent (dev)")

# --- CORS (dev-friendly) ---
allow_origin = os.getenv("CORS_ORIGINS", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[allow_origin, "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def index():
    return {"service": "NMT Agent API", "docs": "/docs", "health": "/health"}

@app.get("/health")
def health():
    return {"ok": True}

# ---------- DUMMY TRANSLATOR ----------
# This is a placeholder so your frontend works end-to-end.
# Replace this with a real model call (e.g., MarianMT) later.
def _toy_translate(text: str, src: str, tgt: str) -> tuple[str, float]:
    if src == tgt:
        return text, 0.99
    # ultra-simple "fake translation": reverse words + tag
    words = text.split()
    if not words:
        return text, 0.5
    translated = " ".join(reversed(words)) + f" [{tgt}]"
    # silly confidence heuristic
    confidence = min(0.95, 0.6 + len(words) * 0.02)
    return translated, confidence

@app.post("/translate", response_model=TranslationResp)
def translate(req: TranslationReq) -> TranslationResp:
    translated, conf = _toy_translate(req.text, req.source_lang, req.target_lang)
    return TranslationResp(translation=translated, confidence=conf)

# ---------- FEEDBACK ----------
@app.post("/feedback")
def feedback(req: FeedbackReq, db: Session = Depends(get_db)):
    fb = models.Feedback(
        source_lang=req.source_lang,
        target_lang=req.target_lang,
        source_text=req.source_text,
        model_translation=req.model_translation,
        user_correction=req.user_correction,
        rating=req.rating,
    )
    db.add(fb)
    db.commit()
    db.refresh(fb)
    return {"status": "saved", "id": fb.id}
