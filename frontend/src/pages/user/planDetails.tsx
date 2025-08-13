import React from 'react';
import { NoticesComponent } from '../../components/planFunctionalities/NoticesComponent';
import { MenuComponent } from '../../components/planFunctionalities/MenuComponent';
import { AttendanceComponent } from '../../components/planFunctionalities/AttendanceComponent';
import { FeedbackComponent } from '../../components/planFunctionalities/FeedbackComponent';
import { PauseResumeComponent } from '../../components/planFunctionalities/PauseResumeComponent';
import { StatisticsComponent } from '../../components/planFunctionalities/StatisticsComponent';

import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';

interface PlanDetailsProps {
  selectedFunctionality: string;
}

export const PlanDetails: React.FC<PlanDetailsProps> = ({ selectedFunctionality }) => {
  // Get selectedPlan from Redux
  const selectedPlan = useSelector(selectSelectedPlan);

  const renderContent = () => {
    switch (selectedFunctionality) {
      case 'notices':
        return <NoticesComponent />;
      case 'menu':
        return <MenuComponent />;
      case 'attendance':
        return <AttendanceComponent />;
      case 'feedback':
        return <FeedbackComponent />;
      case 'pause':
        return <PauseResumeComponent />;
      case 'stats':
        return <StatisticsComponent />;
      
      default:
        return <NoticesComponent />;
    }
  };

  if (!selectedPlan) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Plan Selected</h2>
          <p className="text-gray-600">Please select a plan from the sidebar to view details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {selectedPlan.messId?.messName}
        </h1>
        <p className="text-gray-600">
          {selectedPlan.planId?.name} • ₹{selectedPlan.planId?.amount} • {selectedPlan.planId?.durationDays} days
        </p>
        {selectedPlan.planId?.description && (
          <p className="text-sm text-gray-500 mt-1">
            {selectedPlan.planId.description}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="bg-gray-50 min-h-[500px] rounded-lg p-6">
        {renderContent()}
      </div>
    </div>
  );
};
