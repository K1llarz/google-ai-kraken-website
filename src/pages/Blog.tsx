import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AnimatedSection } from '../components/AnimatedSection';
import { Skeleton } from '../components/Skeleton';
import { blogPosts } from '../data';

export function Blog() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <AnimatedSection>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-900 tracking-tight">
              Insights.
            </h1>
            <p className="text-xl text-gray-500 font-medium mt-4">
              Thoughts on technology, design, and performance marketing.
            </p>
          </AnimatedSection>
          
          <AnimatedSection delay={0.2} className="w-full md:max-w-sm relative">
            <input 
              type="text" 
              placeholder="Search articles..."
              className="w-full pl-12 pr-4 py-4 rounded-full border border-brand-100 bg-brand-50 focus:outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-400 transition-all shadow-sm text-sm font-medium"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </AnimatedSection>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-brand-100 flex flex-col h-[420px]">
                <Skeleton className="w-full aspect-video rounded-none" />
                <div className="p-8 flex flex-col flex-1">
                  <Skeleton className="w-1/3 h-3 mb-4 rounded-full" />
                  <Skeleton className="w-full h-6 mb-2 rounded-lg" />
                  <Skeleton className="w-4/5 h-6 mb-6 rounded-lg" />
                  <div className="mt-auto pt-6 border-t border-brand-100">
                    <Skeleton className="w-1/2 h-4 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            blogPosts.map((post, index) => (
              <AnimatedSection key={post.id} delay={index * 0.1}>
                <Link to={`/blog/${post.id}`} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-brand-100 flex flex-col h-full group block">
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-black text-brand-900 shadow-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-brand-400 mb-4">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-2xl font-bold font-display text-brand-900 mb-4 group-hover:text-brand-600 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <div className="mt-auto pt-6 border-t border-brand-100">
                      <span className="text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 transition-colors flex items-center gap-1 group-hover:gap-2 duration-300">
                        Read Article <span className="text-brand-400">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              </AnimatedSection>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
