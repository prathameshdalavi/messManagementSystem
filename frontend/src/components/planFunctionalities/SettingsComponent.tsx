import React from 'react';

export const SettingsComponent: React.FC = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Settings</h3>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Account Settings</h4>
            <p className="text-sm text-gray-600">Manage your account preferences and settings.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Notification Preferences</h4>
            <p className="text-sm text-gray-600">Configure how you receive notifications.</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Privacy Settings</h4>
            <p className="text-sm text-gray-600">Control your privacy and data sharing preferences.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
