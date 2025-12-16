import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Trophy,
  FileText,
  Settings,
  ListChecks,
  History,
  UserCog,
  Activity,
  Flag,
  Star,
  Heart,
  X,
} from "lucide-react";

export default function DashboardSidebar({ sidebarOpen, setSidebarOpen }) {
  // role
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user.role;

  // MENU GROUPS
  const menuItems = {
    admin: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
      { name: "Manage Teams", icon: Users, path: "/admin/teams" },
      { name: "Manage Players", icon: UserCog, path: "/admin/players" },
      { name: "Users & Roles", icon: ShieldCheck, path: "/admin/users" },
      { name: "Matches", icon: ListChecks, path: "/admin/matches" },
      { name: "Reports", icon: FileText, path: "/admin/reports" },
      { name: "Settings", icon: Settings, path: "/admin/settings" },
    ],

    scorer: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/scorer/dashboard" },
      { name: "Live Scoring", icon: Activity, path: "/scorer/live" },
      { name: "Manage Matches", icon: ListChecks, path: "/scorer/matches" },
      { name: "Scoreboard", icon: Flag, path: "/scorer/scoreboard" },
      { name: "Match History", icon: History, path: "/scorer/history" },
      { name: "Settings", icon: Settings, path: "/scorer/settings" },
    ],

    viewer: [
      { name: "Dashboard", icon: LayoutDashboard, path: "/viewer/dashboard" },
      { name: "All Matches", icon: Activity, path: "/viewer/all-matches" },
      { name: "Leaderboard", icon: Trophy, path: "/viewer/leaderboard" },
      { name: "Highlights", icon: Star, path: "/viewer/highlights" },
      { name: "Match History", icon: History, path: "/viewer/match-history" },
      { name: "Teams", icon: Users, path: "/viewer/teams" },
      { name: "Followed Teams", icon: Heart, path: "/viewer/followed-teams" },
      { name: "Settings", icon: Settings, path: "/viewer/settings" },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <>
      {/* BACKDROP — Only when sidebar is open (mobile + desktop) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => {
            // Close sidebar ONLY on mobile screens
            if (window.innerWidth < 768) {
              setSidebarOpen(false);
            }
          }}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 z-50
          bg-white dark:bg-gray-900 shadow-xl
          transform transition-transform duration-300

          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="logo"
              className="w-10 h-10 mx-auto rounded-full shadow-md border dark:border-gray-600"
            />
            <h1 className="text-xl font-bold dark:text-white">
              CricTrackerPro
            </h1>
          </div>

          {/* CROSS BUTTON ALWAYS VISIBLE */}
          <button
            className="text-gray-700 dark:text-white cursor-pointer p-1 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ROLE BADGE */}
        <div className="px-6 py-3">
          {role === "admin" && (
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white">
              Administrator
            </span>
          )}
          {role === "scorer" && (
            <span className="px-3 py-1 text-sm rounded-full bg-green-100 dark:bg-green-700 text-green-700 dark:text-white">
              Scorer
            </span>
          )}
          {role === "viewer" && (
            <span className="px-3 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-700 text-purple-700 dark:text-white">
              Viewer
            </span>
          )}
        </div>

        {/* MENU LIST */}
        <nav className="mt-2">
          {items.map(({ name, icon: Icon, path }) => (
            <NavLink
              key={name}
              to={path}
              className={({ isActive }) =>
                `
      flex items-center gap-4 px-6 py-3 my-1
      transition-all duration-200 cursor-pointer
      ${
        isActive
          ? "bg-blue-500 text-white dark:bg-blue-600 rounded-l-xl"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      }
    `
              }
              onClick={() => {
                if (window.innerWidth < 768) {
                  setSidebarOpen(false); // mobile only
                }
              }}
            >
              <Icon className="w-5 h-5" />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
