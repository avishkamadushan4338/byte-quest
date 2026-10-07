# BYTE QUEST — Handover

Inter-school innovation and coding programme for St. Aloysius' College, Galle (OBA). Bun + Nx monorepo, TanStack Start, SQLite (libSQL) + Drizzle, Better Auth, oRPC, Tailwind v4, Base UI.

Last commit: `d1964d9` on `master`, pushed to `origin`.

---

## 1. Run it

```bash
bun install
bun run db:migrate        # apply migrations to ./local.db (SQLite file at repo root)
bun run dev:web           # http://localhost:5001
```

Useful checks:

```bash
bun run check-types       # tsc across all 5 projects
bun run check             # ultracite format + lint
bun run --cwd packages/api test
```

`apps/web/src/routeTree.gen.ts` is generated and gitignored. After adding or renaming a route file run, **from `apps/web`**:

```bash
bun x @tanstack/router-cli generate
```

Doing it from the repo root silently resolves nothing.

---

## 2. Shape of the repo

```
apps/web          TanStack Start app — routes, page components, oRPC client
packages/ui       Design system: primitives/ + components/ (Base UI wrappers)
packages/api      oRPC routers, one folder per feature
packages/auth     Better Auth factory
packages/db       Drizzle schema + migrations
```

Everything the UI can import lives in `packages/ui` under four exported subpaths: `/primitives/*`, `/components/*`, `/hooks/*`, `/lib/*`.

---

## 3. Accounts and access — read this first

Authentication is **username + password** (Better Auth `username` plugin). There is **no email OTP and no open signup**. Exactly two ways to get an account:

| Path | Who | What happens |
| --- | --- | --- |
| `/register` | Team leader or MIC | Creates the account, then registers the team |
| `/apply-admin` | Anyone | Application; an existing admin approves and provisions it |

`user_profile.role` is one of `admin`, `mic`, `leader`, `student`.

- **admin** — organising committee. Only ever reached by an approved application, never by self-selecting at sign-up.
- **mic** — Master-In-Charge, the teacher in charge. May register a team.
- **leader** — team leader. May register their own team.
- **student** — ordinary member. Joins an existing team; cannot register one.

`access.canRegisterTeam` is the single source of truth for that gate, and `teams.register` re-checks it server-side. Both the UI and the API refuse a student.

### Seed an admin

There is no bootstrap admin, so create the first one directly, then use `/apply-admin` for everyone else:

```sql
-- create the auth user first (any username/password you choose)
INSERT INTO "user" (id, name, email, "email_verified", username, "created_at", "updated_at")
VALUES ('u_admin', 'Committee Admin', 'admin@bytequest.lk', 1, 'admin',
        unixepoch('subsec') * 1000, unixepoch('subsec') * 1000);

INSERT INTO session (id, "expires_at", token, "created_at", "updated_at", "user_id")
VALUES ('s_seed', unixepoch('subsec') * 1000 + 86400000, 'seed-token',
        unixepoch('subsec') * 1000, unixepoch('subsec') * 1000, 'u_admin');

INSERT INTO user_profile (id, "user_id", role, "full_name", "national_id", birthday, grade, "created_at", "updated_at")
VALUES (lower(hex(randomblob(16))), 'u_admin', 'admin', 'Committee Admin', 'SEED', '1970-01-01', '13',
        unixepoch('subsec') * 1000, unixepoch('subsec') * 1000);
```

Timestamps are `integer` columns in `timestamp_ms` mode — milliseconds since epoch, hence the `* 1000`.

The `user_profile` row must exist or every protected procedure throws `UNAUTHORIZED` — the API resolves the profile separately from the session.

Passwords for approved admin applications are generated server-side and returned **once**; an approved application shows it in the admin panel and never again.

---

## 4. Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | public | Marketing homepage |
| `/about` `/programme` `/journey` `/projects` `/mentors` `/partners` `/volunteers` | public | Programme pages |
| `/register` | signed out | 8-step registration (leader/MIC only) |
| `/apply-admin` | public | Admin access application |
| `/privacy` `/terms` `/code-of-conduct` `/submission-guidelines` | public | Policies |
| `/auth/login` | signed out | Username + password |
| `/onboarding` | session, no profile | Student profile completion |
| `/dashboard` | session + profile | Team, join requests, submission |
| `/admin` | session + profile + `admin` | Applications, users, schools, teams, submissions |

Guards are `beforeLoad` + `throw redirect()` using `getUser()` and `getProfile()` from `apps/web/src/functions`. Keep them coarse — one guard per layout, not per page.

### Registration flow

1. Step 1 creates the account: `access.register` → `auth.api.signUpEmail` → profile insert with role `leader` or `mic`. Then `authClient.signIn.username`.
2. Steps 2–7 collect school, division, team, students and teacher contact.
3. Final submit calls `teams.register`, which resolves or registers the school (`findOrCreateSchool`) and creates the team with the caller as leader.

