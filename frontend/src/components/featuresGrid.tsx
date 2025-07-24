import { FaUtensils, FaUserFriends, FaSyncAlt } from 'react-icons/fa';

export const FeaturesGrid = () => {

    return (
        
              <section className="py-20 px-6 bg-gray-50">
                <div className="max-w-7xl mx-auto">
                  <div className="text-center mb-16">
                    <span className="inline-block bg-teal-100 text-teal-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      WHY CHOOSE US
                    </span>
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                      Smart solutions for <span className="text-teal-600">students</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                      We combine technology with hospitality to create the perfect mess experience for students and working professionals.
                    </p>
                  </div>
        
                  <div className="grid md:grid-cols-3 gap-8">
                    {[
                      {
                        icon: <FaUtensils className="text-3xl text-teal-500" />,
                        title: "Smart Meal Planning",
                        desc: "Meals are prepared based on real attendance—helping reduce food waste and ensuring availability."
                      },
                      {
                        icon: <FaUserFriends className="text-3xl text-teal-500" />,
                        title: "Guest-Friendly Booking",
                        desc: "Book surplus meals for yourself, friends, or visitors—instantly and effortlessly with QR confirmation."
                      },
                      {
                        icon: <FaSyncAlt className="text-3xl text-teal-500" />,
                        title: "Hassle-Free Subscriptions",
                        desc: "Pause, resume, or manage your mess plan anytime. Pay bills, track attendance, and share feedback all online."
                      }
                    ].map((feature, index) => (
                      <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-16 h-16 bg-teal-50 rounded-xl flex items-center justify-center mb-6">
                          {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {feature.desc}
                        </p>
                        <a href="#" className="inline-block mt-4 text-teal-500 font-medium hover:text-teal-600 transition-colors">
                          Learn more →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
        
    )
}