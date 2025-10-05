import React from 'react';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';

export const StatisticsComponent: React.FC = () => {
  const selectedPlan = useSelector(selectSelectedPlan);

  if (!selectedPlan) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-1">No plan selected</h3>
        <p className="text-gray-500 max-w-md">Select a plan to view detailed statistics and usage information</p>
      </div>
    );
  }

  const monthlyPausedSummary: number = (() => {
    const monthly = (selectedPlan as any)?.monthlyPausedDays;
    if (Array.isArray(monthly)) return monthly.reduce((sum: number, m: any) => sum + (m?.noofDaysinMonth || 0), 0);
    if (typeof monthly === 'number') return monthly;
    return 0;
  })();

  const totalPausedDays = (selectedPlan as any)?.totalPaused || 0;

  const calculateProgress = () => {
    if (!selectedPlan.purchaseDate || !selectedPlan.expiryDate) return 0;
    const start = new Date(selectedPlan.purchaseDate).getTime();
    const end = new Date(selectedPlan.expiryDate).getTime();
    const now = Date.now();
    if (now >= end) return 100;
    if (now <= start) return 0;
    return Math.round(((now - start) / (end - start)) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">Plan Overview</h3>
          <p className="text-gray-500 text-sm sm:text-base">Detailed statistics and usage information</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
            selectedPlan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {selectedPlan.isActive ? 'Active' : 'Inactive'}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs sm:text-sm font-medium ${
            selectedPlan.isPaused ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {selectedPlan.isPaused ? 'Paused' : 'Running'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between mb-1 sm:mb-2 text-sm sm:text-base">
          <span>Plan Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
          <div 
            className="h-2 sm:h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-teal-400" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Plan Details Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Plan Details</h4>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Plan Name</p>
              <p className="font-medium">{selectedPlan.planId?.name || 'N/A'}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</p>
                <p className="font-medium">₹{selectedPlan.planId?.amount || '0'}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</p>
                <p className="font-medium">{selectedPlan.planId?.durationDays || '0'} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Information Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Purchase Information</h4>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Purchase Date</p>
              <p className="font-medium">
                {selectedPlan.purchaseDate ? new Date(selectedPlan.purchaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry Date</p>
              <p className="font-medium">
                {selectedPlan.expiryDate ? new Date(selectedPlan.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Pause Statistics Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Pause Statistics</h4>
          </div>
          <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Paused</p>
                <p className="font-medium text-xl sm:text-2xl">{totalPausedDays} <span className="text-sm font-normal">days</span></p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Paused</p>
                <p className="font-medium text-xl sm:text-2xl">{monthlyPausedSummary} <span className="text-sm font-normal">days</span></p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</p>
              <p className="font-medium">
                {selectedPlan.isPaused ? (
                  <span className="text-amber-600">Plan is currently paused</span>
                ) : (
                  <span className="text-green-600">Plan is active</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
