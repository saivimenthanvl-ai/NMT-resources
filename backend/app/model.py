from transformers import MarianMTModel, MarianTokenizer
from functools import lru_cache

@lru_cache(maxsize=6)
def load_pair(src: str, tgt: str):
    pair = f"{src}-{tgt}"
    names = {
        "en-ta": "Helsinki-NLP/opus-mt-en-tam",
        "en-kn": "Helsinki-NLP/opus-mt-en-kn",
        "en-hi": "Helsinki-NLP/opus-mt-en-hi",
        "ta-en": "Helsinki-NLP/opus-mt-tam-en",
        # add more as needed
    }
    if pair not in names:
        raise ValueError(f"Unsupported pair: {pair}")
    tok = MarianTokenizer.from_pretrained(names[pair])
    mdl = MarianMTModel.from_pretrained(names[pair])
    return tok, mdl

def translate(text: str, src: str, tgt: str) -> str:
    tok, mdl = load_pair(src, tgt)
    batch = tok([text], return_tensors="pt", padding=True)
    out = mdl.generate(**batch, max_new_tokens=128)
    return tok.decode(out[0], skip_special_tokens=True)
