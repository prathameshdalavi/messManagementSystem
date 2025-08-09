import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';

export const StatisticsComponent: React.FC = () => {
  const selectedPlan = useSelector(selectSelectedPlan);

  if (!selectedPlan) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No plan selected</p>
      </div>
    );
  }

  // Safely compute monthly paused days summary whether it's a number or an array of { month, noofDaysinMonth, pauseEntries }
  const monthlyPausedSummary: number = (() => {
    const monthly = (selectedPlan as any)?.monthlyPausedDays;
    if (Array.isArray(monthly)) {
      return monthly.reduce((sum: number, m: any) => sum + (m?.noofDaysinMonth || 0), 0);
    }
    if (typeof monthly === 'number') return monthly;
    return 0;
  })();

  const totalPausedDays = (selectedPlan as any)?.totalPaused || 0;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Plan Statistics</h3>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Plan Details</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Plan Name:</span> {selectedPlan.planId?.name}</p>
            <p><span className="font-medium">Amount:</span> ₹{selectedPlan.planId?.amount}</p>
            <p><span className="font-medium">Duration:</span> {selectedPlan.planId?.durationDays} days</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Purchase Information</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Purchase Date:</span> {selectedPlan.purchaseDate ? new Date(selectedPlan.purchaseDate).toLocaleDateString() : 'N/A'}</p>
            <p><span className="font-medium">Expiry Date:</span> {selectedPlan.expiryDate ? new Date(selectedPlan.expiryDate).toLocaleDateString() : 'N/A'}</p>
            <p><span className="font-medium">Status:</span> {selectedPlan.isActive ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">Pause Statistics</h4>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Total Paused Days:</span> {totalPausedDays}</p>
            <p><span className="font-medium">Monthly Paused Days:</span> {monthlyPausedSummary}</p>
            <p><span className="font-medium">Currently Paused:</span> {selectedPlan.isPaused ? 'Yes' : 'No'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
