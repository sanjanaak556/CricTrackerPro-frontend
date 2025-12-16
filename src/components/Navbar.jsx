import { useState, useEffect } from "react";
import logo from "../assets/logo.jpg";
import { Link } from "react-router-dom";
import { setTheme } from "../utils/theme";

export default function Navbar() {
  const [theme, setThemeState] = useState(
    localStorage.getItem("theme") || "light"
  );

  return (
    <nav className="w-full fixed top-0 left-0 z-50 px-6 py-4 flex items-center justify-between bg-transparent">
      {/* Logo + App Name */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="logo" className="w-13 h-13 mx-auto rounded-full shadow-md border dark:border-gray-600" />
        <span className="text-2xl font-bold text-white">CricTrackerPro</span>
      </div>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-6 text-white font-medium">
        <li className="hover:text-blue-300 cursor-pointer">
          <Link to="/">Home</Link>
        </li>
        <li className="hover:text-blue-300 cursor-pointer">Features</li>
        <li className="hover:text-blue-300 cursor-pointer">Live Matches</li>
        <li className="hover:text-blue-300 cursor-pointer">Teams</li>
        <li className="hover:text-blue-300 cursor-pointer">Reports</li>
        <li className="hover:text-blue-300 cursor-pointer">About</li>
        <li className="hover:text-blue-300 cursor-pointer">Contact</li>
      </ul>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-4">
        <Link to="/login">
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
            Login
          </button>
        </Link>

        {/* Dark Mode Toggle */}
        <button
          onClick={() => {
            const newTheme = theme === "light" ? "dark" : "light";
            setThemeState(newTheme);
            setTheme(newTheme);
          }}
          className="text-xl cursor-pointer text-gray-900 dark:text-white"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}
