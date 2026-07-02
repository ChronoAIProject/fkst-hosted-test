# fkst Site

The `site/` directory is the static marketing and documentation site for
**fkst**, the autonomous software-engineering platform. The product flow is:
file a GitHub issue, an isolated agent claims it, the agent writes code with
an LLM, and the delivery path opens a PR for review.

The site uses HTML5, vanilla CSS, and minimal vanilla JavaScript. There is no
framework, no build step, and no `npm` dependency for the site itself.

## Directory Layout

```text
site/
  README.md
  css/
    reset.css
    tokens.css
    base.css
    theme.css
    a11y.css
    code.css
  js/
    layout.js
    theme.js
    code.js
  partials/
    head.html
    header.html
    footer.html
  data/
    packages.json
  assets/
    favicon.svg
    images/
  index.html
  getting-started.html
  architecture.html
  packages.html
```

## Head Ownership

The canonical `<head>` boilerplate is owned by the later issue named
`Canonical head template + favicon`; do not duplicate the full head contract in
page work before that issue lands.

Foundation CSS loads before page CSS. `reset.css` is first because it declares
the cascade-layer order. `tokens.css` is unlayered and loads near the start so
every stylesheet can consume the same custom properties.

## Theme Contract

The default theme is dark. No attribute is needed on `<html>` for the dark
theme, and `tokens.css` defines that dark theme directly on `:root`.

The light theme is delivered later in `site/css/theme.css` as a
`[data-theme="light"]` override block, not in `tokens.css`.

Theme selection uses the localStorage key `fkst-theme`. If the value is
`light`, JavaScript should set `data-theme="light"` on `<html>`. If the value is
missing or `dark`, the attribute should be absent so the dark tokens apply.

Pages that support the theme switcher should include an anti-FOUC inline snippet
before first paint. It belongs in the canonical head template and only reads
`fkst-theme` to set the initial attribute before CSS paints.

## Token Rules

Components consume semantic tokens only. Do not hardcode `oklch()`, hex, RGB,
or named colors in component CSS when an existing token describes the role.

For tinted borders, backgrounds, or foregrounds, use the repo tint recipe with
one semantic token and transparent fallback:

```css
color-mix(in oklab, var(--token) N%, var(--line)/transparent)
```

## Color Tokens

| Token | Role |
| --- | --- |
| `--bg` | Page background and the darkest app-continuous surface. |
| `--raise` | Raised panels, header background, and quiet grouped surfaces. |
| `--raise-2` | Higher-emphasis raised surfaces and active surface states. |
| `--line` | Default divider, border, and low-emphasis rule color. |
| `--line-2` | Stronger border, selected edge, and high-contrast rule color. |
| `--fg` | Primary foreground text and icons. |
| `--dim` | Secondary text and supporting interface copy. |
| `--faint` | Tertiary text, metadata, and subdued labels. |
| `--ghost` | Disabled text, placeholders, and low-emphasis hints. |
| `--amber` | Primary accent, calls to action, and brand emphasis. |
| `--amber-ink` | Text or icon color placed on amber fills. |
| `--green` | Success, ready, healthy, or positive states. |
| `--red` | Error, danger, failed, or destructive states. |
| `--gold` | Warning, pending, or attention states distinct from primary amber. |

`tokens.css` is canonical for exact `oklch()` values and copies the product
app's dark amber-accent language.

## Font Tokens

| Token | Role |
| --- | --- |
| `--display` | Display headings, large labels, and brand-forward moments. |
| `--ui` | Body copy, navigation, controls, and general interface text. |
| `--mono` | Code, terminal text, identifiers, and structured technical data. |

## Layout And Shape Tokens

| Token | Role |
| --- | --- |
| `--container-max` | Main content container width, currently `1120px`. |
| `--site-max-w` | Site-wide maximum width alias for shared layout code. |
| `--section-y` | Vertical section spacing, `clamp(64px, 10vw, 128px)`. |
| `--gutter` | Responsive page gutter, `clamp(16px, 4vw, 32px)`. |
| `--site-header-h` | Sticky header height, currently `60px`. |
| `--z-header` | Header stacking level, currently `100`. |
| `--radius-sm` | Small control and chip radius, currently `8px`. |
| `--radius` | Default panel and component radius, currently `12px`. |
| `--radius-lg` | Larger feature panel radius, currently `20px`. |
| `--radius-pill` | Fully rounded pill radius, currently `999px`. |
| `--shadow-card` | Standard card shadow for elevated repeated items. |

## Cascade Layers

`site/css/reset.css` declares the global layer order:

```css
@layer reset, base, utilities;
```

The intended order is `reset < base < utilities`. Reset rules live in
`@layer reset`, shared defaults belong in `@layer base` when `base.css` lands,
and opt-in utility classes belong in `@layer utilities`.

`tokens.css` stays unlayered because it contains custom properties only. This
avoids weakening canonical values through layer order.

Page-specific CSS should also stay unlayered so page styles win over shared
layers without selector escalation.

## Reset Contract

`reset.css` is a modern Andy Bell and Josh Comeau style hybrid. It normalizes
box sizing, margins, media sizing, form controls, links, buttons, text wrapping,
target scroll offset, and reduced-motion behavior.

## Preview

Serve the site from the repository root:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://localhost:8000/site/
```

Do not rely on `file://` for full previews. Pages that use `fetch()` to load
partials will fail from `file://` in Chrome, although the static page content
should remain readable.

The product version referenced by preview notes is `0.2.3`.
