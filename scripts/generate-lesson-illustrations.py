"""Generate the illustrated steps published with the current Affinity Academy lessons."""
import argparse
import json
from functools import lru_cache

from PIL import Image, ImageDraw, ImageStat

from lesson_artwork import photo, production, studio, vector
from lesson_artwork.common import ASSETS, GREEN, INK, LINE, PAPER, ROOT, SIZE, arrow, load_image, text

MANIFEST = ROOT / "curriculum" / "lesson-illustrations.json"
WORKSHOP = ROOT / "curriculum" / "first-project.json"
DESTINATION = ASSETS / "lessons" / "steps"
DIMENSIONS = (944, 292)
STACKED_DIMENSIONS = (460, 588)

RENDERERS = {
    "poster": vector.poster, "boards": vector.boards, "grid": vector.grid, "path": vector.path,
    "shape": vector.shape, "fill": vector.fill, "stroke": vector.stroke,
    "layers": studio.layers, "type": studio.typography, "component": studio.component, "brush": studio.brush,
    "chart": production.chart, "layout": production.layout, "export": production.export,
    "system": production.system, "photo": photo.photo, "starter": production.starter,
}


@lru_cache(maxsize=350)
def render_scene(name):
    family, subject = name.split(":", 1)
    if family == "workspace":
        # These panels are real Windows screenshots. The other panes are labelled as teaching illustrations.
        original = load_image(f"lessons/affinity-333-{subject}.webp")
        image = Image.new("RGB", SIZE, "#1d2421")
        size = (405, 236)
        image.paste(original.resize(size, Image.Resampling.LANCZOS), (17,0))
        draw = ImageDraw.Draw(image)
        draw.rounded_rectangle((23,208,267,230),radius=3,fill="#1d2421")
        text(draw,(28,211),"Ảnh Affinity 3.3.3.5004 · Windows",12,PAPER,650)
        return image
    return RENDERERS[family](subject)


def compose(card, stacked):
    image = Image.new("RGB", STACKED_DIMENSIONS if stacked else DIMENSIONS, "#eef2e8")
    draw = ImageDraw.Draw(image)
    positions = ((10, 10), (10, 306)) if stacked else ((10, 10), (494, 10))
    for side, (x, y) in zip(("before", "after"), positions):
        state = card[side]
        pane = render_scene(state["scene"])
        image.paste(pane, (x, y))
        draw.rectangle((x, y, x+439, y+235), outline=LINE)
        text(draw, (x+11, y+248), state["label"], 17, INK, 650)
    if stacked:
        arrow(draw, (230, 281), (230, 300), GREEN, 2)
    else:
        arrow(draw, (455, 125), (487, 125), GREEN, 3)
    return image


def validate(manifest):
    lessons = {}
    curriculum = ROOT / "curriculum"
    for file in sorted(curriculum.glob("*/*/*-*.json")):
        lesson = json.loads(file.read_text(encoding="utf-8-sig"))
        lessons[lesson["id"]] = lesson["standardSections"]["stepByStepInstructions"]
    lessons["starter-poster"] = [{"stepNumber": step["step"]} for step in json.loads(WORKSHOP.read_text(encoding="utf-8"))]
    if set(lessons) != set(manifest):
        raise ValueError(f"Lessons with no illustration plan or no corresponding data: {set(lessons) ^ set(manifest)}")
    for lesson_id, steps in lessons.items():
        illustrations = manifest[lesson_id]
        if len(illustrations) < 4 or [entry["step"] for entry in illustrations] != [step["stepNumber"] for step in steps]:
            raise ValueError(f"{lesson_id}: expected every procedure step to have an illustration and at least four per lesson")
        for entry in illustrations:
            if entry["before"]["scene"] == entry["after"]["scene"] or not entry["tool"] or not entry["lookFor"]:
                raise ValueError(f"{lesson_id} step {entry['step']}: illustration must show distinct states, a tool and a check")


def regenerate(manifest, only, check):
    DESTINATION.mkdir(parents=True, exist_ok=True)
    total = 0
    for lesson_id, illustrations in manifest.items():
        if only and lesson_id not in only:
            continue
        for card in illustrations:
            try:
                for stacked in (False, True):
                    suffix = "-stacked" if stacked else ""
                    path = DESTINATION / f"{lesson_id.lower()}-{card['step']:02}{suffix}.webp"
                    if check:
                        with Image.open(path) as image:
                            image.load()
                            expected_size = STACKED_DIMENSIONS if stacked else DIMENSIONS
                            if image.size != expected_size or min(ImageStat.Stat(image.convert("RGB")).stddev) < 8:
                                raise ValueError(f"{path.name}: wrong dimensions or blank image")
                    else:
                        compose(card, stacked).save(path, "WEBP", quality=88, method=5)
            except (FileNotFoundError, KeyError, TypeError, ValueError, OSError) as error:
                raise ValueError(f"{lesson_id}, step {card['step']}: {error}") from error
            total += 1
    print(f"{'Validated' if check else 'Generated'} {total} illustrated steps.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check coverage and the bundled assets without overwriting them.")
    parser.add_argument("--lesson", action="append", help="Generate selected lesson IDs, for example --lesson D02-01.")
    args = parser.parse_args()
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    manifest["starter-poster"] = json.loads(WORKSHOP.read_text(encoding="utf-8"))
    validate(manifest)
    if args.lesson and set(args.lesson) - manifest.keys():
        parser.error("unknown lesson ID")
    regenerate(manifest, args.lesson, args.check)


if __name__ == "__main__":
    main()
