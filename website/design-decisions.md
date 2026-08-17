# Website — Design Decisions

This file records the stack and architecture decisions made so far for the future interactive
Conciliatorics website. It is planning material, not treatise content — the same distinction
CLAUDE.md already draws between `docs/` (the treatise) and `library/glossary/glossary.yaml`
(structured data in service of the treatise) applies here too.

**Status: planning only. No website code has been written yet.** This document is the
accumulated record of choices made in conversation, kept so future sessions don't have to
re-derive or re-litigate them. Update it as new decisions are made; don't let it drift behind
what's actually decided.

---

## Term & diagram interaction: click/tap, two-tier disclosure

The treatise is dense with cross-referential, original terminology. The site's defining feature
is contextual definitions — the interaction model went through a few iterations before settling
here, so the reasoning is worth keeping alongside the final decision.

**Rejected: hover-triggered tooltips.** Hover doesn't exist on touch devices at all, and even on
desktop, popping up a balloon under the cursor on a page where a meaningful fraction of the text
is a styled term risks constant, unwanted interruption for a reader who's just scanning normally,
not looking anything up. Hover would also have needed its own dexterity fix (a balloon containing
a clickable "More" button, reachable without the balloon vanishing first) that a click-only model
sidesteps entirely.

**Decided: click/tap only, identical on desktop and mobile.**

1. A styled term (in prose) or a diagram node is clicked/tapped.
2. A compact panel appears — anchored near the clicked element — showing **essential info only**
   (definition, symbol if one exists).
3. An **Expand** control inside that panel grows it, **with a progressive/animated size
   transition** (not a sudden jump), into the full view: equation chain, jurisdiction, pair,
   notes, related terms.
4. Dismissing (click outside, Esc, or an explicit close) returns to the underlying page at the
   same scroll position — no navigation occurs.

This keeps one interaction model across devices (no separate "mobile equivalent" to design),
avoids the hover-annoyance and dexterity problems above, and still keeps the common case (a quick
reminder of what a term means) cheap — essential info is available before Expand is ever clicked,
rather than every glance costing a full modal open/close.

**Implementation note.** The progressive-resize interaction has a native fit in Svelte —
`svelte/transition` and FLIP-based `animate:flip` (from `svelte/animate`) cover a card growing in
place into a larger view without pulling in an external animation library. Not expected to be a
major lift; worth confirming once building starts rather than a planning-stage blocker.

**v1 scope: self-contained and flat.** The expanded view shows a term's own equation chain and
related terms as text/labels, not as further clickable links into *other* terms' expanded views.
Making the chain itself click-through-able (derivation trails — walking from Viability back to
primary attributes, term by term) is a real enhancement but adds real complexity, since the panel
would then need its own navigation stack so closing it doesn't lose a multi-step exploration.
Deliberately scoped as a v2, not part of the initial build.

**Shareable via URL.** SvelteKit's shallow routing (`pushState`/`replaceState` from
`$app/navigation`) supports updating the URL (e.g. `#term=viability`) when the panel opens,
without an actual page navigation — so a definition becomes bookmarkable/linkable, and the
browser back button closes the panel instead of leaving the page. Low cost to add; skippable at
first if simplicity is preferred.

**One shared component, three uses.** The same click → panel → Expand flow applies to defined
terms in prose, elements inside diagrams, and the five core operators (`≡ ≢ ^ ← →`) wherever they
appear in an equation — all three key off the same **stable ids** in `glossary.yaml`, not
displayed label text, so one component serves all of them. This is also why the interaction
doesn't need to change if a definition's phrasing is later refined, or if a second language is
ever added (see Language, below).

---

## Stack: SvelteKit (Svelte 5, runes) + Vercel

The site is built from scratch — there's no existing Conciliatorics site code to preserve, so no
framework choice here carries a migration cost. (Next.js was the earlier pick, largely on the
strength of React's web3 tooling ecosystem; that reasoning no longer applies and the decision was
revisited.)

- **Interactivity is pervasive, not occasional.** The click/tap disclosure panel touches a
  meaningful fraction of the running prose, every diagram, and the operator symbols — closer to
  an app than a mostly-static content site. This ruled out an islands-first framework like Astro:
  most pages would need substantial client JS anyway, and the "one shared component, three uses"
  requirement above wants state shared across the whole page (only one panel open at a time,
  global Escape/click-outside handling) — native to a single SvelteKit app via context, but an
  extra library (e.g. nanostores) needed to bridge state across isolated Astro islands.
- **EIC-Dex is a real app, not a content page** (see below) — search, filtered browsing,
  deep-linked entries (`/dex/viability`). SvelteKit's routing and load functions fit this
  directly.
- **Lighter by default.** SvelteKit compiles away its framework runtime instead of shipping a
  virtual-DOM library to the client, which suits a text-heavy site better than Next.js's default
  (which needed active discipline — Server Components by default — to avoid shipping more client
  JS than the content needed).
