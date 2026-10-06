// A for Aesthetics - redirect Worker.
//
// Applies 301 redirects for old WordPress URLs, then hands everything else to
// the static assets served from ./site (via the ASSETS binding). This replaces
// the _redirects file, which Cloudflare Workers did not reliably apply to the
// old slash-suffixed URLs. run_worker_first is enabled in wrangler.jsonc so
// this logic runs on every request.

const REDIRECTS = {
  "/about-us": "/about",
  "/lip-fillers-enhancement-augmentation": "/lip-fillers",
  "/lip-fillers-enhancement-augmentation-treatments": "/lip-fillers",
  "/anti-wrinkle": "/anti-wrinkle-injections",
  "/anti-wrinkle-anti-ageing-treatments": "/anti-wrinkle-injections",
  "/anti-ageing-treatments": "/anti-ageing",
  "/profhilo": "/skin-boosters",
  "/treatments": "/advanced-treatments",
  "/wanting-plump-cheeks-fillers-will-do-the-trick": "/dermal-fillers",
  "/home": "/",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Normalise a single trailing slash so "/about-us/" and "/about-us" both match.
    let path = url.pathname;
    if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

    const dest = REDIRECTS[path];
    if (dest) {
      return Response.redirect(url.origin + dest, 301);
    }

    // Not a known redirect: serve the static asset (or the 404 page when
    // nothing matches, per not_found_handling in wrangler.jsonc).
    return env.ASSETS.fetch(request);
  },
};
