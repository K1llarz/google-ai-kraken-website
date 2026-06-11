import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { Skeleton } from '../components/Skeleton';
import { jobOpenings } from '../data';

export function Careers() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <AnimatedSection>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-900 mb-6 tracking-tight">
            Build the future <span className="italic font-light">with us</span>.
          </h1>
          <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto leading-relaxed">
            We are a collective of creators, engineers, and strategists. Join a culture that champions bold ideas and ruthless execution.
          </p>
        </AnimatedSection>
      </section>

      {/* Culture Image */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection>
            <div className="aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-brand-900 relative">
              <img 
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2000" 
                alt="Our Office Culture"
                className="w-full h-full object-cover opacity-80 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-950 via-brand-900/60 to-transparent flex items-end p-12">
                <h3 className="text-4xl md:text-5xl font-display font-bold text-white max-w-2xl">
                  Work shouldn't suck. We make sure of it.
                </h3>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Openings */}
      <section className="py-24 bg-brand-50 border-t border-brand-100">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection className="mb-12 text-center">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mb-3">Join the Team</h2>
            <p className="text-4xl font-display font-bold text-brand-900 mb-4">Open Roles</p>
          </AnimatedSection>
          
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white p-6 md:p-8 rounded-[2rem] border border-brand-100 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="w-full">
                    <Skeleton className="h-8 w-1/2 mb-3 rounded-lg" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20 rounded-full" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                  </div>
                  <Skeleton className="h-12 w-32 rounded-full" />
                </div>
              ))
            ) : (
              jobOpenings.map((job, index) => (
                <AnimatedSection key={job.id} delay={index * 0.1}>
                  <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-brand-100 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg hover:-translate-y-1 hover:border-brand-300 transition-all duration-300">
                    <div>
                      <h3 className="text-2xl font-bold text-brand-900 mb-3">{job.title}</h3>
                      <div className="flex flex-wrap gap-2 text-[10px] uppercase tracking-widest font-bold">
                        <span className="bg-brand-50 border border-brand-100 text-brand-600 px-3 py-1.5 rounded-full">{job.department}</span>
                        <span className="bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1.5 rounded-full">{job.location}</span>
                        <span className="bg-gray-50 border border-gray-200 text-gray-500 px-3 py-1.5 rounded-full">{job.type}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedJob(job.id)}
                      className="w-full md:w-auto bg-brand-600 hover:bg-brand-700 text-white px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-colors whitespace-nowrap shadow-md shadow-brand-500/20"
                    >
                      Apply Now
                    </button>
                  </div>
                </AnimatedSection>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-left">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-lg w-full relative z-10"
            >
              <button 
                onClick={() => setSelectedJob(null)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={24} className="text-gray-500" />
              </button>
              
              <h3 className="text-3xl font-display font-bold text-gray-900 mb-2">Apply Now</h3>
              <p className="text-gray-500 mb-8">We're stoked you want to join us.</p>
              
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio / LinkedIn URL</label>
                  <input type="url" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Why Kroma?</label>
                  <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-medium py-4 rounded-xl mt-4 transition-colors">
                  Submit Application
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
