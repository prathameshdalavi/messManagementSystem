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

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setSignedIn(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/v1/user/settings/getuser`, {
          headers: { token },
        });

        if (res.data.success) {
          const data = res.data.data;
          setUser(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            password: "",
            phone: data.phone || "",
            hostelAddress: data.hostelAddress || "",
          });
        } else {
          setSignedIn(false);
        }
      } catch (err) {
        console.error(err);
        setSignedIn(false);
      }
    };

    fetchUserData();
  }, []);

  // Not signed in UI
  if (!signedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
        <div className="bg-white p-8 rounded-xl shadow max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-teal-600">Session Expired</h1>
          <p className="text-gray-600 mt-2 mb-6">Please sign in to access your settings.</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save changes
  const handleSave = async () => {
    if (!editField) return;

    try {
      setLoading(true);
      const updateData: Partial<UserSettings> = {
        [editField]: (formData as any)[editField],
      };

      await axios.put(`${BACKEND_URL}/api/v1/user/settings/settings`, updateData, {
        headers: { token: localStorage.getItem("token") || "" },
      });

      if (user) setUser({ ...user, [editField]: (formData as any)[editField] });

      setEditField(null);
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update. Please try again.");
      setLoading(false);
    }
  };

  // Cancel editing
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

  // Render individual field
  const renderField = (label: string, key: keyof UserSettings, icon: React.ReactNode, placeholder?: string) => {
    const isEditing = editField === key;
    const displayValue = key === "password" ? "••••••••" : (user as any)?.[key] || "";

    return (
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
          <div className="p-2 bg-teal-50 rounded-lg text-teal-600">{icon}</div>
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
                  {loading ? "Saving..." : "Save Changes"}
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-500 mt-2">Manage your personal information and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8">
          {[
            { key: "profile", label: "Profile Information" },
            { key: "security", label: "Security" },
            { key: "contact", label: "Contact Details" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-3 font-medium text-sm ${
                activeTab === tab.key
                  ? "text-teal-600 border-b-2 border-teal-600"
                  : "text-gray-500 hover:text-gray-700"
              } transition-colors`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {user ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            {activeTab === "profile" && (
              <>
                {renderField("Full Name", "name", <User className="w-5 h-5" />, "Enter your full name")}
                {renderField("Email Address", "email", <Mail className="w-5 h-5" />, "Enter your email")}
              </>
            )}
            {activeTab === "security" && (
              <>
                {renderField("Password", "password", <Shield className="w-5 h-5" />, "Enter new password")}
              </>
            )}
            {activeTab === "contact" && (
              <>
                {renderField("Phone Number", "phone", <Phone className="w-5 h-5" />, "Enter phone number")}
                {renderField("Hostel Address", "hostelAddress", <MapPin className="w-5 h-5" />, "Enter hostel address")}
              </>
            )}
          </div>
        ) : (
          <div className="flex justify-center items-center h-64 bg-white rounded-xl shadow-sm">
            <span className="text-teal-600">Loading your settings...</span>
          </div>
        )}
      </div>
    </div>
  );
}
