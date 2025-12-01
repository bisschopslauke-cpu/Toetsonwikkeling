
import React, { useState } from 'react';
import { Menu, X, BookOpenCheck, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, currentPage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navLinks = [
    { name: t.nav.home, id: 'home' },
    { name: t.nav.grading, id: 'grading' },
    { name: t.nav.about, id: 'about' },
    { name: t.nav.faq, id: 'faq' },
    { name: t.nav.contact, id: 'contact' },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Radboud Red Top Bar */}
      <div className="h-1 w-full bg-primary"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleNav('home')}>
            <div className="text-primary">
              <BookOpenCheck size={36} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                {t.nav.university}
              </span>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-1">
                {t.nav.subtitle}
              </span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-baseline space-x-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${
                    currentPage === link.id
                      ? 'text-primary bg-primary/5'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 hover:bg-gray-50 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="ml-6 border-l border-gray-200 pl-6 flex items-center gap-2">
                <Globe size={16} className="text-gray-400" />
                <button 
                  onClick={() => setLanguage('nl')}
                  className={`text-xs font-bold px-2 py-1 rounded transition-colors ${language === 'nl' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  NL
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={`text-xs font-bold px-2 py-1 rounded transition-colors ${language === 'en' ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  EN
                </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded text-gray-700 hover:text-primary focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-zinc-900 border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`block w-full text-left px-3 py-4 rounded text-base font-medium ${
                  currentPage === link.id
                    ? 'text-primary bg-primary/5'
                    : 'text-gray-700 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {link.name}
              </button>
            ))}
             <div className="flex gap-4 px-3 py-4 border-t border-gray-100">
                <button onClick={() => setLanguage('nl')} className={`font-bold ${language === 'nl' ? 'text-primary' : 'text-gray-500'}`}>NL</button>
                <button onClick={() => setLanguage('en')} className={`font-bold ${language === 'en' ? 'text-primary' : 'text-gray-500'}`}>EN</button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
