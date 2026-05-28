# ADR 0001 — Adopt TanStack Query v5 for data fetching

**Date:** 2026-05-28
**Status:** Accepted

---

## Context

The codebase fetched all remote data with the pattern:

```js
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetchSomething(id).then(setData).catch(setError).finally(() => setLoading(false));
}, [id]);
```

This pattern was repeated in 162 try-catch blocks across 230 source files. Three concrete problems:

1. **No caching.** Every page navigation re-fetched all data from the backend, even if the user had visited the same page 10 seconds earlier.
2. **No deduplication.** Multiple components on the same page that needed the same data (e.g. educator info) each fetched it independently.
3. **No standardisation.** Loading/error state handling was inconsistent — some components swallowed errors silently, others re-threw, some set local error state.

The app has real production users. Re-fetching everything on every navigation creates visible latency and unnecessary backend load.

## Decision

Adopt **TanStack Query v5** (`@tanstack/react-query`) as the standard data-fetching layer for all new and migrated components.

A singleton `QueryClient` is created in `src/lib/query-client.ts` and provided at the root in `src/app/layout.jsx`. All query keys are defined in `src/lib/query-keys.ts` to prevent collisions and enable targeted invalidation.

```ts
// Default config (src/lib/query-client.ts)
staleTime: 5 * 60 * 1000   // data considered fresh for 5 min
gcTime:    10 * 60 * 1000  // unused cache retained for 10 min
retry: 2
refetchOnWindowFocus: false
```

Priority migration order was determined by graphify edge-count (most-connected components = most user traffic):

| Component | Edges | Replaced |
|-----------|-------|---------|
| `CourseDetails` | 15 | 2 `useEffect` fetches + educator secondary fetch |
| `WebinarDetailsPage` | 15 | Full page fetch |
| `ViewProfile` | 14 | 4 secondary fetches (webinars, courses, test series, summary counts) |
| `CoursePanelPage` | 11 | 4 `useEffect` fetches (course, test series, videos, materials) |

## Alternatives considered

**Custom `useFetch` hook** — A lightweight wrapper around Axios that standardises loading/error state without a new dependency. Rejected because it doesn't solve caching or deduplication, which are the core problems for production users who navigate frequently.

**SWR** — Simpler API but less powerful for complex cases (pagination, optimistic updates, dependent queries). TanStack Query v5 has full TypeScript support and better devtools, which matters for an intermediate-level developer scaling the codebase.

**Keep existing pattern** — No upside beyond avoiding a new dependency. The latency problem compounds as the feature set grows.

## Consequences

- Back-navigation to any migrated page is now instant — data served from cache with zero network requests.
- The ReactQuery Devtools panel (visible in dev mode, bottom-right) shows cache hits, stale status, and refetch behaviour in real time.
- New data-fetching code must use `useQuery` / `useMutation` from TanStack Query, not raw `useEffect` + Axios.
- The query key factory in `src/lib/query-keys.ts` must be updated when a new entity type is introduced.
- `src/components/server/*.routes.js` files remain unchanged — they are plain async functions that TanStack Query calls as `queryFn`.
