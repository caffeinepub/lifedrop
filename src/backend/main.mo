import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

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

  public type DonorPublicInfo = {
    userId : Principal;
    name : Text;
    phone : Text;
    city : Text;
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

  // BloodRequest type is unchanged from the original — maintains stable variable compatibility
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

  public type PublicUserEntry = {
    name : Text;
    role : Role;
    city : Text;
    bloodGroup : ?BloodGroup;
  };

  let users = Map.empty<Principal, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let donorProfiles = Map.empty<Principal, DonorProfile>();
  let hospitalProfiles = Map.empty<Principal, HospitalProfile>();
  // Keep as List to maintain stable variable type compatibility with previous version
  let bloodRequests = List.empty<BloodRequest>();
  // New Map tracks deleted request IDs (owner-only deletion)
  let deletedRequestIds = Map.empty<Nat, Bool>();

  var nextRequestId = 0;

  module DonorProfile {
    public func compare(dp1 : DonorProfile, dp2 : DonorProfile) : Order.Order {
      dp1.userId.compare(dp2.userId);
    };
  };

  module User {
    public func compare(user1 : User, user2 : User) : Order.Order {
      Text.compare(user1.name, user2.name);
    };
  };

  func isAppAdmin(caller : Principal) : Bool {
    switch (users.get(caller)) {
      case (?user) { user.role == #admin };
      case (null) { false };
    };
  };

  public shared ({ caller }) func registerUser(
    name : Text,
    email : Text,
    phone : Text,
    role : Role,
    city : Text,
    bloodGroup : ?BloodGroup,
  ) : async Principal {
    if (users.containsKey(caller)) { return caller };

    let newUser : User = {
      id = caller;
      name;
      email;
      phone;
      role;
      city;
      bloodGroup;
      isVerified = false;
      createdAt = Time.now();
    };
    users.add(caller, newUser);

    let newProfile : UserProfile = {
      name;
      email;
      phone;
      role;
      city;
      bloodGroup;
    };
    userProfiles.add(caller, newProfile);

    switch (role) {
      case (#donor) {
        switch (bloodGroup) {
          case (null) {};
          case (?bg) {
            let donorProfile : DonorProfile = {
              userId = caller;
              bloodGroup = bg;
              availability = true;
              lastDonationDate = null;
              totalDonations = 0;
            };
            donorProfiles.add(caller, donorProfile);
          };
        };
      };
      case (#hospital) {
        let hospitalProfile : HospitalProfile = {
          userId = caller;
          licenseNumber = "";
          hospitalName = name;
          address = city;
          isApproved = false;
        };
        hospitalProfiles.add(caller, hospitalProfile);
      };
      case (_) {};
    };

    caller;
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not isAppAdmin(caller)) {
      return [];
    };
    users.values().toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getCallerDonorProfile() : async ?DonorProfile {
    donorProfiles.get(caller);
  };

  public query ({ caller }) func getDonorProfile(userId : Principal) : async ?DonorProfile {
    donorProfiles.get(userId);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    switch (users.get(caller)) {
      case (?existingUser) {
        userProfiles.add(caller, profile);
        let updatedUser : User = {
          id = existingUser.id;
          name = profile.name;
          email = profile.email;
          phone = profile.phone;
          role = profile.role;
          city = profile.city;
          bloodGroup = profile.bloodGroup;
          isVerified = existingUser.isVerified;
          createdAt = existingUser.createdAt;
        };
        users.add(caller, updatedUser);
      };
      case (null) {};
    };
  };

  public shared ({ caller }) func updateUser(user : User) : async () {
    if (not isAppAdmin(caller)) {
      return;
    };
    users.add(user.id, user);
    let updatedProfile : UserProfile = {
      name = user.name;
      email = user.email;
      phone = user.phone;
      role = user.role;
      city = user.city;
      bloodGroup = user.bloodGroup;
    };
    userProfiles.add(user.id, updatedProfile);
  };

  public query ({ caller }) func searchDonors(
    bloodGroup : ?BloodGroup,
    city : ?Text,
    availableOnly : Bool,
  ) : async [DonorProfile] {
    let allDonors = donorProfiles.values().toArray();
    allDonors.filter(func(donor : DonorProfile) : Bool {
      let bloodGroupMatch = switch (bloodGroup) {
        case (?bg) { donor.bloodGroup == bg };
        case (null) { true };
      };
      let availabilityMatch = if (availableOnly) { donor.availability } else { true };
      let cityMatch = switch (city) {
        case (?c) {
          switch (users.get(donor.userId)) {
            case (?user) { user.city == c };
            case (null) { false };
          };
        };
        case (null) { true };
      };
      bloodGroupMatch and availabilityMatch and cityMatch;
    });
  };

  func caseInsensitiveContains(text : Text, search : Text) : Bool {
    let tLower = text.toLower();
    let sLower = search.toLower();
    tLower.contains(#text(sLower));
  };

  public query ({ caller }) func searchDonorsPublic(
    bloodGroup : ?BloodGroup,
    city : ?Text,
    name : ?Text,
    availableOnly : Bool,
  ) : async [DonorPublicInfo] {
    let allDonors = donorProfiles.values().toArray();
    let filteredDonors = allDonors.filter(func(donor) {
      let bloodGroupMatch = switch (bloodGroup) {
        case (?bg) { donor.bloodGroup == bg };
        case (null) { true };
      };
      let cityMatch = switch (city) {
        case (?c) {
          switch (users.get(donor.userId)) {
            case (?user) { caseInsensitiveContains(user.city, c) };
            case (null) { false };
          };
        };
        case (null) { true };
      };
      let availabilityMatch = if (availableOnly) { donor.availability } else { true };
      let nameMatch = switch (name) {
        case (null) { true };
        case (?searchName) {
          switch (users.get(donor.userId)) {
            case (?user) { caseInsensitiveContains(user.name, searchName) };
            case (null) { false };
          };
        };
      };
      bloodGroupMatch and cityMatch and availabilityMatch and nameMatch;
    });
    filteredDonors.map(func(donor) {
      let (name, phone, city) = switch (users.get(donor.userId)) {
        case (?user) { (user.name, user.phone, user.city) };
        case (null) { ("", "", "Unknown") };
      };
      {
        userId = donor.userId;
        name;
        phone;
        city;
        bloodGroup = donor.bloodGroup;
        availability = donor.availability;
        lastDonationDate = donor.lastDonationDate;
        totalDonations = donor.totalDonations;
      };
    });
  };

  public shared ({ caller }) func updateDonorAvailability(available : Bool) : async Bool {
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#donor) {
            switch (donorProfiles.get(caller)) {
              case (?profile) {
                let updatedProfile : DonorProfile = {
                  userId = profile.userId;
                  bloodGroup = profile.bloodGroup;
                  availability = available;
                  lastDonationDate = profile.lastDonationDate;
                  totalDonations = profile.totalDonations;
                };
                donorProfiles.add(caller, updatedProfile);
                true;
              };
              case (null) { false };
            };
          };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func updateHospitalProfile(
    licenseNumber : Text,
    hospitalName : Text,
    address : Text,
  ) : async Bool {
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#hospital) {
            switch (hospitalProfiles.get(caller)) {
              case (?profile) {
                let updatedProfile : HospitalProfile = {
                  userId = profile.userId;
                  licenseNumber;
                  hospitalName;
                  address;
                  isApproved = profile.isApproved;
                };
                hospitalProfiles.add(caller, updatedProfile);
                true;
              };
              case (null) { false };
            };
          };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getTotalUsers() : async Nat {
    users.size();
  };

  public query ({ caller }) func getRoleCount(role : Role) : async Nat {
    users.values().toArray().filter(func(user) { user.role == role }).size();
  };

  public query ({ caller }) func getPublicUserList() : async [PublicUserEntry] {
    users.values().toArray().map(func(user) {
      {
        name = user.name;
        role = user.role;
        city = user.city;
        bloodGroup = user.bloodGroup;
      };
    });
  };

  public query ({ caller }) func getAllDonorsList() : async [DonorPublicInfo] {
    donorProfiles.values().toArray().map(func(donor) {
      let (name, phone, city) = switch (users.get(donor.userId)) {
        case (?user) { (user.name, user.phone, user.city) };
        case (null) { ("", "", "Unknown") };
      };
      {
        userId = donor.userId;
        name;
        phone;
        city;
        bloodGroup = donor.bloodGroup;
        availability = donor.availability;
        lastDonationDate = donor.lastDonationDate;
        totalDonations = donor.totalDonations;
      };
    });
  };

  public shared ({ caller }) func createBloodRequest(
    patientName : Text,
    bloodGroup : BloodGroup,
    quantityMl : Nat,
    hospitalName : Text,
    city : Text,
    urgency : UrgencyLevel,
    contact : Text,
  ) : async Nat {
    let newRequest : BloodRequest = {
      id = nextRequestId;
      patientName;
      bloodGroup;
      quantityMl;
      hospitalName;
      city;
      urgencyLevel = urgency;
      contactNumber = contact;
      requesterId = caller;
      createdAt = Time.now();
    };
    nextRequestId += 1;
    bloodRequests.add(newRequest);
    newRequest.id;
  };

  // Returns only non-deleted requests
  public query ({ caller }) func getBloodRequests() : async [BloodRequest] {
    bloodRequests.toArray().filter(func(r : BloodRequest) : Bool {
      not deletedRequestIds.containsKey(r.id);
    });
  };

  // Permanently marks a request as deleted — only the original requester can do this
  public shared ({ caller }) func deleteBloodRequest(requestId : Nat) : async Bool {
    let all = bloodRequests.toArray();
    var found = false;
    for (req in all.vals()) {
      if (req.id == requestId and req.requesterId == caller) {
        found := true;
      };
    };
    if (not found) { return false };
    deletedRequestIds.add(requestId, true);
    true;
  };

  public shared ({ caller }) func approveHospital(hospitalId : Principal) : async Bool {
    if (not isAppAdmin(caller)) { return false };
    switch (hospitalProfiles.get(hospitalId)) {
      case (?profile) {
        let updatedProfile : HospitalProfile = {
          userId = profile.userId;
          licenseNumber = profile.licenseNumber;
          hospitalName = profile.hospitalName;
          address = profile.address;
          isApproved = true;
        };
        hospitalProfiles.add(hospitalId, updatedProfile);
        true;
      };
      case (null) { false };
    };
  };

  public query ({ caller }) func getAllHospitals() : async [HospitalProfile] {
    hospitalProfiles.values().toArray();
  };

  public shared ({ caller }) func acceptBloodRequest(requestId : Nat) : async Bool {
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#donor) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func completeBloodRequest(requestId : Nat) : async Bool {
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#hospital) { true };
          case (#admin) { true };
          case (_) { false };
        };
      };
      case (null) { false };
    };
  };
};
