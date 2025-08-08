
import { HeroSection } from './heroSection';
import { SearchSection } from '../../components/searchSection';
import { FeaturesGrid } from '../../components/featuresGrid';
import { Footer } from '../../components/footer';
import React from 'react';
import { ServiceSection } from '../../components/serviceSection';

export const HomePage = () => {
  const searchRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="font-sans bg-white overflow-hidden">

        <HeroSection searchRef={searchRef} />
        {/* Search Section */}
        <SearchSection searchRef={searchRef} />

        {/* Features Grid */}
        <FeaturesGrid />

        <ServiceSection />

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};