
import { NavBar } from '../../components/navBar';
import { HeroSection } from './heroSection';
import { SearchSection } from '../../components/searchSection';
import { FeaturesGrid } from '../../components/featuresGrid';
import { Footer } from '../../components/footer';
import React from 'react';

export const HomePage = () => {
  const searchRef = React.useRef<HTMLDivElement>(null);
  return (
    <>
      <div className="font-sans bg-white overflow-hidden">

        <NavBar />
        {/* Hero Section */}

        <HeroSection searchRef={searchRef} />
        {/* Search Section */}
        <SearchSection searchRef={searchRef} />

        {/* Features Grid */}
        <FeaturesGrid />



        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};