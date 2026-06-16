import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navKeys = ['Home', 'About', 'Services', 'Portfolio', 'Blog', 'Careers'];
const getPath = (name: string) => name === 'Home' ? '/' : `/${name.toLowerCase()}`;

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language.startsWith('en') ? 'ka' : 'en');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 border-b ${
        isScrolled || mobileMenuOpen ? 'bg-white/90 backdrop-blur-md border-brand-100 shadow-sm py-4' : 'bg-white/80 backdrop-blur-md border-transparent py-4 md:py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link 
          to="/" 
          onClick={handleLogoClick}
          className="text-2xl font-black font-display tracking-tighter text-brand-600 group shrink-0"
        >
          Kraken<span className="text-brand-400 transition-colors">.</span>
        </Link>
        <nav className="hidden md:flex justify-between items-center w-full max-w-sm lg:max-w-lg mx-6">
          {navKeys.map((key) => {
            const path = getPath(key);
            return (
            <NavLink
              key={key}
              to={path}
              className={({ isActive }) => 
                `text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive ? 'text-brand-600 border-b-2 border-brand-600 pb-1' : 'text-gray-500 hover:text-brand-600 pb-1 border-b-2 border-transparent'
                }`
              }
            >
              {t(`nav.${key}`)}
            </NavLink>
          )})}
        </nav>

        <div className="hidden md:flex flex-row items-center gap-4 shrink-0">
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center text-gray-500 hover:text-brand-600 transition-colors uppercase text-xs font-bold tracking-widest"
          >
            <Globe className="w-4 h-4 mr-1" />
            {i18n.language.startsWith('en') ? 'KA' : 'EN'}
          </button>
          <Link 
            to="/contact" 
            className="bg-brand-600 text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-200"
          >
            {t('nav.GetTouch')}
          </Link>
        </div>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center text-gray-500 uppercase text-xs font-bold tracking-widest"
          >
            <Globe className="w-4 h-4 mr-1" />
            {i18n.language.startsWith('en') ? 'KA' : 'EN'}
          </button>
          <button 
            className="p-2 text-brand-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navKeys.map((key) => {
                const path = getPath(key);
                return (
                <NavLink
                  key={key}
                  to={path}
                  className={({ isActive }) => 
                    `text-xs font-bold uppercase tracking-widest py-3 border-b border-gray-50 ${
                      isActive ? 'text-brand-600' : 'text-gray-500 hover:text-brand-900'
                    }`
                  }
                >
                  {t(`nav.${key}`)}
                </NavLink>
              )})}
              <Link 
                to="/contact" 
                className="mt-4 bg-brand-600 text-center text-white px-5 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-brand-200"
              >
                {t('nav.GetTouch')}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
