import React from 'react';
import { motion } from 'motion/react';
import { AnimatedSection } from '../components/AnimatedSection';
import { usePageContent } from '../lib/content';

export function About() {
  const { content } = usePageContent('about');
  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-900 mb-8 tracking-tight">
            {content.heroTitle}
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-3xl mx-auto leading-relaxed">
            {content.heroSubtitle}
          </p>
        </motion.div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden border border-brand-100 shadow-sm relative group">
              <div className="absolute inset-0 bg-brand-600/10 z-10" />
              <img
                src={content.heroImage}
                alt="Our Team"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-brand-50 border-y border-brand-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-brand-900 mb-8 leading-tight">
              {content.missionHeading}
            </h2>
            <div className="h-1 w-20 bg-brand-400 mx-auto rounded-full" />
          </AnimatedSection>
        </div>
      </section>

      {/* Meet the Team Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="mb-16 text-center">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mb-3">Meet the Leadership</h2>
            <p className="text-4xl font-display font-bold text-brand-900 mb-4 tracking-tight">{content.teamHeading}</p>
          </AnimatedSection>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Sarah Chen', role: 'CEO & Founder', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600' },
              { name: 'Marcus Weaver', role: 'Head of Creative', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600' },
              { name: 'Elena Torres', role: 'VP of Performance', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600' },
              { name: 'David Kim', role: 'Lead AI Engineer', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600' }
            ].map((person, i) => (
              <AnimatedSection key={i} delay={i * 0.1}>
                <div className="group context">
                  <div className="relative overflow-hidden rounded-[2rem] aspect-[3/4] mb-4 bg-brand-50 border border-brand-100">
                    <img 
                      src={person.image} 
                      alt={person.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-brand-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm flex items-center justify-center">
                       <span className="text-white text-xs font-bold uppercase tracking-widest border border-white/30 px-4 py-2 rounded-full">View Profile</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold font-display text-brand-900 group-hover:text-brand-600 transition-colors">{person.name}</h3>
                  <p className="text-xs font-bold uppercase tracking-widest text-brand-400 mt-1">{person.role}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
