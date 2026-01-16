
import React from 'react';
import { FEATURES } from '../../constants';

export const FeaturesGrid: React.FC = () => (
  <section id="portfolio" className="max-w-7xl mx-auto mt-24 scroll-mt-24">
    <div className="text-center mb-16">
      <h3 className="text-4xl font-bold text-white serif mb-4">Enterprise-Grade Architecture</h3>
      <p className="text-silver/40 max-w-xl mx-auto">Built for reliability, speed, and seamless AI integration.</p>
    </div>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {FEATURES.map((feature, idx) => (
        <div key={idx} className="p-8 bg-[#111] rounded-2xl border border-[#222] hover:bg-[#151515] transition-all gold-border group cursor-default">
          <div className="mb-6 p-3 bg-[#090909] rounded-lg w-fit border border-[#222] group-hover:border-[#FFD700]/50 transition-colors">
            {feature.icon}
          </div>
          <h4 className="text-xl font-bold text-white mb-2 serif">{feature.title}</h4>
          <p className="text-sm text-silver/50 leading-relaxed">{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
);
