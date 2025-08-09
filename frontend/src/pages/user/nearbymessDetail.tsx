import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { useSelector } from "react-redux";
import { selectNearbyMess } from "../../redux/nearbyMessSlice";
import { useNavigate } from "react-router-dom";

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
  _id: string; // ✅ added _id field
  name: string;
  amount: number;
  description: string;
  durationDays: number;
  features: string[];
  maxNoOfPausePerMonth: number;
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const NearbyMessDetail = () => {
  const mess = useSelector(selectNearbyMess);
  const [menuData, setMenuData] = useState<Record<string, Meal>>({});
  const [planData, setPlanData] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
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
        // Error fetching data
      } finally {
        setLoading(false);
      }
    };

    fetchMenuAndPlans();
  }, [mess]);

  const handleBuyPlan = async (plan: Plan) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin", { state: { from: location.pathname } }); //  pass current path
      return;
    }

    try {
      const response = await axios.post(
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

  if (!mess) return <div className="p-6 text-red-500">No mess selected.</div>;
  if (loading) return <div className="p-6">Loading data...</div>;

  return (
    <div className="min-h-screen bg-white font-sans">
      <div className="p-6 max-w-6xl mx-auto">
        {/* Mess Details */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{mess?.messName}</h1>
          <p className="text-gray-600">{mess?.messLocation}</p>
          <p className="text-sm text-gray-500">Phone: {mess?.phone}</p>
          <p className="text-sm text-gray-500">Email: {mess?.email}</p>
          <p className="text-sm text-gray-500">Capacity: {mess?.capacity}</p>
        </div>

        {/* Weekly Menu */}
        <h2 className="text-3xl font-bold mb-6 text-teal-700">Weekly Menu</h2>
        <div className="overflow-x-auto mb-10">
          <table className="min-w-full border border-gray-300 text-sm text-left">
            <thead className="bg-teal-600 text-white">
              <tr>
                <th className="p-2 border border-gray-300">Meal / Day</th>
                {daysOfWeek.map((day) => (
                  <th key={day} className="p-2 border border-gray-300 text-center">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {["breakfast", "lunch", "snacks", "dinner"].map((mealType) => (
                <tr key={mealType}>
                  <td className="p-2 border font-medium bg-gray-100 capitalize">
                    {mealType}
                  </td>
                  {daysOfWeek.map((day) => (
                    <td key={day} className="p-2 border text-gray-700">
                      {menuData[day]?.[mealType as keyof Meal]?.join(", ") || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Subscription Plans */}
        <h2 className="text-3xl font-bold mt-10 mb-6 text-teal-700">Subscription Plans</h2>
        {planData.length > 0 ? (
          <div className="gap-6">
            {planData.map((plan, index) => (
              <div
                key={index}
                className="border rounded-xl p-6 shadow-lg hover:shadow-xl transition-all bg-white flex justify-between items-center mb-6"
              >
                <div className="flex-1 pr-6">
                  <h3 className="text-xl font-bold text-teal-800 mb-2">{plan.name}</h3>
                  <p className="text-teal-600 font-semibold text-lg mb-1">₹{plan.amount}</p>
                  <p className="text-gray-600 mb-3">{plan.description || "No description provided."}</p>
                  <p className="text-sm text-gray-700"><strong>Duration:</strong> {plan.durationDays} days</p>
                  <p className="text-sm text-gray-700"><strong>Max Pause/Month:</strong> {plan.maxNoOfPausePerMonth}</p>
                  {plan.features?.length > 0 && (
                    <ul className="mt-3 pl-4 list-disc text-sm text-gray-600">
                      {plan.features.map((feature, i) => (
                        <li key={i}>{feature}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex-shrink-0">
                  <button
                    onClick={() => handleBuyPlan(plan)}
                    className="bg-teal-600 text-white cursor-pointer px-10 py-3 rounded-lg hover:bg-teal-700 transition-all"
                  >
                    Buy Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-teal-600">No subscription plans available for this mess.</p>
        )}
      </div>
    </div>
  );
};
