# BYTE QUEST – Technical SEO

Stack: TanStack Start (React 19, SSR) on Nitro `node-server`, deployed as a Docker image. All public pages are server-rendered, so metadata and content are present in the initial HTML.

## 1. Audit (baseline, 2026-10-09)

Evidence came from a production build served locally and from `curl`, Playwright and Lighthouse 12 runs.

| # | Sev | Finding | Evidence | Status |
| --- | --- | --- | --- | --- |
| 1 | P0 | Unknown URLs returned HTTP 404 but rendered the **home page's** title, og:url and indexable meta | `/nope` -> `og:url=https://bytequest.lk`, no robots tag | Fixed (noindex, own title, no canonical) |
| 2 | P0 | Private routes (`/admin`, `/dashboard`, `/auth/login`, `/onboarding`, `/volunteer-portal`, `/apply-admin`) inherited indexable, home-page social tags | `/register/team` showed home `og:*` | Fixed |
| 3 | P1 | No `<link rel="canonical">` anywhere; `/register/volunteer` duplicates `/volunteers` | HTML inspection | Fixed (canonical + sitemap exclusion) |
| 4 | P1 | No sitemap; `robots.txt` had no `Sitemap:` line | `/sitemap.xml` -> 404 | Fixed |
| 5 | P1 | Production origin hard-coded to `https://bytequest.lk`, which conflicts with the deploy default `bytequest.aloysiuscollege.lk` and the organiser email domain | `seo.ts` vs `docker-compose.prod.yml` | Fixed (`SITE_URL`) |
| 6 | P1 | JSON-LD asserted unverified facts: `postalCode 80000`, GPS coordinates, `legalName`, `sameAs: facebook.com/instagram.com` (generic homepages), and typed the programme as `EducationalOrganization` | `seo.ts` | Fixed (WebSite + Organization only) |
| 7 | P1 | `/mentors` and `/projects` are "coming soon" placeholders, but metadata said "Meet industry mentors... guiding students" and "projects built by participants" | route files | Fixed (noindex, honest descriptions, not in sitemap) |
| 8 | P2 | `og:image` was the 512x512 school crest with `summary_large_image`; `og:image:alt` repeated the title | HTML | Fixed (1200x630 brand card + alt) |
| 9 | P2 | Titles like `Home \| BYTE QUEST`; legal/register pages had no description | HTML | Fixed |
| 10 | P2 | Homepage LCP element was `hero-avatar.png` (2.6 MB); logos 0.7 MB; JS/CSS served uncompressed | Lighthouse | Improved (see 6) |
| 11 | Info | `geo.*` / `ICBM` meta tags: ignored by Google, coordinates unverified | n/a | Removed |

Checked and found sound: `<html lang="en">`, a single H1 per public page, 404 status codes, redirect behaviour (`/register`, `/dashboard`, `/admin`: one hop), SSR content.

## 2. Architecture

One metadata owner, with no per-route `head()` overrides on public pages.

- [apps/web/src/utils/seo-pages.ts](../apps/web/src/utils/seo-pages.ts): route registry (title, description, indexability, canonical override). **Edit copy here.**
- [apps/web/src/utils/seo.ts](../apps/web/src/utils/seo.ts): site identity, `buildHeadForPath()`, JSON-LD, sitemap, robots and `llms.txt` generators.
- [apps/web/src/routes/\_\_root.tsx](../apps/web/src/routes/__root.tsx): calls `buildHeadForPath` with the leaf match's pathname. Both SSR and client navigation use it. Sentinel `NOT_FOUND_PATH` is used when only the root route matched.
- `routes/sitemap[.]xml.ts`, `routes/robots[.]txt.ts`, `routes/llms[.]txt.ts`: generated at request time from the same registry. The static `public/robots.txt` was removed.
- `functions/get-site-origin.ts` and `SITE_URL` in `.env.schema`: runtime origin, with the default `https://bytequest.aloysiuscollege.lk`.
- `vite.config.ts`: `X-Robots-Tag: noindex, nofollow` for `/admin/**`, `/api/rpc/**` and `/api/auth/**`; `compressPublicAssets`.

Rules:

- Paths not in the registry and not under a private prefix are treated as unknown and rendered `noindex` with no canonical.
- Query strings and trailing slashes are stripped from canonicals.
- Private prefixes: `/admin /apply-admin /auth /dashboard /onboarding /volunteer-portal /register`.
- **Adding a page**: add the route, then add a registry entry. The unit test fails if a route file is neither registered nor private.

### Indexing decisions

