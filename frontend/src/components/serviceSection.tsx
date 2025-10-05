import { FaCalendarAlt, FaUtensils, FaCommentAlt, FaUserFriends, FaSearchLocation, FaSyncAlt, FaBell, FaShieldAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export const ServiceSection = () => {   
  const features = [
    { icon: <FaCalendarAlt className="text-3xl" />, title: "Daily Attendance", desc: "Easily mark your presence for each meal with one tap." },
    { icon: <FaUtensils className="text-3xl" />, title: "Live Menu Access", desc: "View daily and weekly menus before you decide to eat." },
    { icon: <FaCommentAlt className="text-3xl" />, title: "Feedback & Ratings", desc: "Submit ratings and suggest improvements directly." },
    { icon: <FaUserFriends className="text-3xl" />, title: "Guest Meal Booking", desc: "Invite parents or friends and book their meal slots." },
    { icon: <FaSearchLocation className="text-3xl" />, title: "Nearby Mess Finder", desc: "Find messes around your hostel or college with availability." },
    { icon: <FaSyncAlt className="text-3xl" />, title: "Flexible Scheduling", desc: "Pause and resume your subscription based on your needs." },
    { icon: <FaBell className="text-3xl" />, title: "Smart Notifications", desc: "Stay updated with reminders and slot availability." },
    { icon: <FaShieldAlt className="text-3xl" />, title: "Secure Payments", desc: "Pay safely with trusted gateways. No hidden charges." }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="inline-block bg-teal-100 text-teal-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            FEATURES
          </span>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything you need, nothing you don't
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Student-first features that make your meal journey easy and enjoyable
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group text-center p-8 rounded-xl hover:bg-teal-50 transition-colors border border-transparent hover:border-teal-100 shadow-sm hover:shadow-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-4 mx-auto transition-colors group-hover:bg-teal-200">
                <span className="text-teal-600">{feature.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
