import { useNavigate } from "react-router-dom";


export const NavBar = () => {
    const navigate = useNavigate();
     const handleSignIn = () => {
    navigate('/signin');
  };

    return (
    <nav className="bg-gradient-to-br from-teal-50 to-white shadow-sm py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">KC</span>
            </div>
            <span className="text-2xl font-bold text-teal-600">KhaanaCloud</span>
          </div>

          <button onClick={handleSignIn} className="bg-teal-500 cursor-pointer text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors shadow-md">
            Sign In
          </button>
        </div>
      </nav>
    )
}