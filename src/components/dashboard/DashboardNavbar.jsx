import { useState } from "react";
import logo from "../../assets/logo-1.jpg";
import { Link } from "react-router-dom";

export default function DashboardNavbar() {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="fixed top-0 left-64 right-0 bg-white shadow-md h-16 flex items-center px-6 z-40">

      {/* Left: Logo + App Name */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="logo" className="h-10 w-10" />
        <h1 className="text-xl font-bold">CricTrackerPro</h1>
      </div>

      {/* Center: Search */}
      <div className="flex-1 flex justify-center px-6">
        <input
          type="text"
          placeholder="Search team / match..."
          className="w-96 px-4 py-2 border rounded-lg shadow-sm focus:outline-none"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">

        {/* Notification Bell */}
        <button className="text-xl hover:text-blue-500 cursor-pointer">🔔</button>

        {/* Back to Home */}
        <Link
          to="/"
          className="text-sm px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 cursor-pointer"
        >
          Home
        </Link>

        {/* Profile Avatar */}
        <div className="relative">
          <img
            src="https://i.pravatar.cc/40" // Dummy avatar
            alt="profile"
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => setShowDropdown(!showDropdown)}
          />

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-2 bg-white shadow-md rounded-lg w-40 py-2">
              <Link className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
              <Link className="block px-4 py-2 hover:bg-gray-100">Logout</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
