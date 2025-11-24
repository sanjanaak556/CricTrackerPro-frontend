import { useState, useEffect } from "react";
import logo from "../assets/logo-1.jpg";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [theme, setTheme] = useState("light");

  // Toggle theme
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 px-6 py-4 flex items-center justify-between bg-transparent">

      {/* Logo + App Name */}
      <div className="flex items-center gap-3">
        <img src={logo} alt="logo" className="h-10 w-10 object-contain" />
        <span className="text-2xl font-bold text-white">
          CricTrackerPro
        </span>
      </div>

      {/* Links */}
      <ul className="hidden md:flex items-center gap-6 text-white font-medium">
        <li className="hover:text-blue-300 cursor-pointer"><Link to="/">Home</Link></li>
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
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="text-xl text-white cursor-pointer"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}