- **Placeholders** (`/mentors`, `/projects`, `/coming-soon`): `noindex`, excluded from the sitemap. Flip `indexable: true` once real content exists.
- **Registration** (`/register/team`): indexable, since it is the public entry point for the programme's main call to action. Form data is never placed in URLs or metadata.
- **`/register/volunteer`**: canonical `/volunteers`, excluded from the sitemap.
- **Legal pages**: indexable.
- **robots.txt**: `Disallow: /api/`. Private pages stay crawlable but `noindex`, so crawlers can see the directive. They are protected by authentication, not by robots.txt.
- **llms.txt** (`/llms.txt`): plain-text summary for generative engines - one-line site description, key facts, contact and the sitemap page list, all derived from the same registry so it cannot drift from the sitemap. Private and placeholder routes are never listed.

### Structured data

Emitted on indexable pages only: `WebSite` and `Organization` (BYTE QUEST) with stable `@id`s (`/#website`, `/#organization`), plus a per-page `WebPage` node (`<url>#webpage`) carrying the title and description and linking back with `isPartOf: { "@id": "/#website" }`.

Deliberately **not** used:

- `EducationalOrganization` or `School`: BYTE QUEST is a programme, and it has not been confirmed to be the same entity as the school or the OBA.
- `Event`: no confirmed dates or venue.
- `BreadcrumbList`: no visible breadcrumbs, and the structure is flat.
- `Person`, `CreativeWork`, FAQ and review markup.
- Address, geo and `sameAs`: nothing confirmed.

Neither type qualifies for a Google rich result; they feed entity understanding (site name, logo) only.

## 3. Route matrix

| Route | Index | Title | Canonical | Sitemap | Structured data |
| --- | --- | --- | --- | --- | --- |
| `/` | yes | BYTE QUEST \| Inter-School Innovation & Coding Programme | self | yes | WebSite, Organization, WebPage |
| `/about` | yes | About & Organisers \| BYTE QUEST | self | yes | same |
| `/programme` | yes | Programme: Divisions, Phases & Hackathons \| BYTE QUEST | self | yes | same |
| `/journey` | yes | Journey & Milestones \| BYTE QUEST | self | yes | same |
| `/partners` | yes | Partners & Sponsors \| BYTE QUEST | self | yes | same |
| `/volunteers` | yes | Student Volunteers \| BYTE QUEST | self | yes | same |
| `/register/team` | yes | Register your school team \| BYTE QUEST | self | yes | same |
| `/privacy` `/terms` `/code-of-conduct` `/submission-guidelines` | yes | per page | self | yes | same |
| `/register/volunteer` | canonical to `/volunteers` | Student Volunteers | `/volunteers` | no | same |
| `/mentors` `/projects` `/coming-soon` | noindex | per page | none | no | none |
| `/register`, `/auth/login`, `/dashboard`, `/onboarding`, `/admin/*`, `/volunteer-portal`, `/apply-admin` | noindex (redirect or auth-gated) | various | none | no | none |
| unknown paths | noindex, HTTP 404 | Page not found \| BYTE QUEST | none | no | none |

Keyword mapping (hypotheses only, no volume data was available):

- Brand/navigational: "BYTE QUEST", "BYTE QUEST Sri Lanka" -> `/`.
- "school hackathon Sri Lanka", "inter-school coding competition" -> `/` and `/programme`.
- "St. Aloysius' College Galle innovation" -> `/about`.
- Junior/Senior division eligibility -> `/programme`.
- How to register a team -> `/register/team`.

## 4. Test report

Run on 2026-10-09 against `bun run build` output (production mode, dummy env, temp SQLite DB).

