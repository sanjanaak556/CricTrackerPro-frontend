import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { Sun, Moon, ArrowLeft } from "lucide-react";
import defaultAvatar from "../assets/avatar_img.jpg";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    profileImage: "",
    role: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [newImageFile, setNewImageFile] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );

  // ---------------------------------------------------------
  // FETCH CURRENT USER
  // ---------------------------------------------------------
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get("/users/me");

        setProfile({
          name: res.name,
          email: res.email,
          profileImage: res.profileImage,
          role: res.role?.roleName,
        });

        setPreviewImage(res.profileImage);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };
    loadProfile();
  }, []);

  // ---------------------------------------------------------
  // SELECT NEW IMAGE
  // ---------------------------------------------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // ---------------------------------------------------------
  // UPDATE PROFILE (COMMON ENDPOINT FOR ALL ROLES)
  // ---------------------------------------------------------
  const handleProfileUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);

      if (newImageFile) {
        formData.append("image", newImageFile);
      }

      // ⭐ FIXED: single endpoint for Admin, Scorer, Viewer
      await api.put("/users/me", formData);

      alert("Profile updated successfully!");
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.message || "Profile update failed");
    }
  };

  // ---------------------------------------------------------
  // REMOVE PROFILE IMAGE
  // ---------------------------------------------------------
  const handleRemoveImage = async () => {
    try {
      await api.delete("/users/me/image");
      alert("Profile image removed!");
      setProfile({ ...profile, profileImage: null });
      setPreviewImage(null);
    } catch (err) {
      alert("Failed to remove image");
    }
  };

  // ---------------------------------------------------------
  // DELETE ACCOUNT
  // ---------------------------------------------------------
  const handleDeleteAccount = async () => {
    try {
      await api.delete("/users/me");
      alert("Your account is deactivated");
      localStorage.clear();
      window.location.href = "/";
    } catch (err) {
      alert("Account deletion failed");
    }
  };

  // ---------------------------------------------------------
  // UPDATE PASSWORD
  // ---------------------------------------------------------
  const handlePasswordUpdate = async () => {
    try {
      if (!oldPassword || !newPassword) return alert("Please fill both fields");

      await api.put("/auth/change-password", {
        oldPassword,
        newPassword,
      });

      alert("Password updated successfully");
      setOldPassword("");
      setNewPassword("");
    } catch (err) {
      alert(err.response?.data?.message || "Password update failed");
    }
  };

  // ---------------------------------------------------------
  // THEME TOGGLE
  // ---------------------------------------------------------
  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.toggle("dark");
    setIsDark(!isDark);
    localStorage.setItem("theme", !isDark ? "dark" : "light");
  };

  // ---------------------------------------------------------
  // DASHBOARD ROUTE BASED ON USER ROLE
  // ---------------------------------------------------------
  const dashboardRoute =
    profile.role === "admin"
      ? "/admin/dashboard"
      : profile.role === "scorer"
      ? "/scorer/dashboard"
      : "/viewer/dashboard";

  return (
    <div className="p-4 sm:p-8 space-y-6">
      {/* Back */}
      <Link
        to="/viewer/dashboard"
        className="inline-flex items-center text-blue-600 hover:text-blue-400"
      >
        <ArrowLeft className="w-5 h-5 mr-1" /> Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold dark:text-white">Settings</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg w-fit">
        {["profile", "password", "preferences"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm capitalize ${
              activeTab === tab
                ? "bg-white dark:bg-gray-900 shadow font-semibold"
                : "opacity-70"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content Wrapper */}
      <div className="bg-white dark:bg-gray-900 shadow rounded-xl p-6 max-w-2xl">
        {/* ---------------- PROFILE TAB ---------------- */}
        {activeTab === "profile" && (
          <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Profile</h2>

            {/* Profile Image */}
            <div className="flex items-center gap-4 mb-6">
              <img
                src={previewImage || profile.profileImage || defaultAvatar}
                alt="profile"
                className="w-20 h-20 object-cover rounded-full border"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block text-sm"
              />
            </div>

            {/* Name */}
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2 mb-4 rounded border dark:bg-gray-800 dark:text-white"
            />

            {/* Email */}
            <label className="block mb-2 text-sm font-medium dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full p-2 mb-4 rounded border dark:bg-gray-800 dark:text-white"
            />

            <button
              onClick={handleProfileUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        )}

        {/* Remove Profile Image */}
        <button
          onClick={handleRemoveImage}
          className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mt-3 mr-3"
        >
          Remove Profile Image
        </button>

        {/* Delete Account */}
        <button
          onClick={() => setShowDeleteModal(true)}
          className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 mt-3"
        >
          Delete Account
        </button>

        {/* ---------------- PASSWORD TAB ---------------- */}
        {activeTab === "password" && (
          <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Change Password
            </h2>

            <label className="block mb-2 text-sm dark:text-gray-300">
              Old Password
            </label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 mb-4 rounded border dark:bg-gray-800 dark:text-white"
            />

            <label className="block mb-2 text-sm dark:text-gray-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 mb-4 rounded border dark:bg-gray-800 dark:text-white"
            />

            <button
              onClick={handlePasswordUpdate}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Update Password
            </button>
          </div>
        )}

        {/* ---------------- PREFERENCES TAB ---------------- */}
        {activeTab === "preferences" && (
          <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Preferences
            </h2>

            {/* Theme toggle */}
            <div className="flex items-center gap-3 mb-6">
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-800"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
                <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>

            <p className="text-gray-600 dark:text-gray-400 text-sm">
              More preferences coming soon…
            </p>
          </div>
        )}

        {/* Delete Account Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
              <h2 className="text-lg font-bold mb-3 dark:text-white">
                Are you sure?
              </h2>
              <p className="text-sm mb-5 dark:text-gray-300">
                This action cannot be undone. Your account will be permanently
                deactivated.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
