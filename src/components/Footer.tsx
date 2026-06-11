import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, ArrowRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white text-brand-900 pt-20 pb-10 border-t border-brand-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="text-3xl font-display font-black tracking-tighter text-brand-600 mb-6 block">
              Kroma<span className="text-brand-400">.</span>
            </Link>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6 max-w-xs">
              We engineer brand experiences that capture attention, drive conversion, and inspire loyalty.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-brand-100 bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-100 hover:text-brand-800 transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-brand-100 bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-100 hover:text-brand-800 transition-colors">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-brand-100 bg-brand-50 flex items-center justify-center text-brand-600 hover:bg-brand-100 hover:text-brand-800 transition-colors">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-300 mb-6">Company</h4>
            <ul className="space-y-4 flex flex-col items-start">
              <li><Link to="/about" className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors">About Us</Link></li>
              <li><Link to="/portfolio" className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors">Our Work</Link></li>
              <li><Link to="/careers" className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors">Careers & Culture</Link></li>
              <li><Link to="/contact" className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-300 mb-6">Services</h4>
            <ul className="space-y-4 flex flex-col items-start">
              <li><Link to="/services" className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors">Performance Ads</Link></li>
              <li><Link to="/services" className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors">Brand Design</Link></li>
              <li><Link to="/services" className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors">AI Integration</Link></li>
              <li><Link to="/services" className="text-xs font-bold uppercase tracking-widest text-brand-600 hover:text-brand-800 transition-colors">Strategy</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] uppercase tracking-[0.2em] font-black text-brand-300 mb-6">Stay in the loop</h4>
            <p className="text-gray-500 font-medium text-sm mb-4">Latest insights, case studies, and news sent directly to your inbox.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email" 
                className="bg-brand-50 border border-brand-100 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-brand-400 text-sm font-medium"
              />
              <button 
                type="submit" 
                className="bg-brand-600 hover:bg-brand-700 text-white p-2 px-4 rounded-lg flex items-center justify-center transition-colors shadow-md shadow-brand-200"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
        
        <div className="pt-8 border-t border-brand-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">
          <p>EST. {new Date().getFullYear()} • KROMA AGENCY</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
