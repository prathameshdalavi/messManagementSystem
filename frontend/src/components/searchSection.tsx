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
    const [searchQuery, setSearchQuery] = useState('');
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
                params: { lat, lng }
            });

            navigate('/nearby', {
                state: { messes: response.data.data },
            });
        } catch (error) {
            alert('Failed to get location or fetch nearby messes');
        } finally {
            setIsLocating(false);
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        try {
            setIsLocating(true);
            setShowResults(false);

            const response = await axios.get(`${BACKEND_URL}/api/v1/user/mess/search`, {
                params: { query: searchQuery }
            });

            setNearbyMesses(response.data?.data || []);
            setShowResults(true);
        } catch (error) {
            alert('Search failed');
            setNearbyMesses([]);
            setShowResults(true);
        } finally {
            setIsLocating(false);
        }
    };

    return (
        <motion.section 
            ref={searchRef} 
            className="py-16 px-6 bg-white"
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
                    <motion.div 
                        className="bg-white rounded-xl p-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <motion.h2 
                            className="text-3xl font-bold text-gray-900 mb-6 text-center"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Find mess near your <span className="text-teal-600">college</span> or <span className="text-teal-600">workspace</span>
                        </motion.h2>
                        
                        <motion.div 
                            className="flex flex-col md:flex-row gap-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="flex-1 relative">
                                <motion.input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter college, area, or hostel name"
                                    className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    whileFocus={{ 
                                        scale: 1.01,
                                        boxShadow: "0 0 0 2px rgba(16, 185, 129, 0.5)"
                                    }}
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1 }}
                                />
                                <motion.div 
                                    className="absolute right-4 top-4 text-gray-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1.2 }}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </motion.div>
                            </div>
                            <motion.div 
                                className="flex gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1.4 }}
                            >
                                <motion.button
                                    onClick={handleGetCurrentLocation}
                                    disabled={isLocating}
                                    className="bg-teal-500 text-white px-4 py-4 rounded-xl font-semibold hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                    title="Use current location"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLocating ? (
                                        <motion.svg 
                                            className="h-5 w-5 text-white" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </motion.svg>
                                    ) : (
                                        <FaLocationArrow className="text-lg" />
                                    )}
                                </motion.button>
                                <motion.button
                                    onClick={handleSearch}
                                    disabled={isLocating || !searchQuery.trim()}
                                    className="bg-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {isLocating ? (
                                        <motion.svg 
                                            className="h-5 w-5 text-white" 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            fill="none" 
                                            viewBox="0 0 24 24"
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </motion.svg>
                                    ) : (
                                        <span>Search</span>
                                    )}
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Results Section */}
                <AnimatePresence>
                    {showResults && (
                        <motion.div 
                            className="mt-8 bg-white rounded-2xl shadow-lg p-6"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <motion.h3 
                                className="text-xl font-bold text-gray-900 mb-4"
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                {nearbyMesses.length > 0
                                    ? `Found ${nearbyMesses.length} nearby messes`
                                    : "No messes found nearby"}
                            </motion.h3>

                            {nearbyMesses.length > 0 && (
                                <motion.div 
                                    className="grid md:grid-cols-2 gap-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    {nearbyMesses.map((mess, index) => (
                                        <motion.div 
                                            key={index} 
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ 
                                                delay: 0.4 + index * 0.1,
                                                type: "spring",
                                                stiffness: 100,
                                                damping: 10
                                            }}
                                            whileHover={{ y: -5 }}
                                        >
                                            <div className="flex items-start">
                                                <motion.div 
                                                    className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mr-4"
                                                    whileHover={{ rotate: 5 }}
                                                >
                                                    <FaUtensils className="text-teal-500" />
                                                </motion.div>
                                                <div>
                                                    <h4 className="font-bold text-lg">{mess.name}</h4>
                                                    <p className="text-gray-600">{mess.address}</p>
                                                    <div className="flex items-center mt-2">
                                                        <span className="text-yellow-500">★ {mess.rating || '4.5'}</span>
                                                        <span className="mx-2 text-gray-300">|</span>
                                                        <span className="text-gray-600">{mess.distance} km away</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.section>
    )
}