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
    retry: 8,
    retryDelay: (attempt) => Math.min(2000 * 2 ** attempt, 30000),
  });

  return {
    actor: deviceQuery.data ?? null,
    isFetching: deviceQuery.isFetching,
    isError: deviceQuery.isError,
    status: deviceQuery.status,
  };
}
