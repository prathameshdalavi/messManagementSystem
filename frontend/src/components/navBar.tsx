import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

interface NavBarProps {
  toggleSidebar?: () => void;
}

export const NavBar = ({ toggleSidebar }: NavBarProps) => {
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
          headers: { token },
        })
        .then((res) => {
          const name = res.data.data?.name;
          if (name) setUserInitial(name.charAt(0).toUpperCase());
        })
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, []);

  return (
    <nav className="bg-gradient-to-br from-teal-50 to-white shadow-sm py-3 px-4 sm:px-8 flex items-center justify-between w-full">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        {/* Hamburger Icon (mobile only) */}
        {toggleSidebar && (
          <button
            className="md:hidden p-2 text-teal-700 hover:bg-teal-100 rounded-lg transition"
            onClick={toggleSidebar}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-teal-700 rounded-full flex items-center justify-center pb-1">
            <span className="font-bold text-xl text-white">AK</span>
          </div>
          <span className="text-xl sm:text-2xl text-teal-700 font-bold">
            Aai'sKitchen
          </span>
        </div>
      </div>

      {/* Right Section */}
      <div>
        {userInitial ? (
          <div className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-teal-500 text-white rounded-full font-bold cursor-pointer">
            {userInitial}
          </div>
        ) : (
          <button
            onClick={handleSignIn}
            className="px-3 sm:px-4 py-2 bg-teal-500 text-white rounded-lg text-sm sm:text-base hover:bg-teal-600 transition"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};
