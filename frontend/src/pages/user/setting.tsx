import React, { useState, useEffect } from "react";
import axios from "axios";
import { User, Shield, Phone, Mail, MapPin } from "lucide-react";
import { BACKEND_URL } from "../../config";

interface UserSettings {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  hostelAddress?: string;
}

export default function SettingsPage() {
  const [user, setUser] = useState<UserSettings | null>(null);
  const [formData, setFormData] = useState<UserSettings>({
    name: "",
    email: "",
    password: "",
    phone: "",
    hostelAddress: "",
  });
  const [editField, setEditField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signedIn, setSignedIn] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setSignedIn(false);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/settings/getuser`, {
          headers: { token: localStorage.getItem("token") },
        });
        
        if (res.data.success) {
          setUser(res.data.data);
          setFormData({
            name: res.data.data.name || "",
            email: res.data.data.email || "",
            password: "",
            phone: res.data.data.phone || "",
            hostelAddress: res.data.data.hostelAddress || "",
          });
        } else {
          setSignedIn(false);
        }
      } catch (err) {
        console.error("API Error:", err);
        setSignedIn(false);
      }
    };

    fetchUserData();
  }, []);

  if (!signedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md w-full">
          <h1 className="text-2xl font-bold text-teal-600">Session Expired</h1>
          <p className="text-gray-600 mt-2 mb-6">Please sign in to access your settings.</p>
          <button
            onClick={() => window.location.href = "/login"}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      const updateData: Partial<UserSettings> = {};
      if (editField) {
        updateData[editField as keyof UserSettings] = (formData as any)[editField];
      }

      await axios.put(`${BACKEND_URL}/api/v1/user/settings/settings`, updateData, {
        headers: { token: localStorage.getItem("token") },
      });

      if (user && editField) {
        const updatedUser = { ...user, [editField]: (formData as any)[editField] };
        setUser(updatedUser);
      }

      setEditField(null);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update. Please try again.");
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: "",
        phone: user.phone || "",
        hostelAddress: user.hostelAddress || "",
      });
    }
    setEditField(null);
  };

  const renderField = (label: string, key: keyof UserSettings, icon: React.ReactNode, placeholder?: string) => {
    const isEditing = editField === key;
    const displayValue = key === "password" ? "••••••••" : (user as any)?.[key] || "";

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
            {icon}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-800">{label}</h3>
            {!isEditing && (
              <p className={`text-sm mt-1 ${displayValue ? "text-gray-600" : "text-gray-400 italic"}`}>
                {displayValue || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="w-full sm:w-auto sm:min-w-[300px]">
            <div className="flex flex-col gap-4">
              <input
                type={key === "password" ? "password" : "text"}
                name={key}
                value={(formData as any)[key]}
                onChange={handleChange}
                placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                autoFocus
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditField(key)}
            className="text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
          >
            Edit {label}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-2">Manage your personal information and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-3 font-medium text-sm ${activeTab === "profile" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"} transition-colors`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`px-5 py-3 font-medium text-sm ${activeTab === "security" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"} transition-colors`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-5 py-3 font-medium text-sm ${activeTab === "contact" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"} transition-colors`}
          >
            Contact Details
          </button>
        </div>

        {user ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                {renderField("Full Name", "name", <User className="w-5 h-5" />, "Enter your full name")}
                {renderField("Email Address", "email", <Mail className="w-5 h-5" />, "Enter your email")}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div>
                {renderField("Password", "password", <Shield className="w-5 h-5" />, "Enter new password")}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div>
                {renderField("Phone Number", "phone", <Phone className="w-5 h-5" />, "Enter phone number")}
                {renderField("Hostel Address", "hostelAddress", <MapPin className="w-5 h-5" />, "Enter hostel address")}
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
            <div className="flex items-center gap-3 text-teal-600">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading your settings...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}