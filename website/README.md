# Lokapal website

SvelteKit app for [lokapal.xyz](https://www.lokapal.xyz). Vercel Root Directory = `website`.
Hub at `/` with six sections (Start here, Treatise, EIC-Dex, In dialogue, Cases, About).

Treatise pages come from `../docs/**/*.md` (mdsvex). Glossary and Dex data are loaded at
build time from `../library/glossary/glossary.yaml` and `../library/eic-dex/eic-dex.yaml`.
Diagrams are inlined from `../diagrams/svg/`. Product lock: `../design-refs/design-decisions.md`
(local; not in git).

```sh
pnpm install
pnpm run dev
pnpm run check
pnpm run build
pnpm run preview
```

Node 22+ (see `.nvmrc`). pnpm only. No Tailwind; dark only. Do not re-run `sv create` here.
