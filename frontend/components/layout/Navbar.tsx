
import React from 'react';

interface NavbarProps {
  activeSection: string;
  links: { name: string; id: string; href: string }[];
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, links }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090909]/80 backdrop-blur-md border-b border-[#222]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center relative">
        <h1 className="text-2xl font-bold gold-gradient tracking-tight cursor-default">x402-MCP</h1>

        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-xs uppercase tracking-[0.2em]">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`transition-all py-2 border-b-2 font-medium ${activeSection === link.id
                  ? 'text-[#FFD700] border-[#FFD700]'
                  : 'text-silver/60 border-transparent hover:text-white hover:border-white/20'
                }`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};
