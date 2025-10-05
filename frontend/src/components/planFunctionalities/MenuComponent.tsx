import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { FaUtensils, FaSync } from 'react-icons/fa';
import { IoFastFoodOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';
import { motion, AnimatePresence } from 'framer-motion';

interface Meal {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

interface MenuItem {
  day: string;
  meals: Meal;
}

export const MenuComponent: React.FC = () => {
  const [menu, setMenu] = useState<MenuItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState<string | null>(null);

  const selectedPlan = useSelector(selectSelectedPlan);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    if (selectedPlan) {
      fetchMenu();
      setActiveDay(today);
    }
  }, [selectedPlan]);

  const fetchMenu = async () => {
    if (!selectedPlan?.messId?._id) return;

    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/menu/seeMenu`, {
        params: { messId: selectedPlan.messId._id }
      });

      if (response.data.success) {
        setMenu(response.data.data.menu);
      } else {
        setMenu(null);
      }
    } catch (error) {
      setMenu(null);
    } finally {
      setLoading(false);
    }
  };

  const mealIcons = {
    breakfast: '☕',
    lunch: '🍽️',
    snacks: '🍎',
    dinner: '🌙'
  };

  const activeDayMenu = menu?.find(item => item.day === activeDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <IoFastFoodOutline className="text-teal-500 text-2xl" />
          Weekly Menu
        </h3>
        <button
          onClick={fetchMenu}
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
          {Object.keys(mealIcons).map((mealType) => (
            <div key={mealType} className="h-24 w-full rounded-lg bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : menu ? (
        <div className="space-y-6">
          {/* Day Selector */}
          <div className="flex overflow-x-auto pb-2 gap-1">
            {daysOfWeek.map((day) => (
              <button
                key={day}
                aria-current={activeDay === day ? 'date' : undefined}
                onClick={() => setActiveDay(day)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeDay === day
                    ? 'bg-teal-600 text-white'
                    : day === today
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
                {day === today && <span className="ml-1">• Today</span>}
              </button>
            ))}
          </div>

          {/* Menu Cards */}
          <AnimatePresence mode="wait">
            {activeDay && activeDayMenu && (
              <motion.div
                key={activeDay}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {Object.entries(mealIcons).map(([mealType, icon]) => {
                  const items = activeDayMenu.meals[mealType as keyof Meal] || [];
                  return (
                    <div key={mealType} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-teal-50 p-2 rounded-lg">
                          <span className="text-xl">{icon}</span>
                        </div>
                        <h4 className="font-semibold text-gray-800 capitalize">{mealType}</h4>
                      </div>
                      {items.length > 0 ? (
                        <ul className="space-y-2 pl-2">
                          {items.map((item, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-teal-500 mt-1">•</span>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-400 pl-2">No items listed</p>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="bg-gray-50 p-6 rounded-full inline-block mb-4">
            <FaUtensils className="mx-auto text-4xl text-gray-300" />
          </div>
          <h4 className="text-lg font-medium text-gray-600 mb-2">No menu available</h4>
          <p className="text-gray-400 max-w-md mx-auto">
            The mess hasn't shared their weekly menu yet. Please check back later.
          </p>
          <button
            onClick={fetchMenu}
            className="mt-4 text-sm text-teal-600 hover:text-teal-800 font-medium transition-colors"
          >
            Check again
          </button>
        </motion.div>
      )}
    </div>
  );
};
