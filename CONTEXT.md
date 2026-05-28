# Faculty Pedia Frontend — Domain Context

> This file is the canonical glossary and architecture reference for the project.
> Update it when a term is renamed or a structural decision changes.
> Do NOT couple entries to implementation details (file paths, API shapes) — those belong in ADRs or code comments.

---

## Domain Glossary

### Roles

**Student**
A learner who browses content and enrolls in Courses, Test Series, or Webinars via payment. Students have a profile page at `/profile/student/[id]` and a personal dashboard at `/exams`.

**Educator**
A subject-matter expert who creates and delivers Courses, Webinars, and Test Series. Educators have a separate dashboard application (different origin). Their public-facing profile is at `/profile/educator/[id]`.

---

### Content Types

**Course**
A structured curriculum delivered as a collection of recorded video lessons, grouped by topic. A Course may include Test Series and Study Materials. Courses are either **One-to-One** (single student, live) or **One-to-All** (group, recorded or live).

**Live Class**
A real-time session between an Educator and one or more Students. Distinct from a recorded Course:
- **1:1 Live Class** — single student, billed by pay-per-hour
- **1:All Live Class** — group live session, part of a Course package

**Test Series**
A curated collection of practice tests. May be attached to a Course (course-specific) or sold standalone. Students attempt individual Tests within a Test Series during a timed **Live Test** session.

**Live Test**
A timed, proctored sitting of a single Test from a Test Series. Distinct from browsing — a Student enters a focused test-taking UI at `/test-panel`.

**Webinar**
A scheduled live or recorded session, typically topic-specific rather than curriculum-based. Webinars have a fixed date, seat limit, and price. Distinct from a Live Class: a Webinar is a one-off event, not part of a Course.

**Post**
An article or educational write-up published by an Educator. Rendered at `/posts/[id]`.

---

### Transactions

**Enrollment**
The payment-gated relationship between a Student and a purchasable resource (Course, Test Series, or Webinar). Enrollment is created via Razorpay checkout. The `EnrollButton` component orchestrates the full flow: order creation → Razorpay modal → server-side verification → redirect.

**Payment Order**
A Razorpay order created server-side before checkout. Identified by `orderId` (Razorpay) and `intentId` (internal). Verified after the student completes payment.

---

### Identity

**Specialization**
The broad exam category an Educator or Course targets (e.g. IIT-JEE, NEET, CBSE, CA). Used for filtering and routing.

**Subject**
The academic subject within a Specialization (e.g. Physics, Chemistry, Mathematics).

---

## Architecture

### Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 18, Tailwind CSS v4, HeroUI |
| Data fetching | TanStack Query v5 (server cache) + Axios (HTTP) |
| Auth | httpOnly cookie (`fp_session`) for server-side middleware + localStorage token for backend API calls |
| Payment | Razorpay |
| Animation | Framer Motion, AOS |
| Icons | Lucide React, React Icons |

### Request flow

```
Browser
  └── Next.js middleware (edge) — reads fp_session cookie, redirects unauthenticated requests
        └── Server component (ISR, revalidate=300 on detail pages)
              └── Client component hydration
                    └── TanStack Query — deduplicates, caches, background-refetches
                          └── Axios API_CLIENT → Backend API (http://localhost:5000 or api.facultypedia.com)
```

### Auth model

- **`fp_session`** — httpOnly cookie, set by `/api/auth/session` POST after login. Read by `middleware.ts` for server-side route protection. Value is the user's role (`student` | `educator`).
- **`faculty-pedia-auth-token`** — JWT stored in localStorage. Added as `Authorization: Bearer` header by the Axios request interceptor. Sent to the backend API (different origin from Next.js, so cookies don't cross).
- **`AuthContext`** (`src/context/AuthContext.tsx`) — single source of truth for client-side auth state (`isLoggedIn`, `userRole`, `userData`, `studentId`). Syncs across browser tabs via `storage` events.

### Route groups

| Route prefix | Access | Description |
|---|---|---|
| `/exams`, `/course-panel`, `/profile`, `/details`, `/test-series`, `/webinars` | Authenticated | Protected by middleware |
| `/login`, `/join-as-student` | Public + redirect-if-authed | Middleware redirects logged-in users away |
| `/`, `/courses`, `/educators`, `/posts`, `/about` | Public | No auth required |

### Component conventions

- **New files** are written in TypeScript (`.tsx` / `.ts`). Existing `.jsx` files are untouched until modified for another reason.
- **"God node" components** (identified by graphify: `CourseDetails`, `ViewProfile`, `WebinarDetailsPage`) are imported with `next/dynamic` to defer their bundles.
- **Shared media utilities** live in `src/lib/media.ts` — never duplicate `getYouTubeEmbedUrl`, `getVimeoEmbedUrl`, `pickImageUrl`, or `resolveAssetUrl` inline.
- **Shared query keys** live in `src/lib/query-keys.ts` — use these factories, never write raw string arrays in `useQuery` calls.

### API layer

All backend calls go through `src/components/server/` route files which wrap Axios. The central client is `src/components/server/config.js`. Server route files are plain async functions — not React hooks.

---

## Key Invariants

1. A **Student** cannot be an **Educator** — roles are mutually exclusive and stored in `localStorage['user-role']`.
2. **Enrollment** always requires payment through Razorpay, even for ₹0 items (the flow still creates an order, just charges 0).
3. **Test Series** attached to a Course (`ts.courseId !== null`) are only accessible after enrolling in that Course.
4. A **Live Test** session state (answers, timer) is local-only during the attempt; results are submitted via `/api/results/submit-test` at the end.
5. The **Educator Dashboard** is a separate Next.js application at a different origin — the main app only links to it, never embeds it.
