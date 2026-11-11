# Jessie Sunday

Portfolio site for Jessie Sunday, fractional embedded strategist and community
architect.

This is a plain static site: HTML, one stylesheet, and one JavaScript file.
There is no framework, no build step, and nothing to install. What is in this
folder is exactly what gets served.

## Preview it locally

Serve the folder with any static file server, for example:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

You can also open `index.html` straight from disk: every link names its file
(`about/index.html`), so navigation works without a server. Illustrated figures
(people and the VW bus) are embedded in the HTML and render from disk too.
The original artwork lives in `illustrations/`. After changing those SVG files
or adding an external illustration `<use>`, run
`python3 scripts/inline-illustrations.py` to refresh the embedded symbols.
This is an editing utility; deployment still requires no build step.

## Publishing

Upload or deploy this folder as-is to any static host (GitHub Pages, Netlify,
Vercel, Cloudflare Pages, S3, a plain web server). There is no build command
and the publish directory is the repository root.

- Pages are folders with an `index.html`. Links name the file
  (`about/index.html`) so they also work from disk; on the live site
  `/about/` and `/about/index.html` serve the same page, and the canonical
  URLs and sitemap use the shorter `/about/` form. Write new links the same
  way.
- Every page uses relative paths, so the site also works from a subfolder
  (for example `example.github.io/jessiesunday-website/`).
- `404.html` is the exception. A host can serve it for any missing URL, so it
  uses paths from the domain root (`/assets/…`) and is only styled correctly
  when the site lives at the root of its domain.

## Where things live

| Path                          | Contents                                              |
| ----------------------------- | ----------------------------------------------------- |
| `index.html`                  | Home                                                  |
| `about/`, `approach/`         | About and Approach                                    |
| `work/index.html`             | Selected work, with category filters                  |
| `work/<project>/index.html`   | The six project pages                                 |
| `partner/`, `contact/`        | Partner with me, and the inquiry form                 |
| `brand/`, `privacy/`, `credits/` | Reference pages                                    |
| `404.html`                    | Page-not-found page                                   |
| `assets/css/site.css`         | All styles                                            |
| `assets/js/site.js`           | All behaviour                                         |
| `assets/fonts/`               | Web fonts and their license files                     |
| `images/`                     | Photography, textures, and social sharing cards       |
| `illustrations/`              | Figures used inside the illustrated scenes            |
| `brand/`                      | Downloadable logos, client and company logos          |
| `icon.svg`                    | Favicon                                               |
| `robots.txt`, `sitemap.xml`   | For search engines                                    |

## Editing

**Copy.** Open the page's `index.html` and edit the text.

**Header and footer.** They are repeated in every page (16 files). Change them
with a project-wide find and replace so the pages stay in step. The current
page's link in the header carries `aria-current="page"`.

**Projects.** Each project has its own page under `work/`, a card in
`work/index.html`, and appears in its neighbours' "Previous / Next" links at
the bottom of their pages.

**Styles.** `assets/css/site.css` starts with the fonts, then the shared styles,
then one labelled section per page-specific component. Classes in those
sections are prefixed with the component name, such as `.case-hero__content`.

**Colors and themes.** Colors sit in two groups at the top of the shared
styles. Brand colors (`--wine`, `--cream`, `--butter`, …) never change. Role
tokens (`--bg`, `--text`, `--accent-text`, `--cta-bg`, …) hold the light values
in `:root` and are overridden under `[data-theme="dark"]`. Use a role token for
anything on the page background, and a brand color only on fixed surfaces such
as the wine and forest sections.

The sun/moon button switches themes. The choice is saved in the browser under
`theme`; first-time visitors follow their system setting. A small inline script
in each page's `<head>` applies the theme before the first paint so nothing
flashes.

**Images.** Photographs have smaller copies beside them, named by width
(`drag-show-640w.webp` next to `drag-show.webp`), and each `<img>` lists them
in `srcset` so phones download less. When you replace a photograph, either
re-export those sizes, or delete the `srcset` attribute and point `src` at the
new file.

Logos drawn in the page's ink (`.company-logo`, `.timeline-logo`) name their
file in an inline `mask-image` style on the element.

