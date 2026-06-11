import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AnimatedSection } from '../components/AnimatedSection';
import { Skeleton } from '../components/Skeleton';
import { services } from '../data';

export function Services() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-brand-50 min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-20 px-6 bg-brand-100/50 text-brand-900 border-b border-brand-100">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight">
              Our Core Services
            </h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
              We don't do everything. We do what we're exceptionally good at. Here is how we scale brands to the moon.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="space-y-12">
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-brand-100 flex flex-col md:flex-row gap-8 items-start">
                  <Skeleton className="w-20 h-20 rounded-3xl shrink-0" />
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-4">
                      <Skeleton className="h-8 w-1/3 rounded-lg" />
                      <Skeleton className="h-6 w-12 rounded-full" />
                    </div>
                    <Skeleton className="h-4 w-full mb-3 rounded-md" />
                    <Skeleton className="h-4 w-5/6 mb-3 rounded-md" />
                    <Skeleton className="h-4 w-2/3 mb-6 rounded-md" />
                    <Skeleton className="h-4 w-40 rounded-full" />
                  </div>
                </div>
              ))
            ) : (
              services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <AnimatedSection key={service.id} delay={index * 0.05}>
                    <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-brand-100 flex flex-col md:flex-row gap-8 items-start group hover:shadow-xl hover:border-brand-200 transition-all duration-300">
                      <div className="w-20 h-20 rounded-3xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300">
                        <Icon size={32} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-2xl md:text-3xl font-display font-bold text-brand-900 group-hover:text-brand-600 transition-colors">
                            {service.title}
                          </h3>
                          <span className="text-[10px] uppercase tracking-widest font-black text-brand-300 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                            0{index + 1}
                          </span>
                        </div>
                        <p className="text-lg text-gray-600 font-medium leading-relaxed mb-6">
                          {service.description} 
                          At Kroma, we don't just deliver basic setups; we integrate deep technical expertise to ensure maximum yield. We continuously monitor, A/B test, and iterate to achieve unprecedented results.
                        </p>
                        <button className="text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 transition-colors flex items-center gap-1 group-hover:gap-2 duration-300">
                          Explore Methodology <span className="text-brand-400">→</span>
                        </button>
                      </div>
                    </div>
                  </AnimatedSection>
                )
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
