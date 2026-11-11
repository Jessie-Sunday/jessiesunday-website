# Selected work logos

Retrieved November 7, 2026. Brand artwork belongs to its respective owners.

| SVG | Source and processing |
| --- | --- |
| `headprint-studio.svg` | [Official site header PNG](https://images.squarespace-cdn.com/content/v1/680fae22be96a90a7e7f23ce/619ec9e7-f7ce-458f-b27e-bae24025a85e/ee2d6e1c-72bf-4539-985a-b5f15c6a9615.png?format=1500w). Transparent margins cropped, antialiasing colors flattened to the two brand colors, and artwork vectorized with VTracer; an approximation of the raster source, not an official vector master. |
| `the-barb-shop.svg` | Inline header SVG from [The Barb Shop San Francisco](https://thebarbshop.com/pages/sanfrancisco). Removed page attributes and corrected `viewBox` casing for standalone SVG. |
| `jack-morton.svg` | [Official website SVG](https://jackmorton.com/wp-content/themes/Jack2020/frontend/public/images/new%20Jack%20logo.svg), path geometry retained and SVG markup optimized. |
| `jewish-federation-la.svg` | [Official primary PNG logo](https://www.jewishla.org/wp-content/uploads/2024/02/JFEDLA-Primary-Logo.png), vectorized with VTracer; an approximation of the raster source, not an official vector master. |
| `the-release-series.svg` | Provisional, locally authored typographic concept. Georgia lettering is outlined as paths, with no font dependency; not a sourced official identity. |

LivingSocial reuses `../companies/livingsocial.svg`; its provenance is recorded
in `../companies/SOURCES.md`.

Social destinations in `lib/work.ts` were taken from each brand's website links,
including the San Francisco Instagram profile linked by The Barb Shop and the
Facebook/Twitter profiles linked in LivingSocial's footer. Social networks can
require sign-in; brand-linked destinations are retained.

All six featured logos are rendered through native SVG `use` elements, backed by
`logos.svg`. There are no embedded bitmaps, image elements, or live text in these
logos. SVG paths are optimized for size. Rebuild the sprite after editing a
standalone source with `node scripts/generate-work-logo-sprite.mjs`.
