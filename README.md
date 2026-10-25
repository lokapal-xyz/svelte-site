# Conciliatorics

Public source for [lokapal.xyz](https://www.lokapal.xyz), by **Lokapal** (Ricardo Pintos).

Conciliatorics is a perspective within Systemics. This repository holds the treatise, its structured libraries, and the SvelteKit site.

## License

All rights reserved. Quotation with attribution is welcome.

## Cite

Ricardo Pintos. _Conciliatorics_. https://www.lokapal.xyz/treatise

## Contents

- `docs/` — treatise markdown, one file per chapter
- `diagrams/svg/` — treatise diagrams
- `library/` — glossary, EIC-Dex, and Edge EIC
- `book/` — Typst pipeline for the free PDF
- `website/` — SvelteKit app (Vercel Root Directory)

The site is a hub with six sections: Start here, Treatise, EIC-Dex, Edge EIC, Models, and About. A free PDF of the treatise is generated from `docs/` and `diagrams/svg/` (`python3 book/build.py`) and offered on Treatise and About.

## Website

See [`website/README.md`](website/README.md). Node 22+, pnpm only.
