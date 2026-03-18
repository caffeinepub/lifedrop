import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface DonorPublicInfo {
    city: string;
    userId: Principal;
    name: string;
    lastDonationDate?: bigint;
    availability: boolean;
    bloodGroup: BloodGroup;
    totalDonations: bigint;
    phone: string;
}
export interface BloodRequest {
    id: bigint;
    urgencyLevel: UrgencyLevel;
    fulfilled: boolean;
    city: string;
    createdAt: bigint;
    bloodGroup: BloodGroup;
    patientName: string;
    fulfilledBy?: Principal;
    contactNumber: string;
    hospitalName: string;
    requesterId: Principal;
    quantityMl: bigint;
    thankYouMessage?: string;
}
export interface Notification {
    id: bigint;
    title: string;
    bloodRequestId?: bigint;
    createdBy: Principal;
    message: string;
    timestamp: bigint;
}
export interface User {
    id: Principal;
    city: string;
    name: string;
    createdAt: bigint;
    role: Role;
    email: string;
    isVerified: boolean;
    bloodGroup?: BloodGroup;
    phone: string;
}
export interface DonorProfile {
    userId: Principal;
    lastDonationDate?: bigint;
    availability: boolean;
    bloodGroup: BloodGroup;
    totalDonations: bigint;
}
export interface PublicUserEntry {
    city: string;
    name: string;
    role: Role;
    bloodGroup?: BloodGroup;
}
export interface HospitalProfile {
    isApproved: boolean;
    userId: Principal;
    address: string;
    licenseNumber: string;
    hospitalName: string;
}
export interface UserProfile {
    city: string;
    name: string;
    role: Role;
    email: string;
    bloodGroup?: BloodGroup;
    phone: string;
}
export enum BloodGroup {
    B_Negative = "B_Negative",
    AB_Positive = "AB_Positive",
    O_Positive = "O_Positive",
    A_Negative = "A_Negative",
    B_Positive = "B_Positive",
    AB_Negative = "AB_Negative",
    A_Positive = "A_Positive",
    O_Negative = "O_Negative"
}
export enum Role {
    ngo = "ngo",
    hospital = "hospital",
    patient = "patient",
    bloodBank = "bloodBank",
    admin = "admin",
    donor = "donor",
    volunteer = "volunteer"
}
export enum UrgencyLevel {
    low = "low",
    high = "high",
    critical = "critical",
    medium = "medium"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    approveHospital(hospitalId: Principal): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createBloodRequest(patientName: string, bloodGroup: BloodGroup, quantityMl: bigint, hospitalName: string, city: string, urgency: UrgencyLevel, contact: string): Promise<bigint>;
    deleteAccount(): Promise<boolean>;
    deleteBloodRequest(requestId: bigint): Promise<boolean>;
    fulfillBloodRequest(requestId: bigint, thankYouMessage: string): Promise<boolean>;
    getAllDonorsList(): Promise<Array<DonorPublicInfo>>;
    getAllHospitals(): Promise<Array<HospitalProfile>>;
    getAllUsers(): Promise<Array<User>>;
    getBloodRequests(): Promise<Array<BloodRequest>>;
    getCallerDonorProfile(): Promise<DonorProfile | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDonorProfile(userId: Principal): Promise<DonorProfile | null>;
    getGlobalNotifications(): Promise<Array<Notification>>;
    getPublicUserList(): Promise<Array<PublicUserEntry>>;
    getRoleCount(role: Role): Promise<bigint>;
    getTotalUsers(): Promise<bigint>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(name: string, email: string, phone: string, role: Role, city: string, bloodGroup: BloodGroup | null): Promise<Principal>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchDonors(bloodGroup: BloodGroup | null, city: string | null, availableOnly: boolean): Promise<Array<DonorProfile>>;
    searchDonorsPublic(bloodGroup: BloodGroup | null, city: string | null, name: string | null, availableOnly: boolean): Promise<Array<DonorPublicInfo>>;
    updateDonorAvailability(available: boolean): Promise<boolean>;
    updateHospitalProfile(licenseNumber: string, hospitalName: string, address: string): Promise<boolean>;
    updateUser(user: User): Promise<void>;
}
