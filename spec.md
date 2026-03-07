# LIFEDROP

## Current State
The app has a full Motoko backend with `registerUser`, `getAllDonorsList`, `searchDonorsPublic`, and `getPublicUserList`. Registration forms collect name, phone, city, blood group for each role. The Search Donors page uses `getAllDonorsList` to show donor cards with phone and WhatsApp.

**Root bug**: All users who are not logged in via Internet Identity share the same anonymous principal (`2vxsx-fae`). The backend's `registerUser` uses `users.containsKey(caller)` to detect duplicates — so after the first person registers, every subsequent registration is silently skipped (returns the same caller principal). Phone numbers and details of all users after the first are never stored. Search shows "Phone not provided" because the phone field is empty for all duplicated-principal entries.

## Requested Changes (Diff)

### Add
- `src/frontend/src/utils/deviceIdentity.ts` — generates a persistent Ed25519 keypair per device/browser, stored in localStorage. Each device gets a unique principal, so each registration goes to a unique slot in the backend HashMap.
- Update `useActor.ts` to always use the device keypair identity (not anonymous) when no Internet Identity session is active.

### Modify
- `useActor.ts` — import `getOrCreateDeviceIdentity()` and use it as the identity for every actor call (replaces anonymous actor). This gives each user a unique principal.
- Backend `registerUser` — add an `updateUser` path: if the caller is already registered, **update** their name/phone/email/city instead of silently returning. This fixes the case where a user re-registers with different details.
- `getAllDonorsList` — no change needed; it already reads phone from the users map correctly. Fix will come from each user having a unique principal.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/utils/deviceIdentity.ts` that generates/loads an Ed25519 keypair from localStorage and returns an `Identity`.
2. Update `useActor.ts` to call `getOrCreateDeviceIdentity()` and always use it (skip anonymous actor path).
3. Update backend `registerUser` to update existing user's phone/name/email/city if already registered (upsert behavior).
4. Validate and deploy.