- **Vercel deployment is unaffected.** Vercel has first-party, zero-config support for SvelteKit
  (`@sveltejs/adapter-vercel`) — the git-push-to-deploy workflow and the custom domain (NameCheap
  DNS → Vercel) work the same way they do for the author's other site. Only the app framework is
  new; the hosting pipeline isn't.
- **Svelte 5, runes mode, from day one.** `$state` / `$derived` / `$effect` / `$props`, no legacy
  `$:`-reactivity or Svelte 4 idioms, so the codebase isn't mixing conventions from the start.
  AI-assisted work on this codebase should follow the official `svelte-core-bestpractices` skill
  (from `sveltejs/ai-tools`, installed user-scoped) for exactly this reason.

---

## Repo layout & development tooling

The SvelteKit project itself will live at **`website/app/`** — a subfolder of this repo, not a
separate one. This keeps the "read `glossary.yaml` directly at build time" plan below a plain
relative file read (no submodule, no sync step, no second source of truth to keep fetched and
current). The tradeoff, accepted deliberately: Node tooling (`node_modules`, lockfile, build
output, app-specific CI) now lives alongside the treatise's markdown/YAML content in the same git
history. `website/design-decisions.md` (this file) stays where it is, as a sibling to `app/`, not
inside it.

Locked in now, before any scaffolding, specifically to avoid later drift or improvised choices:

- **Package manager: pnpm.** Matches the author's existing Next.js/Vercel project, `sv create`
  (SvelteKit's own scaffolding CLI) supports it natively, and Vercel auto-detects a
  `pnpm-lock.yaml` with no extra config.
- **Node version: pinned**, via `.nvmrc` and `package.json`'s `engines` field, tracking current
  Node LTS.
- **TypeScript: yes, from the start.** Cheap to pick at scaffold time via `sv create`, expensive
  to retrofit later — and this site is data-shape-heavy (glossary entries, diagram node/edge
  records, EIC-Dex derivation records all flowing through components), which is exactly where
  static typing earns its cost.
- **Lint/format: ESLint + Prettier with `prettier-plugin-svelte`**, using whatever `sv create`
  scaffolds by default rather than a hand-picked config. Not worth relitigating beyond "use the
  default."

**Deliberately not decided yet** (no conflict risk from leaving these open):

- **CSS approach** (scoped `<style>` + CSS custom properties vs. a utility framework like
  Tailwind) — ties into the still-open "how are interactive terms visually signaled" question
  above; better decided once real components exist than in the abstract.
- **Testing tooling** (Vitest, Playwright) — nothing to target until a first component exists.

---

## Glossary data: read glossary.yaml directly at build time

The website needs term/definition data for the disclosure panels. Rather than hand-maintaining a
second, separate content file for the site (which would recreate the exact drift problem the
treatise already solved once — see `docs/06_edified-intrinsic-transformation/06_04_yaml_glossary.md`
on merging the old definitions/symbols glossaries into one), the site reads `glossary.yaml`
directly at build time: a SvelteKit load function (`+page.server.ts` / `+layout.server.ts`)
parses it for prerendered pages — no separate generated file written to disk, no client-side YAML
parsing, no runtime fetch.

Only three fields are actually consumed for the panel: **`id`**, **`term`**, **`definition`**
(possibly `symbol` too, if shown). This is a deliberate scope limit, not an oversight:

- `glossary.yaml`'s own header already documents `id` as stable and safe to depend on long-term.
- The website's build step should stay indifferent to `glossary.yaml`'s schema growing over
  time (e.g. the typed knowledge graph or operator grammar directions named as possible futures
  in `06_03_yaml_library.md`) — it only ever looks for those three fields and ignores everything
  else, so schema growth elsewhere doesn't break the site.
- Editing a definition's wording in `glossary.yaml` and redeploying is enough to update the
  live site — no manual copy-paste, no second source of truth to keep in sync.

---

## Diagrams: diagram-as-data, not hand-exported SVG

The existing diagrams are Inkscape exports (PNG now, SVG available). For per-element click
interactivity, raw Inkscape SVG output has real problems: auto-generated non-semantic ids
(`text1`, `path14`, ...), label text and its bounding shape as unrelated sibling elements
instead of one clickable group, duplicated marker definitions, and (in at least one diagram
checked so far) mojibake-encoded Spanish text alongside the English prose.

**Decision:** Inkscape stays in the workflow as a *design* tool — laying out and iterating on a
diagram visually is still done there. But the artifact that ships to the website isn't the
exported SVG file; it's a small hand-ported **data structure** per diagram (node positions,
labels, ids, edges), rendered by a single shared Svelte/SVG component that owns id-assignment,
grouping, and click/tap wiring for every diagram at once, rather than being patched per file.

Rejected alternative: auto-layout graph libraries. These diagrams have deliberately meaningful
hand-authored geometry (the Compass diagram is literally compass-shaped; Resolution's layout
mirrors its conceptual build-up) that a generic auto-layout algorithm would fight rather than
preserve.

Rough data shape, subject to change once actual porting starts:

