import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { FaUser, FaEnvelope, FaPhone, FaUtensils, FaRegClock, FaHistory } from "react-icons/fa";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { FiRotateCw } from "react-icons/fi";

export const ProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ No token → mark as not signed in
    if (!token) {
      setSignedIn(false);
      setLoading(false);
      return;
    }

    // ✅ Token exists → fetch profile
    axios
      .get(`${BACKEND_URL}/api/v1/user/profile/profile`, { headers: { token } })
      .then((res) => {
        if (res.data.success) {
          setProfile(res.data.data);
          setSignedIn(true);
        } else {
          setSignedIn(false);
        }
      })
      .catch((err) => {
        console.error(err);
        setSignedIn(false);
      })
      .finally(() => setLoading(false));
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="text-teal-500 text-4xl"
        >
          <FiRotateCw />
        </motion.div>
      </div>
    );
  }

  // ✅ Show not signed in message
  if (!signedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-teal-500">You are not signed in</h1>
        <p className="text-gray-600 mt-2">Please sign in to view your profile.</p>
      </div>
    );
  }

  // ✅ Show error if no profile data (but user is signed in)
  if (!profile) {
    return (
      <div className="text-center mt-10 text-red-500 font-semibold">
        No profile data found.
      </div>
    );
  }

  const { user, messHistory } = profile;
  // Handle case where messHistory might be undefined or empty
  const plans = messHistory || [];
  const activePlan = plans.find((p: any) => p.isActive);
  const pastPlans = plans.filter((p: any) => !p.isActive);

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto space-y-8 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Page Title */}
      <motion.div
        className="text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 text-transparent bg-clip-text">
          My Profile
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Manage your personal info and mess plan details
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Info Card */}
        <TiltCard>
          <div className="h-full bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-teal-600 mb-4 flex items-center gap-2 border-b pb-2">
              <FaUser className="text-teal-500" /> Basic Information
            </h2>
            <div className="grid gap-4 text-gray-700">
              <InfoItem icon={<FaUser />} label="Name" value={user.name || "Not specified"} />
              <InfoItem icon={<FaEnvelope />} label="Email" value={user.email || "Not specified"} />
              <InfoItem icon={<FaPhone />} label="Phone" value={user.phone || "Not specified"} />
              <InfoItem 
                icon={<FaPhone />} 
                label="Hostel Address" 
                value={user.hostelAddress || "Not specified"} 
              />
            </div>
          </div>
        </TiltCard>

        {/* Active Plan Card */}
        <TiltCard>
          <div className="h-full bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-semibold text-teal-600 mb-4 flex items-center gap-2 border-b pb-2">
              <FaUtensils className="text-teal-500" /> Active Plan
            </h2>
            {activePlan ? (
              <motion.div
                className="bg-gradient-to-br from-teal-50 to-white p-5 rounded-xl border border-teal-200 space-y-3 shadow-sm"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <PlanInfo label="Mess" value={activePlan.messId?.messName || "Not specified"} />
                <PlanInfo label="Plan" value={activePlan.planId?.name || "Not specified"} />
                <PlanInfo 
                  label="Start" 
                  value={new Date(activePlan.purchaseDate).toLocaleDateString()} 
                />
                <PlanInfo 
                  label="Expiry" 
                  value={new Date(activePlan.expiryDate).toLocaleDateString()} 
                />
                <div className="flex items-center gap-2 pt-2">
                  <FaRegClock className="text-teal-500" />
                  <span className="font-medium">Status:</span>
                  <StatusBadge isPaused={activePlan.isPaused} />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <FaUtensils className="text-gray-400 text-3xl mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No Active Plan</p>
                  <p className="text-gray-400 text-sm mt-1">You don't have any active mess plan currently</p>
                </div>
              </motion.div>
            )}
          </div>
        </TiltCard>
      </div>

      {/* Past Plans Section */}
      <motion.div
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-xl font-semibold text-teal-600 mb-4 flex items-center gap-2 border-b pb-2">
          <FaHistory className="text-teal-500" /> Past Plans
        </h2>
        {pastPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {pastPlans.map((plan: any, index: number) => (
              <PlanCard key={index} plan={plan} index={index} />
            ))}
          </div>
        ) : (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <FaHistory className="text-gray-400 text-3xl mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No Past Plans</p>
              <p className="text-gray-400 text-sm mt-1">You haven't had any previous mess plans</p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

// Reusable components
const InfoItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <span className="text-teal-500 mt-1">{icon}</span>
    <div>
      <p className="font-medium text-gray-800">{label}</p>
      <p className="text-gray-600">{value}</p>
    </div>
  </div>
);

const PlanInfo = ({ label, value }: { label: string, value: string }) => (
  <div className="flex justify-between">
    <span className="font-medium text-gray-700">{label}:</span>
    <span className="text-gray-600">{value}</span>
  </div>
);

const StatusBadge = ({ isPaused }: { isPaused: boolean }) => (
  <motion.span
    className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
      isPaused ? "bg-yellow-500" : "bg-teal-500"
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    {isPaused ? "Paused" : "Active"}
  </motion.span>
);

const PlanCard = ({ plan, index }: { plan: any, index: number }) => (
  <TiltCard>
    <motion.div
      className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
    >
      <h3 className="font-semibold text-teal-600">{plan.messId?.messName || "Unknown Mess"}</h3>
      <div className="mt-2 space-y-1 text-sm">
        <p><span className="font-medium">Plan:</span> {plan.planId?.name || "Unknown Plan"}</p>
        <p><span className="font-medium">Duration:</span> {new Date(plan.purchaseDate).toLocaleDateString()} - {new Date(plan.expiryDate).toLocaleDateString()}</p>
        <div className="flex items-center gap-2 pt-1">
          <span className="font-medium">Status:</span>
          <span className={`px-2 py-0.5 rounded-full text-xs ${
            plan.isPaused ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
          }`}>
            {plan.isPaused ? "Paused" : "Completed"}
          </span>
        </div>
      </div>
    </motion.div>
  </TiltCard>
);

// 3D Tilt Card Component
const TiltCard = ({ children }: { children: React.ReactNode }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    animate(x, xPct * 200, { type: "spring", stiffness: 300, damping: 20 });
    animate(y, yPct * 200, { type: "spring", stiffness: 300, damping: 20 });
  };
  
  const handleMouseLeave = () => {
    animate(x, 0, { type: "spring", stiffness: 300, damping: 20 });
    animate(y, 0, { type: "spring", stiffness: 300, damping: 20 });
  };

  return (
    <motion.div
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02, zIndex: 10 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};