# LIFEDROP

## Current State
Full-stack blood donation platform on ICP. Backend in Motoko, frontend in React/TypeScript. All core features (registration, blood requests, camps, notifications, leaderboard, music, splash screen) are implemented.

## Requested Changes (Diff)

### Add
- Perfect SVG ECG pulse-wave animation component used in hero, navbar, and footer

### Modify
- `access-control.mo`: return `#guest` instead of `Runtime.trap` for unregistered principals (fixes backend unavailable error)
- `useActor.ts`: wrap `_initializeAccessControlWithSecret` in try-catch so it never crashes the frontend
- `useDeviceActor.ts`: reduce retry delay (300ms base, max 5000ms) for faster registration
- `SplashScreen.tsx`: reduce animation duration from 1600ms to 700ms
- `MusicPlayer.tsx`: improve Web Audio music with richer layering and reliable play/pause
- `index.css`: add `@keyframes ecg-pulse` and `.animate-ecg-pulse` for perfect pulse wave

### Remove
- Nothing removed

## Implementation Plan
1. Fix `access-control.mo` — return `#guest` silently for unknown non-anonymous principals
2. Fix `useActor.ts` — try-catch around `_initializeAccessControlWithSecret`
3. Fix `useDeviceActor.ts` — faster retries
4. Fix `SplashScreen.tsx` — 700ms duration
5. Fix `MusicPlayer.tsx` — richer, reliable ambient music
6. Add perfect SVG ECG pulse wave animation in index.css and as a reusable component
