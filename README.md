# A for Aesthetics — website

Nurse-led aesthetics clinic, Sheffield. Static HTML site for GitHub + Cloudflare Pages (same setup as Shortlist Lane).

## Repo layout

```
site/     ← the live website (this is the Cloudflare Pages web root)
docs/
  preview/  ← single-file preview versions of every page (open by double-clicking; not deployed)
IMAGES.md   ← checklist of photos to add to site/img/
README.md   ← this file
```

Everything Cloudflare serves lives in **`site/`**. The `docs/` folder is kept in the
repo for reference and is **not** part of the deployed site.

## What's in `site/`

Every page shares one stylesheet (`styles.css`) and one small script (`main.js`). Edit the stylesheet once and the whole site changes.

```
index.html                 Home
lip-fillers.html           Treatment
dermal-fillers.html        Treatment
anti-wrinkle-injections.html
anti-ageing.html           Treatment
skin-boosters.html         Treatment
fat-dissolving.html        Treatment
advanced-treatments.html   Treatments hub
about.html                 Eleana / clinic
our-prices.html            Prices  ← has £— placeholders to fill
faq.html
contact.html               Includes a map + Google reviews link
blog.html                  Guides index
blog-*.html                4 guide articles
privacy-policy.html        ← template, needs legal review
terms-conditions.html      ← template, needs legal review
styles.css  main.js        Shared assets (brand colours live at top of styles.css)
img/                       Logo + favicon (add photos here)
_redirects  robots.txt  sitemap.xml   Config for Cloudflare/SEO
```

## Deploy (GitHub + Cloudflare Pages)

1. This repo is already on GitHub. In Cloudflare Pages: **Create project → Connect to Git → pick this repo**.
2. Build settings: **Framework preset: none. Build command: (leave empty). Build output directory: `site`.**
   (The files are already static — Cloudflare just serves the `site/` folder.)
3. Deploy, test on the `.pages.dev` URL, then add the custom domain `aforaesthetics.com`.
4. Set a redirect rule so **www → non-www** (or vice-versa) — pick one and stick to it.
5. Keep Cloudflare Pages on its default "no trailing slash" URL behaviour (the pages link to clean paths like `/lip-fillers`).

## Before you go live — fill these in

- [ ] **Prices** — open `site/our-prices.html`, replace every `£—` with the figure from your Faces menu (search "EDIT PRICES HERE").
- [ ] **Photos** — add the images listed in `IMAGES.md` to `site/img/` and swap the placeholder blocks (search the HTML for `hero-media--placeholder`). See IMAGES.md.
- [ ] **Opening hours** — add them on `site/contact.html` (search "add your hours").
- [ ] **Google review link** — on `site/index.html`, swap the "Leave a review" link for your Google Business one-tap review short link (search for the comment about `g.page/r/`).
- [ ] **Professional memberships** — on `site/about.html`, add any registrations beyond NMC (e.g. Save Face, JCCP, BACN) once confirmed.
- [ ] **Legal pages** — `site/privacy-policy.html` and `site/terms-conditions.html` are solid templates; have them reviewed for your exact practices.
- [ ] **Redirects** — run a Screaming Frog crawl of the current WordPress site and add any old URLs missing from `site/_redirects` so nothing 404s after switchover.

## Compliance (built in — keep it this way)

- No prescription-only medicine brand names anywhere in promotional copy. Treatments are described generically ("anti-wrinkle injections", "wrinkle-relaxing"). Keep it that way when you edit.
- The blog article "anti-wrinkle vs Botox" mentions Botox **educationally only**. Have it compliance-checked before publishing.
- Eleana's nurse-prescriber status is the trust anchor and appears across the site — it's your strongest asset.

## Brand

Colours are defined once at the top of `site/styles.css` (look for `PALETTE`). Primary is your logo coral `#e08e83`. Change the six values there to adjust the whole site.
