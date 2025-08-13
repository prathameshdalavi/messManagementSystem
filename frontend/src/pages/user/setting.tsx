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
    axios
      .get(`${BACKEND_URL}/api/v1/user/settings/getuser`, {
        headers: { token: localStorage.getItem("token") },
      })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.data);
          setFormData({
            name: res.data.name || "",
            email: res.data.email || "",
            password: "",
            phone: res.data.phone || "",
            hostelAddress: res.data.hostelAddress || "",
          });
        }
        else{
          setSignedIn(false);
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, []);
  if (!signedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-teal-500">You are not signed in</h1>
        <p className="text-gray-600 mt-2">Please sign in to access your settings.</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-gray-100 last:border-0">
        <div className="flex items-center gap-3 mb-3 sm:mb-0">
          <div className="text-teal-500">{icon}</div>
          <div>
            <h3 className="font-medium text-gray-700">{label}</h3>
            {!isEditing && (
              <p className={`text-sm ${displayValue ? "text-gray-600" : "text-gray-400 italic"}`}>
                {displayValue || "Not provided"}
              </p>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="w-full sm:w-auto sm:min-w-[300px]">
            <div className="flex flex-col gap-3">
              <input
                type={key === "password" ? "password" : "text"}
                name={key}
                value={(formData as any)[key]}
                onChange={handleChange}
                placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditField(key)}
            className="text-sm text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            Edit
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1">
        <div className="max-w-9xl mx-auto p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Account Settings</h1>
            <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-2 font-medium ${activeTab === "profile" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-4 py-2 font-medium ${activeTab === "security" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-4 py-2 font-medium ${activeTab === "contact" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              Contact
            </button>
          </div>

          {user ? (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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
            <div className="flex justify-center items-center h-64 bg-white rounded-xl">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}