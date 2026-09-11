# YAML Library

*On common shelves.*

Schematic Representation is a shape, not a file format. The same fields could, in principle, be written in any serialization. In EIT that shape is written in YAML, and a collection of records built this way is a **YAML Library**.

- **YAML LIBRARY**: A structured, growing set of schematic entries — sharing a consistent set of fields, cross-referenced by stable identifiers — that accumulates instances of some kind (definitions, symbols, cases, relationships) into something that stays organized as it grows.

The choice of YAML over JSON is itself an intrinsic judgement, not a neutral default. JSON is precise and universally parseable, and it is written for machines first: no comments, heavy punctuation, a syntax that resists being read casually by a person. YAML holds the same structural information while staying legible without a parser: comments are native, nesting is visible through indentation rather than braces, and a human can scan an entry the way they would scan a table. A YAML Library has to serve both an AI reading it programmatically and a person reading it directly. The format that keeps both audiences native, rather than favoring one, is the correct intrinsic choice for the job.

A YAML Library is not one file with one purpose. It is a pattern, instantiable for more than one kind of content. Several instances have already come up, at different stages of readiness:

- **A term and symbol glossary** — every defined concept and its notation, held as a single source of truth. This instance is already built; YAML Glossary is next.

- **A case library** — structured records of real-world cases read through Attributes Dynamics, each stating its jurisdiction, the pairs involved, and the analyst's positions on them, with mandatory pairs enforced as complete rather than left half-argued. Named as a discipline in AI Assistance; not yet built as its own library. Operational Status is a first piece of vocabulary such a record could use for the Operation pair: tagging a Proceptivity or Fronterization reading as Supra- or Hyper-, rather than leaving degree and functional/dysfunctional status unstated.

- **Diagram metadata** — structured descriptions of a diagram's nodes and relationships, sitting alongside the image files under `diagrams/`, so a diagram's content becomes queryable rather than only visible. Deferred for now; a placeholder, not a built instance.

- **A typed knowledge graph** — an extension of the glossary's simple `related` lists into labeled relationships (a term *accentuated into* another, one attribute *concatenated with* another to *yield* a third, one longing *predisposing* a given pole) that would let a derivation path be traced rather than only marked as "related." Discussed, not yet designed.

- **A formal operator grammar** — rules stating what counts as a well-formed attribute pair, a legal concatenation, a valid accentuation — so that a new equation's validity can be checked rather than judged by eye. Also discussed, not yet built.

Each of these would follow the same discipline as the glossary: stable ids, explicit fields, entries short enough to scan and structured enough to check. None of them requires a new representation type. Schematic Representation already covers them. What a YAML Library adds is the concrete decision of how to write that representation down, and the habit of treating each new kind of accumulating content as a candidate for its own instance rather than folding it into prose, where it will be harder to maintain and harder for an AI to use reliably.
