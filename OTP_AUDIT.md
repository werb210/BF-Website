# OTP Audit — BF-Website (branch `audit/otp-2026-05-19`)

Date: 2026-05-19 (UTC)
Mode requested: read-only audit

## Step 1 — Phone capture + submit surfaces

Phone is captured in these primary user flows:

- `client/src/pages/CreditReadiness.tsx`
  - Captures `phone` input in the form.
  - Submits payload via `fetch(`${WEBSITE_API_BASE}/api/website/credit-readiness`, ...)`.
- `client/src/components/ContactForm.tsx`
  - Captures `mobilePhone` and normalizes to E.164 fallback.
  - Submits via `safeFetch(`${WEBSITE_API_BASE}/api/website/contact`, ...)`.
- `client/src/components/ScoreModal.tsx`
  - Captures `phone` and submits to `${API_BASE_URL}/api/lead`.
- `client/src/components/ContactModal.tsx` and `client/src/features/contact/ContactModal.tsx`
  - Capture `mobilePhone` in UI; feature-modal variant is form-only UI and does not directly show a fetch in this file.
- `client/src/pages/IndustryDetail.tsx`
  - Captures `phone` field in a local form.

OTP keyword/code surface:
- `client/src/components/ui/input-otp.tsx` exists as UI primitive import wrapper only.
- No client-side OTP verification API call path found in this repo’s website flow.

## Step 2 — Fetch/API clients and distinct API base URLs

### API request patterns found

1. **Absolute website-to-server base for readiness/contact**
   - `WEBSITE_API_BASE` in `client/src/config/api.ts` is hardcoded:
     - `https://server.boreal.financial`
   - Used by Credit Readiness + Contact form submissions.

2. **Environment-based API base**
   - `API_BASE_URL` in `client/src/config/env.ts`:
     - `import.meta.env.VITE_API_BASE_URL || ""`
   - Used for routes like `/api/lead`, `/api/public/lender-count`, `/api/support/event`, `/api/support/track`.
   - If empty, fetches are relative to current origin.

3. **Maya-specific env base**
   - `VITE_MAYA_API_BASE` in `client/src/lib/mayaClient.ts`.
   - Used for health check only: `${getMayaApiBase()}/health`.

4. **Relative API prefix client (`/api...`)**
   - `client/src/core/apiClient.ts` prepends `/api` to all Maya service calls (`/maya/*`, `/marketing/*`, `/crm/*` etc.) via `apiRequest`.
   - This means runtime origin depends on current site origin unless proxy/host routing overrides it.

### Distinct API base URLs / origins observed

- `https://server.boreal.financial` (hardcoded, explicit backend origin)
- `import.meta.env.VITE_API_BASE_URL` (configurable env origin; can be empty/relative)
- `import.meta.env.VITE_MAYA_API_BASE` (Maya health-check origin)
- Relative origin `/api` (via shared `apiClient` for Maya widget actions)

## Step 3 — Maya widget URL construction + wrong-host source

### Where Maya API URLs are built

- `client/src/services/mayaService.ts`
  - Calls `api.post("/maya/website-chat", ...)`, `api.post("/maya/escalate", ...)`, etc.
- `client/src/core/apiClient.ts`
  - Converts those to `apiRequest(method, `/api${url}`, ...)`.
  - So `"/maya/website-chat"` becomes request path `"/api/maya/website-chat"` on the current origin.

### Misconfiguration implication

Given operator-observed requests landing at `www.boreal.financial/api/maya/*` (405):
- This behavior is consistent with relative-origin routing (`/api/...`) from `apiClient`.
- If `www.boreal.financial` is the page origin and does not correctly proxy `/api/maya/*` to BF server, Maya POSTs will hit wrong host/path and can return 405.

### Env/constant likely involved

- Not from `WEBSITE_API_BASE` (Maya service does not use it).
- Not directly from `VITE_MAYA_API_BASE` for POSTs (that file currently only affects health check).
- Root cause source in code is **relative `/api` composition in `client/src/core/apiClient.ts`** for Maya service calls.

## Step 4 — Credit Readiness handler and OTP involvement

Confirmed in `client/src/pages/CreditReadiness.tsx`:
- Submit target: `POST ${WEBSITE_API_BASE}/api/website/credit-readiness`.
- `WEBSITE_API_BASE` resolves to `https://server.boreal.financial`.
- No `/api/auth`, OTP challenge, SMS code verification, or OTP endpoint call exists in this submit handler.

Related downstream behavior:
- After success, it stores result in sessionStorage and navigates to `/credit-results`.
- `client/src/pages/CreditResults.tsx` hardcodes apply CTA to `https://client.boreal.financial/apply?fresh=1`.
- This supports the expected architecture: website readiness submit here; OTP occurs in client app flow, not this repo.

## Verdict

- **Maya widget POSTs are vulnerable to wrong-host behavior** because they use relative `/api/maya/*` URLs from current origin.
- **Credit Readiness flow does not invoke OTP from this repo** and posts to explicit `https://server.boreal.financial` instead.
- I found **no other OTP-adjacent API call paths** in this repo matching `/api/auth`-style verification endpoints.
