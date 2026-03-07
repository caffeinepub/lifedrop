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
      return actor.getBloodRequests();
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
      if (!actor) throw new Error("Not connected");
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
      if (!actor) throw new Error("Not connected");
      return actor.acceptBloodRequest(requestId);
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
      if (!actor) throw new Error("Not connected");
      return actor.completeBloodRequest(requestId);
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
) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["donors", bloodGroup, city, availableOnly],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchDonors(bloodGroup, city, availableOnly);
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
      return actor.getAllUsers();
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
      return actor.getAllHospitals();
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
