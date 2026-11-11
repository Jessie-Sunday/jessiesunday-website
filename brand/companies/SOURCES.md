# Company logos

These SVGs identify the companies in Jessie's experience section on Home and in
the career timeline on Home and About. `components/proof.tsx` and `lib/career.ts`
supply accessible company names and sizes; CSS masks use the site's text color in
both themes without altering the artwork's proportions.

| File | Source |
| --- | --- |
| `google.svg` | [Google-hosted wordmark](https://www.gstatic.com/images/branding/googlelogo/svg/googlelogo_clr_74x24px.svg) |
| `meta.svg` | [Meta company brand page, inline company logo](https://www.meta.com/brand/resources/meta/company-brand/) |
| `intel.svg` | [Intel homepage, inline logo](https://www.intel.com/content/www/us/en/homepage.html) |
| `cruise.svg` | [Wikimedia copy extracted from getcruise.com](https://commons.wikimedia.org/wiki/File:Cruise_logo.svg) |
| `docker.svg` | [Docker's official logo kit, SVG/docker-logo-black.svg](https://www.docker.com/static/Docker-Logos-1.zip) |
| `t-mobile.svg` | [Wikimedia T-Mobile wordmark](https://commons.wikimedia.org/wiki/File:T-Mobile_logo2.svg) |
| `gm.svg` | [Wikimedia GM symbol](https://commons.wikimedia.org/wiki/File:General_Motors_(2021).svg) |
| `livingsocial.svg` | [Wikimedia copy extracted from livingsocial.com](https://commons.wikimedia.org/wiki/File:LivingSocial_logo.svg) |
| `another-planet-entertainment.svg` | [Another Planet Entertainment's website asset](https://apeconcerts.com/wp-content/themes/apechild/assets/svg/ape-logo.svg) |
| `club-med.svg` | [Club Med's website icon sprite](https://www.clubmed.us/assets/_next/static/icons/7a89086e684b49d7240c534d4d77fb43/ClubMed.svg), retrieved November 7, 2026 |
| `birthright-israel.svg` | [Wikipedia's copy of the 2023 Taglit-Birthright Israel logo](https://en.wikipedia.org/wiki/File:Birthright_Israel_logo.svg), credited there to birthrightisrael.com, retrieved November 7, 2026 |

The first nine were retrieved October 29, 2026. Logo geometry and view boxes are retained; export
metadata and page-specific attributes are removed. Intel's HTML SVG attribute
casing is normalized for standalone XML. Another Planet's embedded gradient
bitmaps are replaced with solid vector fills inside the original clipping paths,
so the monochrome version contains no raster images. Club Med's sprite id is
dropped and its `currentColor` fill kept. Birthright Israel's fixed pixel size,
unused clipping path, and namespace are removed and path coordinates rounded to
one decimal place; the official website refuses automated requests, so the
Wikipedia copy of its own asset is the source. All logos remain the trademarks of
their respective owners.
