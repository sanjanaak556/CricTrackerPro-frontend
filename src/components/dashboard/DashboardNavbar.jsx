import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setTheme } from "../../utils/theme";
import defaultAvatar from "../../assets/avatar_img.jpg";
import api from "../../services/api";

import { Bell, Menu, Moon, Sun, Home, MoreVertical, Search } from "lucide-react";

export default function DashboardNavbar({ sidebarOpen, setSidebarOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // USER ROLE
  const [profileImage, setProfileImage] = useState(null);
  const [role, setRole] = useState(null);

  // SEARCH
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await api.get("/users/me");

        console.log("USER RESPONSE:", res);

        // FIXED KEYS BASED ON YOUR RESPONSE
        setProfileImage(res.profileImage || null);
        setRole(res.role?.roleName || null);
      } catch (err) {
        console.error("Failed to load user:", err);
      }
    };

    loadUser();
  }, []);

  // THEME
  const [theme, setThemeState] = useState(
    localStorage.getItem("theme") || "light"
  );

  useEffect(() => {
    setTheme(theme);
  }, [theme]);

  // SEARCH FUNCTIONALITY - Only for Admin
  const performSearch = useCallback(async (query) => {
    if (!query.trim() || role !== "admin") {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    setSearchLoading(true);
    try {
      const [matchesRes, playersRes, teamsRes] = await Promise.all([
        api.get(`/matches/search?name=${encodeURIComponent(query)}`),
        api.get(`/players/search?name=${encodeURIComponent(query)}`),
        api.get(`/teams/search?name=${encodeURIComponent(query)}`)
      ]);

      const results = [
        ...matchesRes.matches.map(m => ({ ...m, type: 'match' })),
        ...playersRes.players.map(p => ({ ...p, type: 'player' })),
        ...teamsRes.teams.map(t => ({ ...t, type: 'team' }))
      ];

      setSearchResults(results);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, [role]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResultClick = (result) => {
    setShowResults(false);
    setSearchQuery("");

    if (result.type === 'match') {
      navigate(`/admin/matches/view/${result._id}`);
    } else if (result.type === 'player') {
      navigate(`/admin/players`);
    } else if (result.type === 'team') {
      navigate(`/admin/teams`);
    }
  };

  return (
    <nav
      className={`
        fixed top-0 right-0 h-16 shadow-md z-40
        flex items-center justify-between
        px-4 md:px-6
        bg-white dark:bg-gray-900 
        text-gray-900 dark:text-white
        transition-all duration-300

        ${sidebarOpen ? "md:left-64" : "md:left-0"}
        left-0
      `}
    >
      {/* LEFT — HAMBURGER BUTTON (Desktop + Mobile) */}
      <button
        className="
          p-2 rounded-lg
          hover:bg-gray-200 dark:hover:bg-gray-700
          transition
          md:block
          cursor-pointer
        "
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* CENTER — SEARCH BAR */}
      {role === "admin" && (
        <div className="flex-1 flex justify-center px-4 relative">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search team / match..."
              className="
                w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none
                bg-white dark:bg-gray-700
                text-gray-900 dark:text-white
                placeholder-gray-500 dark:placeholder-gray-300
              "
            />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white"></div>
              </div>
            )}
            {showResults && searchResults.length > 0 && (
              <div className="
                absolute top-full mt-1 w-full bg-white dark:bg-gray-800 
                border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg 
                max-h-64 overflow-y-auto z-50
              ">
                {searchResults.map((result, index) => (
                  <button
                    key={`${result.type}-${result._id || index}`}
                    onClick={() => handleResultClick(result)}
                    className="
                      w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                      flex items-center gap-3 border-b border-gray-100 dark:border-gray-700 last:border-b-0
                    "
                  >
                    <Search className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {result.name || result.matchName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {result.type} {result.role && `• ${result.role}`}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-4">
        {/* DESKTOP BUTTONS */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={() => setThemeState(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            {theme === "light" ? (
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </button>

          {/* Notifications */}
          {(role === "admin" || role === "scorer") && (
            <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer">
              <Bell className="w-6 h-6" />
            </button>
          )}

          {/* Home Icon */}
          <Link
            to="/"
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer"
          >
            <Home className="w-6 h-6" />
          </Link>
        </div>

        {/* PROFILE AVATAR */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="
    w-10 h-10 rounded-full overflow-hidden
    border border-gray-300 dark:border-gray-700
    bg-gray-200 dark:bg-gray-700 hover:opacity-80 transition cursor-pointer
  "
          >
            <img
              src={profileImage || defaultAvatar}
              alt="profile"
              className="w-full h-full object-cover"
              onError={(e) => (e.target.src = defaultAvatar)}
            />
          </button>

          {profileOpen && (
            <div
              className="
                absolute right-0 mt-2 w-40 
                bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2
              "
            >
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Profile
              </Link>

              <Link
                to="/logout"
                className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Logout
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE — 3 DOTS MENU */}
        <div className="relative md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            <MoreVertical className="w-6 h-6" />
          </button>

          {/* MOBILE DROPDOWN */}
          {menuOpen && (
            <div
              className="
                absolute right-0 mt-2 w-44
                bg-white dark:bg-gray-800 shadow-md rounded-lg py-2
              "
            >
              {/* Home */}
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Home className="w-5 h-5" />
                Home
              </Link>

              {/* Theme */}
              <button
                onClick={() =>
                  setThemeState(theme === "light" ? "dark" : "light")
                }
                className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
                Theme
              </button>

              {/* Notifications */}
              {(role === "admin" || role === "scorer") && (
                <button className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Bell className="w-5 h-5" />
                  Notifications
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
