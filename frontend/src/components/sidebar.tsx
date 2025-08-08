// components/Sidebar.tsx
import React, { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface SidebarProps {
  opensidebar: boolean;
  toggleSidebar: () => void;
  currentMenu: string;
  setCurrentMenu: (menu: string) => void;
  selectedPlan: any | null;
  setSelectedPlan: (plan: any | null) => void;
  userPlans: any[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  opensidebar,
  toggleSidebar,
  currentMenu,
  setCurrentMenu,
  selectedPlan,
  setSelectedPlan,
  userPlans,
}) => {
  const [loadingPlans, setLoadingPlans] = useState(false);

  const sidebarItems = [
    { label: "Home", subItems: [] },
    { label: "My Plans", subItems: [] },
    { label: "Profile", subItems: ["Edit", "Preferences"] },
    { label: "Settings", subItems: ["Account", "Notifications", "Privacy"] },
    { label: "Logout", subItems: [] },
  ];

  const planFeatures = [
    "Attendance",
    "Feedback",
    "Notice",
    "Billing",
    "Pause/Resume",
  ];

  const handleMyPlansClick = async () => {
    setCurrentMenu("My Plans");
    setLoadingPlans(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BACKEND_URL}/api/v1/user/plans/myPlans`, {
        headers: { token },
      });
      console.log("Fetched plans:", res.data);
      // You should lift state up and handle plan setting in the parent component.
    } catch (err) {
      console.error("Error fetching plans:", err);
    } finally {
      setLoadingPlans(false);
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed z-40 top-20 p-2 m-0.5 rounded-md bg-[#2F3349] text-white transition-all duration-300 ${
          opensidebar ? "left-[16rem]" : "left-2"
        }`}
      >
        {opensidebar ? "✕" : "☰"}
      </button>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-[#2F3349] text-white transition-all duration-300 z-30 overflow-hidden ${
          opensidebar ? "w-64" : "w-0"
        }`}
      >
        {/* Header or Back */}
        <div className="px-4 py-3 text-xl border-b text-center text-teal-500 border-gray-600 font-bold">
          {(selectedPlan || currentMenu !== "main") ? (
            <button onClick={() => {
              if (selectedPlan) setSelectedPlan(null);
              setCurrentMenu("main");
            }} className="hover:underline">
              ← Back
            </button>
          ) : (
            <div>Main Menu</div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-start px-4 py-4 font-semibold text-lg overflow-y-auto h-[calc(100%-3.5rem)] gap-y-2">
          {/* Plan Features */}
          {currentMenu === "planFeatures" && selectedPlan &&
            planFeatures.map((feature) => (
              <div
                key={feature}
                className="px-2 py-2 text-center hover:bg-gray-600 rounded"
              >
                {feature}
              </div>
            ))}

          {/* My Plans List */}
          {currentMenu === "My Plans" && !selectedPlan && (
            loadingPlans ? (
              <div className="text-center py-2">Loading...</div>
            ) : userPlans.length > 0 ? (
              userPlans.map((plan: any) => (
                <button
                  key={plan._id}
                  onClick={() => {
                    setSelectedPlan(plan);
                    setCurrentMenu("planFeatures");
                  }}
                  className="px-2 py-2 hover:bg-gray-600 rounded text-center"
                >
                  {plan.messId?.messName || "Unknown Mess"} - {plan.planId?.name}
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
                    : console.log(`${item.label} clicked`)
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
