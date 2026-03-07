/**
 * deviceIdentity.ts
 *
 * Generates a persistent Ed25519 keypair per device/browser session.
 * Stored in localStorage so the same identity is reused across page reloads.
 * This gives every user a unique principal without requiring Internet Identity login.
 */
import { Ed25519KeyIdentity } from "@dfinity/identity";

const STORAGE_KEY = "lifedrop_device_keypair";

export function getOrCreateDeviceIdentity(): Ed25519KeyIdentity {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      // Ed25519KeyIdentity.fromJSON accepts the JSON output of identity.toJSON()
      const identity = Ed25519KeyIdentity.fromJSON(stored);
      return identity;
    }
  } catch {
    // If stored data is corrupt, generate fresh keypair
    localStorage.removeItem(STORAGE_KEY);
  }

  // Generate a new random keypair
  const identity = Ed25519KeyIdentity.generate();

  try {
    // Persist the keypair for reuse across page reloads
    localStorage.setItem(STORAGE_KEY, JSON.stringify(identity.toJSON()));
  } catch {
    // localStorage might be unavailable — use in-memory identity only
  }

  return identity;
}
