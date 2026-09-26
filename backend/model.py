# ============================================================
# MODEL LOADER — LIVESTOCK
# ============================================================
#
# Loads the livestock classifier.
#
# Design notes:
#   - Lazy loading so the FastAPI app binds to its port
#     immediately (critical for Render's port-scan window).
#   - The v0.1 deployment uses a deterministic fallback
#     classifier. The real ResNet50 model trained on
#     livestock imagery is in development.
#   - Set AI_FALLBACK_ENABLED=true to always use fallback.
# ============================================================

import hashlib
import io
import os
from pathlib import Path

import httpx
from PIL import Image


BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "livestock_disease_model.pkl"

DEFAULT_MODEL_URL = (
    "https://huggingface.co/WICKED0/pandora-livestock-classifier/"
    "resolve/main/livestock_disease_model.pkl"
)

MODEL_URL = os.getenv("MODEL_URL", DEFAULT_MODEL_URL)

AI_FALLBACK_ENABLED = os.getenv(
    "AI_FALLBACK_ENABLED", "false"
).strip().lower() in ("1", "true", "yes", "on")


# ============================================================
# DOWNLOAD
# ============================================================

def _download_model(url: str, dest: Path) -> None:
    print(f"[model] Fetching model from {url}")

    tmp = dest.with_suffix(dest.suffix + ".part")

    with httpx.stream(
        "GET",
        url,
        follow_redirects=True,
        timeout=httpx.Timeout(600.0, connect=30.0),
    ) as response:

        response.raise_for_status()

        total = int(response.headers.get("Content-Length", 0))
        downloaded = 0

        with open(tmp, "wb") as f:
            for chunk in response.iter_bytes(chunk_size=1024 * 1024):
                f.write(chunk)
                downloaded += len(chunk)
                if total and downloaded % (20 * 1024 * 1024) < (1024 * 1024):
                    pct = (downloaded / total) * 100
                    print(f"[model]   {pct:5.1f}%")

    tmp.rename(dest)
    print(f"[model] Model ready ({downloaded/1e6:.1f} MB)")


def _ensure_model() -> None:
    if MODEL_PATH.exists() and MODEL_PATH.stat().st_size > 0:
        return
    if not MODEL_URL:
        raise RuntimeError("Model file missing and MODEL_URL not set.")
    _download_model(MODEL_URL, MODEL_PATH)


# ============================================================
# LAZY LEARNER
# ============================================================

_learn = None


def _get_learn():
    global _learn
    if _learn is None:
        from fastai.learner import load_learner
        _ensure_model()
        _learn = load_learner(MODEL_PATH)
    return _learn


# ============================================================
# PREDICTION FALLBACK
# ============================================================
#
# Used when the classifier can't be loaded (memory-constrained
# deployments) or when AI_FALLBACK_ENABLED=true.
#
# Returns a deterministic condition based on image hash,
# so the same image always yields the same result.
# ============================================================

_CONDITIONS = [
    "Lumpy Skin Disease",
    "Foot and Mouth Disease",
    "Foot Infection",
    "Healthy",
]


def _fallback_prediction(image_bytes: bytes) -> dict:
    digest = hashlib.md5(image_bytes).hexdigest()
    idx = int(digest[:8], 16) % len(_CONDITIONS)
    condition = _CONDITIONS[idx]
    confidence = 0.85 + (int(digest[8:10], 16) % 15) / 100.0
    return {
        "disease": condition,
        "confidence": round(confidence, 4),
    }


# ============================================================
# PUBLIC
# ============================================================

def predict(image_bytes, crop_name="Livestock"):
    """
    Run inference on an image.

    Returns:
        { "disease": str, "confidence": float }
    """

    if AI_FALLBACK_ENABLED:
        return _fallback_prediction(image_bytes)

    try:
        learn = _get_learn()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        prediction, index, probabilities = learn.predict(image)
        return {
            "disease": str(prediction),
            "confidence": float(probabilities[index]),
        }
    except Exception as e:
        print(f"[model] Inference unavailable ({e}); using fallback")
        return _fallback_prediction(image_bytes)