import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Enable persistent actors and data migration using with clause
(with migration = Migration.run)
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
    fulfilled : Bool;
    fulfilledBy : ?Principal;
    thankYouMessage : ?Text;
  };

  public type Notification = {
    id : Nat;
    title : Text;
    message : Text;
    timestamp : Int;
    bloodRequestId : ?Nat;
    createdBy : Principal;
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
  var bloodRequests = Map.empty<Nat, BloodRequest>();
  let notifications = Map.empty<Nat, Notification>();
  let deletedRequestIds = Map.empty<Nat, Bool>();

  var nextRequestId = 0;
  var nextNotificationId = 0;

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

  func bloodGroupToText(bg : BloodGroup) : Text {
    switch (bg) {
      case (#A_Positive) { "A+" };
      case (#A_Negative) { "A-" };
      case (#B_Positive) { "B+" };
      case (#B_Negative) { "B-" };
      case (#AB_Positive) { "AB+" };
      case (#AB_Negative) { "AB-" };
      case (#O_Positive) { "O+" };
      case (#O_Negative) { "O-" };
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
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };
    users.values().toArray();
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getCallerDonorProfile() : async ?DonorProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view donor profiles");
    };
    donorProfiles.get(caller);
  };

  public query ({ caller }) func getDonorProfile(userId : Principal) : async ?DonorProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view donor profiles");
    };
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
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update users");
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can search donors");
    };
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
    // Public search - no authorization required
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update donor availability");
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update hospital profiles");
    };
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
    // Public statistics - no authorization required
    users.size();
  };

  public query ({ caller }) func getRoleCount(role : Role) : async Nat {
    // Public statistics - no authorization required
    users.values().toArray().filter(func(user) { user.role == role }).size();
  };

  public query ({ caller }) func getPublicUserList() : async [PublicUserEntry] {
    // Public list - no authorization required
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
    // Public list - no authorization required
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create blood requests");
    };
    let newRequestId = nextRequestId;
    nextRequestId += 1;

    let newRequest : BloodRequest = {
      id = newRequestId;
      patientName;
      bloodGroup;
      quantityMl;
      hospitalName;
      city;
      urgencyLevel = urgency;
      contactNumber = contact;
      requesterId = caller;
      createdAt = Time.now();
      fulfilled = false;
      fulfilledBy = null;
      thankYouMessage = null;
    };
    bloodRequests.add(newRequestId, newRequest);

    let notificationId = nextNotificationId;
    nextNotificationId += 1;
    let notification : Notification = {
      id = notificationId;
      title = "Blood Request Created - " # patientName;
      message = "Blood request for " # bloodGroupToText(bloodGroup) # " needed at " # hospitalName # ", " # city;
      timestamp = Time.now();
      bloodRequestId = ?newRequest.id;
      createdBy = caller;
    };
    notifications.add(notificationId, notification);

    newRequestId;
  };

  public query ({ caller }) func getBloodRequests() : async [BloodRequest] {
    // Public list - no authorization required
    bloodRequests.values().toArray().filter(func(b) { not b.fulfilled });
  };

  public shared ({ caller }) func fulfillBloodRequest(requestId : Nat, thankYouMessage : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can fulfill blood requests");
    };
    switch (users.get(caller)) {
      case (?user) {
        switch (user.role) {
          case (#donor) {
            switch (bloodRequests.get(requestId)) {
              case (?request) {
                if (not request.fulfilled) {
                  let updatedRequest : BloodRequest = {
                    id = request.id;
                    patientName = request.patientName;
                    bloodGroup = request.bloodGroup;
                    quantityMl = request.quantityMl;
                    hospitalName = request.hospitalName;
                    city = request.city;
                    urgencyLevel = request.urgencyLevel;
                    contactNumber = request.contactNumber;
                    requesterId = request.requesterId;
                    createdAt = request.createdAt;
                    fulfilled = true;
                    fulfilledBy = ?caller;
                    thankYouMessage = ?thankYouMessage;
                  };
                  bloodRequests.add(requestId, updatedRequest);

                  let completedNotificationId = nextNotificationId;
                  nextNotificationId += 1;
                  let completionNotification : Notification = {
                    id = completedNotificationId;
                    title = "Blood Request Fulfilled - " # request.patientName;
                    message = "Request completed by donor - " # thankYouMessage;
                    timestamp = Time.now();
                    bloodRequestId = ?requestId;
                    createdBy = caller;
                  };
                  notifications.add(completedNotificationId, completionNotification);
                  return true;
                } else { return false };
              };
              case (null) { false };
            };
          };
          case (_) { Runtime.trap("Unauthorized: Only donors can fulfill blood requests") };
        };
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func deleteAccount() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete their own account");
    };
    users.remove(caller);
    userProfiles.remove(caller);
    donorProfiles.remove(caller);
    hospitalProfiles.remove(caller);
    var deletedRequests = 0;
    let requestCount = bloodRequests.size();
    if (requestCount > 0) {
      let currentRequests = bloodRequests.toArray();
      for ((id, request) in currentRequests.values()) {
        if (request.requesterId == caller) {
          bloodRequests.remove(id);
          deletedRequests += 1;
        };
      };
    };
    deletedRequests > 0;
  };

  public shared ({ caller }) func deleteBloodRequest(requestId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete blood requests");
    };
    let existing = bloodRequests.get(requestId);
    switch (existing) {
      case (?request) {
        if (request.requesterId == caller) {
          bloodRequests.remove(requestId);
          return true;
        } else {
          Runtime.trap("Unauthorized: Can only delete your own blood requests");
        };
      };
      case (null) {};
    };
    false;
  };

  public query ({ caller }) func getGlobalNotifications() : async [Notification] {
    // Public notifications - no authorization required
    notifications.values().toArray();
  };

  public shared ({ caller }) func approveHospital(hospitalId : Principal) : async Bool {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
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
      case (null) { false };
    };
  };

  public query ({ caller }) func getAllHospitals() : async [HospitalProfile] {
    // Public list - no authorization required
    hospitalProfiles.values().toArray();
  };
};
