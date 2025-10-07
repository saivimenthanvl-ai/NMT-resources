from pydantic import BaseModel, Field
from typing import Optional

# ---- Requests ----
class TranslationReq(BaseModel):
    text: str = Field(..., min_length=1)
    source_lang: str = Field(..., min_length=2, max_length=10)
    target_lang: str = Field(..., min_length=2, max_length=10)

class FeedbackReq(BaseModel):
    source_lang: str
    target_lang: str
    source_text: str
    model_translation: str
    user_correction: Optional[str] = None
    rating: Optional[int] = Field(default=None, ge=1, le=5)

# ---- Responses ----
class TranslationResp(BaseModel):
    translation: str
    confidence: float
