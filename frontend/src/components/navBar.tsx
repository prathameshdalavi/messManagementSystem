import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const NavBar = () => {
  const navigate = useNavigate();
  const [userInitial, setUserInitial] = useState<string | null>(null);

  const handleSignIn = () => {
    navigate("/signin");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get(`${BACKEND_URL}/api/v1/user/settings/getuser`, {
          headers: {
            token,
          },
        })
        .then((res) => {
          const name = res.data.data?.name ;
          if (name) {
            setUserInitial(name.charAt(0).toUpperCase());
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
          
        });
    }
  }, []);

  return (
    <nav className="bg-gradient-to-br from-teal-50 to-white shadow-sm py-4 px-26 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center pb-1"><span className="font-bold  text-xl text-white">KC</span>
        </div>
        <span className="text-2xl text-teal-700   font-bold">KhaanaCloud</span>
      </div>

      <div>
        {userInitial ? (
          <div className="w-10 h-10 flex items-center justify-center bg-teal-500 text-white rounded-full font-bold">
            {userInitial}
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};
