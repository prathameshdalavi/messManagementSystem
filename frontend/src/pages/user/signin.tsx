// src/pages/SignInPage.tsx
import { useRef } from 'react';
import { BACKEND_URL } from '../../config';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const SignInPage = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signin(event: React.FormEvent) {
    event.preventDefault();

    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/auth/signin`, {
        email,
        password
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const jwtToken = response.data.data.token;
      if (jwtToken) {
        localStorage.setItem("token", jwtToken);
        alert("Signed In Successfully");
        navigate("/"); // Change to "/dashboard" or "/home" as needed
      }

    } catch (error: any) {
      console.error("Sign in error:", error);
      const message = error?.response?.data?.message || "Sign in failed. Please try again.";
      alert(message);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f5f5f5] text-black font-sans">
      {/* Left section with image and heading */}
      <div className="w-1/3 relative hidden lg:flex flex-col justify-center items-center">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
          alt="Dining background"
          className="absolute inset-0 object-cover w-full h-full z-0"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#191919] via-black/50 to-transparent z-10" />
        <div className="relative z-20 p-8 text-center text-white">
          <h1 className="text-4xl font-bold leading-snug">
            Eat well, Manage better <br />
            <span className="text-teal-500">Mess Management</span>
          </h1>
        </div>
      </div>

      {/* Right side form */}
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold text-center">Welcome Back</h2>
          <h6 className="font-semibold text-gray-800 text-center">
            Sign in to manage your mess account.
          </h6>
          <form onSubmit={signin} className="space-y-1">
            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-gray-900">Email Address</label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 bg-white rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="password" className="text-sm text-gray-900">Password</label>
              <input
                ref={passwordRef}
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-white rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 mt-4 rounded bg-teal-500 text-white font-semibold hover:bg-teal-400 transition"
            >
              Sign In
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            By signing in, you agree to the{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
          <p className="mt-2 text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <span onClick={() => navigate('/signup')} className="text-teal-600 hover:underline cursor-pointer">
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
