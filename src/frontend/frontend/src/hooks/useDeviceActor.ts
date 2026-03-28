/**
 * useDeviceActor.ts
 *
 * Creates an actor using a persistent device Ed25519 keypair identity.
 * This gives each browser/device a unique stable Principal, solving the
 * "all anonymous users share 2vxsx-fae" problem in the backend.
 *
 * The backend has NO access control guards on public functions.
 */
import { useQuery } from "@tanstack/react-query";
import { createActorWithConfig } from "../config";
import { getOrCreateDeviceIdentity } from "../utils/deviceIdentity";

export function useDeviceActor() {
  const deviceQuery = useQuery({
    queryKey: ["deviceActor", "device"],
    queryFn: async () => {
      const identity = getOrCreateDeviceIdentity();
      const actor = await createActorWithConfig({
        agentOptions: { identity },
      });
      return actor;
    },
    staleTime: Number.POSITIVE_INFINITY,
    // Faster retries: 300ms, 600ms, 1200ms, 2400ms, 5000ms cap
    retry: 5,
    retryDelay: (attempt) => Math.min(300 * 2 ** attempt, 5000),
  });

  return {
    actor: deviceQuery.data ?? null,
    isFetching: deviceQuery.isFetching,
    isError: deviceQuery.isError,
    status: deviceQuery.status,
  };
}
