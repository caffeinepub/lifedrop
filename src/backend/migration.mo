import Map "mo:core/Map";
import List "mo:core/List";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Iter "mo:core/Iter";

module {
  // Type definitions for migration context
  public type Role = {
    #donor;
    #patient;
    #hospital;
    #bloodBank;
    #ngo;
    #volunteer;
    #admin;
  };

  public type BloodGroup = {
    #A_Positive;
    #A_Negative;
    #B_Positive;
    #B_Negative;
    #AB_Positive;
    #AB_Negative;
    #O_Positive;
    #O_Negative;
  };

  public type UrgencyLevel = {
    #low;
    #medium;
    #high;
    #critical;
  };

  public type User = {
    id : Principal;
    name : Text;
    email : Text;
    phone : Text;
    role : Role;
    city : Text;
    bloodGroup : ?BloodGroup;
    isVerified : Bool;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
    role : Role;
    city : Text;
    bloodGroup : ?BloodGroup;
  };

  public type DonorProfile = {
    userId : Principal;
    bloodGroup : BloodGroup;
    availability : Bool;
    lastDonationDate : ?Int;
    totalDonations : Nat;
  };

  public type HospitalProfile = {
    userId : Principal;
    licenseNumber : Text;
    hospitalName : Text;
    address : Text;
    isApproved : Bool;
  };

  public type BloodRequest = {
    id : Nat;
    patientName : Text;
    bloodGroup : BloodGroup;
    quantityMl : Nat;
    hospitalName : Text;
    city : Text;
    urgencyLevel : UrgencyLevel;
    contactNumber : Text;
    requesterId : Principal;
    createdAt : Int;
  };

  public type OldActor = {
    users : Map.Map<Principal, User>;
    userProfiles : Map.Map<Principal, UserProfile>;
    donorProfiles : Map.Map<Principal, DonorProfile>;
    hospitalProfiles : Map.Map<Principal, HospitalProfile>;
    bloodRequests : List.List<BloodRequest>;
    deletedRequestIds : Map.Map<Nat, Bool>;
    nextRequestId : Nat;
  };

  public type Notification = {
    id : Nat;
    title : Text;
    message : Text;
    timestamp : Int;
    bloodRequestId : ?Nat;
    createdBy : Principal;
  };

  public type NewBloodRequest = {
    id : Nat;
    patientName : Text;
    bloodGroup : BloodGroup;
    quantityMl : Nat;
    hospitalName : Text;
    city : Text;
    urgencyLevel : UrgencyLevel;
    contactNumber : Text;
    requesterId : Principal;
    createdAt : Int;
    fulfilled : Bool;
    fulfilledBy : ?Principal;
    thankYouMessage : ?Text;
  };

  public type NewActor = {
    users : Map.Map<Principal, User>;
    userProfiles : Map.Map<Principal, UserProfile>;
    donorProfiles : Map.Map<Principal, DonorProfile>;
    hospitalProfiles : Map.Map<Principal, HospitalProfile>;
    bloodRequests : Map.Map<Nat, NewBloodRequest>;
    notifications : Map.Map<Nat, Notification>;
    deletedRequestIds : Map.Map<Nat, Bool>;
    nextRequestId : Nat;
    nextNotificationId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let convertedRequests = Map.empty<Nat, NewBloodRequest>();
    let bloodRequestsArray = old.bloodRequests.toArray();
    for (request in bloodRequestsArray.values()) {
      convertedRequests.add(request.id, convertBloodRequest(request));
    };

    {
      users = old.users;
      userProfiles = old.userProfiles;
      donorProfiles = old.donorProfiles;
      hospitalProfiles = old.hospitalProfiles;
      bloodRequests = convertedRequests;
      notifications = Map.empty<Nat, Notification>();
      deletedRequestIds = old.deletedRequestIds;
      nextRequestId = old.nextRequestId;
      nextNotificationId = 0;
    };
  };

  public func convertBloodRequest(oldRequest : BloodRequest) : NewBloodRequest {
    {
      id = oldRequest.id;
      patientName = oldRequest.patientName;
      bloodGroup = oldRequest.bloodGroup;
      quantityMl = oldRequest.quantityMl;
      hospitalName = oldRequest.hospitalName;
      city = oldRequest.city;
      urgencyLevel = oldRequest.urgencyLevel;
      contactNumber = oldRequest.contactNumber;
      requesterId = oldRequest.requesterId;
      createdAt = oldRequest.createdAt;
      fulfilled = false;
      fulfilledBy = null;
      thankYouMessage = null;
    };
  };
};
