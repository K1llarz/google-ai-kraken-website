import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../components/AnimatedSection';
import { services, portfolioItems } from '../data';
import { usePageContent } from '../lib/content';

export function Home() {
  const { content } = usePageContent('home');
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-start overflow-hidden bg-brand-200 mx-6 mt-6 pt-24 rounded-[2.5rem] group">
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/50 to-transparent z-10" />
        
        <div className="relative z-20 max-w-7xl mx-auto px-10 w-full mb-10 mt-auto">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className=" max-w-3xl"
          >
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-display leading-[0.9] text-white drop-shadow-2xl mb-8 font-bold tracking-tight">
              {content.heroTitle}
            </h1>
            <p className="text-lg md:text-xl text-brand-50 mb-10 leading-relaxed max-w-xl font-medium">
              {content.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link to="/contact" className="bg-white text-brand-600 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-50 transition-colors shadow-xl">
                {content.heroCtaLabel}
              </Link>
              <span className="text-white/90 text-sm font-semibold tracking-wide">
                Trusted by 150+ Global Brands
              </span>
            </div>
          </motion.div>
        </div>

        {/* Decorative Element */}
        <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full flex items-center justify-center animate-[spin_12s_linear_infinite] z-20 hidden md:flex">
          <div className="w-20 h-20 bg-white/10 rounded-full backdrop-blur-md" />
        </div>
      </section>

      {/* About Teaser */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-brand-100 relative max-w-md mx-auto lg:max-w-none lg:ml-0">
                  <img 
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1000" 
                    alt="Our team collaborating"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-brand-900/10 mix-blend-multiply" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-brand-900 text-white p-8 rounded-3xl hidden md:block max-w-xs shadow-2xl">
                  <p className="text-3xl font-display font-bold mb-2">200%</p>
                  <p className="text-brand-200 text-sm">Average client revenue growth in the first 12 months.</p>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div>
                <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mb-3">{content.aboutLabel}</h2>
                <h3 className="text-4xl md:text-5xl font-display font-bold text-brand-900 mb-6 leading-tight">
                  {content.aboutHeading}
                </h3>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed font-medium">
                  Founded on the belief that traditional marketing is dead, Kroma merges behavioral psychology, stunning aesthetics, and deep technical expertise. We partner with founders who are ready to dominate their space.
                </p>
                <ul className="space-y-4 mb-10">
                  {['Award-winning creative team', 'Proprietary AI growth models', 'Transparent ROI tracking'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-brand-900 font-bold text-sm uppercase tracking-wider">
                      <CheckCircle2 className="text-brand-500" size={20} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/about" className="inline-flex items-center gap-2 text-brand-600 font-bold text-xs uppercase tracking-widest hover:text-brand-800 transition-colors group">
                  Learn more about us
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Services Preview Grid */}
      <section className="py-24 bg-brand-50 border-y border-brand-100">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="text-center mb-16 max-w-3xl mx-auto">
             <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mb-3 text-center">Core Capabilities</h2>
             <h3 className="text-4xl md:text-5xl font-display font-bold text-brand-900 mb-6 leading-tight">
               {content.servicesHeading}
             </h3>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <AnimatedSection 
                  key={service.id} 
                  delay={index * 0.1}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-brand-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors bg-brand-100 text-brand-600 group-hover:bg-brand-600 group-hover:text-white">
                    <Icon size={28} />
                  </div>
                  <h4 className="text-xl font-bold mb-3 text-brand-900">{service.title}</h4>
                  <p className="text-sm leading-relaxed font-medium text-gray-600">
                    {service.description}
                  </p>
                </AnimatedSection>
              );
            })}
            
            <AnimatedSection delay={0.4} className="bg-brand-100 p-8 rounded-3xl flex flex-col justify-center items-start border border-brand-200">
              <h4 className="text-xl font-bold text-brand-900 mb-4">Need a custom solution?</h4>
              <Link to="/services" className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white text-brand-600 shadow-sm hover:scale-110 transition-transform">
                <ArrowRight size={20} />
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Portfolio Teaser */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatedSection className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div className="max-w-2xl">
              <h2 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-400 mb-3">Our Work</h2>
              <h3 className="text-4xl md:text-5xl font-display font-bold text-brand-900 leading-tight">
                {content.portfolioHeading}
              </h3>
            </div>
            <Link to="/portfolio" className="inline-flex items-center gap-2 text-brand-900 font-bold text-xs uppercase tracking-widest hover:text-brand-600 transition-colors group pb-2 border-b-2 border-brand-900 hover:border-brand-600">
              View all work
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioItems.slice(0, 4).map((item, index) => (
              <AnimatedSection key={item.id} delay={index * 0.1}>
                <Link to={`/portfolio/${item.id}`} className="group block relative overflow-hidden rounded-[2.5rem] aspect-video bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                    <span className="text-brand-300 text-xs font-bold uppercase tracking-widest mb-2 inline-block transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-100">
                      {item.category}
                    </span>
                    <h4 className="text-white text-3xl font-display font-bold transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-150">
                      {item.title}
                    </h4>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Teaser */}
      <section className="py-24 bg-brand-900 relative overflow-hidden mx-6 mb-6 rounded-[2.5rem]">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              {content.careersHeading}
            </h2>
            <p className="text-xl text-brand-200 mb-10 max-w-2xl mx-auto font-medium">
              {content.careersBody}
            </p>
            <Link to="/careers" className="inline-block bg-white text-brand-900 px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest hover:bg-brand-50 transition-colors shadow-xl">
              View open positions
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
}
