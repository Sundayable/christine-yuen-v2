"""Generate Spa-Polish brand assets: favicon set + OG card.

Outputs to public/logo/ and public/og/, replacing existing newspaper-archetype favicons.
"""
import sys
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parent.parent
LOGO_DIR = ROOT / "public" / "logo"
OG_DIR = ROOT / "public" / "og"
PORTRAIT = ROOT / "public" / "images" / "portrait" / "christine-arms-crossed.jpg"

GOLD = (201, 166, 97)        # #C9A661
GOLD_DARK = (138, 109, 51)   # #8A6D33
SOFT_WHITE = (255, 252, 247) # #FFFCF7
INK = (42, 40, 37)           # #2A2825
GRAPHITE = (110, 102, 88)

GEORGIA_ITALIC = "C:/Windows/Fonts/georgiaz.ttf"  # bold italic
GEORGIA_BOLD = "C:/Windows/Fonts/georgiab.ttf"
GEORGIA = "C:/Windows/Fonts/georgia.ttf"
ARIAL_BOLD = "C:/Windows/Fonts/arialbd.ttf"
ARIAL = "C:/Windows/Fonts/arial.ttf"


def make_monogram(size: int) -> Image.Image:
    """Champagne gold square with italic 'C' in soft white. Used for all favicon sizes."""
    img = Image.new("RGB", (size, size), GOLD)
    draw = ImageDraw.Draw(img)

    font_size = int(size * 0.72)
    try:
        font = ImageFont.truetype(GEORGIA_ITALIC, font_size)
    except OSError:
        font = ImageFont.load_default()

    text = "C"
    bbox = draw.textbbox((0, 0), text, font=font)
    text_w = bbox[2] - bbox[0]
    text_h = bbox[3] - bbox[1]
    x = (size - text_w) // 2 - bbox[0]
    y = (size - text_h) // 2 - bbox[1] - int(size * 0.04)
    draw.text((x, y), text, fill=SOFT_WHITE, font=font)
    return img


def write_favicons() -> None:
    LOGO_DIR.mkdir(parents=True, exist_ok=True)
    sizes = [16, 32, 48, 96, 180, 192, 512]
    pngs = {}
    for sz in sizes:
        img = make_monogram(sz)
        out = LOGO_DIR / f"favicon-{sz}.png"
        img.save(out, "PNG", optimize=True)
        pngs[sz] = img
        print(f"  wrote {out.name}", flush=True)

    apple = LOGO_DIR / "apple-touch-icon.png"
    pngs[180].save(apple, "PNG", optimize=True)
    print(f"  wrote {apple.name}", flush=True)

    ico_sizes = [16, 32, 48]
    ico_path = LOGO_DIR / "favicon.ico"
    pngs[48].save(ico_path, format="ICO", sizes=[(s, s) for s in ico_sizes])
    print(f"  wrote {ico_path.name}", flush=True)

    app_icon = ROOT / "app" / "icon.png"
    pngs[512].save(app_icon, "PNG", optimize=True)
    print(f"  wrote app/{app_icon.name}", flush=True)

    apple_app = ROOT / "app" / "apple-icon.png"
    pngs[180].save(apple_app, "PNG", optimize=True)
    print(f"  wrote app/{apple_app.name}", flush=True)


def make_og_card() -> Image.Image:
    """1200x630 OG card. Left: portrait crop. Right: cream background + wordmark + tagline + gold rule."""
    W, H = 1200, 630
    canvas = Image.new("RGB", (W, H), SOFT_WHITE)

    if PORTRAIT.exists():
        portrait = Image.open(PORTRAIT).convert("RGB")
        target_w = 480
        ratio = target_w / portrait.width
        target_h = int(portrait.height * ratio)
        portrait = portrait.resize((target_w, target_h), Image.LANCZOS)
        crop_top = max(0, (target_h - H) // 2 - 40)
        portrait = portrait.crop((0, crop_top, target_w, crop_top + H))
        canvas.paste(portrait, (0, 0))

    draw = ImageDraw.Draw(canvas)

    text_x = 530
    eyebrow_font = ImageFont.truetype(ARIAL_BOLD, 20)
    name_font = ImageFont.truetype(GEORGIA_ITALIC, 96)
    tagline_font = ImageFont.truetype(GEORGIA, 30)
    role_font = ImageFont.truetype(ARIAL, 22)

    eyebrow = "REALTOR  ·  GRAND CENTRAL REALTY"
    draw.text((text_x, 80), eyebrow, fill=GOLD_DARK, font=eyebrow_font)

    draw.multiline_text((text_x, 130), "Christine\nYuen", fill=INK, font=name_font, spacing=4)

    draw.line([(text_x, 360), (text_x + 100, 360)], fill=GOLD, width=3)

    tagline = "Realtor and immigration\nconsultant, listening first."
    draw.multiline_text((text_x, 390), tagline, fill=INK, font=tagline_font, spacing=8)

    role = "Richmond  ·  Vancouver East  ·  Vancouver West"
    draw.text((text_x, 510), role, fill=GRAPHITE, font=role_font)

    draw.line([(text_x, 555), (text_x + 580, 555)], fill=GOLD, width=1)
    draw.text((text_x, 570), "vancityhouses.com", fill=GOLD_DARK, font=role_font)

    return canvas


def write_og() -> None:
    OG_DIR.mkdir(parents=True, exist_ok=True)
    og = make_og_card()
    out = OG_DIR / "og-default.jpg"
    og.save(out, "JPEG", quality=88, optimize=True)
    print(f"  wrote {out.relative_to(ROOT)}", flush=True)

    legacy = LOGO_DIR / "og-default.jpg"
    og.save(legacy, "JPEG", quality=88, optimize=True)
    print(f"  wrote {legacy.relative_to(ROOT)}", flush=True)


def write_manifest() -> None:
    manifest = {
        "name": "Christine Yuen, REALTOR",
        "short_name": "Christine Yuen",
        "description": "Christine Yuen, REALTOR with Grand Central Realty. Richmond, Vancouver East and West.",
        "start_url": "/en",
        "display": "standalone",
        "background_color": "#FFFCF7",
        "theme_color": "#C9A661",
        "icons": [
            {"src": "/logo/favicon-192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/logo/favicon-512.png", "sizes": "512x512", "type": "image/png"},
            {"src": "/logo/apple-touch-icon.png", "sizes": "180x180", "type": "image/png", "purpose": "any"}
        ]
    }
    import json
    out = ROOT / "public" / "manifest.json"
    out.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"  wrote {out.relative_to(ROOT)}", flush=True)


def main() -> None:
    print("FAVICON SET", flush=True)
    write_favicons()
    print("\nOG CARD", flush=True)
    write_og()
    print("\nMANIFEST", flush=True)
    write_manifest()
    print("\nDONE", flush=True)


if __name__ == "__main__":
    main()
