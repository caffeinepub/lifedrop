/**
 * useDeviceActor.ts
 *
 * Creates an actor using a persistent device Ed25519 keypair identity.
 * This gives each browser/device a unique stable Principal, solving the
 * "all anonymous users share 2vxsx-fae" problem in the backend.
 *
 * Use this hook ONLY for registration calls that need a unique identity.
 * Read-only queries can continue to use useActor (anonymous is fine for reads).
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
  });

  return {
    actor: deviceQuery.data ?? null,
    isFetching: deviceQuery.isFetching,
  };
}
