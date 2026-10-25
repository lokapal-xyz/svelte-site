# Lokapal website

SvelteKit app for [lokapal.xyz](https://www.lokapal.xyz). Source:
[github.com/lokapal-xyz/svelte-site](https://github.com/lokapal-xyz/svelte-site). Vercel Root
Directory = `website`. Hub at `/` with six sections (Start here, Treatise, EIC-Dex, Edge EIC,
Models, About).

Treatise pages come from `../docs/**/*.md` (mdsvex). Glossary and Dex data are loaded at
build time from `../library/glossary/glossary.yaml` and `../library/eic-dex/eic-dex.yaml`.
Models is one page at `/models`. Each model is an entry under a shared introduction, with a
short recording in `static/models/`. The running models stay in their own repositories.
Edge EIC loads `../library/edge-eic/edge-eic.yaml` plus `leaves/*.md` (front matter + body,
tokens on). Diagrams are inlined from `../diagrams/svg/`. Product lock:
`../design-refs/design-decisions.md` (local; not in git).

License (all rights reserved; quotation with attribution welcome) and a cite line live on
`/about`. A free PDF of the treatise is generated locally (`python3 book/build.py`) into
`static/conciliatorics.pdf` and linked from `/treatise` and `/about`.

```sh
pnpm install
pnpm run dev
pnpm run check
pnpm run build
pnpm run preview
```

Node 22+ (see `.nvmrc`). pnpm only. No Tailwind; dark only. Do not re-run `sv create` here.
