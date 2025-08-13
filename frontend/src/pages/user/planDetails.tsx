import React from 'react';
import { NoticesComponent } from '../../components/planFunctionalities/NoticesComponent';
import { MenuComponent } from '../../components/planFunctionalities/MenuComponent';
import { AttendanceComponent } from '../../components/planFunctionalities/AttendanceComponent';
import { FeedbackComponent } from '../../components/planFunctionalities/FeedbackComponent';
import { PauseResumeComponent } from '../../components/planFunctionalities/PauseResumeComponent';
import { StatisticsComponent } from '../../components/planFunctionalities/StatisticsComponent';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';
import { motion } from 'framer-motion';

interface PlanDetailsProps {
  selectedFunctionality: string;
}

export const PlanDetails: React.FC<PlanDetailsProps> = ({ selectedFunctionality }) => {
  const selectedPlan = useSelector(selectSelectedPlan);

  const renderContent = () => {
    const components = {
      notices: <NoticesComponent />,
      menu: <MenuComponent />,
      attendance: <AttendanceComponent />,
      feedback: <FeedbackComponent />,
      pause: <PauseResumeComponent />,
      stats: <StatisticsComponent />,
    };

    return components[selectedFunctionality as keyof typeof components] || <NoticesComponent />;
  };

  if (!selectedPlan) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-full min-h-[500px]"
      >
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="bg-gray-50 p-4 rounded-full inline-block mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">No Plan Selected</h2>
          <p className="text-gray-600 mb-4">
            Please select a plan from the sidebar to view details.
          </p>
          <button className="text-sm font-medium text-teal-600 hover:text-teal-800 transition-colors">
            View Available Plans
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start px-4 justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {selectedPlan.messId?.messName}
            </h1>
            <div className="flex items-center flex-wrap gap-2 mt-2">
              <span className="bg-teal-100 text-teal-800 text-sm font-medium px-3 py-1 rounded-full">
                {selectedPlan.planId?.name}
              </span>
              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                ₹{selectedPlan.planId?.amount}
              </span>
              <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
                {selectedPlan.planId?.durationDays} days
              </span>
              {selectedPlan.isPaused && (
                <span className="bg-amber-100 text-amber-800 text-sm font-medium px-3 py-1 rounded-full">
                  Currently Paused
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">
              Started on{' '}
              {new Date(selectedPlan.purchaseDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <p className="text-sm text-gray-500">
              {selectedPlan.totalPaused
                ? `Paused ${selectedPlan.totalPaused} days total`
                : 'No pauses yet'}
            </p>
          </div>
        </div>

        {selectedPlan.planId?.description && (
          <p className="text-gray-600 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            {selectedPlan.planId.description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="bg-white min-h-[500px] rounded-xl shadow-sm border border-gray-100 p-6">
        {renderContent()}
      </div>
    </motion.div>
  );
};