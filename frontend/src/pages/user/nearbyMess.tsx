import { useLocation, useNavigate } from 'react-router-dom';
import { FaUtensils } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { setNearbyMess } from '../../redux/nearbyMessSlice';

export const NearbyMessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const messes = location.state?.messes || [];

  const handleMessClick = (mess: any) => {
    dispatch(setNearbyMess(mess));// ✅ store selected mess in Redux
    navigate('/details'); // ✅ don't pass messId anymore, use Redux instead
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Nearby Messes</h2>

          {messes.length === 0 ? (
            <p className="text-gray-600 text-lg">No messes found near you.</p>
          ) : (
            <div className="grid gap-6">
              {messes.map((mess: any) => (
                <div
                  key={mess._id}
                  className="cursor-pointer border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => handleMessClick(mess)}
                >
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mt-2 mr-4">
                      <FaUtensils className="text-teal-500 text-xl" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">{mess.messName}</h4>
                      <p className="text-gray-600">{mess.messLocation}</p>
                      <p className="text-sm text-gray-500 mt-1">Capacity: {mess.capacity}</p>
                      <p className="text-sm text-gray-500">Phone: {mess.phone}</p>
                      <p className="text-sm text-gray-500">Email: {mess.email}</p>
                      {mess.distance && (
                        <p className="text-sm text-gray-500 mt-1">
                          Distance: {mess.distance.toFixed(2)} km
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
