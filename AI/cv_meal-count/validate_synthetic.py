"""
Generates synthetic "tray photo" test images (random circles standing in for
plates/dishes on a table) with a KNOWN ground-truth count, then runs the
contour-based estimator against them to sanity-check it end-to-end.

This is a stand-in for real photos only — accuracy on synthetic circles does
not indicate real-world accuracy on actual kitchen photos. It exists purely
to prove the pipeline plumbing (image -> count -> API) works before real
photos and a trained detector are available.

Run from AI/cv_meal_count/:
    python validate_synthetic.py
"""
import os
import random

import cv2
import numpy as np

from estimate import estimate_meal_count

HERE = os.path.dirname(os.path.abspath(__file__))
SAMPLES_DIR = os.path.join(HERE, "synthetic_samples")


def make_synthetic_tray_image(true_count: int, size: int = 600) -> np.ndarray:
    img = np.full((size, size, 3), 235, dtype=np.uint8)  # light "table" background
    placed = []
    attempts = 0
    while len(placed) < true_count and attempts < true_count * 50:
        attempts += 1
        radius = random.randint(35, 55)
        cx, cy = random.randint(radius + 5, size - radius - 5), random.randint(radius + 5, size - radius - 5)
        if any((cx - px) ** 2 + (cy - py) ** 2 < (radius + pr + 10) ** 2 for px, py, pr in placed):
            continue
        color = tuple(int(c) for c in np.random.randint(90, 180, 3))
        cv2.circle(img, (cx, cy), radius, color, -1)
        placed.append((cx, cy, radius))
    return img


def run_validation(n_samples: int = 10):
    os.makedirs(SAMPLES_DIR, exist_ok=True)
    random.seed(42)
    np.random.seed(42)

    errors = []
    for i in range(n_samples):
        true_count = random.randint(3, 15)
        img = make_synthetic_tray_image(true_count)
        path = os.path.join(SAMPLES_DIR, f"sample_{i}_true{true_count}.jpg")
        cv2.imwrite(path, img)

        predicted = estimate_meal_count(path)
        errors.append(abs(predicted - true_count))
        print(f"sample {i}: true={true_count:2d}  predicted={predicted:2d}  |err|={abs(predicted - true_count)}")

    print(f"\nMean absolute error across {n_samples} synthetic samples: {sum(errors)/len(errors):.2f}")


if __name__ == "__main__":
    run_validation()
