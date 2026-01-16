
import React, { useState } from 'react';
import { useActiveSection } from './hooks/useActiveSection';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { FeaturesGrid } from './components/sections/FeaturesGrid';
import { MarketBanner } from './components/sections/MarketBanner';

const NAV_LINKS = [
  { name: 'Intelligence', id: 'intelligence' },
  { name: 'Portfolio', id: 'portfolio' },
  { name: 'Treasury', id: 'treasury' }
];

const App: React.FC = () => {
  const [isTerminalActive, setIsTerminalActive] = useState(false);
  const activeSection = useActiveSection(NAV_LINKS.map(l => l.id));

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar activeSection={activeSection} links={NAV_LINKS} />

      <main className="flex-1 pt-24 pb-12 px-6">
        <Hero 
          onTerminalActivity={setIsTerminalActive} 
          isTerminalActive={isTerminalActive} 
        />
        <FeaturesGrid />
        <MarketBanner />
      </main>

      <Footer />
    </div>
  );
};

export default App;
