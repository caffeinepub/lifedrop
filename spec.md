# rishanlifedrop347 — Backend Fix

## Current State
The authorization `access-control.mo` has `Runtime.trap("User is not registered")` inside `getUserRole`. Any frontend call to `getCallerUserRole()` for a user who hasn't called `_initializeAccessControlWithSecret` causes the canister to trap, returning a rejection that bubbles up as "Backend temporarily unavailable" and "Setting up secure session" errors in RegisterPage and EmergencyRequestPage.

Additionally, blood requests from unregistered/anonymous users may fail silently.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- `access-control.mo`: `getUserRole` — return `#guest` instead of `Runtime.trap` when user not found
- Ensure `createBloodRequest` in `main.mo` accepts any non-anonymous caller (already done, verify)

### Remove
- `Runtime.trap("User is not registered")` from access-control.mo

## Implementation Plan
1. Fix `access-control.mo` — change trap to return `#guest`
2. Verify `main.mo` has no other traps for unregistered callers
