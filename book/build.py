#!/usr/bin/env python3
"""Build the Conciliatorics PDF from docs/ and diagrams/svg/."""

from __future__ import annotations

import argparse
import hashlib
import io
import os
import shutil
import stat
import subprocess
import sys
import tarfile
import urllib.request
import zipfile
from datetime import date
from pathlib import Path

from md_to_typst import chapter_to_typst, split_chapter
from print_svg import prepare_figures

ROOT = Path(__file__).resolve().parent.parent
BOOK = Path(__file__).resolve().parent
DOCS = ROOT / "docs"
SVG_DIR = ROOT / "diagrams" / "svg"
WEBSITE_STATIC = ROOT / "website" / "static"
DEFAULT_OUT = WEBSITE_STATIC / "conciliatorics.pdf"

TYPST_VERSION = "0.15.1"
TYPST_ARCHIVE = "typst-x86_64-unknown-linux-musl.tar.xz"
TYPST_URL = f"https://github.com/typst/typst/releases/download/v{TYPST_VERSION}/{TYPST_ARCHIVE}"

# Colophon faces. Cached in book/.tools/fonts, which is not committed.
PAGELLA_URL = (
    "https://www.gust.org.pl/projects/e-foundry/tex-gyre/pagella/"
    "tg_pagella-otf-2_609-31_03_2026.zip"
)
PAGELLA_SHA256 = "1fa1284bf30aefa1885ec5ce6c26b24d160104b331b1978a85a2a8b3c781737d"
PAGELLA_FILES = (
    "texgyrepagella-regular.otf",
    "texgyrepagella-italic.otf",
    "texgyrepagella-bold.otf",
    "texgyrepagella-bolditalic.otf",
)
LIBERTINE_URL = (
    "https://downloads.sourceforge.net/project/linuxlibertine/linuxlibertine/"
    "5.3.0/LinLibertineOTF_5.3.0_2012_07_02.tgz"
)
LIBERTINE_SHA256 = "3eb84d13e59d390a3f0b15f93bbb590de693dd5f29c4e8083317dbbadf6fb985"
LIBERTINE_FILES = (
    "LinLibertine_R.otf",
    "LinLibertine_RI.otf",
    "LinLibertine_RB.otf",
    "LinLibertine_RBI.otf",
    "LinLibertine_M.otf",
)

TITLE = "Conciliatorics"
AUTHOR = "Lokapal"
LEGAL = "Ricardo Pintos"
LEDE = "A perspective within Systemics."
URL = "https://www.lokapal.xyz/treatise"

PARTS: list[tuple[str, str | None, str | None]] = [
    ("00_front", None, None),
    ("01_introduction", "1", "Introduction"),
    ("02_edified_interstitial_contemplation", "2", "Edified Interstitial Contemplation"),
    ("03_attributes-structure", "3", "Attributes Structure"),
    ("04_attributes-status", "4", "Attributes Status"),
    ("05_attributes-synthesis", "5", "Attributes Synthesis"),
    ("06_edified-intrinsic-transformation", "6", "Edified Intrinsic Transformation"),
    ("07_closing", "7", "Closing"),
]

FONT_PATHS = [
    "/usr/share/texmf/fonts/opentype/public/tex-gyre",
    "/usr/share/texmf/fonts/opentype/public/tex-gyre-math",
    "/usr/share/fonts",
    "/usr/share/fonts/opentype/linux-libertine",
    "/usr/share/fonts/truetype/noto",
]


def git_stamp(root: Path) -> str | None:
    try:
        short = subprocess.check_output(
            ["git", "rev-parse", "--short", "HEAD"], cwd=root, text=True
        ).strip()
        dirty = subprocess.call(["git", "diff", "--quiet"], cwd=root) != 0
        return f"{short}-dirty" if dirty else short
    except (OSError, subprocess.CalledProcessError):
        return None


