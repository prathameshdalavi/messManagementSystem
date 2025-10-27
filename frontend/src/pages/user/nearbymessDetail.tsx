import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useSelector } from "react-redux";
import { selectNearbyMess } from "../../redux/nearbyMessSlice";
import { useNavigate } from "react-router-dom";
import { 
  FaUtensils, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaUsers, 
  FaCalendarAlt, 
  FaPauseCircle,
  FaCoffee,
  FaSun,   
  FaMoon,
  FaAppleAlt,
  FaCheck,
  FaStar,
} from "react-icons/fa";
import { motion } from "framer-motion";

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

interface Plan {
  _id: string;
  name: string;
  amount: number;
  description: string;
  durationDays: number;
  features: string[];
  maxNoOfPausePerMonth: number;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const mealIcons = {
  breakfast: <FaCoffee className="text-amber-500" />,
  lunch: <FaSun className="text-orange-500" />,
  dinner: <FaMoon className="text-indigo-500" />,
  snacks: <FaAppleAlt className="text-green-500" />
};

export const NearbyMessDetail = () => {
  const mess = useSelector(selectNearbyMess);
  const [menuData, setMenuData] = useState<Record<string, Meal>>({});
  const [planData, setPlanData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'menu' | 'plans'>('menu');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuAndPlans = async () => {
      try {
        if (!mess?._id) return;

        const menuRes = await axios.get(`${BACKEND_URL}/api/v1/user/menu/seeMenu`, {
          params: { messId: mess._id },
        });
        const menuArray: MenuItem[] = menuRes.data.data.menu;
        const menuMap: Record<string, Meal> = {};
        menuArray.forEach((item) => {
          menuMap[item.day] = item.meals;     
        });
        setMenuData(menuMap);

        const planRes = await axios.get(`${BACKEND_URL}/api/v1/user/plan/getPlans`, {
          params: { messId: mess._id },
        });
        setPlanData(planRes.data.data || []);
      } catch (error: any) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuAndPlans();   
  }, [mess]);

  const handleBuyPlan = async (plan: Plan) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin", { state: { from: location.pathname } });
      return;
    }

    try {
      await axios.post(
        `${BACKEND_URL}/api/v1/user/buyPlan/buyPlan`,
        { planId: plan._id },
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
      alert("Plan purchased successfully!");
    } catch (error: any) {
      alert(error?.response?.data?.message || "Failed to buy plan.");
    }
  };

  const getPlanVariant = (index: number) => {
    const variants = [
      { bg: "bg-gradient-to-br from-blue-50 to-cyan-50", border: "border-blue-200", accent: "bg-blue-500" },
      { bg: "bg-gradient-to-br from-purple-50 to-pink-50", border: "border-purple-200", accent: "bg-purple-500" },
      { bg: "bg-gradient-to-br from-emerald-50 to-teal-50", border: "border-emerald-200", accent: "bg-emerald-500" },
    ];
    return variants[index % variants.length];
  };

