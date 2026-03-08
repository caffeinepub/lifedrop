# LIFEDROP

## Current State
A blood donor and emergency blood request platform with 7 role dashboards (Donor, Patient, Hospital, Blood Bank, NGO, Volunteer, Admin), donor search, emergency requests, blog, and camps. The Motoko backend uses HashMap storage and principal-based identity via a device keypair per browser.

## Requested Changes (Diff)

### Add
- URL param support on `/register` page so clicking "Hospital Registration" on homepage navigates to `/register?role=hospital` and auto-selects the Hospital tab

### Modify
- **Backend**: Remove `AccessControl.hasPermission` checks from `searchDonors`, `getBloodRequests`, `getAllHospitals`, `getTotalUsers`, `getRoleCount` — these currently throw for anonymous callers, causing "backend temporarily unavailable" errors. Make them open queries with no auth gate.
- **Backend**: `saveCallerUserProfile` currently traps if caller not in users — change to upsert (always save, even for new callers)
- **Homepage** (`HomePage.tsx`): "Register Hospital" button (`<Link to="/register">`) should navigate to `/register?role=hospital` 
- **RegisterPage** (`RegisterPage.tsx`): Read `role` query param on mount and set `activeTab` to that role if valid
- **BlogPage** (`BlogPage.tsx`): Remove all `readTime` display ("5 min read", "8 min read", etc.) — remove Clock icon and readTime text from featured post and all grid cards

### Remove
- Reading time (Clock icon + readTime text) from BlogPage entirely

## Implementation Plan
1. Update `RegisterPage.tsx` to read `?role=hospital` (or other role) from URL search params and set initial tab accordingly
2. Update `HomePage.tsx` "Register Hospital" link from `to="/register"` to `to="/register?role=hospital"`  
3. Update `BlogPage.tsx` to remove Clock import, readTime field from posts array, and all readTime rendering
4. The Motoko backend auth issues — frontend workaround: ensure all backend calls that can fail for anonymous callers have proper try/catch returning empty arrays (already done in useQueries.ts hooks). The key fix is to make sure `getBloodRequests()` is called with the device actor (which has a registered principal) not the anonymous actor — or guard it so it doesn't throw.
