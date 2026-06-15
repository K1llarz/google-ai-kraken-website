import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../components/AnimatedSection';
import { Skeleton } from '../components/Skeleton';
import { portfolioItems } from '../data';
import { usePageContent } from '../lib/content';

const categories = ['All', 'Performance Marketing', 'Design', 'AI/Tech'];

export function Portfolio() {
  const { content } = usePageContent('portfolio');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const filteredItems = activeCategory === 'All' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-900 mb-6 tracking-tight">
            {content.heroTitle}
          </h1>
          <p className="text-xl font-medium text-gray-500 max-w-2xl mx-auto">
            {content.heroSubtitle}
          </p>
        </AnimatedSection>

        {/* Filters */}
        <AnimatedSection delay={0.2} className="flex flex-wrap justify-center gap-2 mb-16">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === category 
                  ? 'bg-brand-600 text-white border-brand-600 shadow-lg shadow-brand-500/20' 
                  : 'bg-transparent text-gray-400 border-gray-200 hover:border-brand-200 hover:text-brand-900'
              }`}
            >
              {category}
            </button>
          ))}
        </AnimatedSection>

        {/* Gallery */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`skeleton-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="rounded-[2.5rem] aspect-[4/5] bg-brand-50"
                >
                  <Skeleton className="w-full h-full rounded-[2.5rem]" />
                </motion.div>
              ))
            ) : (
              filteredItems.map(item => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  key={item.id}
                  className="group relative overflow-hidden rounded-[2.5rem] aspect-[4/5] bg-gray-100 cursor-pointer border border-brand-100"
                >
                  <Link to={`/portfolio/${item.id}`} className="absolute inset-0 z-20">
                    <span className="sr-only">View Project</span>
                  </Link>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-8">
                    <span className="text-brand-300 text-[10px] uppercase tracking-[0.2em] font-black mb-3 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      {item.category}
                    </span>
                    <h3 className="text-white text-3xl font-display font-bold leading-tight transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                      {item.title}
                    </h3>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </section>
    </div>
  );
}
