import { useState, type RefObject } from "react";
import { FaLocationArrow, FaUtensils } from "react-icons/fa";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface SearchSectionProps {
  searchRef: RefObject<HTMLDivElement | null>;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ searchRef }) => {
  const navigate = useNavigate();
  const [isLocating, setIsLocating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [nearbyMesses, setNearbyMesses] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleGetCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude: lat, longitude: lng } = position.coords;
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/messes/nearby`, {
        params: { lat, lng },
      });

      navigate("/nearby", { state: { messes: response.data.data } });
    } catch {
      alert("Failed to get location or fetch nearby messes");
    } finally {
      setIsLocating(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLocating(true);
    setShowResults(false);

    try {
      const response = await axios.get(`${BACKEND_URL}/api/v1/user/mess/search`, {
        params: { query: searchQuery },
      });
      setNearbyMesses(response.data?.data || []);
      setShowResults(true);
    } catch {
      setNearbyMesses([]);
      setShowResults(true);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <motion.section
      ref={searchRef}
      className="py-16 px-4 sm:px-6 md:px-8 bg-white"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-gradient-to-r from-teal-500 to-teal-400 border border-teal-400 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div className="bg-white rounded-xl p-6 sm:p-8">
            <motion.h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Find mess near your{" "}
              <span className="text-teal-600">college</span> or{" "}
              <span className="text-teal-600">workspace</span>
            </motion.h2>

            <motion.div className="flex flex-col md:flex-row gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <div className="flex-1 relative">
                <motion.input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter college, area, or hostel name"
                  className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <FaUtensils className="absolute right-4 top-4 text-gray-400" />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  className="bg-teal-500 text-white px-4 py-4 rounded-xl font-semibold hover:bg-teal-600 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <FaLocationArrow className="mr-2" /> Use Current Location
                </button>
                <button
                  onClick={handleSearch}
                  disabled={isLocating || !searchQuery.trim()}
                  className="bg-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-600 transition flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  Search
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              className="mt-8 bg-white rounded-2xl shadow-lg p-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                {nearbyMesses.length > 0
                  ? `Found ${nearbyMesses.length} nearby messes`
                  : "No messes found nearby"}
              </h3>

              {nearbyMesses.length > 0 && (
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  {nearbyMesses.map((mess, i) => (
                    <motion.div
                      key={i}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ y: -3 }}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center">
                          <FaUtensils className="text-teal-500" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-lg">{mess.name}</h4>
                          <p className="text-gray-600 truncate">{mess.address}</p>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                            <span>★ {mess.rating || 4.5}</span>
                            <span>|</span>
                            <span>{mess.distance?.toFixed(2)} km away</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
