import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { FaBell, FaRegBell, FaSync } from 'react-icons/fa';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';
import { motion, AnimatePresence } from 'framer-motion';

export const NoticesComponent: React.FC = () => {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedNotice, setExpandedNotice] = useState<number | null>(null);

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
          mess_id: selectedPlan.messId._id,
        },
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

  const toggleExpandNotice = (index: number) => {
    setExpandedNotice(expandedNotice === index ? null : index);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <IoIosNotificationsOutline className="text-teal-500" />
          Notices & Alerts
        </h3>
        <button
          onClick={fetchNotices}
          className="text-sm text-teal-600 hover:text-teal-800 transition-colors flex items-center gap-1"
          disabled={loading}
        >
          <FaSync className={`text-sm ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 w-full rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : notices.length > 0 ? (
        <div className="space-y-4">
          <AnimatePresence>
            {notices.map((notice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-teal-100 transition-all 
                  ${expandedNotice === index ? 'ring-2 ring-teal-200' : ''}`}
              >
                <div className="cursor-pointer" onClick={() => toggleExpandNotice(index)}>
                  <div className="flex items-start gap-3">
                    <div className="bg-teal-50 p-2 rounded-full">
                      <FaRegBell className="text-teal-500 text-lg" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-1">
                          {notice.title}
                        </h4>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                          {formatDate(notice.createdAt)}
                        </span>
                      </div>
                      <p
                        className={`text-gray-600 text-sm ${
                          expandedNotice === index ? '' : 'line-clamp-2'
                        }`}
                      >
                        {notice.message}
                      </p>
                    </div>
                  </div>
                </div>

                {expandedNotice === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 pt-3 border-t border-gray-100"
                  >
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Posted by: {notice.postedBy?.name || 'Mess Admin'}</span>
                      <button
                        className="text-teal-500 hover:text-teal-700"
                        onClick={() => toggleExpandNotice(index)}
                      >
                        Show less
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="bg-gray-50 p-6 rounded-full inline-block mb-4">
            <FaBell className="mx-auto text-4xl text-gray-300" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">No notices available</h4>
          <p className="text-gray-400 max-w-md mx-auto">
            You'll see important alerts and announcements here when they're posted by your mess.
          </p>
          <button
            onClick={fetchNotices}
            className="mt-4 text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
          >
            Check for updates
          </button>
        </motion.div>
      )}
    </div>
  );
};
