// components/Sidebar.tsx
import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedPlan,
  clearSelectedPlan,
  selectSelectedPlan,
} from "../redux/nearbyMessSlice";
import { useNavigate } from "react-router-dom";

interface SidebarProps {
  opensidebar: boolean;
  toggleSidebar: () => void;
  currentMenu: string;
  setCurrentMenu: (menu: string) => void;
  userPlans: any[];
  setUserPlans: (plans: any[]) => void;
  selectedFunctionality: string;
  setSelectedFunctionality: (func: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  opensidebar,
  toggleSidebar,
  currentMenu,
  setCurrentMenu,
  userPlans,
  setUserPlans,
  selectedFunctionality,
  setSelectedFunctionality,
}) => {
  const [loadingPlans, setLoadingPlans] = useState(false);
  const dispatch = useDispatch();
  const selectedPlan = useSelector(selectSelectedPlan);
  const navigate = useNavigate();

  const sidebarItems = [
    { label: "Home" },
    { label: "My Plans" },
    { label: "Profile" },
    { label: "Settings" },
    { label: "Logout" },
  ];

  const functionalityButtons = [
    { id: "notices", label: "Notices" },
    { id: "menu", label: "Menu" },
    { id: "attendance", label: "Attendance" },
    { id: "feedback", label: "Feedback" },
    { id: "pause", label: "Pause/Resume" },
    { id: "stats", label: "Statistics" },
  ];

  const isMobile = () => window.innerWidth < 768;

  const handleMyPlansClick = async () => {
    setCurrentMenu("My Plans");
    setLoadingPlans(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/plans/myPlans`, {
        headers: { token },
      });
      setUserPlans(res.data.data || []);
    } catch {
      setUserPlans([]);
    } finally {
      setLoadingPlans(false);
    }

    // ❌ Do NOT close sidebar here
  };

  const handlePlanSelect = (plan: any) => {
    dispatch(setSelectedPlan(plan));
    setCurrentMenu("planDetails");
    setSelectedFunctionality("notices");

    // ❌ Do NOT close sidebar — keep it open to show functionality buttons
  };

  const handleBackToMain = () => {
    dispatch(clearSelectedPlan());
    setCurrentMenu("main");
    setSelectedFunctionality("");

    // ✅ Do NOT close sidebar on mobile when navigating inside sidebar
  };

  const handleBackToPlans = () => {
    dispatch(clearSelectedPlan());
    setCurrentMenu("My Plans");
    setSelectedFunctionality("");

    // ✅ Keep sidebar open on mobile
  };

  const handleItemClick = (item: any) => {
    if (item.label === "Home") {
      navigate("/home");
      if (isMobile()) toggleSidebar();
    } else if (item.label === "My Plans") {
      handleMyPlansClick(); // keep sidebar open
    } else if (item.label === "Profile") {
      navigate("/profile");
      if (isMobile()) toggleSidebar();
    } else if (item.label === "Settings") {
      navigate("/settings");
      if (isMobile()) toggleSidebar();
    } else if (item.label === "Logout") {
      localStorage.removeItem("token");
      dispatch(clearSelectedPlan());
      setUserPlans([]);
      setCurrentMenu("main");
      setSelectedFunctionality("");
      navigate("/home");
      alert("Logged out successfully!");
      if (isMobile()) toggleSidebar();
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-[#2F3349] text-white z-40 transform transition-transform duration-300 w-64 md:translate-x-0 ${
        opensidebar ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-gray-700 text-center font-bold text-teal-400">
        {selectedPlan ? (
          <div className="space-y-2">
            <div className="text-sm font-normal text-white">
              {selectedPlan.messId?.messName}
            </div>
            <button
              onClick={handleBackToPlans}
              className="text-xs hover:underline text-teal-300"
            >
              ← Back to Plans
            </button>
          </div>
        ) : currentMenu !== "main" ? (
          <button onClick={handleBackToMain} className="hover:underline">
            ← Back
          </button>
        ) : (
          <div>Main Menu</div>
        )}
      </div>

      {/* Sidebar Content */}
      <div className="flex flex-col justify-start px-4 py-4 font-semibold text-lg overflow-y-auto h-full gap-2 md:gap-3">
        {/* Functionality Buttons */}
        {selectedPlan &&
          currentMenu === "planDetails" &&
          functionalityButtons.map((func) => (
            <button
              key={func.id}
              onClick={() => {
                setSelectedFunctionality(func.id);
                if (isMobile()) toggleSidebar(); // ✅ only close when user selects a functionality
              }}
              className={`w-full text-center px-3 py-2 rounded transition-colors ${
                selectedFunctionality === func.id
                  ? "bg-teal-600 text-white"
                  : "hover:bg-gray-700 text-gray-200"
              }`}
            >
              {func.label}
            </button>
          ))}

        {/* My Plans List */}
        {currentMenu === "My Plans" && !selectedPlan &&
          (loadingPlans ? (
            <div className="text-center py-2">Loading...</div>
          ) : userPlans.length > 0 ? (
            userPlans.map((plan) => (
              <button
                key={plan._id}
                onClick={() => handlePlanSelect(plan)}
                className="px-3 py-2 w-full text-left rounded hover:bg-gray-700"
              >
                {plan.messId?.messName || "Unknown Mess"}
              </button>
            ))
          ) : (
            <div className="text-center py-2 text-gray-400">
              No plans found.
            </div>
          ))}

        {/* Main Menu */}
        {currentMenu === "main" && !selectedPlan &&
          sidebarItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleItemClick(item)}
              className="w-full text-left px-3 py-2 rounded hover:bg-gray-700"
            >
              {item.label}
            </button>
          ))}
      </div>
    </div>
  );
};
