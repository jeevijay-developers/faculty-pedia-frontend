# ADR 0002 — httpOnly session cookie + Next.js middleware for auth

**Date:** 2026-05-28
**Status:** Accepted

---

## Context

The original auth model stored everything in `localStorage`:

| Key | Value |
|-----|-------|
| `faculty-pedia-auth-token` | JWT |
| `faculty-pedia-student-data` | Parsed user object (JSON) |
| `user-role` | `'student'` \| `'educator'` |

Route protection was client-side only — a React `useEffect` on each page read localStorage and called `router.replace('/login')` if the user wasn't authenticated. This created two production risks:

1. **Flash of unprotected content.** On a fresh page load, the HTML renders before React hydrates. Protected pages were visible for a split second before the redirect fired.
2. **No server-side enforcement.** A user who manually edited localStorage (or a sophisticated XSS attack) could bypass client-side checks entirely.

There was also no centralised auth state — 40+ components each read `localStorage.getItem('faculty-pedia-student-data')` independently, and a `student-data-updated` custom event was used to synchronise them.

## Decision

Introduce a **dual-layer** auth model:

### Layer 1 — httpOnly `fp_session` cookie (server-side protection)

After a successful login, the frontend calls `POST /api/auth/session` (a Next.js API route) which sets:

```
Set-Cookie: fp_session=student; HttpOnly; Secure; SameSite=Lax; Max-Age=604800
```

`middleware.ts` (Next.js edge middleware) reads this cookie on every request before the page renders. Unauthenticated requests to protected routes are redirected to `/login?redirect=<path>` at the edge — no React, no flash.

### Layer 2 — localStorage JWT (backend API calls)

The backend API runs at a different origin (`http://localhost:5000` / `https://api.facultypedia.com`). httpOnly cookies set on the Next.js domain are not sent cross-origin, so the JWT must still travel via the `Authorization: Bearer` header. The Axios interceptor in `src/components/server/config.js` reads the token from localStorage and adds it to every request.

### AuthContext

`src/context/AuthContext.tsx` replaces all scattered localStorage reads with a single React context. Components consume `useAuth()` instead of reading localStorage directly. The context syncs across browser tabs via the `storage` event and across in-page updates via custom events dispatched by `Login.jsx`.

### Logout

`AuthContext.logout()` clears all localStorage keys **and** calls `DELETE /api/auth/session` to remove the httpOnly cookie. The Axios 401 interceptor does the same on session expiry.

## Why not full httpOnly-only (no localStorage)?

The cleanest security model would store the JWT exclusively in an httpOnly cookie and proxy all backend calls through Next.js API routes. This was rejected because:

1. It requires rewriting every API call to go through a Next.js proxy — significant scope increase.
2. The backend already validates Bearer tokens from headers; it would need changes to read cookies too.
3. The incremental win (full XSS token protection) is smaller than the risk of breaking the payment and enrollment flows during a large proxy migration.

The adopted model still meaningfully improves security:
- XSS cannot read the `fp_session` cookie to forge session state.
- Unprotected routes (e.g. navigating directly to `/exams`) are blocked at the edge before any page content is delivered.
- The JWT in localStorage remains an XSS risk, but is mitigated by: CSP headers (infrastructure concern), React's XSS-safe rendering (no `dangerouslySetInnerHTML` in auth paths), and the short JWT expiry enforced by the backend.

## Alternatives considered

**Keep localStorage-only, add AuthContext** — Solves the scattered reads problem but not the flash-of-content or server-side enforcement problem. Rejected.

**Full BFF (Backend For Frontend) proxy** — Maximum security. All API calls go through Next.js, cookies stay httpOnly throughout. Deferred to a future ADR when the team has bandwidth to migrate the API layer.

## Consequences

- Logging in sets both the localStorage token (for API calls) and the `fp_session` cookie (for middleware).
- Any code that reads `localStorage.getItem('faculty-pedia-student-data')` directly should be migrated to use `useAuth()` from `AuthContext`.
- The `/api/auth/session` route is internal — it must never be called from outside the app.
- If the `fp_session` cookie is missing but the localStorage token exists (e.g. user cleared cookies manually), middleware will redirect to login. This is correct behaviour — the session is considered invalid.
- Protected routes: `/exams/*`, `/course-panel/*`, `/profile/*`, `/details/*`, `/test-series/*`, `/webinars/*`.
