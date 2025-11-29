import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Right main area */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <DashboardNavbar />

        {/* Main content area */}
        <div className="p-6 mt-16">
          {children}
        </div>
      </div>
    </div>
  );
}
