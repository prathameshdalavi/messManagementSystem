// components/Sidebar.tsx
import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedPlan, clearSelectedPlan, selectSelectedPlan } from "../redux/nearbyMessSlice";
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

  const sidebarItems = [
    { label: "Home", subItems: [] },
    { label: "My Plans", subItems: [] },
    { label: "Profile"},
    { label: "Settings" },
    { label: "Logout"},
  ];

  const functionalityButtons = [
    { id: "notices", label: "Notices" },
    { id: "menu", label: "Menu" },
    { id: "attendance", label: "Attendance" },
    { id: "feedback", label: "Feedback" },
    { id: "pause", label: "Pause/Resume" },
    { id: "stats", label: "Statistics" },
  ];

  const handleMyPlansClick = async () => {
    setCurrentMenu("My Plans");
    setLoadingPlans(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/plans/myPlans`, {
        headers: { token }
      });

      if (res.data.success) {
        setUserPlans(res.data.data || []);
      }
    } catch (err) {
      setUserPlans([]);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handlePlanSelect = (plan: any) => {
    dispatch(setSelectedPlan(plan));
    setCurrentMenu("planDetails");
    setSelectedFunctionality("notices"); // Default to notices
  };

  const handleBackToMain = () => {
    dispatch(clearSelectedPlan());
    setCurrentMenu("main");
    setSelectedFunctionality("");
  };

  const handleBackToPlans = () => {
    dispatch(clearSelectedPlan());
    setCurrentMenu("My Plans");
    setSelectedFunctionality("");
  };

  const navigate = useNavigate();

  const handleItemClick = (item: any) => {
    if (item.label === "Home") {
      navigate("/home"); // This will only change the Outlet content
    }
    else if (item.label === "My Plans") {
      handleMyPlansClick();
    }
    else if (item.label === "Profile") {
      navigate("/profile"); // Example future page
    }
    else if (item.label === "Settings") {
      navigate("/settings"); // Example future page
    }
    else if (item.label === "Logout") {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You are already logged out!");
        return;
      }

      // Remove token from localStorage
      localStorage.removeItem("token");

      // Optional: Clear Redux state
      dispatch(clearSelectedPlan());
      setUserPlans([]);
      setCurrentMenu("main");
      setSelectedFunctionality("");

      alert("Logged out successfully!");
      navigate("/home");
    }

  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-40 top-20 p-2 m-0.5 rounded-md bg-[#2F3349] text-white transition-all duration-300 ${opensidebar ? "left-[16rem]" : "left-2"
          }`}
      >
        {opensidebar ? "✕" : "☰"}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#2F3349] text-white transition-all duration-300 z-30 overflow-hidden ${opensidebar ? "w-64" : "w-0"
          }`}
      >
        {/* Header or Back */}
        <div className="px-4 py-3 text-xl border-bzzz text-center text-teal-500 border-gray-600 font-bold">
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

        {/* Content */}
        <div className="flex flex-col   justify-start px-4 py-4 font-semibold text-lg overflow-y-auto h-[calc(100%-3.5rem)] gap-y-25">
          {/* Functionality Buttons - when plan is selected */}
          {selectedPlan && currentMenu === "planDetails" && (
            <div className="space-y-12 ">
              {functionalityButtons.map((func) => (
                <button
                  key={func.id}
                  onClick={() => setSelectedFunctionality(func.id)}
                  className={`w-full text-center  px-2 py-2 rounded transition-colors ${selectedFunctionality === func.id
                      ? "bg-teal-600 text-white"
                      : "hover:bg-gray-600 text-gray-200"
                    }`}
                >
                  {func.label}
                </button>
              ))}
            </div>
          )}

          {/* My Plans List */}
          {currentMenu === "My Plans" && !selectedPlan && (
            loadingPlans ? (
              <div className="text-center py-2">Loading...</div>
            ) : userPlans.length > 0 ? (
              userPlans.map((plan: any) => (
                <button
                  key={plan._id}
                  onClick={() => handlePlanSelect(plan)}
                  className="px-2 py-2 hover:bg-gray-600 rounded text-center w-full"
                >
                  {plan.messId?.messName || "Unknown Mess"}
                </button>
              ))
            ) : (
              <div className="text-center py-2 text-gray-400">No plans found.</div>
            )
          )}

          {/* Main Menu */}
          {currentMenu === "main" && !selectedPlan &&
            sidebarItems.map((item) => (
              <button
                key={item.label}
                onClick={() =>
                  item.label === "My Plans"
                    ? handleMyPlansClick()
                    : handleItemClick(item)
                }
                className="w-full text-center  px-2 py-2 hover:bg-gray-700 rounded"
              >
                {item.label}
              </button>
            ))}
        </div>
      </div>
    </>
  );
};
