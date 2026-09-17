"""Convert treatise markdown to Typst markup."""

from __future__ import annotations

import re
from pathlib import Path

from markdown_it import MarkdownIt

from print_svg import FigureInfo

PLAIN = re.compile(r"</?plain(?:\s[^>]*)?>", re.I)
MD = MarkdownIt("commonmark").enable("table")

# Typst markup that would otherwise start a command, emphasis, math, or heading.
ESCAPE_CHARS = frozenset("\\#*$<>@[]_`^~")


def escape_text(text: str) -> str:
    return "".join(f"\\{ch}" if ch in ESCAPE_CHARS else ch for ch in text)


def typst_string(text: str) -> str:
    return '"' + text.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n") + '"'


def strip_plain(text: str) -> str:
    return PLAIN.sub("", text.replace("\ufeff", ""))


def split_chapter(raw: str) -> tuple[str, str | None, str]:
    raw = strip_plain(raw)
    lines = raw.split("\n")
    i = 0
    title = "Untitled"
    if lines and lines[0].startswith("# "):
        title = lines[0][2:].strip()
        i = 1
    while i < len(lines) and lines[i].strip() == "":
        i += 1
    kicker = None
    if i < len(lines):
        match = re.match(r"^\*(.+)\*$", lines[i].strip())
        if match and "**" not in lines[i]:
            kicker = match.group(1).strip()
            i += 1
            while i < len(lines) and lines[i].strip() == "":
                i += 1
    body = "\n".join(lines[i:])
    return title, kicker, body


def collect_until(tokens: list, i: int, open_type: str, close_type: str) -> tuple[list, int]:
    depth = 1
    inner: list = []
    j = i + 1
    while j < len(tokens):
        tok = tokens[j]
        if tok.type == open_type:
            depth += 1
        elif tok.type == close_type:
            depth -= 1
            if depth == 0:
                return inner, j
        inner.append(tok)
        j += 1
    return inner, j


