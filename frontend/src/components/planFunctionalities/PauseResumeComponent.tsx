import React, { useState } from 'react';

export const PauseResumeComponent: React.FC = () => {
  const [isPaused, setIsPaused] = useState(false);
  const [pauseDays, setPauseDays] = useState(0);

  const handlePause = () => {
    setIsPaused(true);
    // Here you would typically make an API call to pause the plan
    alert('Plan paused successfully!');
  };

  const handleResume = () => {
    setIsPaused(false);
    // Here you would typically make an API call to resume the plan
    alert('Plan resumed successfully!');
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Pause/Resume Plan</h3>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pause Days
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={pauseDays}
              onChange={(e) => setPauseDays(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={handlePause}
              disabled={isPaused || pauseDays === 0}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Pause Plan
            </button>
            <button
              onClick={handleResume}
              disabled={!isPaused}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Resume Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
