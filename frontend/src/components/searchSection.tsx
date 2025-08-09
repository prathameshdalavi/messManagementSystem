import { useState, type RefObject } from "react";
import { FaLocationArrow, FaUtensils } from "react-icons/fa";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
        <section ref={searchRef} className="py-16 px-6 bg-white">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gradient-to-r from-teal-500 to-teal-400 border border-teal-400 rounded-2xl shadow-xl">
                    <div className="bg-white rounded-xl p-6">
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            Find mess near your <span className="text-teal-600">college</span> or <span className="text-teal-600">workspace</span>
                        </h2>
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Enter college, area, or hostel name"
                                    className="w-full px-6 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <div className="absolute right-4 top-4 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleGetCurrentLocation}
                                    disabled={isLocating}
                                    className="bg-teal-500 text-white px-4 py-4 rounded-xl font-semibold hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                    title="Use current location"
                                >
                                    {isLocating ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <FaLocationArrow className="text-lg" />
                                    )}
                                </button>
                                <button
                                    onClick={handleSearch}
                                    disabled={isLocating || !searchQuery.trim()}
                                    className="bg-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLocating ? (
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    ) : (
                                        <span>Search</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {showResults && (
                    <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            {nearbyMesses.length > 0
                                ? `Found ${nearbyMesses.length} nearby messes`
                                : "No messes found nearby"}
                        </h3>

                        {nearbyMesses.length > 0 && (
                            <div className="grid md:grid-cols-2 gap-4">
                                {nearbyMesses.map((mess, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-start">
                                            <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                                                <FaUtensils className="text-teal-500" />
                                            </div>
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
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}