import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { BloodGroup, UrgencyLevel } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

// ─── Blood Requests ───────────────────────────────────────────
export function useBloodRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bloodRequests"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getBloodRequests();
      } catch {
        // Return empty array if system not initialized or access denied
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBloodRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (params: {
      patientName: string;
      bloodGroup: BloodGroup;
      quantityMl: bigint;
      hospitalName: string;
      city: string;
      urgency: UrgencyLevel;
      contact: string;
    }) => {
      if (!actor) throw new Error("Not connected to backend");
      // Ensure system is initialized before creating a request
      try {
        await actor.initSystem();
      } catch {
        // Already initialized — safe to ignore
      }
      return actor.createBloodRequest(
        params.patientName,
        params.bloodGroup,
        params.quantityMl,
        params.hospitalName,
        params.city,
        params.urgency,
        params.contact,
      );
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bloodRequests"] });
    },
  });
}

export function useAcceptBloodRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Not connected to backend");
      try {
        return await actor.acceptBloodRequest(requestId);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.toLowerCase().includes("permission") ||
          msg.toLowerCase().includes("access") ||
          msg.toLowerCase().includes("unauthorized")
        ) {
          throw new Error("You don't have permission to accept this request");
        }
        throw err;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bloodRequests"] });
    },
  });
}

export function useCompleteBloodRequest() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (requestId: bigint) => {
      if (!actor) throw new Error("Not connected to backend");
      try {
        return await actor.completeBloodRequest(requestId);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        if (
          msg.toLowerCase().includes("permission") ||
          msg.toLowerCase().includes("access") ||
          msg.toLowerCase().includes("unauthorized")
        ) {
          throw new Error("You don't have permission to complete this request");
        }
        throw err;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["bloodRequests"] });
    },
  });
}

// ─── Donors ──────────────────────────────────────────────────
export function useSearchDonors(
  bloodGroup: BloodGroup | null,
  city: string | null,
  availableOnly: boolean,
  enabled = true,
  searchKey = 0,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["donors", bloodGroup, city, availableOnly, searchKey],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.searchDonors(bloodGroup, city, availableOnly);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && enabled,
  });
}

export function useUpdateDonorAvailability() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (available: boolean) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateDonorAvailability(available);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["donors"] });
      qc.invalidateQueries({ queryKey: ["donorProfile"] });
    },
  });
}

// ─── Admin / Hospitals ────────────────────────────────────────
export function useAllUsers() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();
  return useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllUsers();
      } catch {
        // getAllUsers requires admin role — return empty array for non-admin users
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!identity,
  });
}

export function useAllHospitals() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allHospitals"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllHospitals();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useApproveHospital() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (hospitalId: string) => {
      if (!actor) throw new Error("Not connected");
      const { Principal } = await import("@icp-sdk/core/principal");
      return actor.approveHospital(Principal.fromText(hospitalId));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["allHospitals"] });
    },
  });
}

// ─── All Donors (public, for stats & leaderboard) ────────────
export function useAllDonors() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allDonors"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.searchDonors(null, null, false);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 30000,
  });
}

// ─── Caller Donor Profile ─────────────────────────────────────
export function useCallerDonorProfile() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["callerDonorProfile"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerDonorProfile();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

// ─── Public User List (no auth required) ─────────────────────
export function usePublicUserList() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["publicUserList"],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getPublicUserList();
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000,
  });
}

// ─── Total Users Count (no auth required) ────────────────────
export function useTotalUsers() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["totalUsers"],
    queryFn: async () => {
      if (!actor) return 0n;
      try {
        return await actor.getTotalUsers();
      } catch {
        return 0n;
      }
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 15000,
  });
}

// ─── Public Donor Search (with name, phone, city) ─────────────
export function useSearchDonorsPublic(
  bloodGroup: BloodGroup | null,
  city: string | null,
  name: string | null,
  availableOnly: boolean,
  enabled = true,
  searchKey = 0,
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: [
      "donorsPublic",
      bloodGroup,
      city,
      name,
      availableOnly,
      searchKey,
    ],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const results = await actor.searchDonorsPublic(
          bloodGroup,
          city,
          name,
          availableOnly,
        );
        // Ensure totalDonations is always a number/bigint to prevent display issues
        return results.map((d) => ({
          ...d,
          totalDonations: BigInt(d.totalDonations ?? 0),
          phone: d.phone ?? "",
          name: d.name ?? "",
          city: d.city ?? "",
        }));
      } catch (err) {
        console.error("searchDonorsPublic error:", err);
        return [];
      }
    },
    enabled: !!actor && !isFetching && enabled,
    staleTime: 0,
    gcTime: 0,
  });
}
