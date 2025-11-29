import { NavLink } from "react-router-dom";

export default function DashboardSidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Manage Teams", path: "/admin/teams" },
    { name: "Manage Players", path: "/admin/players" },
    { name: "Matches", path: "/admin/matches" },
    { name: "Reports", path: "/admin/reports" },
    { name: "Users & Roles", path: "/admin/users" },
    { name: "Settings", path: "/admin/settings" },
    { name: "Leaderboard", path: "/admin/leaderboard" },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-full bg-white shadow-lg p-6 pt-24">
      <ul className="space-y-3">
        {menuItems.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg cursor-pointer 
                ${isActive ? "bg-blue-600 text-white" : "hover:bg-gray-200"}`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}

        <li className="mt-4">
          <button className="w-full text-left px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 cursor-pointer">
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
