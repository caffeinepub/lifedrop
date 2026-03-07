import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
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

  type AppUser = {
    user : User;
    profile : UserProfile;
    donor : ?DonorProfile;
  };

  let users = Map.empty<Principal, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let donorProfiles = Map.empty<Principal, DonorProfile>();
  let hospitalProfiles = Map.empty<Principal, HospitalProfile>();
  let bloodRequests = List.empty<BloodRequest>();

  var nextRequestId = 0;
  var initialized = false;

  module User {
    public func compare(user1 : User, user2 : User) : Order.Order {
      Text.compare(user1.name, user2.name);
    };
  };

  module DonorProfile {
    public func compare(dp1 : DonorProfile, dp2 : DonorProfile) : Order.Order {
      dp1.userId.compare(dp2.userId);
    };
  };

  public shared ({ caller }) func initSystem() : async () {
    if (initialized) { return () };
    initialized := true;
    let adminUser : User = {
      id = caller;
      name = "Administrator";
      email = "admin@lifedrop.com";
      phone = "000-000-0000";
      role = #admin;
      city = "Global";
      bloodGroup = null;
      isVerified = true;
      createdAt = Time.now();
    };
    users.add(caller, adminUser);
    let adminProfile : UserProfile = {
      name = "Administrator";
      email = "admin@lifedrop.com";
      phone = "000-000-0000";
      role = #admin;
      city = "Global";
      bloodGroup = null;
    };
    userProfiles.add(caller, adminProfile);
  };

  public shared ({ caller }) func registerUser(name : Text, email : Text, phone : Text, role : Role, city : Text, bloodGroup : ?BloodGroup) : async Principal {
    if (users.containsKey(caller)) {
      Runtime.trap("This user is already registered.");
    };

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

    if (role == #donor) {
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
    caller;
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
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
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);

    switch (users.get(caller)) {
      case (?existingUser) {
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
      case null {};
    };
  };

  public shared ({ caller }) func updateUser(user : User) : async () {
    if (caller != user.id and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own user data");
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

  public query ({ caller }) func searchDonors(bloodGroup : ?BloodGroup, city : ?Text, availableOnly : Bool) : async [DonorProfile] {
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

  public query ({ caller }) func searchDonorsPublic(bloodGroup : ?BloodGroup, city : ?Text, name : ?Text, availableOnly : Bool) : async [DonorPublicInfo] {
    let allDonors = donorProfiles.values().toArray();

    let filteredDonors = allDonors.filter(func(donor) {
      let bloodGroupMatch = switch (bloodGroup) {
        case (?bg) { donor.bloodGroup == bg };
        case (null) { true };
      };

      let cityMatch = switch (city) {
        case (?c) {
          switch (users.get(donor.userId)) {
            case (?user) {
              user.city.toLower().contains(#text(c.toLower()));
            };
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
            case (?user) {
              user.name.toLower().contains(#text(searchName.toLower()));
            };
            case (null) { false };
          };
        };
      };

      bloodGroupMatch and cityMatch and availabilityMatch and nameMatch;
    });

    filteredDonors.map(func(donor) {
      let (name, phone, city) = switch (users.get(donor.userId)) {
        case (?user) {
          (user.name, user.phone, user.city);
        };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update availability");
    };
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
              case (null) { Runtime.trap("Donor profile not found") };
            };
          };
          case (_) { Runtime.trap("Only donors can update availability") };
        };
      };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public query ({ caller }) func getTotalUsers() : async Nat {
    users.size();
  };

  public query ({ caller }) func getPublicUserList() : async [PublicUserEntry] {
    let publicUsers = users.values().toArray().map(
      func(user) {
        {
          name = user.name;
          role = user.role;
          city = user.city;
          bloodGroup = user.bloodGroup;
        };
      }
    );
    publicUsers;
  };

  public shared ({ caller }) func createBloodRequest(patientName : Text, bloodGroup : BloodGroup, quantityMl : Nat, hospitalName : Text, city : Text, urgency : UrgencyLevel, contact : Text) : async Nat {
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

  public query ({ caller }) func getBloodRequests() : async [BloodRequest] {
    bloodRequests.toArray();
  };

  public shared ({ caller }) func approveHospital(hospitalId : Principal) : async Bool {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can approve hospitals");
    };
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
      case (null) { Runtime.trap("Hospital profile not found") };
    };
  };

  public query ({ caller }) func getAllHospitals() : async [HospitalProfile] {
    hospitalProfiles.values().toArray();
  };

  public shared ({ caller }) func acceptBloodRequest(requestId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can accept blood requests");
    };
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#donor) { true };
          case (_) { Runtime.trap("Only donors can accept blood requests") };
        };
      };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public shared ({ caller }) func completeBloodRequest(requestId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can complete blood requests");
    };
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#hospital) { true };
          case (#admin) { true };
          case (_) { Runtime.trap("Only hospitals or admins can complete blood requests") };
        };
      };
      case (null) { Runtime.trap("User not found") };
    };
  };

  public shared ({ caller }) func upgrade() : async () {};
};
