# byte-quest

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Start, Self, ORPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Start** - SSR framework with TanStack Router
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - Custom reusable components live in `packages/ui`
- **oRPC** - End-to-end type-safe APIs with OpenAPI integration
- **Drizzle** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Authentication** - Better-Auth
- **Nx** - Smart monorepo task orchestration and caching

## Getting Started

First, install the dependencies:

```bash
bun install
```

## Database Setup

This project uses PostgreSQL with Drizzle ORM.

1. Make sure you have a PostgreSQL database set up.
2. Update your `apps/web/.env` file with your PostgreSQL connection details.

3. Apply the schema to your database:

```bash
bun run db:push
```

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:4001](http://localhost:4001) in your browser to see the fullstack application.

## UI Customization

React web apps in this stack share custom components through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Base UI primitives (Button, Input, Textarea, Field, Select, Combobox, Checkbox, Radio, Switch, Tabs, Tooltip, Popover, Accordion, Dialog, AlertDialog, Progress, Skeleton, Avatar, OTPField, Menu) live in `packages/ui/src/primitives`
- Composed components (Container, Section, SectionHeader, Kicker, Card, Badge, Breadcrumb, PageHero, StatStrip, HairlineGrid, DataList, Table, Callout, EmptyState, Steps, Checklist, ProgressMeter, Brand, Marquee) live in `packages/ui/src/components`
- `packages/ui/src/components/fields.tsx` exposes ready-made form fields — `TextField`, `TextareaField`, `SelectField`, `ComboboxField`, `CheckboxField`, `RadioCardField`, `OptionToggleField`, `SwitchField`
- Import shared components directly from their package paths:

```tsx
import { Button } from "@byte-quest/ui/primitives/button";
import { SelectField } from "@byte-quest/ui/components/fields";
import { Section } from "@byte-quest/ui/components/section";
```

Keep shared components presentational and reusable. Put app-specific behavior in components under `apps/web/src/components`.

## Environment Configuration

Each app owns its environment schema in `.env.schema`. Varlock generates `src/env.ts` during installation; run `bun run env:generate` after changing a schema. Commit schemas, and keep secrets in ignored env files or your deployment platform.

Import the generated `ENV` accessor in application code. Shared database and auth packages receive configuration or initialized clients from the application. See [Varlock's monorepo guide](https://varlock.dev/guides/monorepos/).

Bun's automatic env loading is disabled in `bunfig.toml`; the framework integration or server bootstrap loads Varlock. Node deployments must include Varlock and its dependencies alongside the app schema.

Run standalone Node/Bun tools that use Varlock from the owning app directory so they load that app's schema and env files. `env:generate` only generates TypeScript files; it does not initialize environment values in a subsequent command.

## Deployment

### Docker Compose

- Target: web + server
- Config: `docker-compose.yml` (app Dockerfiles live in `apps/*/Dockerfile`)
- Build images: bun run docker:build
- Start: bun run docker:up
- Logs: bun run docker:logs
- Stop: bun run docker:down

Environment variables are read from each app's `.env` file (baked into web builds for public variables) and overridden in `docker-compose.yml` for container networking.

For more details, see the guide on [Deploying with Docker Compose](https://www.better-t-stack.dev/docs/guides/docker).

## Project Structure

```
byte-quest/
├── apps/
│   └── web/         # Fullstack application (React + TanStack Start)
├── packages/
│   ├── ui/          # Design system: primitives, components, and styles
│   ├── api/         # API layer / business logic
│   ├── auth/        # Authentication configuration & logic
│   └── db/          # Database schema & queries
```

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Marketing homepage |
| `/about`, `/programme`, `/journey`, `/projects`, `/mentors`, `/partners`, `/volunteers` | Programme pages |
| `/register` | Team registration — team leader or MIC only |
| `/privacy`, `/terms`, `/code-of-conduct`, `/submission-guidelines` | Policies and guidelines |
| `/auth/login` | Username and password sign in |
| `/apply-admin` | Application for organising committee access |
| `/onboarding` | Student profile completion (requires a session) |
| `/dashboard` | Team, join requests and submission (requires a session) |
| `/admin` | Applications, users, schools, teams and submission review (admin only) |

## Accounts and roles

Sign in uses a username and password (`better-auth` `username` plugin). There is no open signup beyond these two paths:

- `/register` — team leaders and MICs (teachers in charge) create an account and register their team. Ordinary students do not register a team; they sign in and ask to join.
- `/apply-admin` — anyone can apply for organising committee access. An existing admin approves or rejects; approval provisions the account and returns a one-time password once.

Roles live on `user_profile.role`: `admin`, `mic`, `leader`, `student`.

## Available Scripts

- `bun run dev`: Start all applications in development mode
- `bun run build`: Build all applications
- `bun run dev:web`: Start only the web application
- `bun run check-types`: Check TypeScript types across all apps
- `bun run db:push`: Push schema changes to database
- `bun run db:generate`: Generate database client/types
- `bun run db:migrate`: Run database migrations
- `bun run db:studio`: Open database studio UI
- `bun run docker:build`: Build the Docker Compose images
- `bun run docker:up`: Build and start the Docker Compose stack
- `bun run docker:logs`: Tail logs from the Docker Compose stack
- `bun run docker:down`: Stop the Docker Compose stack

## Better Auth Schema Generation

After changing auth plugins or schema options, run `bun run auth:generate` from the project root. The script runs the Better Auth CLI through `varlock run` from the owning app directory, loading the auth instance from `src/services.ts`. Review the schema changes, then use your ORM's migration workflow to apply them.
