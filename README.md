# AutoGradeX

AutoGradeX is a production-style Next.js App Router application for AI-assisted course project evaluation. It implements the PDF brief around assignment publishing, student submissions, plagiarism checks, AI scoring, faculty override, and admin oversight.

## Architecture

- `src/app`: App Router pages, layouts, loading states, and protected dashboards.
- `src/actions`: Server Actions for auth, assignment CRUD, submissions, and admin controls.
- `src/components`: Reusable UI, auth forms, dashboard widgets, and shell components.
- `src/lib`: Prisma client, auth/session helpers, validation, AI grading, plagiarism analysis, and dashboard queries.
- `prisma`: Schema plus a seed script for demo users and a sample assignment.

Key implementation choices:

- Authentication uses signed JWT cookies stored server-side and enforced in both middleware and protected server components.
- All writes use Server Actions. There are no API routes for mutations.
- Prisma is configured against PostgreSQL and works with local Postgres or hosted providers such as Neon.
- AI grading falls back to deterministic heuristics if `GEMINI_API_KEY` is not set, so the app still runs end to end.
- When `GEMINI_API_KEY` is set, the app can also process scanned or image-heavy PDFs through Gemini document understanding.

## Environment Variables

Create `.env` in the project root:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
JWT_SECRET="replace-with-a-long-random-secret"
GEMINI_API_KEY=""
```

Notes:

- `DATABASE_URL` is required for Prisma.
- `JWT_SECRET` is required for stable session signing.
- `GEMINI_API_KEY` is optional. If omitted, AutoGradeX uses a local heuristic grading fallback.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`.

3. Run the initial migration and generate the client:

```bash
npx prisma migrate dev
npm run db:generate
```

4. Seed demo data:

```bash
npm run db:seed
```

5. Start the development server:

```bash
npm run dev
```

## Demo Credentials

- Student: `student@autogradex.local` / `DemoPass123`
- Faculty: `faculty@autogradex.local` / `DemoPass123`
- Admin: `admin@autogradex.local` / `DemoPass123`

## Scalability Notes

- The analysis layer is isolated in `src/lib/analysis` and `src/lib/ai`, making it straightforward to replace heuristic checks with real static analysis or external plagiarism tooling.
- Server Actions return structured responses, so moving high-volume workflows to queues or background jobs later will not require a full UI rewrite.
- Prisma models already separate authored assignments, submission attempts, and reviewer decisions, which supports auditing and future analytics extensions.
