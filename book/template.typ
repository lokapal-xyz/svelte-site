// Conciliatorics — print template. 6×9, ink on warm paper.

#let paper = rgb("#f4efe6")
#let ink = rgb("#1c1917")
#let muted = rgb("#5c5854")
#let rule = rgb("#d4cdc3")
#let token = rgb("#c4a574")
#let cover-bg = rgb("#171719")
#let cover-text = rgb("#e6e6e6")
#let cover-muted = rgb("#a3a3a8")
#let link-color = rgb("#7a5428")

#let part-state = state("part-title", "")
#let chap-state = state("chap-title", "")
#let glossary-state = state("glossary", false)

#let body-font = ("TeX Gyre Pagella", "Linux Libertine O", "Noto Serif")
#let mono-font = ("Linux Libertine Mono O", "DejaVu Sans Mono")

#let horizontalrule = {
  v(0.85em)
  align(center, line(length: 22%, stroke: 0.4pt + rule))
  v(0.85em)
}

#let code-block(src) = {
  set par(first-line-indent: 0pt)
  block(
    width: 100%,
    fill: rgb("#efeae3"),
    inset: 9pt,
    radius: 2pt,
    breakable: true,
    raw(src, block: true),
  )
}

#let book-table(columns: (), compact: false, ..cells) = {
  set text(size: if compact { 8pt } else { 9pt }, hyphenate: false)
  set par(first-line-indent: 0pt, justify: false, leading: 0.52em)
  block(
    width: 100%,
    breakable: true,
    above: 1.2em,
    below: 1.2em,
    table(
      columns: columns,
      stroke: (x: none, y: 0.35pt + rule),
      inset: if compact { (x: 3.4pt, y: 4.4pt) } else { (x: 5pt, y: 5.6pt) },
      align: left + top,
      ..cells.pos(),
    ),
  )
}

#let diagram(path, caption: none, width: 100%) = {
  set par(first-line-indent: 0pt)
  align(center)[
    #figure(
      image(path, width: width),
      caption: caption,
      kind: image,
      supplement: none,
      numbering: none,
      placement: none,
    )
  ]
}

#let part(number, title) = {
  pagebreak(weak: false)
  part-state.update("Part " + number + " — " + title)
  chap-state.update("")
  // Outline/bookmark keep the full "Part N — Title" line; the page itself
  // stacks PART N over the title so long names wrap as a title, not after the dash.
  place(hide[
    #heading(level: 1, outlined: true, bookmarked: true)[Part #number — #title]
  ])
  v(1fr)
  align(center)[
    #set par(first-line-indent: 0pt, justify: false, leading: 0.95em)
    #text(size: 10.5pt, fill: muted, tracking: 0.24em)[PART #number]
    #v(1.15em)
    #block(width: 72%)[
      #set text(size: 22pt, weight: "regular", hyphenate: false)
      #title
    ]
  ]
  v(1.45fr)
  pagebreak()
}

#let chapter(title, kicker: none) = {
  pagebreak(weak: true)
  chap-state.update(title)
  glossary-state.update(
    title == "Definitions Glossary" or title == "Symbols Glossary",
  )
  heading(level: 2, outlined: true, bookmarked: true)[#title]
  if kicker != none {
    block(above: 0.4em, below: 1.35em)[
      #set text(style: "italic", fill: muted, size: 10.5pt)
      #set par(first-line-indent: 0pt, justify: false)
      #kicker
    ]
  } else {
    v(0.9em)
  }
}

#let _header = context {
  let page-headings = query(heading).filter(h => h.location().page() == here().page())
  if page-headings.any(h => h.level <= 2) {
    none
  } else {
    let part = part-state.get()
    let chap = chap-state.get()
    set text(size: 8pt, fill: muted, tracking: 0.04em)
    block(width: 100%, inset: (bottom: 6pt), stroke: (bottom: 0.3pt + rule))[
      #if calc.even(here().page()) {
        part
      } else {
        align(right, chap)
      }
    ]
  }
}

#let _footer = context {
  align(center, text(size: 8.5pt, fill: muted, counter(page).display()))
}

#let cover-page(grain: none, compass: none, title: "", author: "", lede: "") = {
  page(
    margin: 0pt,
    header: none,
    footer: none,
    numbering: none,
    fill: cover-bg,
  )[
    #place(
      dx: 0pt,
      dy: 0pt,
      rect(
        width: 100%,
        height: 100%,
        fill: tiling(image(grain)),
      ),
    )
    #align(center)[
      #v(1.35fr)
      #image(compass, width: 42mm)
      #v(1.2em)
      #text(
        font: body-font,
        size: 28pt,
        fill: cover-text,
        tracking: 0.02em,
      )[#title]
      #v(0.75em)
      #text(size: 13pt, fill: token)[#author]
      #v(1.2em)
      #text(size: 10.5pt, fill: cover-muted)[#lede]
      #v(1.1fr)
    ]
  ]
}

#let half-title(title) = {
  page(header: none, footer: none, numbering: none)[
    #align(center + horizon)[
      #set par(first-line-indent: 0pt, justify: false)
      #text(size: 20pt)[#title]
    ]
  ]
}

