# LIFEDROP

## Current State
The backend has a critical bug: `registerUser` checks `if (not initialized)` which requires `initSystem()` to be called first. This is never called automatically, so all registrations fail with "System not initialized". Additionally, many backend functions check `AccessControl.hasPermission` which requires Internet Identity login — but the app has no login concept, causing "Failed to connect" errors for anonymous callers.

## Requested Changes (Diff)

### Add
- Backend: `getAllRegisteredUsers()` — public query, returns all users (name, role, city) for the sidebar

### Modify
- Backend: Remove `initialized` guard from `registerUser` — any caller (anonymous or not) can register freely
- Backend: Remove `AccessControl.hasPermission` guards from `registerUser`, `getBloodRequests`, `searchDonors`, `getDonorProfile`, `getAllHospitals` — these are public-facing functions
- Backend: Remove `AccessControl.hasPermission` guard from `getCallerUserProfile` — return null if not found instead of trapping
- Backend: Remove `AccessControl.hasPermission` guard from `saveCallerUserProfile` — allow any caller
- Backend: Remove the `initSystem` requirement entirely (keep the function for backward compat but make it a no-op)
- Backend: `createBloodRequest` — remove initialized check, allow any caller
- Frontend: Remove any calls to `initSystem` before registration
- Frontend: Remove "Backend not ready" guard that blocks on actor being null

### Remove
- Backend: `initialized` stable variable and its guard logic
- Backend: All `Runtime.trap("System not initialized")` calls

## Implementation Plan
1. Rewrite main.mo — strip out initSystem guard, remove access control from public functions, add getAllRegisteredUsers
2. Regenerate backend types (backend.d.ts) to include new function
3. Update frontend RegisterPage to remove initSystem pre-call if present
4. Update sidebar/AppContext to use getAllRegisteredUsers from backend
