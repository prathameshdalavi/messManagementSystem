import { useRef } from 'react';
import { BACKEND_URL } from '../../config';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const SignupPage = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const countryCodeRef = useRef<HTMLInputElement>(null);
  const hostelRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function signup(event: React.FormEvent) {
    event.preventDefault();

    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const countryCode = countryCodeRef.current?.value || '';
    const phone = phoneRef.current?.value;
    const hostelAddress = hostelRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/auth/signup`, {
        email,
        password,
        name,
        phone: Number(`${countryCode}${phone}`),
        hostelAddress
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const jwtToken = response.data.data.token;
      if (jwtToken) {
        localStorage.setItem("token", jwtToken);
      }

      alert("Signed Up Successfully");
      navigate("/signin");

    } catch (error: any) {
      console.error("Axios error:", error);
      const message = error?.response?.data?.message || "Signup failed. Please try again.";
      alert(message);
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f5f5f5] text-black font-sans">
      {/* Left side with image and heading */}
      <div className="w-1/3 relative hidden lg:flex flex-col justify-center items-center">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=870&q=80"
          alt="Cooking background"
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

      {/* Right side with form */}
      <div className="flex-grow flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm space-y-4">
          <h2 className="text-2xl font-bold text-center">Create Your Free Account</h2>
          <h6 className="font-semibold text-gray-800 text-center">
            Sign up for smarter dining with Mess Management.
          </h6>
          <form onSubmit={signup} className="space-y-1">
            {/* Full Name */}
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm text-gray-900">Full Name</label>
              <input
                ref={nameRef}
                id="name"
                type="text"
                placeholder="Prathamesh Dalavi"
                className="w-full px-4 py-2 bg-white rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm text-gray-900">Email Address</label>
              <input
                ref={emailRef}
                id="email"
                type="email"
                placeholder="prathamesh@example.com"
                className="w-full px-4 py-2 bg-white rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label htmlFor="phone" className="text-sm text-gray-900">Phone Number</label>
              <div className="flex space-x-2">
                <input
                  ref={countryCodeRef}
                  id="countryCode"
                  type="tel"
                  placeholder="+91"
                  className="w-16 px-2 py-2 bg-white rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  ref={phoneRef}
                  id="phone"
                  type="tel"
                  placeholder="XXXXXX3210"
                  className="w-full px-4 py-2 bg-white rounded border border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Hostel Address */}
            <div className="space-y-1">
              <label htmlFor="hostel" className="text-sm text-gray-900">Hostel Address</label>
              <input
                ref={hostelRef}
                id="hostel"
                type="text"
                placeholder="IIT Bombay B Block"
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
              className="w-full cursor-pointer py-3 mt-4 rounded bg-teal-500 text-white font-semibold hover:bg-teal-400 transition"
            >
              Continue
            </button>
          </form>

          <p className="text-xs text-gray-500 text-center">
            By creating an account, you agree to the{' '}
            <span className="underline cursor-pointer">Terms of Service</span> and{' '}
            <span className="underline cursor-pointer">Privacy Policy</span>.
          </p>
          <p className="mt-2 text-sm text-center text-gray-600">
            Already have an account?{' '}
            <span onClick={() => navigate('/signin')} className="text-teal-600 hover:underline cursor-pointer">
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
