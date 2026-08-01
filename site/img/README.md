# Image spec — A for Aesthetics

Drop real photos in here using the exact filenames below, then tell Claude Code
to wire them in. On go-live each image is optimised: converted to **WebP with a
JPG fallback** (`<picture>`), given explicit `width`/`height` (no layout shift),
`loading="lazy"` (except the hero, which is eager/high-priority), and descriptive
alt text following the pattern *"Eleana, nurse practitioner, {treatment} in Sheffield"*
or *"A for Aesthetics clinic, {location}"*.

Supply JPGs (I'll make the WebP). Keep every file **under 500 KB**.

| Filename | Used on | Ratio | Suggested px | Notes |
|---|---|---|---|---|
| `hero.jpg` | Home hero | ~9:16 portrait | 900 × 1400 | Eleana in clinic — the first thing visitors see |
| `eleana.jpg` | About / Home | ~9:16 portrait | 787 × 1400 | Clean portrait of Eleana |
| `dermal-fillers.jpg` | /dermal-fillers | 16:9 | 1600 × 900 | Treatment / clinic detail |
| `skin-boosters.jpg` | /skin-boosters | 16:9 | 1600 × 900 | |
| `fat-dissolving.jpg` | /fat-dissolving | 16:9 | 1600 × 900 | |
| `anti-ageing.jpg` | /anti-ageing (guide) | 16:9 | 1600 × 900 | Optional |
| `location-peaches.jpg` | /where-we-are | 4:3 | 1200 × 900 | The Peaches room, Hillsborough |
| `location-and-collective.jpg` | /where-we-are | 4:3 | 1200 × 900 | The And Collective room, Abbeydale Road |
| `result-lips-1.jpg` | /results | 3:4 portrait | 1200 × 1600 | Before→after, **consented, fillers/skin only** |
| `result-lips-2.jpg` | /results | 3:4 | 1200 × 1600 | Russian lip |
| `result-cheeks-1.jpg` | /results | 3:4 | 1200 × 1600 | Cheek |
| `result-tear-trough-1.jpg` | /results | 3:4 | 1200 × 1600 | Under-eye |
| `result-jaw-1.jpg` | /results | 3:4 | 1200 × 1600 | Chin / jaw |
| `result-skin-1.jpg` | /results | 3:4 | 1200 × 1600 | Skin boosters |
| `og-image.jpg` | Social share | 1.91:1 | 1200 × 630 | Already present |

**Compliance:** no before/after photos of anti-wrinkle / botulinum toxin
treatments — a prescription-only medicine can't be advertised. Lip fillers,
dermal fillers, skin boosters and fat dissolving are fine.

Already present: `hero.jpg`, `eleana.jpg`, `eleana-bw.jpg`, `og-image.jpg`,
`logo_a_for_a.png`, `favi_a_for_a.png`, `favicon.png`.
