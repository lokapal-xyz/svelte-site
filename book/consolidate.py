#!/usr/bin/env python3
"""Consolidate the treatise into one Markdown file.

Reads docs/ in the same part order as the PDF build. Unwraps <plain> tags,
drops diagram image links, and writes a single file with a table of contents.
Part 7 contributes the Epilogue only. Does not modify the chapter files.

    python3 book/consolidate.py
    python3 book/consolidate.py -o path/to/conciliatorics.md
"""

from __future__ import annotations

import argparse
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs"
DEFAULT_OUT = Path(__file__).resolve().parent / "_build" / "conciliatorics.md"

# Keep in step with book/build.py. Front matter has no part title.
# Part 7 in this file is the epilogue only; the summary and glossaries stay in docs/.
PART_CHAPTERS: dict[str, set[str]] = {
    "07_closing": {"07_01_epilogue.md"},
}
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

TITLE = "Conciliatorics"

# Same tag shape as book/md_to_typst.py.
PLAIN = re.compile(r"</?plain(?:\s[^>]*)?>", re.IGNORECASE)
# Inline ![alt](dest) and reference-style ![alt][ref]. Alt text has no nested ].
IMAGE = re.compile(r"!\[[^\]\n]*\](?:\([^)\n]*\)|\[[^\]\n]*\])")
HEADING = re.compile(r"^(#{1,6})[ \t]+(.+?)\s*$")
# GitHub heading slugs: drop this punctuation, then turn each space into a hyphen.
SLUG_PUNCT = re.compile(r"[\u2000-\u206F\u2E00-\u2E7F\\'\"!#$%&()*+,./:;<=>?@\[\]^`{|}~]")


class Slugs:
    """GitHub-style heading anchors, unique in document order."""

    def __init__(self) -> None:
        self._seen: set[str] = set()
        self._counts: dict[str, int] = {}

    def add(self, text: str) -> str:
        base = slugify(text) or "section"
        if base not in self._seen:
            self._seen.add(base)
            self._counts.setdefault(base, 0)
            return base
        number = self._counts.get(base, 0)
        while True:
            number += 1
            candidate = f"{base}-{number}"
            if candidate not in self._seen:
                self._counts[base] = number
                self._seen.add(candidate)
                return candidate


def slugify(text: str) -> str:
    """GitHub heading anchor. Punctuation drops out; each space becomes a hyphen.

    An em dash is punctuation, so "Part 1 — Introduction" becomes
    part-1--introduction. Repeated spaces are not collapsed.
    """
    text = SLUG_PUNCT.sub("", text.lower())
    return text.replace(" ", "-")


def heading_text(raw: str) -> str:
    return re.sub(r"\s+#+\s*$", "", raw.strip()).strip()


def chapter_paths() -> list[tuple[str, str | None, str | None, list[Path]]]:
    rows: list[tuple[str, str | None, str | None, list[Path]]] = []
    for part_dir, number, title in PARTS:
        folder = DOCS / part_dir
        if not folder.is_dir():
            continue
        allowed = PART_CHAPTERS.get(part_dir)
        files = sorted(
            path
            for path in folder.glob("*.md")
            if path.is_file() and (allowed is None or path.name in allowed)
        )
        if files:
            rows.append((part_dir, number, title, files))
    return rows


def fingerprint(paths: list[Path]) -> dict[Path, bytes]:
    return {path: hashlib.sha256(path.read_bytes()).digest() for path in paths}


