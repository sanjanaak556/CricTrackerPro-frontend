import { useState, useEffect } from "react";
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ children }) {
  // Load sidebar state from localStorage (prevents auto close after navigation)
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("sidebarOpen");

    if (saved !== null) return JSON.parse(saved);

    // Default behavior: desktop open, mobile closed
    return window.innerWidth >= 768;
  });

  // Save state to localStorage whenever changed
  const handleSidebarToggle = (value) => {
    setSidebarOpen(value);
    localStorage.setItem("sidebarOpen", JSON.stringify(value));
  };

  // AUTO-CLOSE SIDEBAR ON MOBILE WHEN SCREEN SHRINKS
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        handleSidebarToggle(false); // auto close on small screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* SIDEBAR */}
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={handleSidebarToggle}
      />

      {/* MAIN CONTENT */}
      <div
        className={`
          flex-1 flex flex-col transition-all duration-300
          ${sidebarOpen ? "md:ml-64" : "md:ml-0"}
        `}
      >
        {/* NAVBAR */}
        <DashboardNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={handleSidebarToggle}
        />

        {/* CONTENT */}
        <main className="p-6 pt-20">{children}</main>
      </div>
    </div>
  );
}