class Renderer:
    def __init__(self, figures: dict[str, FigureInfo]):
        self.figures = figures

    def render(self, tokens: list) -> str:
        chunks: list[str] = []
        i = 0
        while i < len(tokens):
            tok = tokens[i]
            if tok.type == "heading_open":
                level = int(tok.tag[1]) + 1
                title = self.inlines(tokens[i + 1].children or [])
                chunks.append(f"#heading(level: {level}, outlined: false)[{title}]\n")
                i += 3
                continue
            if tok.type == "paragraph_open":
                inline = tokens[i + 1]
                children = inline.children or []
                if len(children) == 1 and children[0].type == "image":
                    chunks.append(self.figure(children[0]) + "\n")
                else:
                    chunks.append(self.inlines(children) + "\n")
                i += 3
                continue
            if tok.type == "bullet_list_open":
                inner, close = collect_until(tokens, i, "bullet_list_open", "bullet_list_close")
                chunks.append(self.list_block(inner, ordered=False, depth=0) + "\n")
                i = close + 1
                continue
            if tok.type == "ordered_list_open":
                inner, close = collect_until(tokens, i, "ordered_list_open", "ordered_list_close")
                chunks.append(self.list_block(inner, ordered=True, depth=0) + "\n")
                i = close + 1
                continue
            if tok.type == "table_open":
                inner, close = collect_until(tokens, i, "table_open", "table_close")
                chunks.append(self.table(inner) + "\n")
                i = close + 1
                continue
            if tok.type == "fence" or tok.type == "code_block":
                chunks.append(f"#code-block({typst_string(tok.content.rstrip(chr(10)))})\n")
                i += 1
                continue
            if tok.type == "hr":
                chunks.append("#horizontalrule\n")
                i += 1
                continue
            if tok.type == "blockquote_open":
                inner, close = collect_until(tokens, i, "blockquote_open", "blockquote_close")
                quoted = self.render(inner).strip()
                chunks.append(f"#quote[{quoted}]\n")
                i = close + 1
                continue
            i += 1
        return "\n".join(chunks).strip() + "\n"

    def inlines(self, tokens: list) -> str:
        out: list[str] = []
        i = 0
        while i < len(tokens):
            tok = tokens[i]
            if tok.type == "text":
                out.append(escape_text(tok.content))
            elif tok.type == "strong_open":
                inner, close = collect_until(tokens, i, "strong_open", "strong_close")
                out.append(f"#strong[{self.inlines(inner)}]")
                i = close
            elif tok.type == "em_open":
                inner, close = collect_until(tokens, i, "em_open", "em_close")
                out.append(f"#emph[{self.inlines(inner)}]")
                i = close
            elif tok.type == "code_inline":
                out.append(f"#raw({typst_string(tok.content)})")
            elif tok.type == "image":
                out.append(self.figure(tok))
            elif tok.type == "link_open":
                href = tok.attrGet("href") or ""
                inner, close = collect_until(tokens, i, "link_open", "link_close")
                label = self.inlines(inner)
                out.append(f"#link({typst_string(href)})[{label}]")
                i = close
            elif tok.type == "softbreak":
                out.append(" ")
            elif tok.type == "hardbreak":
                out.append(" \\\n")
            elif tok.type == "html_inline":
                stripped = re.sub(r"<[^>]+>", "", tok.content)
                out.append(escape_text(stripped))
            i += 1
        return "".join(out)

    def figure(self, tok) -> str:
        src = tok.attrGet("src") or ""
        name = Path(src).stem
        alt = tok.content or tok.attrGet("alt") or ""
        caption = f"caption: [{escape_text(alt)}]" if alt else "caption: none"
        fig = self.figures.get(name)
        if fig is None:
            return f"#text(fill: red)[Missing figure {escape_text(name)}.]"
        return f"#diagram({typst_string(fig.rel_pdf)}, {caption}, width: {fig.width_pt}pt)"

    def list_block(self, tokens: list, ordered: bool, depth: int) -> str:
        marker = "+" if ordered else "-"
        indent = "  " * depth
        lines: list[str] = []
        i = 0
        while i < len(tokens):
            tok = tokens[i]
            if tok.type != "list_item_open":
                i += 1
                continue
            inner, close = collect_until(tokens, i, "list_item_open", "list_item_close")
            text_chunks: list[str] = []
            nested: list[str] = []
            k = 0
            while k < len(inner):
                item = inner[k]
                if item.type == "paragraph_open":
                    text_chunks.append(self.inlines(inner[k + 1].children or []))
                    k += 3
                    continue
                if item.type == "bullet_list_open":
                    nest, nest_close = collect_until(inner, k, "bullet_list_open", "bullet_list_close")
                    nested.append(self.list_block(nest, False, depth + 1))
                    k = nest_close + 1
                    continue
                if item.type == "ordered_list_open":
                    nest, nest_close = collect_until(inner, k, "ordered_list_open", "ordered_list_close")
                    nested.append(self.list_block(nest, True, depth + 1))
                    k = nest_close + 1
                    continue
                k += 1
            if text_chunks:
                lines.append(f"{indent}{marker} {text_chunks[0]}")
                for extra in text_chunks[1:]:
                    lines.append(f"{indent}  {extra}")
            elif not nested:
                lines.append(f"{indent}{marker}")
            lines.extend(nested)
            i = close + 1
        return "\n".join(lines)

    def table(self, tokens: list) -> str:
        rows: list[list[str]] = []
        row: list[str] = []
        i = 0
        while i < len(tokens):
            tok = tokens[i]
            if tok.type == "tr_open":
                row = []
            elif tok.type == "tr_close":
                rows.append(row)
            elif tok.type in ("th_open", "td_open"):
                cell = self.inlines(tokens[i + 1].children or [])
                row.append(cell)
                i += 3
                continue
            i += 1
        if not rows:
            return ""
        width = max(len(r) for r in rows)
        for r in rows:
            while len(r) < width:
                r.append("")
        if width <= 1:
            cols = "1fr"
        elif width == 2:
            cols = "1.25fr, 1fr"
        elif width == 3:
            cols = "1.15fr, 1fr, 1fr"
        else:
            cols = ", ".join(["1fr"] * width)
        compact = "true" if width >= 5 else "false"
        pieces = ["table.header(" + ", ".join(f"[{c}]" for c in rows[0]) + ")"]
        for r in rows[1:]:
            pieces.extend(f"[{c}]" for c in r)
        return (
            "#book-table(columns: ("
            + cols
            + "), compact: "
            + compact
            + ",\n  "
            + ",\n  ".join(pieces)
            + ",\n)"
        )


def chapter_to_typst(title: str, kicker: str | None, body: str, figures: dict[str, FigureInfo]) -> str:
    rendered = Renderer(figures).render(MD.parse(body))
    args = [f"[{escape_text(title)}]"]
    if kicker:
        args.append(f"kicker: [{escape_text(kicker)}]")
    header = "#chapter(" + ", ".join(args) + ")\n"
    return header + "\n" + rendered
