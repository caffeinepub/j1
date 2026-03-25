import Text "mo:core/Text";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  module Result {
    public func compare(result1 : Result, result2 : Result) : Order.Order {
      Nat.compare(result1.id, result2.id);
    };
  };

  type Result = {
    id : Nat;
    market_name : Text;
    time : Text;
    result_value : Text;
    date : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // Stable storage for persistence across upgrades
  stable let results = Map.empty<Nat, Result>();
  stable let userProfiles = Map.empty<Principal, UserProfile>();
  
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
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
  };

  // Market Results Functions
  
  // Add result (admin only)
  public shared ({ caller }) func addResult(result : Result) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add results");
    };
    if (results.containsKey(result.id)) {
      Runtime.trap("Result id already exists");
    };
    results.add(result.id, result);
  };

  // Update result (admin only)
  public shared ({ caller }) func updateResult(result : Result) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update results");
    };
    if (not results.containsKey(result.id)) {
      Runtime.trap("Result id does not exist");
    };
    results.add(result.id, result);
  };

  // Delete result (admin only)
  public shared ({ caller }) func deleteResult(id : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete results");
    };
    if (not results.containsKey(id)) {
      Runtime.trap("Result id does not exist");
    };
    results.remove(id);
  };

  // Get all results (public - no authorization required)
  public query ({ caller }) func getResults() : async [Result] {
    results.values().toArray().sort();
  };
};
