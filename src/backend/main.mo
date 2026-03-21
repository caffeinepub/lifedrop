import Int "mo:core/Int";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
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
  let bloodInventoryMap = Map.empty<Principal, [(BloodGroup, Nat)]>();
  // Kept for stable variable compatibility with previous canister version
  let deletedRequestIds = Map.empty<Nat, Bool>();

  var nextRequestId = 0;
  var nextNotificationId = 0;

  // -------------------------------------------------------
  // Helpers
  // -------------------------------------------------------
  func isRegisteredUser(caller : Principal) : Bool {
    if (caller.isAnonymous()) { return false };
    users.containsKey(caller);
  };

  func isAppAdmin(caller : Principal) : Bool {
    if (caller.isAnonymous()) { return false };
    switch (users.get(caller)) {
      case (?user) { user.role == #admin };
      case (null) { false };
    };
  };

  func getUserRole(caller : Principal) : ?Role {
    switch (users.get(caller)) {
      case (?user) { ?user.role };
      case (null) { null };
    };
  };

  // Anyone who posted (same device principal) can delete their own request.
  // Hospital, Blood Bank, NGO, Admin can delete any request.
  func canDeleteBloodRequest(caller : Principal, req : BloodRequest) : Bool {
    if (caller.isAnonymous()) { return false };
    if (req.requesterId == caller) { return true };
    switch (getUserRole(caller)) {
      case (?#hospital) { true };
      case (?#bloodBank) { true };
      case (?#ngo) { true };
      case (?#admin) { true };
      case (_) { false };
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

  func urgencyToText(u : UrgencyLevel) : Text {
    switch (u) {
      case (#low) { "Low" };
      case (#medium) { "Medium" };
      case (#high) { "High" };
      case (#critical) { "Critical" };
    };
  };

  // -------------------------------------------------------
  // Register user
  // -------------------------------------------------------
  public shared ({ caller }) func registerUser(
    name : Text,
    email : Text,
    phone : Text,
    role : Role,
    city : Text,
    bloodGroup : ?BloodGroup,
  ) : async Principal {
    if (caller.isAnonymous()) { return caller };
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

  // -------------------------------------------------------
  // Profile queries
  // -------------------------------------------------------
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (caller.isAnonymous()) { return null };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getCallerDonorProfile() : async ?DonorProfile {
    if (caller.isAnonymous()) { return null };
    donorProfiles.get(caller);
  };

  public query ({ caller }) func getDonorProfile(userId : Principal) : async ?DonorProfile {
    donorProfiles.get(userId);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not isRegisteredUser(caller)) { return };
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

  // -------------------------------------------------------
  // Admin
  // -------------------------------------------------------
  public query ({ caller }) func getAllUsers() : async [User] {
    if (not isAppAdmin(caller)) { return [] };
    users.values().toArray();
  };

  public shared ({ caller }) func updateUser(user : User) : async () {
    if (not isAppAdmin(caller)) { return };
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

  public shared ({ caller }) func approveHospital(hospitalId : Principal) : async Bool {
    if (not isAppAdmin(caller)) { return false };
    switch (hospitalProfiles.get(hospitalId)) {
      case (?profile) {
        let updated : HospitalProfile = {
          userId = profile.userId;
          licenseNumber = profile.licenseNumber;
          hospitalName = profile.hospitalName;
          address = profile.address;
          isApproved = true;
        };
        hospitalProfiles.add(hospitalId, updated);
        true;
      };
      case (null) { false };
    };
  };

  // -------------------------------------------------------
  // Donor search
  // -------------------------------------------------------
  func caseInsensitiveContains(text : Text, search : Text) : Bool {
    if (search == "") { return true };
    text.toLower().contains(#text(search.toLower()));
  };

  public query ({ caller }) func searchDonors(
    bloodGroup : ?BloodGroup,
    city : ?Text,
    availableOnly : Bool,
  ) : async [DonorProfile] {
    donorProfiles.values().toArray().filter(func(donor : DonorProfile) : Bool {
      let bgMatch = switch (bloodGroup) {
        case (?bg) { donor.bloodGroup == bg };
        case (null) { true };
      };
      let avMatch = if (availableOnly) { donor.availability } else { true };
      let cityMatch = switch (city) {
        case (?c) {
          if (c == "") { true } else {
            switch (users.get(donor.userId)) {
              case (?u) { caseInsensitiveContains(u.city, c) };
              case (null) { false };
            };
          };
        };
        case (null) { true };
      };
      bgMatch and avMatch and cityMatch;
    });
  };

  public query ({ caller }) func searchDonorsPublic(
    bloodGroup : ?BloodGroup,
    city : ?Text,
    name : ?Text,
    availableOnly : Bool,
  ) : async [DonorPublicInfo] {
    donorProfiles.values().toArray().filter(func(donor) {
      let bgMatch = switch (bloodGroup) {
        case (?bg) { donor.bloodGroup == bg };
        case (null) { true };
      };
      let cityMatch = switch (city) {
        case (?c) {
          switch (users.get(donor.userId)) {
            case (?u) { caseInsensitiveContains(u.city, c) };
            case (null) { false };
          };
        };
        case (null) { true };
      };
      let avMatch = if (availableOnly) { donor.availability } else { true };
      let nameMatch = switch (name) {
        case (null) { true };
        case (?n) {
          if (n == "") { true } else {
            switch (users.get(donor.userId)) {
              case (?u) { caseInsensitiveContains(u.name, n) };
              case (null) { false };
            };
          };
        };
      };
      bgMatch and cityMatch and avMatch and nameMatch;
    }).map(func(donor) {
      let (uName, uPhone, uCity) = switch (users.get(donor.userId)) {
        case (?u) { (u.name, u.phone, u.city) };
        case (null) { ("", "", "") };
      };
      {
        userId = donor.userId;
        name = uName;
        phone = uPhone;
        city = uCity;
        bloodGroup = donor.bloodGroup;
        availability = donor.availability;
        lastDonationDate = donor.lastDonationDate;
        totalDonations = donor.totalDonations;
      };
    });
  };

  public query ({ caller }) func getAllDonorsList() : async [DonorPublicInfo] {
    donorProfiles.values().toArray().map(func(donor) {
      let (uName, uPhone, uCity) = switch (users.get(donor.userId)) {
        case (?u) { (u.name, u.phone, u.city) };
        case (null) { ("", "", "") };
      };
      {
        userId = donor.userId;
        name = uName;
        phone = uPhone;
        city = uCity;
        bloodGroup = donor.bloodGroup;
        availability = donor.availability;
        lastDonationDate = donor.lastDonationDate;
        totalDonations = donor.totalDonations;
      };
    });
  };

  public shared ({ caller }) func updateDonorAvailability(available : Bool) : async Bool {
    if (not isRegisteredUser(caller)) { return false };
    switch (donorProfiles.get(caller)) {
      case (?profile) {
        let updated : DonorProfile = {
          userId = profile.userId;
          bloodGroup = profile.bloodGroup;
          availability = available;
          lastDonationDate = profile.lastDonationDate;
          totalDonations = profile.totalDonations;
        };
        donorProfiles.add(caller, updated);
        true;
      };
      case (null) { false };
    };
  };

  // -------------------------------------------------------
  // Hospital profile & inventory
  // -------------------------------------------------------
  public shared ({ caller }) func updateHospitalProfile(
    licenseNumber : Text,
    hospitalName : Text,
    address : Text,
  ) : async Bool {
    if (not isRegisteredUser(caller)) { return false };
    switch (hospitalProfiles.get(caller)) {
      case (?profile) {
        let updated : HospitalProfile = {
          userId = profile.userId;
          licenseNumber;
          hospitalName;
          address;
          isApproved = profile.isApproved;
        };
        hospitalProfiles.add(caller, updated);
        true;
      };
      case (null) { false };
    };
  };

  public shared ({ caller }) func updateBloodInventory(inventory : [(BloodGroup, Nat)]) : async Bool {
    if (not isRegisteredUser(caller)) { return false };
    bloodInventoryMap.add(caller, inventory);
    true;
  };

  public query ({ caller }) func getMyBloodInventory() : async [(BloodGroup, Nat)] {
    if (caller.isAnonymous()) { return [] };
    switch (bloodInventoryMap.get(caller)) {
      case (?inv) { inv };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getMyHospitalProfile() : async ?HospitalProfile {
    if (caller.isAnonymous()) { return null };
    hospitalProfiles.get(caller);
  };

  public query ({ caller }) func getAllHospitals() : async [HospitalProfile] {
    hospitalProfiles.values().toArray();
  };

  // -------------------------------------------------------
  // Public stats
  // -------------------------------------------------------
  public query ({ caller }) func getTotalUsers() : async Nat {
    users.size();
  };

  public query ({ caller }) func getRoleCount(role : Role) : async Nat {
    users.values().toArray().filter(func(u) { u.role == role }).size();
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

  // -------------------------------------------------------
  // Blood Requests
  // Anyone with a non-anonymous device identity can post a blood request.
  // Registration is NOT required — guests, volunteers, NGOs, hospitals, anyone.
  // -------------------------------------------------------
  public shared ({ caller }) func createBloodRequest(
    patientName : Text,
    bloodGroup : BloodGroup,
    quantityMl : Nat,
    hospitalName : Text,
    city : Text,
    urgency : UrgencyLevel,
    contact : Text,
  ) : async Nat {
    // Only block truly anonymous callers (no device identity)
    if (caller.isAnonymous()) { return 0 };

    let id = nextRequestId;
    nextRequestId += 1;

    let req : BloodRequest = {
      id;
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
    bloodRequests.add(id, req);

    // Broadcast emergency notification to all users
    let notifId = nextNotificationId;
    nextNotificationId += 1;
    let notif : Notification = {
      id = notifId;
      title = "Emergency Blood Request — " # bloodGroupToText(bloodGroup);
      message = "Patient: " # patientName # " | Blood: " # bloodGroupToText(bloodGroup) # " | Hospital: " # hospitalName # " | City: " # city # " | Urgency: " # urgencyToText(urgency) # " | Contact: " # contact;
      timestamp = Time.now();
      bloodRequestId = ?id;
      createdBy = caller;
    };
    notifications.add(notifId, notif);

    id + 1; // >0 = success
  };

  public query ({ caller }) func getBloodRequests() : async [BloodRequest] {
    bloodRequests.values().toArray().filter(func(b) { not b.fulfilled });
  };

  // Only the original poster (any device identity) or hospital/NGO/blood bank can fulfill.
  public shared ({ caller }) func fulfillBloodRequest(requestId : Nat, thankYouMessage : Text) : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (bloodRequests.get(requestId)) {
      case (?req) {
        if (req.requesterId != caller) { return false };
        if (req.fulfilled) { return false };
        let updated : BloodRequest = {
          id = req.id;
          patientName = req.patientName;
          bloodGroup = req.bloodGroup;
          quantityMl = req.quantityMl;
          hospitalName = req.hospitalName;
          city = req.city;
          urgencyLevel = req.urgencyLevel;
          contactNumber = req.contactNumber;
          requesterId = req.requesterId;
          createdAt = req.createdAt;
          fulfilled = true;
          fulfilledBy = ?caller;
          thankYouMessage = ?thankYouMessage;
        };
        bloodRequests.add(requestId, updated);

        let notifId = nextNotificationId;
        nextNotificationId += 1;
        let notif : Notification = {
          id = notifId;
          title = "🩸 Blood Received — Thank You!";
          message = "Blood received for patient " # req.patientName # "! " # (if (thankYouMessage == "") { "Thank you to all helpers!" } else { thankYouMessage });
          timestamp = Time.now();
          bloodRequestId = ?requestId;
          createdBy = caller;
        };
        notifications.add(notifId, notif);
        true;
      };
      case (null) { false };
    };
  };

  // Delete a blood request — allowed by: the original poster (any device), hospital, blood bank, NGO, admin.
  // Also removes all associated notifications so they disappear from everyone's feed.
  public shared ({ caller }) func deleteBloodRequest(requestId : Nat) : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (bloodRequests.get(requestId)) {
      case (?req) {
        if (not canDeleteBloodRequest(caller, req)) { return false };
        bloodRequests.remove(requestId);
        // Delete all notifications linked to this blood request
        let linkedNotifIds = notifications.values().toArray()
          .filter(func(n : Notification) : Bool {
            switch (n.bloodRequestId) {
              case (?rid) { rid == requestId };
              case (null) { false };
            };
          })
          .map(func(n : Notification) : Nat { n.id });
        for (nid in linkedNotifIds.vals()) {
          notifications.remove(nid);
        };
        true;
      };
      case (null) { false };
    };
  };

  // Permanently delete a global notification
  public shared ({ caller }) func deleteGlobalNotification(notifId : Nat) : async Bool {
    if (caller.isAnonymous()) { return false };
    switch (notifications.get(notifId)) {
      case (?_) {
        notifications.remove(notifId);
        true;
      };
      case (null) { false };
    };
  };

  // -------------------------------------------------------
  // Delete Account
  // -------------------------------------------------------
  public shared ({ caller }) func deleteAccount() : async Bool {
    if (not isRegisteredUser(caller)) { return false };
    users.remove(caller);
    userProfiles.remove(caller);
    donorProfiles.remove(caller);
    hospitalProfiles.remove(caller);
    bloodInventoryMap.remove(caller);
    let toDelete = bloodRequests.values().toArray()
      .filter(func(r : BloodRequest) : Bool { r.requesterId == caller })
      .map(func(r : BloodRequest) : Nat { r.id });
    for (id in toDelete.vals()) {
      bloodRequests.remove(id);
    };
    true;
  };

  // -------------------------------------------------------
  // Notifications
  // -------------------------------------------------------
  public query ({ caller }) func getGlobalNotifications() : async [Notification] {
    notifications.values().toArray();
  };

  public shared ({ caller }) func createCampNotification(title : Text, message : Text) : async Bool {
    if (caller.isAnonymous()) { return false };
    let notifId = nextNotificationId;
    nextNotificationId += 1;
    let notif : Notification = {
      id = notifId;
      title;
      message;
      timestamp = Time.now();
      bloodRequestId = null;
      createdBy = caller;
    };
    notifications.add(notifId, notif);
    true;
  };
};
