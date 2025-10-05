// pages/dashboard/UserDashboard.tsx
import { useState } from "react";
import { NavBar } from "../../components/navBar";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";
import { PlanDetails } from "./planDetails";
import { useSelector } from "react-redux";
import { selectSelectedPlan } from "../../redux/nearbyMessSlice";

export const UserDashboard = () => {
  const [opensidebar, setSidebar] = useState(false);
  const [currentMenu, setCurrentMenu] = useState("main"); // main, My Plans, planDetails
  const [userPlans, setUserPlans] = useState<any[]>([]);
  const [selectedFunctionality, setSelectedFunctionality] = useState("notices"); // default to notices
  const selectedPlan = useSelector(selectSelectedPlan);

  const toggleSidebar = () => {
    setSidebar(!opensidebar);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <div className="fixed top-0 left-0 w-full z-50">
        <NavBar toggleSidebar={toggleSidebar} />
      </div>

      <div className="flex flex-1 pt-16 relative overflow-hidden">
        {/* Sidebar */}
        <div
          className={`fixed top-16 left-0 z-40 h-full bg-white shadow-lg transition-transform duration-300 ease-in-out
            ${opensidebar ? "translate-x-0" : "-translate-x-full"}
            md:static md:translate-x-0 md:w-64`}
        >
          <Sidebar
            opensidebar={opensidebar}
            toggleSidebar={toggleSidebar}
            currentMenu={currentMenu}
            setCurrentMenu={setCurrentMenu}
            userPlans={userPlans}
            setUserPlans={setUserPlans}
            selectedFunctionality={selectedFunctionality}
            setSelectedFunctionality={setSelectedFunctionality}
          />
        </div>

        {/* Overlay for mobile */}
        {opensidebar && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 transition-all duration-300 overflow-y-auto p-4 md:p-6">
          {selectedPlan && currentMenu === "planDetails" ? (
            <PlanDetails selectedFunctionality={selectedFunctionality} />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};
