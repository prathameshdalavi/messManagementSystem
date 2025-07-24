import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { NavBar } from "../../components/navBar";

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

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export const NearbyMessDetail = () => {
  const location = useLocation();
  const messId = location.state?.messId;

  const [menuData, setMenuData] = useState<Record<string, Meal>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/menu/seeMenu`, {
          params: { messId }
        });
        console.log("Menu fetched successfully:", response.data.data);
        const menuArray: MenuItem[] = response.data.data.menu;

        const menuMap: Record<string, Meal> = {};
        menuArray.forEach((item) => {
          menuMap[item.day] = item.meals;
        });

        setMenuData(menuMap);
      } catch (error: any) {
        console.error("Error fetching menu:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (messId) fetchMenu();
  }, [messId]);

  if (!messId) return <div className="p-6 text-red-500">No mess selected.</div>;
  if (loading) return <div className="p-6">Loading menu...</div>;

  return (
    <div className="min-h-screen bg-white font-sans">
      <NavBar />
      <div className="p-6 max-w-6xl mx-auto">
        <div>
            <h1 className="text-2xl font-bold mb-4"> {}</h1>
        </div>
        <h2 className="text-3xl font-bold mb-6 text-teal-700">Weekly Menu</h2>
        <div className="overflow-x-auto">
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
                  <td className="p-2 border font-medium bg-gray-100">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</td>
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
      </div>
    </div>
  );
};
