# Treatise PDF

Generates a 6×9 free PDF of Conciliatorics from the same sources the site uses: `docs/` and `diagrams/svg/`. Extra pages (cover, title, copyright, contents, colophon) are produced by the template, not stored as treatise chapters.

```sh
python3 book/build.py
```

Writes `website/static/conciliatorics.pdf`. Requires Python 3.12+ (`markdown-it`, Pillow), Inkscape, and Typst. If `typst` is not on `PATH`, the script downloads the pinned Linux binary into `book/.tools/` (not committed). TeX Gyre Pagella and Linux Libertine are cached in `book/.tools/fonts/` the same way, so the PDF is set in the faces named in the colophon.

Do not edit the PDF by hand. Change the markdown or SVGs and rerun.
