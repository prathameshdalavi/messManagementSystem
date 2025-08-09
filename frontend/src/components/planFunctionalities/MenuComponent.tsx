import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config';
import { FaUtensils } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { selectSelectedPlan } from '../../redux/nearbyMessSlice';

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
  const [menu, setMenu] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const selectedPlan = useSelector(selectSelectedPlan);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    if (selectedPlan) {
      fetchMenu();
    }
  }, [selectedPlan]);

  const fetchMenu = async () => {
    if (!selectedPlan?.messId?._id) {
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/menu/seeMenu`, {
        params: { messId: selectedPlan.messId._id }
      });
      
      if (response.data.success) {
        setMenu(response.data.data.menu);
      } else {
        setMenu([]);
      }
    } catch (error: any) {
      setMenu([]);
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Weekly Menu</h3>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-gray-600 mt-2">Loading menu...</p>
        </div>
      ) : menu && menu.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm text-left">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-2 border border-gray-300">Meal / Day</th>
                {daysOfWeek.map((day) => (
                  <th
                    key={day}
                    className={`p-2 border border-gray-300 text-center ${
                      day === today ? 'bg-teal-800' : ''
                    }`}
                  >
                    {day}
                    {day === today && <div className="text-xs font-normal">(Today)</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["breakfast", "lunch", "snacks", "dinner"].map((mealType) => (
                <tr key={mealType}>
                  <td className="p-2 border font-medium bg-gray-100 capitalize">
                    {mealType}
                  </td>
                  {daysOfWeek.map((day) => {
                    const dayMenu = menu.find((item: MenuItem) => item.day === day);
                    return (
                      <td
                        key={day}
                        className={`p-2 border text-gray-700 ${
                          day === today ? 'bg-yellow-50 border-yellow-200' : ''
                        }`}
                      >
                        {dayMenu?.meals[mealType as keyof Meal]?.join(", ") || "-"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaUtensils className="mx-auto text-4xl text-gray-300 mb-4" />
          <p>No menu available for this mess</p>
        </div>
      )}
    </div>
  );
};
