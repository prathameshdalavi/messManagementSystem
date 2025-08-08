// pages/dashboard/UserDashboard.tsx
import { useState } from "react";
import { NavBar } from "../../components/navBar";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";

export const UserDashboard = () => {
  const [opensidebar, setSidebar] = useState(true);
  const [currentMenu, setCurrentMenu] = useState("main");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const toggleSidebar = () => {
    setSidebar(!opensidebar);
    setCurrentMenu("main");
    setSelectedPlan(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar />
      </div>

      <div className="flex flex-1 pt-16 relative">
        {/* Sidebar */}
        <Sidebar
          opensidebar={opensidebar}
          toggleSidebar={toggleSidebar}
          currentMenu={currentMenu}
          setCurrentMenu={setCurrentMenu}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan} userPlans={[]}        />

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${opensidebar ? "ml-64" : "ml-0"
            }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};
