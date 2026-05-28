# ADR 0003 — Gradual TypeScript adoption (new files only)

**Date:** 2026-05-28
**Status:** Accepted

---

## Context

The codebase is 95% plain JavaScript (`.jsx`) with `"strict": false` in `tsconfig.json`. TypeScript is already configured in the project (Next.js generates a `tsconfig.json` by default) but unused.

The practical effect: type errors that would have been caught at compile time surface at runtime. A concrete example found in the codebase:

```js
// Components defensively guard against three different field names
// because nobody knows the real shape returned by the API
const educatorId =
  course?.educatorID ||
  course?.educatorId ||
  course?.educator;
```

A full TypeScript migration would eliminate this class of bug. The question was how to approach it.

## Decision

**New files only.** Any new file created from this point onwards is written in TypeScript (`.tsx` for components, `.ts` for utilities and config). Existing `.jsx` files are not touched until they are modified for another reason — at which point the developer may optionally convert them.

Files already created in TypeScript:
- `src/context/AuthContext.tsx`
- `src/lib/query-client.ts`
- `src/lib/query-keys.ts`
- `src/lib/media.ts`
- `src/lib/ReactQueryProvider.tsx`
- `src/app/api/auth/session/route.ts`
- `middleware.ts`
- All test files (`src/test/**/*.ts`, `src/test/**/*.tsx`)

## Alternatives considered

**Full migration sprint** — Convert all 184 `.jsx` files to `.tsx` in one pass. Rejected because:
- The app has production users. A large-scope refactor on all components simultaneously is high-risk.
- Many existing components have implicit `any` shapes that would require significant API type work before TypeScript can enforce anything useful.
- The effort-to-value ratio is poor until the API response shapes are documented (ongoing work).

**Enable `strict: true` immediately** — Even on existing JS files. Rejected because `tsconfig.json` with `strict` applies to all files and would generate hundreds of errors in the existing `.jsx` files, making CI unusable.

**Skip TypeScript entirely** — The project is already configured for TypeScript. Not using it means giving up static analysis on all new code. Rejected.

## Consequences

- All new utilities, hooks, context providers, and API route handlers are typed.
- Type definitions for API responses should be added to `src/types/` as the shapes stabilise.
- When an existing `.jsx` file is modified for a Phase 3/4/5 change (like adding `useQuery`), it is a good time to rename it to `.tsx` — but not required.
- The `tsconfig.json` `strict` flag remains `false` until enough `.jsx` files are converted that enabling it doesn't break the build.
