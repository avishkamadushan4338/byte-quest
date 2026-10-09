// Rendered-HTML SEO smoke test against a running server.
//   node scripts/seo-check.mjs [baseUrl]      (default http://localhost:5001)
// Start the production build first: `node .output/server/index.mjs`.
const base = (process.argv[2] ?? "http://localhost:5001").replace(/\/$/u, "");

const INDEXABLE = [
  "/",
  "/about",
  "/programme",
  "/journey",
  "/partners",
  "/volunteers",
  "/register/team",
  "/privacy",
  "/terms",
  "/code-of-conduct",
  "/submission-guidelines",
];
const NOINDEX_PAGES = ["/mentors", "/projects", "/coming-soon", "/this-page-does-not-exist"];
const REDIRECTS = {
  "/register": "/register/team",
  "/dashboard": "/auth/login",
  "/admin": "/auth/login",
};

let failures = 0;
const check = (ok, label, detail = "") => {
  if (!ok) {
    failures += 1;
  }
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : `  -> ${detail}`}`);
};

const tags = (html, re) => [...html.matchAll(re)].map((m) => m[1]);
const get = async (path, init) => fetch(`${base}${path}`, { redirect: "manual", ...init });

const titles = new Map();
const descriptions = new Map();

for (const path of INDEXABLE) {
  const res = await get(path);
  const html = await res.text();
  check(res.status === 200, `${path} returns 200`, String(res.status));
  const t = tags(html, /<title>([^<]*)<\/title>/gu);
  const canon = tags(html, /<link rel="canonical" href="([^"]*)"/gu);
  const desc = tags(html, /<meta name="description" content="([^"]*)"/gu);
  const robots = tags(html, /<meta name="robots" content="([^"]*)"/gu);
  const ld = tags(html, /<script type="application\/ld\+json">([^<]*)<\/script>/gu);
  check(t.length === 1 && t[0].length > 0, `${path} has exactly one non-empty <title>`, t.join("|"));
  check(canon.length === 1 && /^https:\/\//u.test(canon[0]), `${path} has one absolute https canonical`, canon.join("|"));
  check(desc.length === 1 && desc[0].length > 40, `${path} has one meta description`, desc.join("|"));
  check(robots.length === 1 && !/noindex/u.test(robots[0]), `${path} is indexable`, robots.join("|"));
  check(tags(html, /<meta property="og:image" content="([^"]*)"/gu).length === 1, `${path} has og:image`);
  check(tags(html, /<meta property="og:url" content="([^"]*)"/gu)[0] === canon[0], `${path} og:url equals canonical`);
  check(tags(html, /<meta name="twitter:card" content="([^"]*)"/gu).length === 1, `${path} has twitter:card`);
  check(tags(html, /<html lang="([^"]*)"/gu)[0] === "en", `${path} declares lang=en`);
  check((html.match(/<h1[\s>]/gu) ?? []).length === 1, `${path} has exactly one <h1>`, String((html.match(/<h1[\s>]/gu) ?? []).length));
  let ldOk = ld.length === 1;
  try {
    JSON.parse(ld[0] ?? "");
  } catch {
    ldOk = false;
  }
  check(ldOk, `${path} has one valid JSON-LD block`);
  if (t[0]) titles.set(t[0], [...(titles.get(t[0]) ?? []), path]);
  if (desc[0]) descriptions.set(desc[0], [...(descriptions.get(desc[0]) ?? []), path]);
}
for (const [what, map] of [["title", titles], ["description", descriptions]]) {
  const dupes = [...map.values()].filter((paths) => paths.length > 1);
  check(dupes.length === 0, `no duplicate ${what} across indexable pages`, JSON.stringify(dupes));
}

for (const path of NOINDEX_PAGES) {
  const res = await get(path);
  const html = await res.text();
  const expected = path === "/this-page-does-not-exist" ? 404 : 200;
  check(res.status === expected, `${path} returns ${expected}`, String(res.status));
  check(/<meta name="robots" content="noindex, nofollow"/u.test(html), `${path} is noindex`);
  check(!/rel="canonical"/u.test(html), `${path} has no canonical`);
}

for (const [from, to] of Object.entries(REDIRECTS)) {
  const res = await get(from);
  const loc = res.headers.get("location") ?? "";
  check(res.status >= 300 && res.status < 400 && new URL(loc, base).pathname === to, `${from} redirects once to ${to}`, `${res.status} ${loc}`);
  const next = await get(to);
  check(next.status === 200, `${to} (redirect target) returns 200`, String(next.status));
}

const robots = await (await get("/robots.txt")).text();
check(/^Sitemap: https:\/\/\S+\/sitemap\.xml$/mu.test(robots), "robots.txt references an https sitemap");
check(!/^Disallow:\s*\/\s*$/mu.test(robots), "robots.txt does not block the whole site");

const sitemapRes = await get("/sitemap.xml");
const sitemap = await sitemapRes.text();
check(sitemapRes.status === 200 && /xml/u.test(sitemapRes.headers.get("content-type") ?? ""), "sitemap.xml served as XML");
const locs = tags(sitemap, /<loc>([^<]+)<\/loc>/gu);
check(locs.length === INDEXABLE.length, `sitemap lists ${INDEXABLE.length} URLs`, String(locs.length));
for (const loc of locs) {
  const path = new URL(loc).pathname;
  const res = await get(path);
  const html = await res.text();
  const canon = tags(html, /<link rel="canonical" href="([^"]*)"/gu)[0];
  check(res.status === 200 && canon === loc, `sitemap URL ${loc} is 200 and self-canonical`, `${res.status} ${canon}`);
}

const vol = await (await get("/register/volunteer")).text();
check(tags(vol, /<link rel="canonical" href="([^"]*)"/gu)[0]?.endsWith("/volunteers"), "/register/volunteer canonicalises to /volunteers");
check(!sitemap.includes("/register/volunteer"), "duplicate /register/volunteer is not in the sitemap");

for (const path of ["/api/rpc/ping", "/api/auth/get-session"]) {
  const res = await get(path);
  check((res.headers.get("x-robots-tag") ?? "").includes("noindex"), `${path} sends X-Robots-Tag noindex`, res.headers.get("x-robots-tag") ?? "none");
}

console.log(failures === 0 ? "\nAll SEO checks passed." : `\n${failures} SEO check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
