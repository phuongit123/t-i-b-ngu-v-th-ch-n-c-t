from functools import lru_cache
from pathlib import Path
import math

from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / "public" / "assets"
SIZE = (440, 236)
PAPER = "#fbfaf4"
INK = "#172c24"
GREEN = "#285e4b"
PALE = "#dcebd8"
LINE = "#adbeb0"
ORANGE = "#a74c24"
GOLD = "#f1d488"
BLUE = "#2d627d"
PINK = "#d88484"


@lru_cache(maxsize=40)
def font(size, weight=500):
    face = ImageFont.truetype(str(ASSETS / "academy" / "lora-normal.ttf"), size)
    face.set_variation_by_axes([weight])
    return face


def text(draw, xy, message, size=17, color=INK, weight=500, anchor=None):
    draw.text(xy, message, fill=color, font=font(size, weight), anchor=anchor)


def scene(color=PAPER):
    image = Image.new("RGB", SIZE, color)
    return image, ImageDraw.Draw(image)


def dot(draw, xy, radius=6, color=ORANGE, border=None):
    x, y = xy
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=color, outline=border, width=2)


def node(draw, xy, active=False):
    x, y = xy
    draw.rectangle((x - 5, y - 5, x + 5, y + 5), fill=ORANGE if active else PAPER, outline=ORANGE, width=2)


def arrow(draw, start, end, color=ORANGE, width=3):
    draw.line((start, end), fill=color, width=width)
    angle = math.atan2(end[1] - start[1], end[0] - start[0])
    wings = [(end[0] - 11 * math.cos(angle + offset), end[1] - 11 * math.sin(angle + offset)) for offset in (-0.57, 0.57)]
    draw.polygon([end, *wings], fill=color)


def dashed(draw, start, end, color=ORANGE, width=2, dash=8, gap=5):
    length = math.dist(start, end)
    if not length:
        return
    for offset in range(0, math.ceil(length), dash + gap):
        def point(distance):
            ratio = min(distance / length, 1)
            return tuple(a + (b - a) * ratio for a, b in zip(start, end))
        draw.line((point(offset), point(offset + dash)), fill=color, width=width)


def guide_box(draw, rect, color=ORANGE):
    x1, y1, x2, y2 = rect
    for start, end in [((x1,y1),(x2,y1)),((x2,y1),(x2,y2)),((x2,y2),(x1,y2)),((x1,y2),(x1,y1))]:
        dashed(draw, start, end, color)


def cubic(start, control_a, control_b, end, segments=56):
    return [
        tuple(round((1-t)**3*a + 3*(1-t)**2*t*b + 3*(1-t)*t*t*c + t**3*d)
              for a,b,c,d in zip(start, control_a, control_b, end))
        for t in (i / segments for i in range(segments + 1))
    ]


@lru_cache(maxsize=12)
def load_image(relative):
    return Image.open(ASSETS / relative).convert("RGB")


def thumbnail(relative, size=SIZE, center=(0.5, 0.5)):
    return ImageOps.fit(load_image(relative), size, Image.Resampling.LANCZOS, centering=center)


def paste_scaled(target, source, xy, size, fit=False):
    resized = ImageOps.fit(source, size, Image.Resampling.LANCZOS) if fit else source.resize(size, Image.Resampling.LANCZOS)
    target.paste(resized, xy)


def file_card(draw, xy, ext, label, color=GREEN):
    x, y = xy
    draw.polygon([(x,y),(x+66,y),(x+91,y+24),(x+91,y+99),(x,y+99)], fill="white", outline=LINE, width=2)
    draw.line([(x+66,y),(x+66,y+24),(x+91,y+24)], fill=LINE, width=2)
    draw.rounded_rectangle((x+7,y+46,x+84,y+73), radius=5, fill=color)
    text(draw,(x+45,y+60),ext,14,"white",700,"mm")
    text(draw,(x+45,y+116),label,14,INK,600,"mm")
