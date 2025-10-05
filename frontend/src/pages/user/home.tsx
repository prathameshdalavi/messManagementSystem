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
      className="font-sans bg-white flex flex-col min-h-screen overflow-x-hidden "
    >
      {/* Hero Section */}
      <HeroSection searchRef={searchRef} />

      {/* Main Content */}
      <main className="flex-1 w-full">
        {/* Search Section */}
        <section className="px-4 sm:px-6 md:px-10 lg:px-16">
          <SearchSection searchRef={searchRef} />
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 md:px-10 lg:px-16 mt-16">
          <FeaturesGrid />
        </section>

        {/* Services Section */}
        <section className="px-4 sm:px-6 md:px-10 lg:px-16 mt-16">
          <ServiceSection />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </motion.div>
  );
};
