import { motion } from "framer-motion";
import dashboardImg from '../../assets/dashboard.png';

type HeroSectionProps = {
  searchRef: React.RefObject<HTMLDivElement | null>;
};

export const HeroSection = ({ searchRef }: HeroSectionProps) => {
  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.section 
      className="relative bg-gradient-to-br from-teal-50 to-white py-24 px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Animated background blobs */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div 
          className="absolute top-20 left-20 w-64 h-64 bg-teal-300 rounded-full filter blur-3xl"
          animate={{
            y: [0, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-20 w-80 h-80 bg-teal-200 rounded-full filter blur-3xl"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring",
              damping: 10,
              stiffness: 100,
              duration: 0.8,
              delay: 0.2
            }}
          >
            <motion.h1 
              className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                damping: 10,
                delay: 0.4
              }}
            >
              Effortless <motion.span 
                className="text-teal-600"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  damping: 10,
                  delay: 0.6
                }}
              >Eating,</motion.span> One Click Away.
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                damping: 10,
                delay: 0.6
              }}
            >
              Life at a professionally managed mess awaits you. Move in without having to pay a fortune.
            </motion.p>
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                damping: 10,
                delay: 0.8
              }}
            >
              <motion.button 
                onClick={scrollToSearch}
                className="bg-teal-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-teal-600 transition-colors shadow-lg hover:shadow-xl"
                whileHover={{ 
                  y: -2,
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                Find Mess Near You
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              type: "spring",
              damping: 10,
              stiffness: 100,
              duration: 0.8, 
              delay: 0.4 
            }}
          >
            <motion.div 
              className="relative w-full h-96 rounded-3xl shadow-2xl overflow-hidden"
              whileHover={{ 
                y: -5,
                transition: { duration: 0.3 }
              }}
            >
              <motion.img
                src={dashboardImg}
                alt="Dashboard Preview"
                className="w-full h-full object-cover"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ 
                  type: "spring",
                  damping: 10,
                  duration: 1.2, 
                  delay: 0.6 
                }}
              />
            </motion.div>
            <motion.div 
              className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-100"
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                type: "spring",
                damping: 10,
                delay: 1 
              }}
              whileHover={{
                rotate: [0, 2, -2, 0],
                transition: { duration: 0.5 }
              }}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                  <motion.span 
                    className="text-teal-500 text-xl"
                    animate={{ 
                      rotate: [0, 10, -10, 0],
                      y: [0, -5, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  >🏆</motion.span>
                </div>
                <div>
                  <div className="text-teal-600 font-bold text-xl">50,000+</div>
                  <div className="text-gray-600 text-sm">Happy Diners</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};