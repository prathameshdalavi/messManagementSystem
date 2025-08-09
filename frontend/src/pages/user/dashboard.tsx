// pages/dashboard/UserDashboard.tsx
import { useState } from "react";
import { NavBar } from "../../components/navBar";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../../components/sidebar";
import { PlanDetails } from "./planDetails";
import { useSelector } from "react-redux";
import { selectSelectedPlan } from "../../redux/nearbyMessSlice";

export const UserDashboard = () => {
  const [opensidebar, setSidebar] = useState(true);
  const [currentMenu, setCurrentMenu] = useState("main");
  const [userPlans, setUserPlans] = useState<any[]>([]);
  const [selectedFunctionality, setSelectedFunctionality] = useState("");

  // Get selectedPlan from Redux
  const selectedPlan = useSelector(selectSelectedPlan);

  const toggleSidebar = () => {
    setSidebar(!opensidebar);
    setCurrentMenu("main");
    setSelectedFunctionality("");
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
          userPlans={userPlans}
          setUserPlans={setUserPlans}
          selectedFunctionality={selectedFunctionality}
          setSelectedFunctionality={setSelectedFunctionality}
        />

        {/* Main Content */}
        <div
          className={`flex-1 transition-all duration-300 ${opensidebar ? "ml-64" : "ml-0"
            }`}
        >
          {selectedPlan ? (
            <PlanDetails 
              selectedFunctionality={selectedFunctionality}
            />
          ) : (
            <Outlet />
          )}
        </div>
      </div>
    </div>
  );
};