#let title-page(compass: none, title: "", lede: "", author: "", legal: "", url: "") = {
  page(header: none, footer: none, numbering: none)[
    #set par(first-line-indent: 0pt, justify: false)
    #align(center)[
      #v(1.35in)
      #image(compass, width: 22mm)
      #v(1.15em)
      #text(size: 26pt)[#title]
      #v(0.7em)
      #text(size: 11pt, fill: muted, style: "italic")[#lede]
      #v(1fr)
      #text(size: 13pt)[#author]
      #v(0.25em)
      #text(size: 10.5pt, fill: muted)[#legal]
      #v(1.4em)
      #text(size: 9.5pt, fill: muted)[#url]
      #v(0.85in)
    ]
  ]
}

#let copyright-page(title: "", legal: "", url: "", generated: "", git: none) = {
  page(header: none, numbering: "i")[
    #set text(size: 9.5pt, fill: muted)
    #set par(first-line-indent: 0pt, justify: true, leading: 0.7em)
    #v(1fr)
    All rights reserved. Quotation with attribution is welcome.

    #v(0.85em)
    Cite: #legal. #emph[#title]. #link(url)[#url]

    #v(0.85em)
    This PDF was generated from the public treatise sources on #generated. It is a living document, not a closed one. If the dates differ, prefer the site.

    #v(0.85em)
    Canonical address: #link(url)[#url]
    #v(0.4in)
  ]
}

#let contents-page() = {
  pagebreak()
  set par(first-line-indent: 0pt, justify: false)
  outline(title: [Contents], depth: 2, indent: 1em)
}

#let colophon-page(generated: "", url: "") = {
  page(header: none)[
    #set par(first-line-indent: 0pt, justify: true)
    #block(below: 1.35em)[
      #set text(size: 17pt, weight: "regular")
      Colophon
    ]
    Set in TeX Gyre Pagella, with Linux Libertine and Noto Serif for glyphs the body face does not carry. Diagrams are the treatise SVGs, recast for the page from the same files the site inlines.

    #v(0.55em)
    The live site also holds EIC-Dex, Edge EIC, and Models. Those are site instruments, not part of this volume.

    #v(0.55em)
    Generated #generated. #link(url)[#url]
  ]
}

#let book(
  title: "Conciliatorics",
  author: "Lokapal",
  legal: "Ricardo Pintos",
  lede: "A perspective within Systemics.",
  url: "https://www.lokapal.xyz/treatise",
  generated: "",
  git: none,
  grain: "grain.png",
  compass: "compass.png",
  body,
) = {
  set document(
    title: title,
    author: legal,
    keywords: ("Conciliatorics", "Systemics", "Lokapal"),
  )
  set page(
    width: 6in,
    height: 9in,
    fill: paper,
    margin: (inside: 0.88in, outside: 0.68in, top: 0.74in, bottom: 0.78in),
    header: none,
    footer: none,
  )
  set text(
    font: body-font,
    size: 10.5pt,
    fill: ink,
    lang: "en",
    hyphenate: true,
  )
  set par(
    justify: true,
    leading: 0.68em,
    spacing: 0.68em,
    first-line-indent: (amount: 1.15em, all: false),
    linebreaks: "optimized",
  )
  set heading(numbering: none, hanging-indent: 0pt)
  show heading: it => {
    set par(first-line-indent: 0pt, justify: false)
    set text(font: body-font, fill: ink, hyphenate: false)
    if it.level == 1 {
      block(width: 100%, below: 0pt)[
        #set text(size: 22pt, weight: "regular")
        #it.body
      ]
    } else if it.level == 2 {
      block(width: 100%, above: 0.2em, below: 0.2em)[
        #set text(size: 17pt, weight: "regular")
        #it.body
      ]
    } else {
      block(width: 100%, above: 1.35em, below: 0.7em)[
        #set text(size: 11pt, weight: "bold")
        #it.body
      ]
    }
  }
  set figure(placement: none)
  show list: it => context {
    let g = glossary-state.get()
    block(
      above: if g { 0.4em } else { 1.15em },
      below: if g { 0.45em } else { 1.15em },
      it,
    )
  }
  show enum: it => context {
    let g = glossary-state.get()
    block(
      above: if g { 0.4em } else { 1.15em },
      below: if g { 0.45em } else { 1.15em },
      it,
    )
  }
  show figure: set block(breakable: false, above: 1.15em, below: 1.15em)
  show figure.caption: it => {
    set text(size: 8.5pt, fill: muted, style: "italic")
    set par(first-line-indent: 0pt, justify: true)
    it
  }
  show raw: set text(font: mono-font, size: 8.2pt, fill: ink)
  show raw.where(block: false): set text(font: body-font, size: 10.5pt)
  show link: set text(fill: link-color)
  show outline.entry.where(level: 1): it => {
    v(1.15em, weak: true)
    strong(it)
  }

  cover-page(grain: grain, compass: compass, title: title, author: author, lede: lede)
  half-title(title)
  title-page(
    compass: compass,
    title: title,
    lede: lede,
    author: author,
    legal: legal,
    url: url,
  )
  copyright-page(title: title, legal: legal, url: url, generated: generated, git: git)

  set page(header: none, footer: _footer, numbering: "i")
  counter(page).update(1)
  contents-page()

  pagebreak()
  set page(header: _header, footer: _footer, numbering: "1")
  counter(page).update(1)
  body

  colophon-page(generated: generated, url: url)
}
