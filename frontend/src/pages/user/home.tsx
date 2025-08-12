import { motion } from "framer-motion";
import React from "react";
import { FeaturesGrid } from "../../components/featuresGrid";
import { Footer } from "../../components/footer";
import { SearchSection } from "../../components/searchSection";
import { ServiceSection } from "../../components/serviceSection";
import { HeroSection } from "./heroSection";

export const HomePage = () => {
  const searchRef = React.useRef<HTMLDivElement>(null);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="font-sans bg-white overflow-hidden"
    >
      <HeroSection searchRef={searchRef} />
      
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <SearchSection searchRef={searchRef} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <FeaturesGrid />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <ServiceSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Footer />
      </motion.div>
    </motion.div>
  );
};