```ts
{
  nodes: [{ id: "friction", label: "Friction", x: 18, y: 5, shape: "rect" }, ...],
  edges: [{ from: "friction", to: "potential", style: "diagonal" }, ...],
}
```

with an escape hatch for hand-specified path geometry on edges/shapes that don't fit the
node/edge grammar cleanly.

This also happens to realize, sooner rather than later, something already named as a deferred
future direction in `06_03_yaml_library.md`: "Diagram metadata — structured descriptions of a
diagram's nodes and relationships... deliberately deferred for now." Building the website
diagrams this way isn't scope creep against that roadmap — it's the same idea, motivated by an
immediate need instead of a speculative one.

**Not yet done:** the actual per-diagram porting (~15 diagrams) hasn't started. Existing PNG/SVG
exports serve as the reference "spec sheet" for that work when it happens.

---

## Visual design: dark mode only

Decided against a light/dark toggle — the site is **dark mode only**: dark background, light
text, no alternate theme.

- The material is text-heavy; a light background is worse for extended reading sessions at this
  volume.
- One palette to design, test, and maintain for contrast/accessibility, rather than two — less
  ongoing design burden for a site expected to iterate quickly (the same reasoning behind staying
  English-only for now — see Language, below).

**Not yet decided: how interactive terms are visually signaled** in running prose — a subtle
color shift, a dotted underline, or some combination. Deliberately left open to experiment with
once real content is in front of real styling, rather than picked in the abstract. Whatever is
chosen, it should not rely on color alone — pairing a color cue with a shape cue (e.g. a dotted
underline) protects against colorblind readers and against any future palette tweaks, since color
alone as the only signal would break both.

---

## Language: English only, for now

Decided against a bilingual site (the author's existing site is bilingual), because:

- Every one of `docs/` and all of `glossary.yaml` is English-only already — bilingual would be
  new work layered on top, not a default being preserved.
- This site is expected to iterate faster than the author's existing site — bilingual
  maintenance directly fights that goal, since every edit would need mirroring in a second
  language or the two versions drift (the same failure mode already named above re: glossary
  drift).

Not a locked-in constraint: SvelteKit i18n (e.g. Paraglide, sveltekit-i18n) can be added later
without a rewrite, and is orthogonal to the id-based interaction system described above (ids are
language-agnostic; adding a locale would mean the tooltip data gains a locale dimension, not that
the diagrams or click/tap wiring change).

---

## EIC-Dex: dedicated lookup tool, separate from the term-disclosure panel

A second interactive feature, distinct from the click/tap term panels above: a dedicated
lookup tool scoped strictly to Edified Interstitial Contemplation (Parts 2-5) — search by term
name or symbol, then trace a concept's derivation back to its terminal primitives, the way a
Pokédex traces an evolved Pokémon through its earlier forms. Full reasoning, schema, and the
underlying data live in `library/eic-dex/eic-dex.md` and `library/eic-dex/eic-dex.yaml`; this
entry is the short pointer for anyone scanning website decisions specifically.

**Decided: a dedicated tab/page, not a popup or an extension of the term-disclosure panel.**

- **Not the disclosure panel.** That panel is deliberately scoped as compact and
  dismiss-in-place (see above) — "essential info first," with full derivation trails explicitly
  named and deferred to a v2 that doesn't exist yet. A derivation trace is a browsing/research
  task, not a glance, and would fight the panel's own design goals if crammed in. The panel can
  still link out to a term's EIC-Dex entry ("View full derivation →") without merging scope or
  implementation.
- **A page, not a modal/popup.** Search-and-browse wants real screen space that an overlay,
  especially on mobile, doesn't comfortably give — the same constraint that ruled out the panel
  above. It's also a destination entered and left deliberately (open it, use it, close it when
  done), which is page behavior, not overlay behavior. Deep-linking one entry
  (e.g. `/dex/viability`) is also more natural on a real route than as modal state. Notably, the
  actual Pokédex — on the official site and elsewhere — is a page for the same reasons, not a
  popup.

**Data backing it:** `library/eic-dex/eic-dex.yaml`, a hand-authored (not build-generated)
derivation-graph overlay joined to `glossary.yaml` by `id`. Hand-authored because symbols and
equations change rarely and only on deliberate structural revision — unlike prose content,
which the site already generates from `glossary.yaml` at build time (see above) precisely
because it changes often. Not every glossary entry appears in it — only concepts that
participate in a stated equation; see `eic-dex.md` for the full scope rule and two notable
caveats about what "traces back to primitives" actually means in this system.

**Not yet done:** the actual page/route hasn't been built — this section (and the underlying
YAML) is data-and-decision groundwork, same status as the diagram-porting work above.

---

## Open questions

- Hosting path: whether the site lives at a subdomain/path under lokapal.xyz or elsewhere —
  not yet decided.
- When (if ever) to add i18n — deferred (see above).
- The actual diagram-porting work — approach decided, execution not started.
- The EIC-Dex page/route itself — data and decisions in place, build not started.