def ensure_typst(tools: Path) -> Path:
    found = shutil.which("typst")
    if found:
        return Path(found)
    binary = tools / "typst"
    if binary.exists():
        return binary
    tools.mkdir(parents=True, exist_ok=True)
    print(f"Downloading Typst {TYPST_VERSION}…")
    with urllib.request.urlopen(TYPST_URL) as response:
        archive = response.read()
    with tarfile.open(fileobj=io.BytesIO(archive), mode="r:xz") as tar:
        member = next(
            (m for m in tar.getmembers() if m.isfile() and Path(m.name).name == "typst"),
            None,
        )
        if member is None:
            raise SystemExit("Typst archive did not contain a typst binary")
        extracted = tar.extractfile(member)
        if extracted is None:
            raise SystemExit("Could not read typst binary from archive")
        binary.write_bytes(extracted.read())
    binary.chmod(binary.stat().st_mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    return binary


def fetch_bytes(url: str, sha256: str, label: str) -> bytes:
    print(f"Downloading {label}…")
    request = urllib.request.Request(url, headers={"User-Agent": "curl/8.5.0"})
    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            data = response.read()
    except OSError as exc:
        raise SystemExit(f"Could not download {label}: {exc}") from exc
    if hashlib.sha256(data).hexdigest() != sha256:
        raise SystemExit(f"Checksum mismatch for {label}")
    return data


def keep_font(name: str) -> bool:
    base = Path(name).name
    if base.startswith("texgyrepagella-") and base.endswith(".otf"):
        return True
    if base.startswith("LinLibertine_") and base.endswith(".otf"):
        return True
    return base in {"OFL-1.1.txt", "LICENCE.txt", "GPL.txt"}


def unpack_zip_fonts(data: bytes, dest: Path) -> None:
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        for info in archive.infolist():
            if info.is_dir() or not keep_font(info.filename):
                continue
            (dest / Path(info.filename).name).write_bytes(archive.read(info))


def unpack_tar_fonts(data: bytes, dest: Path) -> None:
    with tarfile.open(fileobj=io.BytesIO(data), mode="r:gz") as archive:
        for member in archive.getmembers():
            if not member.isfile() or not keep_font(member.name):
                continue
            extracted = archive.extractfile(member)
            if extracted is None:
                raise SystemExit(f"Could not read {member.name} from font archive")
            (dest / Path(member.name).name).write_bytes(extracted.read())


def ensure_fonts(tools: Path) -> Path:
    fonts = tools / "fonts"
    ready = all((fonts / name).is_file() for name in (*PAGELLA_FILES, *LIBERTINE_FILES))
    if ready:
        return fonts
    fonts.mkdir(parents=True, exist_ok=True)
    if any(not (fonts / name).is_file() for name in PAGELLA_FILES):
        unpack_zip_fonts(fetch_bytes(PAGELLA_URL, PAGELLA_SHA256, "TeX Gyre Pagella"), fonts)
    if any(not (fonts / name).is_file() for name in LIBERTINE_FILES):
        unpack_tar_fonts(fetch_bytes(LIBERTINE_URL, LIBERTINE_SHA256, "Linux Libertine"), fonts)
    missing = [
        name
        for name in (*PAGELLA_FILES, *LIBERTINE_FILES)
        if not (fonts / name).is_file()
    ]
    if missing:
        raise SystemExit("Font archive did not contain: " + ", ".join(missing))
    return fonts


def list_chapters() -> list[tuple[str, Path]]:
    rows: list[tuple[str, Path]] = []
    for part_dir, _number, _title in PARTS:
        folder = DOCS / part_dir
        if not folder.is_dir():
            continue
        for path in sorted(folder.glob("*.md")):
            rows.append((part_dir, path))
    return rows


def write_body(path: Path, figures) -> None:
    chunks: list[str] = [
        '#import "../template.typ": chapter, part, diagram, book-table, code-block, horizontalrule\n'
    ]
    last_part: str | None = None
    for part_dir, chapter_path in list_chapters():
        if part_dir != last_part:
            last_part = part_dir
            number, title = next((n, t) for d, n, t in PARTS if d == part_dir)
            if number and title:
                chunks.append(f'#part("{number}", "{title}")\n')
        raw = chapter_path.read_text(encoding="utf-8")
        title, kicker, body = split_chapter(raw)
        chunks.append(chapter_to_typst(title, kicker, body, figures))
        chunks.append("")
    path.write_text("\n".join(chunks), encoding="utf-8")


def write_main(path: Path, generated: str, git: str | None) -> None:
    git_arg = "none" if git is None else f'"{git}"'
    path.write_text(
        f"""#import "../template.typ": book

#show: book.with(
  title: "{TITLE}",
  author: "{AUTHOR}",
  legal: "{LEGAL}",
  lede: "{LEDE}",
  url: "{URL}",
  generated: "{generated}",
  git: {git_arg},
  grain: "_build/grain.png",
  compass: "_build/compass.png",
)

#include "body.typ"
""",
        encoding="utf-8",
    )


def export_grain(dest: Path) -> None:
    src = WEBSITE_STATIC / "nnnoise.svg"
    subprocess.run(
        [
            "inkscape",
            str(src),
            "--export-type=png",
            f"--export-filename={dest}",
            "--export-dpi=144",
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    # The site tile is a faint gold scatter. At page scale the specks vanish
    # unless they are punched a little; topology of the noise stays the same.
    from PIL import Image, ImageEnhance

    image = Image.open(dest).convert("RGBA")
    image = ImageEnhance.Contrast(image).enhance(1.85)
    image = ImageEnhance.Brightness(image).enhance(1.12)
    image.save(dest)


def compile_typst(typst: Path, main: Path, out: Path, fonts: Path) -> None:
    cmd = [str(typst), "compile", "--root", str(BOOK)]
    if fonts.is_dir():
        cmd.extend(["--font-path", str(fonts)])
    for font in FONT_PATHS:
        if Path(font).exists():
            cmd.extend(["--font-path", font])
    cmd.extend([str(main), str(out)])
    result = subprocess.run(cmd, cwd=str(main.parent), text=True, capture_output=True)
    if result.returncode != 0:
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit("typst compile failed")
    if result.stderr:
        sys.stderr.write(result.stderr)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--out",
        type=Path,
        default=DEFAULT_OUT,
        help="PDF destination (default: website/static/conciliatorics.pdf)",
    )
    args = parser.parse_args()
    out = args.out.resolve()

    build = BOOK / "_build"
    figures_dir = build / "figures"
    if build.exists():
        shutil.rmtree(build)
    figures_dir.mkdir(parents=True)

    print("Recasting diagrams…")
    figures = prepare_figures(SVG_DIR, figures_dir)
    print(f"  {len(figures)} figures")

    print("Writing grain and compass…")
    export_grain(build / "grain.png")
    shutil.copy2(WEBSITE_STATIC / "icon-transparent.png", build / "compass.png")

    generated = f"{date.today().day} {date.today().strftime('%B %Y')}"
    git = git_stamp(ROOT)
    if git and git.endswith("-dirty"):
        git = git.removesuffix("-dirty")

    print("Converting chapters…")
    write_body(build / "body.typ", figures)
    write_main(build / "main.typ", generated, git)

    typst = ensure_typst(BOOK / ".tools")
    fonts = ensure_fonts(BOOK / ".tools")
    print(f"Compiling with {typst}…")
    compile_typst(typst, build / "main.typ", out, fonts)
    size = out.stat().st_size
    print(f"Wrote {out} ({size / 1024:.0f} KB)")


if __name__ == "__main__":
    os.chdir(BOOK)
    sys.path.insert(0, str(BOOK))
    main()
