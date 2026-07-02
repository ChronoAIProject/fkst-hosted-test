# Canonical Head Template

This is the temporary no-build source of truth for every page-level `<head>` until issue `#20` consumes or migrates it into shared chrome, or explicitly justifies keeping this Markdown source. Do not invent page-owned SEO copy here; page issues own their final titles and descriptions.

All `href` and `src` values are relative so pages open under `/site/`. The anti-FOUC snippet is first in `<head>` before any stylesheet. Component or page CSS links slot in before `theme.css` and `a11y.css`. `theme.css`, `a11y.css`, and `theme.js` may 404 harmlessly until their issues land. `og:url` and `og:image` should be absolutized at deploy time; no deploy domain is invented here.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{TITLE}}</title>
  <meta name="description" content="{{DESCRIPTION}}">
  <!-- anti-FOUC: resolve theme before first paint (default = dark) -->
  <script>(function(){try{var s=localStorage.getItem('fkst-theme');var t=s||(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();</script>
  <meta name="theme-color" content="#12141a">
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
  <!-- Open Graph / Twitter -->
  <meta property="og:type" content="website"><meta property="og:site_name" content="fkst">
  <meta property="og:title" content="{{TITLE}}"><meta property="og:description" content="{{DESCRIPTION}}">
  <meta property="og:url" content="{{CANONICAL_URL}}"><meta property="og:image" content="assets/favicon.svg">
  <meta name="twitter:card" content="summary"><meta name="twitter:title" content="{{TITLE}}"><meta name="twitter:description" content="{{DESCRIPTION}}">
  <!-- fonts (CDN; duplicated per page since there is no build) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">
  <!-- CANONICAL LOAD ORDER (overrides win last) -->
  <link rel="stylesheet" href="css/reset.css">
  <link rel="stylesheet" href="css/tokens.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <!-- optional per-page/component css here (e.g. css/home.css, css/code.css) -->
  <link rel="stylesheet" href="css/theme.css">
  <link rel="stylesheet" href="css/a11y.css">
  <script src="js/layout.js" defer></script>
  <script src="js/theme.js" defer></script>
</head>
```

## Per-Page Values

Use the final copy from each page issue when that page is implemented. Until then, keep these placeholders as ownership markers rather than invented metadata.

| Page | `{{TITLE}}` | `{{DESCRIPTION}}` | `{{CANONICAL_URL}}` |
| --- | --- | --- | --- |
| `index.html` | `{{INDEX_TITLE}}` | `{{INDEX_DESCRIPTION}}` | `{{INDEX_CANONICAL_URL}}` |
| `getting-started.html` | `{{GETTING_STARTED_TITLE}}` | `{{GETTING_STARTED_DESCRIPTION}}` | `{{GETTING_STARTED_CANONICAL_URL}}` |
| `architecture.html` | `{{ARCHITECTURE_TITLE}}` | `{{ARCHITECTURE_DESCRIPTION}}` | `{{ARCHITECTURE_CANONICAL_URL}}` |
| `packages.html` | `{{PACKAGES_TITLE}}` | `{{PACKAGES_DESCRIPTION}}` | `{{PACKAGES_CANONICAL_URL}}` |
| `about.html` | `{{ABOUT_TITLE}}` | `{{ABOUT_DESCRIPTION}}` | `{{ABOUT_CANONICAL_URL}}` |
| `404.html` | `{{NOT_FOUND_TITLE}}` | `{{NOT_FOUND_DESCRIPTION}}` | `{{NOT_FOUND_CANONICAL_URL}}` |