**Classmates are not persisted by registration.** The API models membership through `join_request` → `decideJoinRequest`, so listed students join themselves from the dashboard. This is deliberate, not an omission.

---

## 5. Design system

`packages/ui` is the only place that may import Base UI. Pages import finished components.

**Primitives** (`primitives/`) — thin, styled Base UI wrappers, exported as named parts: `accordion` `alert-dialog` `avatar` `button` `checkbox` `combobox` `dialog` `field` `input` `menu` `otp-field` `popover` `progress` `radio` `select` `skeleton` `switch` `tabs` `textarea` `tooltip`.

**Components** (`components/`) — presentational and composed: `badge` `brand` `breadcrumb` `callout` `card` `container` `data-list` `data-table` `fields` `icons` `kicker` `marquee` `page-hero` `section` `section-header` `stat-strip` `steps` `table`.

`components/fields.tsx` is the reason forms are short. Each field renders its own label, REQUIRED/OPTIONAL tag, description and error, and wires itself to Base UI `Field` for accessibility:

```
TextField  TextareaField  SelectField  ComboboxField
CheckboxField  RadioCardField  OptionToggleField  SwitchField
```

`components/data-table.tsx` is sortable, searchable and paginated with real loading / empty / error states. Sorting and pagination are **manual** — the caller owns the state and passes already-sliced rows plus the server total, so a client-side sort cannot silently reorder one page of a larger list.

### Tokens

`packages/ui/src/styles/globals.css` defines the whole palette as Tailwind v4 `@theme` tokens: `ink` `surface`/`-2`/`-3`, `fg`/`-strong`/`-dim`, `muted`/`-2`, `faint`/`-2`, `volt` `lime` `teal` `mint` `gold`/`-bright`, borders `line`/`-soft`/`-strong`/`-fg`. Fonts: `font-display` (Space Grotesk), `font-sans` (Manrope), `font-mono` (JetBrains Mono).

Never hardcode a hex that has a token. Dynamic colours that Tailwind's scanner cannot see must be written as literal class strings in a `data.ts`.

---

## 6. Conventions that will bite you

- **No comments in code.** Not one.
- **`interface` for object shapes, `type` for unions/primitives.**
- Separate `import type { … }` statements.
- **No nested ternaries** — extract a helper or an IIFE.
- Named exports only; no default exports. One component per file, static copy in a sibling `data.ts`.
- `packages/ui` must not import the router or any app package. Route-aware wrappers live in `apps/web/src/components/site/` (`PageHero` wraps the UI one with TanStack `Link`).
- A `<Button render={<Link to="/x" />}>` needs an `aria-label` on the rendered element — jsx-a11y requires it.
- ultracite rejects `role="…"` on a `div` when a semantic element exists. Use real elements; `<ul>`/`<li>` over `role="list"`.
- ultracite rejects `try`/`finally` — the React Compiler cannot lower it. Reset state in both branches instead.
- Column definitions for `DataTable` must be hoisted to module scope, not built inside a component.
- `apps/web/tsconfig.json` uses `lib: ES2023` so `Array#toSorted()` typechecks.

---

## 7. Data layer notes

- Row types come off the router, never hand-written: `type Out = InferRouterOutputs<AppRouter>`.
- oRPC procedures are `ProcedureUtils & GeneralUtils`, so:
  - loaders: `context.orpc.x.y.call()`
  - queries: `useQuery(orpc.x.y.queryOptions({ input }))`
  - mutations: `useMutation(orpc.x.y.mutationOptions({ onSuccess }))`
  - invalidation: `queryClient.invalidateQueries({ queryKey: orpc.x.y.key() })`
  - There is **no** `.invalidate()` / `.setData()` helper.
  - `.call()` **rejects** on error — it does not return `{ error }`.
- Roles are enforced in two places on purpose: `protectedProcedure` / `adminProcedure` in `packages/api/src/index.ts`, and again in the handler.

---

## 8. Design sources

Authoritative mockups are in `C:\Users\tenuk\Downloads\Byte Quest website design (1)` — About, Home v2, Journey, Mentors, Partners, Programme, Projects, Register, Volunteers. Each has a trailing `<sc-dc>` script holding the data arrays and computed values; read it before rebuilding a section.

The previous folder (`Byte Quest website design`) is superseded — only Home v2 and About differed.

Assets are copied into `apps/web/public/assets/` (`crest.png`, `hero-avatar.png`, `hero-vr.png`) and served from `/assets/…`.

**Hero dots:** the design's Three.js point cloud is reproduced without the dependency by `components/home/hero-dots.tsx`, a 2D canvas using the same projection, drift and scroll response.

---

## 9. Known gaps

- `/onboarding` is now largely redundant — `/register` creates the profile directly. Consider folding it in.
- The admin panels' other tables are hand-rolled; only the applications table uses the new `DataTable`. Migrating them is the obvious next cleanup.
- No rate limiting on `/apply-admin`; it is public and writes rows.
- `apps/web/tsconfig.json` `lib` was raised to ES2023 for `toSorted`.
