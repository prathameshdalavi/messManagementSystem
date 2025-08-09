import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { FaBell } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';

export const NoticesComponent: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Get selectedPlan from Redux
  const selectedPlan = useSelector(selectSelectedPlan);

  useEffect(() => {
    if (selectedPlan) {
      fetchNotices();
    }
  }, [selectedPlan]);

  const fetchNotices = async () => {
    if (!selectedPlan?.messId?._id) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/notice/getNotices`, {
        headers: { token },
        params: {
          userId: selectedPlan.userId,
          mess_id: selectedPlan.messId._id
        }
      });
      
      if (response.data.success) {
        setNotices(response.data.data || []);
      } else {
        setNotices([]);
      }
    } catch (error) {
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Notices</h3>
      {loading ? (
        <div className="text-center py-4">Loading notices...</div>
      ) : notices.length > 0 ? (
        notices.map((notice, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-2">{notice.title}</h4>
                <p className="text-gray-600 text-sm mb-2">{notice.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(notice.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaBell className="mx-auto text-4xl text-gray-300 mb-4" />
          <p>No notices available</p>
        </div>
      )}
    </div>
  );
};
