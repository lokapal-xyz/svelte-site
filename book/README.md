# Treatise PDF

Generates a 6×9 free PDF of Conciliatorics from the same sources the site uses: `docs/` and `diagrams/svg/`. Extra pages (cover, title, copyright, contents, colophon) are produced by the template, not stored as treatise chapters.

```sh
python3 book/build.py
```

Writes `website/static/conciliatorics.pdf`. Requires Python 3.12+ (`markdown-it`, Pillow), Inkscape, and Typst. If `typst` is not on `PATH`, the script downloads the pinned Linux binary into `book/.tools/` (not committed). TeX Gyre Pagella and Linux Libertine are cached in `book/.tools/fonts/` the same way, so the PDF is set in the faces named in the colophon.

Do not edit the PDF by hand. Change the markdown or SVGs and rerun.

## Single Markdown file

```sh
python3 book/consolidate.py
```

Reads `docs/` and writes `book/_build/conciliatorics.md`. The chapter files are not modified. `<plain>` tags are unwrapped and diagram image links are dropped. The file opens with a table of contents. Part 7 includes the Epilogue only. Pass `-o path.md` to write somewhere else. The script refuses to write into `docs/`.
