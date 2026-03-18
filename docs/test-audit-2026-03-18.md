# BF-Website Test + Endpoint Audit (2026-03-18)

## Scope executed
- Automated tests and static checks from npm scripts.
- Targeted endpoint probing for API/route behavior.
- Static review of API clients, WebSocket chat flow, OTP-related code paths, and lead/contact callouts.

## Commands run
1. `npm run test`
2. `npm run lint`
3. `npm run typecheck`
4. `npm run build`
5. `npm run build:server`
6. `npm run smoke`
7. `npm run audit -- --omit=dev` (failed due registry/audit endpoint restriction)
8. One-off endpoint probing via transient tsx script (not committed)

## Check results
- `npm run test`: PASS (4/4 tests passing)
- `npm run lint`: PASS
- `npm run typecheck`: PASS
- `npm run build`: PASS
- `npm run build:server`: PASS
- `npm run smoke`: PASS
- `npm run audit -- --omit=dev`: FAIL (environment 403 from npm audit endpoint)

## Issues found (no fixes applied)

### 1) Broken client tracking endpoint (`/api/support/track`) 
**Severity:** High (silent analytics loss)

- Client tracking utility posts to `/api/support/track`.
- Server only exposes `/api/support/event`.
- Endpoint probe confirmed `/api/support/track` returns 404.

Impact:
- Event tracking from `track()` is dropped in production without obvious user-facing errors.

### 2) Duplicate Maya routes cause behavior mismatch (`/api/maya/escalate`)
**Severity:** High (inconsistent API contract)

- `server/index.ts` mounts `server/routes/maya.ts` at `/api/maya`.
- `server/routes.ts` also defines `/api/maya/escalate` with different behavior/status.
- Because middleware order registers mounted router first, `/api/maya/escalate` returns the router response (`200 {status:"ok"}`) rather than the later route (`202 {ok:true}` + logging).

Impact:
- Frontend/backend contract ambiguity; inconsistent status code and payload.
- Expected escalation telemetry in `routes.ts` may never execute for this path.

### 3) Duplicate marketing route definition (`/api/marketing/track-lead`)
**Severity:** Medium-High

- `server/routes.ts` defines `/api/marketing/track-lead` with attribution logging and HTTP 202.
- `server/routes/marketing.ts` defines the same path with HTTP 200 and no logging.
- Mounted order means first one to run wins, producing inconsistent implementation.

Impact:
- Loss of attribution logging path depending on route order.
- API semantics/status mismatch for consumers.

### 4) WebSocket protocol mismatch (server sends `reply`, client expects `message`)
**Severity:** High (chat UX degradation)

- WebSocket server sends JSON `{ reply: "Maya connected" }` for incoming messages.
- Floating chat client parser checks `payload.message` and treats unknown payload as fallback.

Impact:
- User messages do not render the intended server response text.
- Chat appears generic/non-functional even with active socket.

### 5) “Talk to a Human” signal is not implemented end-to-end in WebSocket server
**Severity:** High

- Client sends `{ type: "staff_joined", sessionId }` when user requests human support.
- WebSocket server currently ignores message content and always replies with generic payload.

Impact:
- Escalation intent from chat UI does not trigger a distinct server workflow.
- Users receive no meaningful transition to human support.

### 6) Hardcoded external API base in client (`https://api.staff.boreal.financial`)
**Severity:** Medium-High (environment/config fragility)

- `client/src/config/api.ts` hardcodes a production domain.
- Other client calls use relative `/api/...` paths.
- `client/src/config/env.ts` defines an env-driven API base but is not used by `api.ts`.

Impact:
- Mixed-origin behavior can break local/staging deployments.
- Potential CORS/auth cookie inconsistencies across call paths.

### 7) OTP capability appears UI-only; no backend OTP verification flow
**Severity:** Medium (feature completeness / security expectation gap)

- OTP UI component exists (`client/src/components/ui/input-otp.tsx`).
- No server OTP endpoints or verification workflow found.
- Twilio integration present only for SMS alerting on contact leads, not OTP challenge/verification.

Impact:
- If OTP is expected for auth/verification, current implementation is incomplete.

### 8) In-memory storage for lead data in server process
**Severity:** Medium-High (data durability + scaling)

- `server/storage.ts` uses in-memory Maps for leads/users.

Impact:
- Data loss on restart/deploy.
- No cross-instance consistency in multi-instance environments.

### 9) In-memory rate limiting only
**Severity:** Medium

- `server/security.ts` uses process-local Map without shared store.

Impact:
- Rate limits reset on restart and do not coordinate across instances.
- Weak protection under horizontal scaling.

### 10) Sensitive lead/contact PII appears in development logs
**Severity:** Medium

- Contact and readiness submissions log names, phones, emails in non-production paths.

Impact:
- Elevated accidental exposure risk in shared dev/test logs.

## Endpoint probe highlights
Observed from transient local probe against instantiated Express app:
- `GET /api/health` => 200
- `POST /api/support/track` => 404
- `POST /api/support/event` => 202
- `POST /api/maya/message` => 200
- `POST /api/maya/website-chat` => 200
- `POST /api/maya/escalate` => 200 (from mounted router implementation)
- `POST /api/marketing/track-lead` => 200 (from marketing route implementation)
- `POST /api/crm/startup-waitlist` => 202

## Notable environment warning
- Every npm invocation emitted: `npm warn Unknown env config "http-proxy"`.
- This is not currently breaking runs but should be cleaned up to avoid future npm major-version failures.