## Behaviour

`assets/js/site.js` is plain JavaScript with a comment above each feature. Every
feature looks for its own markup and does nothing when it is absent, so pages
remain readable with JavaScript turned off.

| Feature | Hook in the HTML |
| ------- | ---------------- |
| Light / dark theme | `.theme-toggle` |
| Mobile menu | `.menu-toggle`, `#mobile-nav` |
| Right-click the logo to open Brand | `data-brand-page` on `.wordmark` |
| Footer pause button; seal (every fifth time, a shark) when the water is clicked | `.footer-motion`, `.bay-water-trigger` |
| Content arriving as it scrolls into view | `data-reveal`, `data-reveal-group`, `data-flourish` |
| Illustrations drifting with scroll | `data-hero-scene` sections, `data-scene-motion` layers |
| Approach roadmap line | `data-roadmap-route`, `data-roadmap-step`, `data-roadmap-node` |
| Selected work filters | `data-filter` on buttons, `data-category` on cards |
| Partner page paths | `#fractional-route`, `#project-route` |
| Inquiry form | `#inquiry-form` |
| Copy a brand color | `data-hex` on `.swatch-copy` |

All motion respects the visitor's reduced-motion setting.

## Contact email

The inquiry form never sends anything from the website. As shipped, it prepares
a short introduction that the visitor can copy or download.

To have it open a prefilled draft in the visitor's email app instead, add
Jessie's approved address to the form in `contact/index.html`:

```html
<form id="inquiry-form" data-contact-email="hello@example.com">
```

Links from the Partner page arrive as `contact/index.html?type=fractional` or
`contact/index.html?type=project`, and that choice is carried into the introduction.

## Search and social sharing

Every page has its own title, description, canonical URL, Open Graph tags, and
Twitter large-image card. The canonical URLs, sharing images, `robots.txt`, and
`sitemap.xml` all point at `https://jessiesunday.com`. If the site moves to a
different domain, replace that address everywhere it appears.

The 1200×630 sharing cards are in `images/og/`. They are ordinary image files;
re-export one if its page's hero or headline changes.

**Structured data.** Each page's `<head>` ends with a JSON-LD block describing
Jessie (`Person`), the practice (`ProfessionalService`, with its services and
the two ways to work together), the page itself, and its breadcrumb. Case
studies add a `CreativeWork` naming the client and its links; Selected work
lists all six; Partner carries the FAQ. When you change a page's title,
description, or the FAQ on the Partner page, update the matching text in its
JSON-LD so the two agree. Check changes with Google's Rich Results Test.

**Answer engines.** `llms.txt` is a plain-language summary of the site with
links, for AI assistants and answer engines. Keep its facts and case study
lines in step with the pages. `robots.txt` names the main AI crawlers to make
clear they are welcome; remove any you would rather keep out.

**Company names.** Logos drawn with `mask-image` carry their company name in a
`.sr-only` span, so screen readers and crawlers read it as text.

**Sitemap.** Update a page's `<lastmod>` in `sitemap.xml` when its content
changes.

## Content notes

The hero backgrounds and the drag-show image are generated concepts, not
photographs of Jessie, her clients, actual venues, or documented events. The
About portrait is an AI-edited photograph of Jessie. Image provenance is
recorded on the Credits page, and in the `SOURCES.md` files beside the logos
and project images.

The San Francisco photo is by Varun Yadav on Unsplash
(https://unsplash.com/photos/QhYTCG3CTeI), under the Unsplash License. Keep
image credits accurate when replacing imagery.

The six project pages use the supplied brief's summaries and results. Final
event photography, expanded stories, and approved testimonials are still
pending.

## Fonts

Titles, the wordmark, and the favicon are set in Sunday Club by Emil Bertell, a
commercially licensed font supplied as a single bold weight. Its license is
not included here; check that it covers wherever this site and repository are
hosted.

Body copy is DM Sans and the serif paragraph styles are DM Serif Display, both
from Google Fonts under the SIL Open Font License. Their license files sit
beside the fonts in `assets/fonts/`.
