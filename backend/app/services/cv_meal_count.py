"""
Stage 1 — Computer Vision.

Uses the classical contour-based baseline from AI/cv_meal_count/estimate.py
when a local image file is available. The current restaurant listing
endpoint only accepts a photo_url (not yet a real file upload), so until
multipart upload is wired up, this falls back to a synthetic placeholder
count for URL-only inputs.
"""
import os
import random
import sys

_AI_CV_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "..", "AI", "cv_meal_count")


def estimate_meal_count(photo_url: str | None, local_image_path: str | None = None) -> int:
    """Given a kitchen photo, estimate the number of meals present.

    If `local_image_path` points to a real file on disk, runs the classical
    CV baseline (contour detection) from AI/cv_meal_count/. Otherwise (e.g.
    a bare URL with no uploaded file yet), returns a synthetic placeholder
    count so the rest of the pipeline can still be exercised end-to-end.
    """
    if local_image_path and os.path.exists(local_image_path):
        if _AI_CV_DIR not in sys.path:
            sys.path.insert(0, _AI_CV_DIR)
        from estimate import estimate_meal_count as _cv_estimate  # AI/cv_meal_count/estimate.py
        return _cv_estimate(local_image_path)

    if photo_url is None:
        return 0
    return random.randint(8, 60)