| Check | Command | Result |
| --- | --- | --- |
| Unit tests (16): registry, head tags, canonicals, noindex, JSON-LD escaping, sitemap, robots, route inventory | `cd apps/web && bun test src` | 16 pass, 0 fail |
| Rendered-HTML smoke test (160 assertions): status, unique title and description, one canonical, og/twitter, one H1, `lang`, JSON-LD parse, redirects, sitemap URLs 200 and self-canonical, robots.txt, 404 noindex, `X-Robots-Tag` on API | `node scripts/seo-check.mjs http://localhost:5055` | all pass |
| Client-side navigation (Playwright, `/` -> `/about` -> `/mentors`, plus reload) | ad hoc script (not committed) | title, canonical and robots correct each time; no page errors |
| Production build | `bun run build` | succeeds |
| Type-check | `tsc --noEmit` | 1 error, **pre-existing and unrelated**: `admin/volunteers-panel.tsx(117) createdAt` |
| Lint | `bun x ultracite check` | 37 pre-existing error lines in untouched files. New files in `src/` are clean. `scripts/seo-check.mjs` carries style-only findings (the repo's other scripts do too) |
| Lighthouse 12, lab, local, home page | see below |  |

Lighthouse (lab, simulated throttling, local server; indicative only, **not field data**):

|                                      | Before          | After           |
| ------------------------------------ | --------------- | --------------- |
| Mobile LCP                           | 23.6 s          | 6.6 s           |
| Mobile performance                   | 45              | 64              |
| Desktop LCP                          | 4.1 s           | 1.4 s           |
| Desktop performance                  | 70              | 92              |
| SEO / Accessibility / Best practices | 100 / 100 / 100 | 100 / 100 / 100 |
| CLS                                  | 0               | 0               |
| Page weight (home, mobile run)       | 4.9 MB          | 1.1 MB          |

Changes behind the numbers:

- Hero avatar PNG (2.6 MB) -> WebP 640w/1024w with `srcset` (183/449 KB).
- Wordmark, crest and SACOBA logo -> WebP.
- Brotli/gzip for static assets.
- No visual change (screenshots compared). `hero-vr.png` is unreferenced and was left alone.

Mobile LCP is still above the 2.5 s target in the lab. Remaining causes: render-blocking Google Fonts and the 105 KB app CSS (about 2.7 s), and a 570 KB (uncompressed) JS entry. Next steps are self-hosting the fonts, trimming the entry bundle, and measuring real-user data.

Not tested: Google Rich Results Test and Schema.org validator (require the public URL), Search Console, the existing `packages/api` tests (not touched), and an authenticated crawl of private areas.

## 5. Deployment checklist

1. Confirm the public hostname. The default is `bytequest.aloysiuscollege.lk`; set `SITE_URL` in the environment if different. `docker-compose.prod.yml` now passes it through.
2. Serve over HTTPS on a single canonical host. Redirect `http` -> `https` and any `www` or alternate host -> canonical at the proxy. The app does not do this.
3. Enable response compression on the proxy for HTML (the app compresses static assets only).
4. After deploy: `node apps/web/scripts/seo-check.mjs https://<host>`. Then open `/robots.txt` and `/sitemap.xml`.
5. Run Rich Results Test and Schema.org Validator on `/`. Expect valid `WebSite` and `Organization`, no rich result.
6. Search Console: add a **Domain property** (DNS TXT) or a URL-prefix property for the canonical origin, then submit `https://<host>/sitemap.xml`. URL-inspect `/`, `/programme` and `/register/team` and check "User-declared canonical = Google-selected canonical".
7. Monitor weekly: indexed pages (target 11), clicks, impressions, CTR and queries. Add GA4 only with approval and consent, and never send registration or student data to it.

## 6. Roadmap

- **P0 (done)**: noindex on private, placeholder and 404 pages; canonicals; honest structured data.
- **P1 (done)**: sitemap, robots, central metadata, `SITE_URL`.
- **P2**:
  - Self-host fonts and reduce render-blocking CSS and JS.
  - Per-page social images, once there are real pages.
  - Add visible breadcrumbs, then `BreadcrumbList`.
  - Link to programme, register and about from page bodies.
  - Optimise `bq-logo.png` in the volunteer ID card path.
- **P3**:
  - Content: a participation guide (eligibility, team size, grades 6-13), a Junior vs Senior explainer, announcements, and project showcase pages with consent.
  - Add `Event` markup when dates and venue are confirmed.
  - Links via the official school site, OBA channels, participating schools and approved partners.

## 7. Manual action register

| Needs | Owner |
| --- | --- |
| Confirm production hostname and set `SITE_URL` | Organisers / DevOps |
| DNS, HTTPS, host redirects, proxy compression | DevOps |
| Search Console verification and sitemap submission | Authorised Google account holder |
| Approve the generated social card (`public/assets/og-card.webp`; uses the BYTE QUEST wordmark and tagline only, no school crest) | Organisers |
| Real social profile URLs (for `sameAs`) | Organisers |
| Confirmed address or venue, dates and registration deadline (for `Event` / `Organization` details) | Organisers |
| Mentor line-up and student projects (to lift `noindex`), with student and parent consent | Organisers |
| Confirmation that SACOBA is the organiser and publisher of the programme site (to add `publisher`/`parentOrganization`) | Organisers |
| Analytics decision (GA4/GTM) and consent approach | Organisers |
