"""Recast treatise SVGs for a light page and export each to PDF."""

from __future__ import annotations

import re
import shutil
import subprocess
from dataclasses import dataclass
from pathlib import Path
from xml.etree import ElementTree as ET

PAPER = "#f4efe6"
INK = "#1c1917"
INK_SOFT = "#4a453f"

# Screen fills that sit on the dark field and must become paper so connectors
# do not show through boxes. Do not invert blindly: #171719 is the page plate.
FILL_TO_PAPER = {"#171719", "#111113", "#2a2a2c"}
FILL_TO_INK = {"#e6e6e6", "#ffffff"}
STROKE_TO_INK = {"#ffffff", "#e6e6e6"}
STROKE_TO_SOFT = {"#cfcfcf"}
FILL_TO_SOFT = {"#cfcfcf"}

FONT_FROM = "Arial, Helvetica, sans-serif"
FONT_TO = "Liberation Sans"

VIEWBOX = re.compile(r'viewBox="([^"]+)"', re.I)
WIDTH_ATTR = re.compile(r'\bwidth="([0-9.]+)(mm|px)?"', re.I)
FONT_SIZE = re.compile(r'font-size="([^"]+)"')


@dataclass(frozen=True)
class FigureInfo:
    name: str
    rel_pdf: str
    kind: str  # "wide" | "flow"
    width_pt: float


def _norm_hex(value: str) -> str:
    value = value.strip().lower()
    if re.fullmatch(r"#[0-9a-f]{3}", value):
        return "#" + "".join(ch * 2 for ch in value[1:])
    return value


def _map_paint(kind: str, value: str) -> str:
    if value.strip().lower() == "none":
        return value
    hex_val = _norm_hex(value)
    if kind == "fill":
        if hex_val in FILL_TO_PAPER:
            return PAPER
        if hex_val in FILL_TO_INK:
            return INK
        if hex_val in FILL_TO_SOFT:
            return INK_SOFT
        return value
    if hex_val in STROKE_TO_INK:
        return INK
    if hex_val in STROKE_TO_SOFT:
        return INK_SOFT
    if hex_val in FILL_TO_PAPER:
        return INK_SOFT
    return value


def _rewrite_style(style: str) -> str:
    parts = []
    for chunk in style.split(";"):
        if ":" not in chunk:
            if chunk.strip():
                parts.append(chunk)
            continue
        prop, val = chunk.split(":", 1)
        key = prop.strip().lower()
        if key == "fill":
            val = _map_paint("fill", val.strip())
        elif key == "stroke":
            val = _map_paint("stroke", val.strip())
        parts.append(f"{prop.strip()}: {val}")
    return "; ".join(parts)


def recolor_svg(svg: str) -> str:
    svg = svg.replace(FONT_FROM, FONT_TO)
    svg = svg.replace("font-family=\"Arial\"", f'font-family="{FONT_TO}"')
    try:
        root = ET.fromstring(svg)
    except ET.ParseError:
        return _recolor_text(svg)

    for el in root.iter():
        fill = el.get("fill")
        if fill:
            el.set("fill", _map_paint("fill", fill))
        stroke = el.get("stroke")
        if stroke:
            el.set("stroke", _map_paint("stroke", stroke))
        style = el.get("style")
        if style:
            el.set("style", _rewrite_style(style))
    ET.register_namespace("", "http://www.w3.org/2000/svg")
    return ET.tostring(root, encoding="unicode", xml_declaration=True)


def _recolor_text(svg: str) -> str:
    """Fallback if the SVG is not well-formed XML."""

    def repl_fill(match: re.Match[str]) -> str:
        return f'fill="{_map_paint("fill", match.group(1))}"'

    def repl_stroke(match: re.Match[str]) -> str:
        return f'stroke="{_map_paint("stroke", match.group(1))}"'

    svg = re.sub(r'fill="([^"]+)"', repl_fill, svg)
    svg = re.sub(r'stroke="([^"]+)"', repl_stroke, svg)
    return svg


def _most_common_em(svg: str) -> float:
    sizes = [float(m) for m in FONT_SIZE.findall(svg) if float(m) > 0]
    if not sizes:
        return 13.0
    counts: dict[float, int] = {}
    for size in sizes:
        key = round(size, 3)
        counts[key] = counts.get(key, 0) + 1
    return max(counts.items(), key=lambda kv: (kv[1], -kv[0]))[0]


def _viewbox(svg: str) -> tuple[float, float]:
    match = VIEWBOX.search(svg)
    if not match:
        return 0.0, 0.0
    parts = [float(p) for p in match.group(1).replace(",", " ").split()]
    if len(parts) != 4:
        return 0.0, 0.0
    return parts[2], parts[3]


def classify(svg: str, max_width_pt: float = 318.0) -> tuple[str, float]:
    """Return (kind, width_pt) for placing the figure on a 6×9 page.

    Every figure stays in the text column. Landscape plates made diagrams of
    ordinary width look like full-page inserts; scale to the measure instead.
    """
    vw, _vh = _viewbox(svg)
    em = _most_common_em(svg)
    span = (vw / em) if em else 0.0
    width_match = WIDTH_ATTR.search(svg)
    natural_pt = 0.0
    if width_match and (width_match.group(2) or "").lower() == "mm":
        natural_pt = float(width_match.group(1)) * 72.0 / 25.4

    if natural_pt > 0:
        # These files use millimetres as user units, so labels at natural size
        # sit around 16pt — larger than the body. Scale toward body type.
        label_pt = em * 72.0 / 25.4 if em else 16.0
        scale = 10.5 / label_pt if label_pt > 10.5 else 1.0
        width_pt = natural_pt * scale
        width_pt = min(width_pt, max_width_pt * 0.80)
        width_pt = max(width_pt, 125.0)
        return "flow", round(width_pt, 2)

    width_pt = span * 8.0 if span else max_width_pt
    return "flow", round(min(max_width_pt, max(width_pt, 130.0)), 2)


def export_pdf(svg_path: Path, pdf_path: Path) -> None:
    cmd = [
        "inkscape",
        str(svg_path),
        "--export-type=pdf",
        f"--export-filename={pdf_path}",
        "--export-area-page",
        "--export-text-to-path",
    ]
    subprocess.run(cmd, check=True, capture_output=True, text=True)


def prepare_figures(svg_dir: Path, dest_dir: Path) -> dict[str, FigureInfo]:
    dest_dir.mkdir(parents=True, exist_ok=True)
    figures: dict[str, FigureInfo] = {}
    inkscape = shutil.which("inkscape")
    if not inkscape:
        raise SystemExit("inkscape is required to recast diagrams for print")

    for src in sorted(svg_dir.glob("*.svg")):
        raw = src.read_text(encoding="utf-8")
        kind, width_pt = classify(raw)
        recast = dest_dir / f"{src.stem}.svg"
        recast.write_text(recolor_svg(raw), encoding="utf-8")
        pdf = dest_dir / f"{src.stem}.pdf"
        export_pdf(recast, pdf)
        figures[src.stem] = FigureInfo(
            name=src.stem,
            rel_pdf=f"_build/figures/{src.stem}.pdf",
            kind=kind,
            width_pt=round(width_pt, 2),
        )
    return figures
