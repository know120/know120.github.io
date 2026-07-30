import React, { useState, useEffect } from 'react';
import { useLayout } from '../contexts/LayoutContext';

const navConfig = {
  classic: {
    scrolled: 'bg-slate-900/90 backdrop-blur-md border border-white/10 shadow-lg shadow-indigo-500/10',
    link: 'text-slate-300 hover:text-white hover:bg-white/5',
    mobileBg: 'bg-slate-900/95 backdrop-blur-xl border border-white/10',
    logo: 'text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-cyan-400 hover:opacity-80 transition-opacity',
    hamburger: 'text-slate-400 hover:text-white hover:bg-white/10',
  },
  terminal: {
    scrolled: 'bg-slate-950/90 backdrop-blur-md border border-green-500/20 shadow-lg shadow-green-500/10',
    link: 'text-green-300/80 hover:text-green-200 hover:bg-green-500/10',
    mobileBg: 'bg-slate-950/95 backdrop-blur-xl border border-green-500/20',
    logo: 'text-2xl font-bold text-green-400 hover:opacity-80 transition-opacity',
    hamburger: 'text-green-400 hover:text-green-300 hover:bg-green-500/10',
  },
  '90s': {
    scrolled: 'bg-[#1a0a2e]/90 backdrop-blur-md border-2 border-yellow-400/60 shadow-[8px_8px_0_rgba(255,0,255,0.3)]',
    link: 'text-yellow-200/80 hover:text-yellow-100 hover:bg-yellow-500/10',
    mobileBg: 'bg-[#1a0a2e]/95 backdrop-blur-xl border-2 border-yellow-400/60',
    logo: 'text-2xl font-bold text-yellow-300 hover:opacity-80 transition-opacity',
    hamburger: 'text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/10',
  },
};

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { layout } = useLayout();
  const c = navConfig[layout] || navConfig.classic;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Tools', href: '/#/tools' },
    { name: 'Experience', id: 'about' },
    { name: 'Projects', id: 'projects' },
    { name: 'Blog', id: 'blog' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav
      className={`fixed top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-7xl z-50 transition-all duration-300 rounded-2xl ${isScrolled || isMobileMenuOpen ? c.scrolled : 'bg-transparent border border-transparent'}`}
    >
      <div className="px- sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className={c.logo}
            >
              Sujay Halder
            </a>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                link.href ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className={`${c.link} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200`}
                  >
                    {link.name}
                  </a>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.id)}
                    className={`${c.link} px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer`}
                  >
                    {link.name}
                  </button>
                )
              ))}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${c.hamburger} focus:outline-none`}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L6 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 mt-2 ${c.mobileBg} rounded-xl overflow-hidden shadow-xl mx-4`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              link.href ? (
                <a
                  key={link.name}
                  href={link.href}
                  className={`${c.link} block px-3 py-2 rounded-md text-base font-medium`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className={`${c.link} block w-full text-left px-3 py-2 rounded-md text-base font-medium`}
                >
                  {link.name}
                </button>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;