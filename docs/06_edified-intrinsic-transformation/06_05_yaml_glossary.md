# YAML Glossary

*On a working example.*

The clearest way to explain a YAML Library is to walk through the one that already exists.

- **YAML GLOSSARY**: The first built instance of a <plain>YAML Library</plain>; holds every defined term and symbol in the treatise as a single set of structured, cross-referenced records.

It replaced two separate prose glossaries — one for definitions, one for symbols — that had been drifting apart the way any two hand-maintained documents eventually do: roughly the same ground, with no way to catch a term defined in one but not the other, or a symbol used two different ways across chapters.

Each entry carries a small, consistent set of fields: a stable `id`, used for cross-referencing rather than the display name, which can be revised later without breaking a link; the `term` itself and its `symbol`, where one exists; which chapter (`part`) and, where relevant, which `jurisdiction` it belongs to; its `pair`, if it has one; its `equation`, where a term is derived rather than primary; a `definition`; and `related`, a list of other entries worth reading alongside it. A few entries also carry `notes` — caveats, historical context, or a flag that something needs <plain>attention</plain>.

Here is one entry, so the shape is visible. We will not unpack the fields beyond what the list above already named.

```
  - id: stillness
    term: Stillness
    symbol: Q
    part: 02_attributes-dynamics
    jurisdiction: Primary
    pair: movement
    definition: Primary attribute; spatial pole of rest.
```

That structure is already doing real work, not only tidying. A query as simple as "every entry belonging to Attributes Status," or "every entry with a flagged status," is immediate against the glossary and would require rereading whole chapters against the prose alone. As the treatise grows, that gap only widens.

The audience is not exclusively an AI's. A person can open the file and get real use from it — this treatise's own author has done exactly that, spotting a symbol collision on inspection before any automated check ran. An AI can hold the entire glossary in view at once.

The glossary is a template, not a finished singular artifact. Stable ids, explicit fields, cross-links instead of prose references: any later YAML Library instance would follow the same habit. The glossary is the first place that habit was applied.
