
import React, { useState } from 'react';
import { useActiveSection } from './hooks/useActiveSection';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { FeaturesGrid } from './components/sections/FeaturesGrid';

const NAV_LINKS = [
  { name: 'Documentation', id: 'docs', href: '#' },
  { name: 'GitHub', id: 'github', href: 'https://github.com/FlemingJohn/x402-mcp-bridge' },
  { name: 'Tools', id: 'tools', href: '#features' }
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
      </main>

      <Footer />
    </div>
  );
};

export default App;
