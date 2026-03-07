import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import List "mo:core/List";
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

  public type UrgencyLevel = {
    #low;
    #medium;
    #high;
    #critical;
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

  public type BloodRequestStatus = {
    #pending;
    #accepted;
    #completed;
    #cancelled;
  };

  public type HospitalProfile = {
    userId : Principal;
    licenseNumber : Text;
    hospitalName : Text;
    address : Text;
    isApproved : Bool;
  };

  module User {
    public func compare(user1 : User, user2 : User) : Order.Order {
      Text.compare(user1.name, user2.name);
    };
  };

  let bloodRequests = List.empty<BloodRequest>();
  let users = Map.empty<Principal, User>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  let donorProfiles = Map.empty<Principal, DonorProfile>();
  let hospitalProfiles = Map.empty<Principal, HospitalProfile>();
  var nextRequestId = 0;
  var initialized = false;

  public shared ({ caller }) func initSystem() : async () {
    if (initialized) { Runtime.trap("System already initialized") };
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
    
    initialized := true;
  };

  // User Profile Management (Required by Frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
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
    
    // Update the main user record if it exists
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

  // User Registration and Management
  public shared ({ caller }) func registerUser(name : Text, email : Text, phone : Text, role : Role, city : Text, bloodGroup : ?BloodGroup) : async Principal {
    if (not initialized) { Runtime.trap("System not initialized") };
    if (users.containsKey(caller)) { Runtime.trap("This user is already registered.") };
    
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
    
    caller;
  };

  public query ({ caller }) func getUser(userId : Principal) : async User {
    // Users can view their own profile, admins can view any profile
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own user data");
    };
    
    switch (users.get(userId)) {
      case (null) { Runtime.trap("User does not exist") };
      case (?user) { user };
    };
  };

  public shared ({ caller }) func updateUser(user : User) : async () {
    // Only the user themselves or an admin can update user data
    if (caller != user.id and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only update your own user data");
    };
    
    users.add(user.id, user);
  };

  public query ({ caller }) func getAllUsers() : async [User] {
    // Admin only
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    users.values().toArray();
  };

  // Blood Request Management
  public shared ({ caller }) func createBloodRequest(patientName : Text, bloodGroup : BloodGroup, quantityMl : Nat, hospitalName : Text, city : Text, urgency : UrgencyLevel, contact : Text) : async Nat {
    if (not initialized) { Runtime.trap("System not initialized") };
    
    // Only registered users can create blood requests
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can create blood requests");
    };
    
    // Verify the caller is registered
    if (not users.containsKey(caller)) {
      Runtime.trap("User must be registered to create blood requests");
    };

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
    // Anyone can view blood requests (public information for emergency purposes)
    bloodRequests.toArray();
  };

  // Donor Profile Management
  public shared ({ caller }) func updateDonorAvailability(available : Bool) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update donor availability");
    };
    
    // Verify user is a donor
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
              case null { Runtime.trap("Donor profile not found") };
            };
          };
          case _ { Runtime.trap("Only donors can update availability") };
        };
      };
      case null { Runtime.trap("User not found") };
    };
  };

  public query ({ caller }) func getDonorProfile(userId : Principal) : async ?DonorProfile {
    // Anyone can view donor profiles (public for matching purposes)
    donorProfiles.get(userId);
  };

  public query ({ caller }) func searchDonors(bloodGroup : ?BloodGroup, city : ?Text, availableOnly : Bool) : async [DonorProfile] {
    // Anyone can search for donors (public for emergency purposes)
    let allDonors = donorProfiles.values().toArray();
    
    allDonors.filter(func(donor : DonorProfile) : Bool {
      let bloodGroupMatch = switch (bloodGroup) {
        case (?bg) { donor.bloodGroup == bg };
        case null { true };
      };
      
      let availabilityMatch = if (availableOnly) { donor.availability } else { true };
      
      let cityMatch = switch (city) {
        case (?c) {
          switch (users.get(donor.userId)) {
            case (?user) { user.city == c };
            case null { false };
          };
        };
        case null { true };
      };
      
      bloodGroupMatch and availabilityMatch and cityMatch;
    });
  };

  // Hospital Management
  public shared ({ caller }) func approveHospital(hospitalId : Principal) : async Bool {
    // Admin only
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
      case null { Runtime.trap("Hospital profile not found") };
    };
  };

  public query ({ caller }) func getAllHospitals() : async [HospitalProfile] {
    // Anyone can view hospitals (public information)
    hospitalProfiles.values().toArray();
  };

  // Blood Request Actions
  public shared ({ caller }) func acceptBloodRequest(requestId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can accept blood requests");
    };
    
    // Verify user is a donor
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#donor) { true };
          case _ { Runtime.trap("Only donors can accept blood requests") };
        };
      };
      case null { Runtime.trap("User not found") };
    };
  };

  public shared ({ caller }) func completeBloodRequest(requestId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only registered users can complete blood requests");
    };
    
    // Verify user is hospital or admin
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#hospital) { true };
          case (#admin) { true };
          case _ { Runtime.trap("Only hospitals or admins can complete blood requests") };
        };
      };
      case null { Runtime.trap("User not found") };
    };
  };
};