  if (!mess) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 max-w-md bg-white rounded-2xl shadow-xl border border-gray-100"
      >
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaUtensils className="text-2xl text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Mess Selected</h2>
        <p className="text-gray-600 mb-6">Please select a mess to view details</p>
        <button 
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl hover:from-teal-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Back to Messes
        </button>
      </motion.div>
    </div>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-4 text-teal-600"
      >
        <div className="relative">
          <svg className="animate-spin h-12 w-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-700">Loading mess details</h3>
          <p className="text-sm text-gray-500">Please wait a moment...</p>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 font-sans pb-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Mess Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaUtensils className="text-white text-2xl" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">{mess.messName}</h1>
                    <div className="flex items-center gap-2 mt-2">
                      <FaMapMarkerAlt className="text-gray-500 text-sm" />
                      <span className="text-gray-600">{mess.messLocation}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full">
                    <FaStar className="text-amber-500" />
                    <span className="font-medium text-amber-800">Premium Mess</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaPhone className="text-blue-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Phone</p>
                    <p className="text-gray-800 font-semibold">{mess.phone}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FaEnvelope className="text-purple-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Email</p>
                    <p className="text-gray-800 font-semibold text-sm">{mess.email}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaUsers className="text-green-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Capacity</p>
                    <p className="text-gray-800 font-semibold">{mess.capacity} people</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FaStar className="text-amber-600 text-sm" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">Rating</p>
                    <p className="text-gray-800 font-semibold">4.8/5</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-gray-100 p-1 shadow-inner">
            <button
              onClick={() => setActiveTab('menu')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'menu' 
                  ? 'bg-teal-500 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaUtensils />
              Weekly Menu
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'plans' 
                  ? 'bg-teal-500 text-white shadow-md' 
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaCalendarAlt />
              Subscription Plans
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {activeTab === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-500 rounded-xl flex items-center justify-center shadow-lg">
                    <FaUtensils className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Weekly Menu</h2>
                    <p className="text-gray-600">Delicious meals planned for every day</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="p-4 text-left font-bold text-gray-700">Meal</th>
                        {daysOfWeek.map((day) => (
                          <th key={day} className="p-4 text-center font-bold text-gray-700">{day}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {["breakfast", "lunch", "snacks", "dinner"].map((mealType, index) => (
                        <motion.tr 
                          key={mealType} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="hover:bg-gray-50 transition-all duration-300"
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              {mealIcons[mealType as keyof typeof mealIcons]}
                              <span className="font-semibold text-gray-700 capitalize">{mealType}</span>
                            </div>
                          </td>
                          {daysOfWeek.map((day) => (
                            <td key={day} className="p-4 text-center">
                              <div className="text-gray-600 font-medium">
                                {menuData[day]?.[mealType as keyof Meal]?.join(", ") || (
                                  <span className="text-gray-400 italic">Not available</span>
                                )}
                              </div>
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="plans"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="p-6"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <FaCalendarAlt className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Subscription Plans</h2>
                  <p className="text-gray-600">Choose the perfect plan for your needs</p>
                </div>
              </div>

              {planData.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {planData.map((plan, index) => {
                    const variant = getPlanVariant(index);
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className={`${variant.bg} rounded-xl shadow-md overflow-hidden border ${variant.border} relative`}
                      >
                        <div className="p-6">
                          <div className="text-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                            <div className="flex items-center justify-center gap-2 mb-3">
                              <span className="text-3xl font-bold text-gray-800">₹{plan.amount}</span>
                              <span className="text-gray-600">/{plan.durationDays} days</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                              {plan.description || "Perfect for regular meal requirements"}
                            </p>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3 text-gray-700">
                              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                                <FaCalendarAlt className="text-green-600 text-xs" />
                              </div>
                              <span className="text-sm">{plan.durationDays} days validity</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-700">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                                <FaPauseCircle className="text-blue-600 text-xs" />
                              </div>
                              <span className="text-sm">{plan.maxNoOfPausePerMonth} pauses per month</span>
                            </div>

                            {plan.features?.length > 0 && (
                              <div className="mt-4">
                                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2 text-sm">
                                  <FaCheck className="text-green-500" />
                                  Features included
                                </h4>
                                <ul className="space-y-1">
                                  {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-2 text-gray-700 text-sm">
                                      <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                                        <FaCheck className="text-green-600 text-xs" />
                                      </div>
                                      <span>{feature}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleBuyPlan(plan)}
                            className={`w-full ${variant.accent} hover:opacity-90 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 shadow-md`}
                          >
                            Buy Now
                          </motion.button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-50 rounded-xl p-12 text-center border border-gray-200"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCalendarAlt className="text-gray-500 text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No Plans Available</h3>
                  <p className="text-gray-500">This mess hasn't set up any subscription plans yet.</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};