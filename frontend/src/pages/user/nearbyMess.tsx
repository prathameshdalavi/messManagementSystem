import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaUtensils,
  FaMapMarkerAlt,
  FaUsers,
  FaPhone,
  FaEnvelope,
  FaRoad,
} from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setNearbyMess } from '../../redux/nearbyMessSlice';
import { motion } from 'framer-motion';

export const NearbyMessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messes = location.state?.messes || [];

  const handleMessClick = (mess: any) => {
    dispatch(setNearbyMess(mess));
    navigate('/details');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-10 sm:mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500 text-transparent bg-clip-text mb-3">
              Nearby Messes
            </h1>
            <p className="text-gray-600 text-base sm:text-lg">
              Find the best mess services near your location
            </p>
          </motion.div>

          {messes.length === 0 ? (
            <motion.div
              className="text-center py-10 px-6 bg-white rounded-xl shadow-sm border border-gray-200 max-w-md mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <FaUtensils className="text-gray-300 text-5xl mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
                No messes found
              </h3>
              <p className="text-gray-500 mt-2 text-sm sm:text-base">
                We couldn't find any mess services near your location.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
              {messes.map((mess: any, index: number) => (
                <motion.div
                  key={mess._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div
                    onClick={() => handleMessClick(mess)}
                    className="h-full bg-white p-5 sm:p-6 rounded-xl shadow-md border border-gray-100 cursor-pointer transition-all hover:shadow-lg hover:border-teal-200"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-100 to-teal-50 rounded-xl flex items-center justify-center shadow-inner">
                        <FaUtensils className="text-teal-600 text-xl sm:text-2xl" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                          {mess.messName}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                          <FaMapMarkerAlt className="text-teal-500" />
                          <p className="truncate">{mess.messLocation || "Location not specified"}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 text-gray-700">
                          <FaUsers className="text-emerald-500" />
                          <span className="font-medium">Capacity:</span>
                          <span>{mess.capacity || "N/A"}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 text-gray-700">
                          <FaPhone className="text-blue-500" />
                          <span className="font-medium">Phone:</span>
                          <span className="truncate">{mess.phone || "N/A"}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 text-gray-700">
                        <FaEnvelope className="text-purple-500" />
                        <span className="font-medium">Email:</span>
                        <span className="truncate">{mess.email || "N/A"}</span>
                      </div>

                      {mess.distance && (
                        <div className="bg-gray-50 p-3 rounded-lg flex items-center gap-2 text-gray-700">
                          <FaRoad className="text-amber-500" />
                          <span className="font-medium">Distance:</span>
                          <span>{(mess.distance / 1000).toFixed(2)} km</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
