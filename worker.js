// A for Aesthetics - site Worker.
//
// 1. Applies 301 redirects for old WordPress URLs.
// 2. POST /api/meta-event: forwards conversion events from main.js to Meta's
//    Conversions API (server-side copy of the Pixel, deduplicated by event_id).
//    Needs two Worker settings in Cloudflare (Settings > Variables and Secrets):
//      META_PIXEL_ID     plain text, e.g. 548824422421465
//      META_CAPI_TOKEN   secret, generated in Meta Events Manager
//    Until both are set the endpoint quietly does nothing.
// 3. Everything else is served from ./site via the ASSETS binding.
// run_worker_first is enabled in wrangler.jsonc so this runs on every request.

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

const META_API_VERSION = "v23.0";
const ALLOWED_EVENTS = new Set(["Lead", "Contact", "Schedule"]);

async function sha256(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(hash)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

// Meta wants lower-cased emails and digits-only phone numbers with country code.
function normalisePhone(raw) {
  let digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("00")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = "44" + digits.slice(1); // UK local format
  return digits;
}

function readCookie(header, name) {
  const match = (header || "").match(new RegExp("(?:^|;\\s*)" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[1]) : undefined;
}

async function handleMetaEvent(request, env, ctx) {
  // Always answer quickly; the browser never waits on Meta.
  const ok = new Response(null, { status: 204 });
  if (!env.META_CAPI_TOKEN || !env.META_PIXEL_ID) return ok;

  let body;
  try {
    body = await request.json();
  } catch {
    return ok;
  }
  if (!body || !ALLOWED_EVENTS.has(body.event_name)) return ok;

  // Only accept events from our own pages.
  const origin = new URL(request.url).origin;
  const sourceUrl = String(body.event_source_url || "");
  if (!sourceUrl.startsWith(origin)) return ok;

  const cookies = request.headers.get("Cookie");
  const userData = {
    client_ip_address: request.headers.get("CF-Connecting-IP") || undefined,
    client_user_agent: request.headers.get("User-Agent") || undefined,
    fbp: readCookie(cookies, "_fbp"),
    fbc: readCookie(cookies, "_fbc"),
  };
  const user = body.user || {};
  const email = String(user.email || "").trim().toLowerCase();
  const phone = normalisePhone(user.phone);
  if (email) userData.em = [await sha256(email)];
  if (phone) userData.ph = [await sha256(phone)];

  const payload = {
    data: [
      {
        event_name: body.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: String(body.event_id || "").slice(0, 100),
        action_source: "website",
        event_source_url: sourceUrl,
        user_data: userData,
        custom_data: body.custom_data && typeof body.custom_data === "object" ? body.custom_data : {},
      },
    ],
  };
  if (env.META_TEST_EVENT_CODE) payload.test_event_code = env.META_TEST_EVENT_CODE;

  const url =
    `https://graph.facebook.com/${META_API_VERSION}/${env.META_PIXEL_ID}/events` +
    `?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`;
  ctx.waitUntil(
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {})
  );
  return ok;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/meta-event") {
      if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
      return handleMetaEvent(request, env, ctx);
    }

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
