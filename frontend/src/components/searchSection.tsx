import React, { useState, type RefObject } from "react";
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

      navigate("/nearby", { state: { messes: response.data?.data || [] } });
    } catch (err) {
      console.error("Location / nearby error:", err);
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
        params: { q: searchQuery },
      });

      setNearbyMesses(response.data?.data || []);
      setShowResults(true);
    } catch (err) {
      console.error("Search error:", err);
      setNearbyMesses([]);
      setShowResults(true);
    } finally {
      setIsLocating(false);
    }
  };

  const handleResultClick = (mess: any) => {
    navigate("/nearby", { state: { messes: [mess] } });
  };

  return (
    <motion.section
      ref={searchRef}
      className="py-12 px-4 sm:px-6 md:px-8 bg-white"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="bg-gradient-to-r from-teal-500 to-teal-400 rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-xl p-5 sm:p-6 md:p-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 text-center">
              Find mess near your <span className="text-teal-600">college</span> or{" "}
              <span className="text-teal-600">workspace</span>
            </h2>

            <div className="flex flex-col md:flex-row items-stretch gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter college, area, or hostel name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-base sm:text-lg"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  aria-label="Search mess"
                />
                <FaUtensils className="absolute right-4 top-3 text-gray-400 hidden sm:block" />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={isLocating}
                  className="flex items-center justify-center gap-2 bg-teal-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-teal-600 transition disabled:opacity-70"
                  aria-label="Use current location"
                >
                  <FaLocationArrow />{" "}
                  <span className="hidden sm:inline">Use Current Location</span>
                </button>

                <button
                  onClick={handleSearch}
                  disabled={isLocating || !searchQuery.trim()}
                  className="bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-70"
                  aria-label="Search"
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              className="mt-6 bg-white rounded-2xl shadow-lg p-4 sm:p-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">
                {nearbyMesses.length > 0
                  ? `Found ${nearbyMesses.length} mess${nearbyMesses.length > 1 ? "es" : ""}`
                  : "No messes found"}
              </h3>

              {nearbyMesses.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {nearbyMesses.map((mess, i) => (
                    <motion.div
                      key={mess._id || i}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer flex flex-col"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.04 * i }}
                      whileHover={{ y: -4 }}
                      onClick={() => handleResultClick(mess)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => (e.key === "Enter" ? handleResultClick(mess) : null)}
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FaUtensils className="text-teal-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-base sm:text-lg truncate">
                            {mess.messName || mess.name}
                          </h4>
                          <p className="text-sm text-gray-600 truncate">
                            {mess.messLocation || mess.address}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                            <span>★ {mess.rating ?? 4.5}</span>
                            {mess.distance != null && (
                              <>
                                <span className="hidden sm:inline">|</span>
                                <span>{Number(mess.distance).toFixed(2)} km away</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-gray-500">
                  Try a different keyword or use your current location.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
