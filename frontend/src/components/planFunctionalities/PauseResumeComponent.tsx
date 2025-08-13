import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { selectSelectedPlan } from "../../redux/nearbyMessSlice";
import type { RootState } from "../../redux/store";
import { FiPause, FiPlay, FiInfo } from "react-icons/fi";

export const PauseResumeComponent: React.FC = () => {
  const selectedPlan = useSelector((state: RootState) => selectSelectedPlan(state));
  const [isPaused, setIsPaused] = useState<boolean>(selectedPlan?.isPaused || false);
  const [reason, setReason] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  const handlePause = async () => {
    if (!selectedPlan?.planId?._id) {
      alert("No plan selected");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/pauseResume/pausePlan`,
        {
          planId: selectedPlan.planId._id,
          reason,
        },
        {
          headers: {
            token,
          },
        }
      );
      alert(res.data?.message || "Plan paused successfully!");
      setIsPaused(true);
      setReason("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to pause plan");
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    if (!selectedPlan?.planId?._id) {
      alert("No plan selected");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${BACKEND_URL}/api/v1/user/pauseResume/resumePlan`,
        {
          planId: selectedPlan.planId._id,
        },
        {
          headers: {
            token,
          },
        }
      );
      alert(res.data?.message || "Plan resumed successfully!");
      setIsPaused(false);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to resume plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Plan Status Control</h3>
          <p className="text-gray-500">
            {isPaused ? "Your plan is currently paused" : "Your plan is active"}
          </p>
        </div>
        <button 
          onClick={() => setShowInfo(!showInfo)}
          className="text-teal-500 hover:text-teal-600 p-1 rounded-full transition-colors"
          aria-label="Information"
        >
          <FiInfo className="w-5 h-5" />
        </button>
      </div>

      {showInfo && (
        <div className="bg-teal-50 text-teal-800 p-4 rounded-lg mb-6 text-sm border border-teal-100">
          <p className="font-medium mb-1">About Pausing Your Plan:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Pausing stops meal deliveries temporarily</li>
            <li>Your plan duration will be extended accordingly</li>
            <li>You can resume anytime</li>
            <li>Provide reason for better service (optional)</li>
          </ul>
        </div>
      )}

      {!isPaused ? (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason for pausing (optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="E.g. Going on vacation, health reasons..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
          <button
            onClick={handlePause}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-70 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Pausing Plan...</span>
              </>
            ) : (
              <>
                <FiPause className="w-5 h-5 text-teal-100" />
                <span>Pause My Plan</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="bg-teal-50 text-teal-800 p-4 rounded-lg border border-teal-100">
            <p className="font-medium">Your plan is currently paused</p>
            <p className="text-sm mt-1">You can resume service whenever you're ready</p>
          </div>
          <button
            onClick={handleResume}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-70 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Resuming Plan...</span>
              </>
            ) : (
              <>
                <FiPlay className="w-5 h-5 text-teal-100" />
                <span>Resume My Plan</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};