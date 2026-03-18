# LIFEDROP

## Current State

LIFEDROP is a decentralized blood donation platform with:
- Multi-role registration (Donor, Patient, Hospital, Blood Bank, NGO, Volunteer, Admin)
- Blood request creation and deletion (owner only)
- Notifications stored in localStorage (per-device only, not visible to all users)
- No account delete feature
- Emergency request submission without global broadcast notification
- "Mark as Received" deletes request silently without a thank you message to all users

## Requested Changes (Diff)

### Add
- **Account Delete**: A `deleteAccount` backend function that removes the caller from all data collections (users, userProfiles, donorProfiles, hospitalProfiles). Frontend shows a "Delete Account" button in every dashboard with a confirmation dialog. After deletion, user is logged out and redirected to home.
- **Global Notifications (backend-stored)**: A `GlobalNotification` type stored on-chain, visible to all users. Two backend functions: `getGlobalNotifications()` returns all global notifications (array). `addGlobalNotification(title, message, type, details)` adds one (internal, called by other backend functions).
- **Emergency Request → Broadcast Notification**: When `createBloodRequest` is called, automatically create a global notification containing: patient name, blood group, quantity, hospital, city, urgency level, contact number, and timestamp. This notification is visible to ALL users in the Notifications page.
- **Blood Received Thank-You Flow**: Replace the current silent "Mark as Received" (which just deletes the request) with a two-step flow:
  1. Requester clicks "Blood Received" button → a dialog opens asking them to enter a thank you message
  2. On confirm, calls new backend function `fulfillBloodRequest(requestId, thankYouMessage)` which marks the request fulfilled and posts a global broadcast notification: "🙏 Thank You! Blood has been received. [patient name] thanks all helpers. Message: [thankYouMsg]" visible to ALL users
- **`fulfillBloodRequest(requestId, thankYouMessage)`** backend function: marks request as fulfilled (removes from active list, adds to fulfilled list), stores the thank you message, adds global notification visible to all users.

### Modify
- **BloodRequestsPage and EmergencyRequestPage**: "Mark as Received" opens a thank-you dialog instead of silently deleting.
- **NotificationsPage**: Fetches global notifications from backend AND merges with localStorage notifications. Global notifications show with a special "📢 For Everyone" tag. Sorted by newest first.
- **All 7 dashboards**: Add "Delete Account" section at the bottom with a red danger button and confirmation dialog.
- **useNotifications hook**: Add `useGlobalNotifications()` query that fetches from backend. Merge with local notifications in NotificationsPage.
- **useQueries**: Add `useFulfillBloodRequest`, `useDeleteAccount`, `useGlobalNotifications` hooks.

### Remove
- The old `handleFulfill` in BloodRequestsPage that just calls `deleteRequest` silently — replace with the thank-you dialog flow.

## Implementation Plan

1. Update Motoko backend:
   - Add `GlobalNotification` type and stable `globalNotifications` list
   - Add `getGlobalNotifications()` query
   - Modify `createBloodRequest` to auto-add global notification with all request details
   - Add `fulfillBloodRequest(requestId, thankYouMsg)` that marks fulfilled and broadcasts thank-you global notification
   - Add `deleteAccount()` shared function that removes caller from all maps

2. Frontend — useQueries.ts:
   - Add `useGlobalNotifications()` query (calls `actor.getGlobalNotifications()`)
   - Add `useFulfillBloodRequest()` mutation
   - Add `useDeleteAccount()` mutation

3. Frontend — BloodRequestsPage.tsx:
   - Replace `handleFulfill` with a dialog: textarea for thank-you message, confirm calls `fulfillBloodRequest`
   - Keep `handleDelete` as-is for the Delete button

4. Frontend — NotificationsPage.tsx:
   - Fetch global notifications from backend via `useGlobalNotifications()`
   - Merge with localStorage notifications, deduplicate, sort by timestamp
   - Global notifications show a special "📢 Everyone" badge

5. Frontend — All dashboards + a reusable `DeleteAccountButton` component:
   - AlertDialog confirmation: "Are you sure? This will permanently delete your account and all data."
   - On confirm, calls `deleteAccount()`, clears localStorage, navigates to `/`

6. Validate and deploy
