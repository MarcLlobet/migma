"""Generate stand-in assets for the "before" app.

They match the production files' format, dimensions and byte weight
(measured on migma.ai, Oct 27 2026) without copying them:
  /images/MigmaAI.gif          ~651 KB, 315 frames, 110x98, 30-40 ms/frame
  /images/bg/MigmaMobile.webp  ~111 KB, 1128x719
  /images/bg/noise.png         ~29 KB
Usage: python3 scripts/make-assets.py
"""
import math
import os
import numpy as np
from PIL import Image

OUT = os.path.join(os.path.dirname(__file__), "..", "before", "public", "images")
os.makedirs(os.path.join(OUT, "bg"), exist_ok=True)
rng = np.random.default_rng(7)


def kb(path):
    return os.path.getsize(path) / 1024


# --- animated logo GIF -------------------------------------------------------
W, H, N = 110, 98, 315
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
# envelope mask: rectangle with a V notch on top
inside = (xx >= 12) & (xx <= 98) & (yy <= 92)
notch = yy >= 9 + 24 * (1 - np.abs(xx - 55) / 43)
mask = inside & notch
base = np.stack([
    240 - 10 * (xx + yy) / (W + H),
    120 - 90 * (xx + yy) / (W + H),
    30 + 60 * (xx + yy) / (W + H),
], -1)

frames = []
for f in range(N):
    t = f / N * 2 * math.pi
    a = t + 0.6 * math.sin(t * 2)
    u = (xx - 55) * math.cos(a) + (yy - 50) * math.sin(a)
    band = np.exp(-((u - 18 * math.sin(t)) ** 2) / 90) + np.exp(-((u + 22 * math.cos(t)) ** 2) / 60)
    shade = np.clip(1 - 0.95 * band, 0, 1)[..., None]
    grain = rng.normal(0, 2, (H, W, 1))
    img = np.clip(base * shade + grain, 0, 255).astype(np.uint8)
    rgba = np.dstack([img, np.where(mask, 255, 0).astype(np.uint8)])
    frames.append(Image.fromarray(rgba, "RGBA").convert("P", palette=Image.ADAPTIVE, colors=56))

durations = [40 if i % 3 == 1 else 30 for i in range(N)]
gif = os.path.join(OUT, "MigmaAI.gif")
frames[0].save(gif, save_all=True, append_images=frames[1:], duration=durations, loop=0, disposal=2, transparency=0, optimize=False)
print(f"MigmaAI.gif          {kb(gif):7.1f} KB (target ~651)")

# --- hero background WebP ----------------------------------------------------
BW, BH = 1128, 719
by, bx = np.mgrid[0:BH, 0:BW].astype(np.float32)
glow1 = np.exp(-(((bx - 250) / 500) ** 2 + ((by - 700) / 380) ** 2))
glow2 = np.exp(-(((bx - 1000) / 420) ** 2 + ((by - 650) / 300) ** 2))
r = 10 + 200 * glow1 + 190 * glow2
g = 10 + 70 * glow1 + 20 * glow2
b = 10 + 12 * glow1 + 60 * glow2
bg = np.stack([r, g, b], -1) + rng.normal(0, 9, (BH, BW, 1))
webp = os.path.join(OUT, "bg", "MigmaMobile.webp")
Image.fromarray(np.clip(bg, 0, 255).astype(np.uint8)).save(webp, quality=66, method=6)
print(f"bg/MigmaMobile.webp  {kb(webp):7.1f} KB (target ~111)")

# --- noise PNG ---------------------------------------------------------------
noise = rng.integers(0, 255, (96, 96), dtype=np.uint8)
alpha = np.full((96, 96), 10, np.uint8)
png = os.path.join(OUT, "bg", "noise.png")
Image.fromarray(np.dstack([noise, noise, noise, alpha]), "RGBA").save(png, optimize=True)
print(f"bg/noise.png         {kb(png):7.1f} KB (target ~29)")
