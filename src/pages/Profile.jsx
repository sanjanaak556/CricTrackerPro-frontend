import { useEffect, useState } from "react";
import api from "../services/api";
import defaultAvatar from "../assets/avatar_img.jpg";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import appLogo from "../assets/logo.jpg";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/users/me");
        setUser(res.user || res); 
      } catch (err) {
        console.error(err);
      }
    };

    loadUser();
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  // === ROLE-BASED DASHBOARD ROUTE ===
  let dashboardRoute = "/dashboard"; // fallback

  if (user.role?.roleName === "admin") dashboardRoute = "/admin/dashboard";
  else if (user.role?.roleName === "scorer") dashboardRoute = "/scorer/dashboard";
  else if (user.role?.roleName === "viewer") dashboardRoute = "/viewer/dashboard";

  return (
    <div className="min-h-screen flex justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 border dark:border-gray-700 relative">

        {/* BACK TO DASHBOARD */}
        <Link
          to={dashboardRoute}
          className="absolute top-4 left-4 flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-300"
        >
          <ArrowLeft size={18} />
          <span className="font-medium">Back to Dashboard</span>
        </Link>

        {/* Header */}
        <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">
          My Profile
        </h2>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <img
              src={user.profileImage || defaultAvatar}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow-md"
              onError={(e) => (e.target.src = defaultAvatar)}
            />

            <div className="absolute inset-0 rounded-full border-4 border-transparent bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-sm"></div>
          </div>
        </div>

        {/* Info Section */}
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-xl font-semibold dark:text-white">{user.name}</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-xl font-semibold dark:text-white">{user.email}</p>
          </div>

          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Role</p>
            <p className="text-xl font-semibold capitalize dark:text-white">
              {user.role?.roleName || "N/A"}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <span
              className={`px-3 py-1 mt-1 inline-block rounded-full text-sm font-medium ${
                user.isActive
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t mt-8 dark:border-gray-700"></div>

        {/* App Logo + Name */}
        <div className="mt-8 text-center">
          <img
            src={appLogo}
            alt="App Logo"
            className="w-20 h-20 mx-auto rounded-full shadow-md border dark:border-gray-600"
          />
          <p className="text-xl font-bold tracking-wide mt-2 dark:text-white">
            CricTrackerPro
          </p>
        </div>

      </div>
    </div>
  );
}
