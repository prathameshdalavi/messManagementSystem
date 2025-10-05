import { FaUtensils, FaUserFriends, FaSyncAlt } from "react-icons/fa";

export const FeaturesGrid = () => {
  const features = [
    {
      icon: <FaUtensils className="text-3xl text-teal-500" />,
      title: "Smart Meal Planning",
      desc: "Meals are prepared based on real attendance—helping reduce food waste and ensuring availability.",
    },
    {
      icon: <FaUserFriends className="text-3xl text-teal-500" />,
      title: "Guest-Friendly Booking",
      desc: "Book surplus meals for yourself, friends, or visitors—instantly and effortlessly with QR confirmation.",
    },
    {
      icon: <FaSyncAlt className="text-3xl text-teal-500" />,
      title: "Hassle-Free Subscriptions",
      desc: "Pause, resume, or manage your mess plan anytime. Pay bills, track attendance, and share feedback all online.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Heading Section */}
        <div className="text-center mb-12 sm:mb-16 px-2">
          <span className="inline-block bg-teal-100 text-teal-600 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            WHY CHOOSE US
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Smart solutions for <span className="text-teal-600">students</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl sm:max-w-3xl mx-auto leading-relaxed">
            We combine technology with hospitality to create the perfect mess experience for students and working professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-50 rounded-xl flex items-center justify-center mb-5 sm:mb-6 mx-auto sm:mx-0">
                {feature.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 text-center sm:text-left">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed text-center sm:text-left">
                {feature.desc}
              </p>
              <div className="text-center sm:text-left">
                <a
                  href="#"
                  className="inline-block mt-4 text-teal-500 font-medium hover:text-teal-600 transition-colors text-sm sm:text-base"
                >
                  Learn more →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