def clean_chapter(text: str) -> tuple[str, int, int]:
    """Return cleaned chapter text, plus counts of plain tags and images removed."""
    text = text.replace("\ufeff", "").replace("\r\n", "\n").replace("\r", "\n")
    lines = text.split("\n")
    if lines and lines[-1] == "":
        lines.pop()

    cleaned: list[str] = []
    in_fence = False
    pending_blank = False
    plain_count = 0
    image_count = 0

    for line in lines:
        fence = line.startswith("```")
        plain_count += len(PLAIN.findall(line))
        images = IMAGE.findall(line)
        image_count += len(images)
        line = PLAIN.sub("", line)

        if fence:
            if pending_blank and cleaned and cleaned[-1] != "":
                cleaned.append("")
            pending_blank = False
            in_fence = not in_fence
            cleaned.append(IMAGE.sub("", line))
            continue

        if in_fence:
            cleaned.append(IMAGE.sub("", line))
            continue

        if images and not IMAGE.sub("", line).strip():
            if cleaned and cleaned[-1] != "":
                pending_blank = True
            continue

        if images:
            indent = re.match(r"[ \t]*", line).group(0)
            rest = IMAGE.sub("", line[len(indent) :])
            rest = re.sub(r" {2,}", " ", rest)
            line = indent + rest

        if line.strip() == "":
            if cleaned and cleaned[-1] != "":
                pending_blank = True
            continue

        if pending_blank:
            cleaned.append("")
            pending_blank = False
        cleaned.append(line)

    return "\n".join(cleaned).strip("\n"), plain_count, image_count


def link_label(text: str) -> str:
    return text.replace("\\", "\\\\").replace("[", "\\[").replace("]", "\\]")


def toc_level(heading_level: int, in_part: bool) -> int:
    return heading_level - 1 + (1 if in_part else 0)


def build() -> tuple[str, int, int, int]:
    slugs = Slugs()
    slugs.add(TITLE)
    slugs.add("Contents")

    toc: list[str] = []
    chunks: list[str] = []
    chapters = 0
    plain_count = 0
    image_count = 0

    for _part_dir, number, title, files in chapter_paths():
        in_part = number is not None and title is not None
        if in_part:
            part_heading = f"Part {number} — {title}"
            anchor = slugs.add(part_heading)
            toc.append(f"- [{link_label(part_heading)}](#{anchor})")
            chunks.append(f"# {part_heading}")

        for path in files:
            body, plains, images = clean_chapter(path.read_text(encoding="utf-8"))
            plain_count += plains
            image_count += images
            chapters += 1
            in_fence = False
            for line in body.split("\n"):
                if line.startswith("```"):
                    in_fence = not in_fence
                    continue
                if in_fence:
                    continue
                match = HEADING.match(line)
                if not match:
                    continue
                level = len(match.group(1))
                text = heading_text(match.group(2))
                anchor = slugs.add(text)
                indent = "  " * toc_level(level, in_part)
                toc.append(f"{indent}- [{link_label(text)}](#{anchor})")
            chunks.append(body)

    if chapters == 0:
        raise SystemExit(f"No treatise chapters found in {DOCS}")

    document = (
        f"# {TITLE}\n\n## Contents\n\n"
        + "\n".join(toc)
        + "\n\n"
        + "\n\n".join(chunks)
        + "\n"
    )
    return document, chapters, plain_count, image_count


def assert_outside_docs(path: Path) -> None:
    docs = DOCS.resolve()
    if path == docs or docs in path.parents:
        raise SystemExit(f"Refusing to write inside {docs}")


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "-o",
        "--output",
        type=Path,
        default=DEFAULT_OUT,
        help=f"output file (default: {DEFAULT_OUT.relative_to(ROOT)})",
    )
    args = parser.parse_args(argv)

    output = args.output
    if not output.is_absolute():
        output = Path.cwd() / output
    output = output.resolve()
    assert_outside_docs(output)

    sources = [path for _part, _number, _title, files in chapter_paths() for path in files]
    before = fingerprint(sources)
    document, chapters, plain_count, image_count = build()
    if fingerprint(sources) != before:
        raise SystemExit("Source chapter files changed while reading. Nothing was written.")

    if "<plain" in document.lower() or "</plain" in document.lower():
        raise SystemExit("Refusing to write: <plain> tags are still in the consolidated text.")
    if IMAGE.search(document):
        raise SystemExit("Refusing to write: an image link is still in the consolidated text.")

    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(document, encoding="utf-8")

    if fingerprint(sources) != before:
        raise SystemExit(f"Source chapter files changed. Wrote {output} anyway; check docs/.")

    print(
        f"Wrote {output} ({chapters} chapters, "
        f"{plain_count} <plain> tags removed, {image_count} images removed)"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
