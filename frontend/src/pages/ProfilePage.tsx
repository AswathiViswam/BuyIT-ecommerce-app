import { useState } from "react";
import { Link } from "react-router-dom";
import { useUserProfile } from "../api/useUserProfile";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../api/useOrders";
import { useAppDispatch } from "../store/hooks";
import { showToast } from "../store/slices/uiSlice";
import type { Address } from "../types/user";
import type { Order } from "../types/order";

export function ProfilePage() {
  const { user, logout } = useAuth();
  const {
    addresses,
    updateProfile,
    isUpdatingProfile,
    changePassword,
    isChangingPassword,
    addAddress,
    isAddingAddress,
    deleteAddress,
  } = useUserProfile();
  const { orders } = useOrders();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<"info" | "password" | "addresses" | "orders">("info");

  // Profile fields state
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  // Password fields state
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Address fields state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || "",
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: user?.phone || "",
  });

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      dispatch(showToast({ message: "Profile updated successfully!", type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.message || "Failed to update profile", type: "error" }));
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      dispatch(showToast({ message: "New passwords do not match", type: "error" }));
      return;
    }

    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
      dispatch(showToast({ message: "Password updated successfully!", type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.message || "Failed to change password", type: "error" }));
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addAddress({ ...newAddr, isDefault: addresses.length === 0 });
      setShowAddressModal(false);
      setNewAddr({ fullName: user?.name || "", street: "", city: "", state: "", zip: "", phone: "" });
      dispatch(showToast({ message: "Address added successfully!", type: "success" }));
    } catch (err: any) {
      dispatch(showToast({ message: err.response?.data?.message || "Failed to add address", type: "error" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* User Banner Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-3xl p-6 sm:p-10 text-white flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl font-black border border-white/20 shadow-inner overflow-hidden">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt={user?.name} className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name[0].toUpperCase() : "U"
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black">{user?.name}</h1>
              <p className="text-sm text-indigo-100">{user?.email}</p>
              <span className="inline-block mt-2 text-[10px] uppercase font-black tracking-wider bg-white/20 px-3 py-1 rounded-full">
                {user?.role || "Customer"} Account
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="bg-white/10 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-2xl text-xs backdrop-blur-md border border-white/20 transition duration-200"
          >
            Sign Out
          </button>
        </div>

        {/* Profile Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Navigation Tabs Column */}
          <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-3 space-y-1 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("info")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition text-left ${
                activeTab === "info"
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span>👤</span> Personal Information
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("addresses")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition text-left ${
                activeTab === "addresses"
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span>📍</span> Saved Addresses ({addresses.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("password")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition text-left ${
                activeTab === "password"
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span>🔒</span> Change Password
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition text-left ${
                activeTab === "orders"
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span>📦</span> Order History ({orders.length})
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="md:col-span-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 sm:p-8 shadow-xs">
            
            {/* 1. Personal Information Tab */}
            {activeTab === "info" && (
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Edit Personal Profile</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl text-sm text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={profileData.avatar}
                    onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {isUpdatingProfile ? "Saving Changes..." : "Save Profile Details"}
                </button>
              </form>
            )}

            {/* 2. Change Password Tab */}
            {activeTab === "password" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Security & Password</h3>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwords.currentPassword}
                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-2xl text-xs shadow-md transition disabled:opacity-50"
                >
                  {isChangingPassword ? "Updating..." : "Change Password"}
                </button>
              </form>
            )}

            {/* 3. Saved Addresses Tab */}
            {activeTab === "addresses" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Saved Delivery Addresses</h3>
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-md"
                  >
                    + Add Address
                  </button>
                </div>

                {/* Address Cards */}
                {addresses.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">No addresses saved yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {addresses.map((addr: Address) => (
                      <div
                        key={addr.id}
                        className="p-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 text-xs space-y-2 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-sm text-gray-900 dark:text-white">{addr.full_name}</span>
                            {addr.is_default === 1 && (
                              <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded">DEFAULT</span>
                            )}
                          </div>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{addr.street}, {addr.city}, {addr.state} - {addr.zip}</p>
                          <p className="text-gray-400">Phone: {addr.phone}</p>
                        </div>

                        <button
                          type="button"
                          onClick={() => deleteAddress(addr.id)}
                          className="text-rose-600 font-bold text-left hover:underline pt-2"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Address Modal */}
                {showAddressModal && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold dark:text-white">Add Delivery Address</h4>
                        <button onClick={() => setShowAddressModal(false)} className="text-gray-400 font-bold">✕</button>
                      </div>

                      <form onSubmit={handleAddressSubmit} className="space-y-3">
                        <input
                          type="text"
                          required
                          placeholder="Full Name"
                          value={newAddr.fullName}
                          onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs dark:text-white"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number"
                          value={newAddr.phone}
                          onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs dark:text-white"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Street Address"
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs dark:text-white"
                        />
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            required
                            placeholder="City"
                            value={newAddr.city}
                            onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs dark:text-white"
                          />
                          <input
                            type="text"
                            required
                            placeholder="State"
                            value={newAddr.state}
                            onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs dark:text-white"
                          />
                          <input
                            type="text"
                            required
                            placeholder="PIN"
                            value={newAddr.zip}
                            onChange={(e) => setNewAddr({ ...newAddr, zip: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border rounded-xl text-xs dark:text-white"
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddressModal(false)}
                            className="px-4 py-2 text-xs font-bold text-gray-500"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={isAddingAddress}
                            className="bg-indigo-600 text-white text-xs font-bold px-5 py-2 rounded-xl"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 4. Orders History Tab */}
            {activeTab === "orders" && (
              <div className="space-y-4">
                <h3 className="text-lg font-black text-gray-900 dark:text-white mb-4">Past Purchases</h3>
                {orders.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center">No orders found.</p>
                ) : (
                  <div className="space-y-3">
                    {orders.map((o: Order) => (
                      <div key={o.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 flex items-center justify-between gap-4 text-xs">
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white text-sm block">Order #ORD-{o.id}</span>
                          <span className="text-gray-400">{new Date(o.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-indigo-600 dark:text-indigo-400 text-sm block">₹{o.total_amount.toLocaleString()}</span>
                          <Link to={`/orders/${o.id}`} className="font-bold text-indigo-600 hover:underline">
                            View Receipt →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}

export default ProfilePage;
