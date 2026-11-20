import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

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
      className={`fixed top-4 left-4 right-4 z-50 rounded-full transition-all duration-500 md:left-1/2 md:w-full md:max-w-7xl md:-translate-x-1/2 ${isScrolled || isMobileMenuOpen
          ? 'glass-nav'
          : 'border border-transparent bg-transparent'
        }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="heading-gradient text-xl font-bold tracking-tight transition-opacity hover:opacity-85 sm:text-2xl"
            >
              Sujay Halder
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              {navLinks.map((link) => (
                link.href ? (
                  <a
                    key={link.name}
                    href={link.href}
                    className="nav-link"
                  >
                    {link.name}
                  </a>
                ) : (
                  <button
                    key={link.name}
                    onClick={() => scrollToSection(link.id)}
                    className="nav-link cursor-pointer"
                  >
                    {link.name}
                  </button>
                )
              ))}

              {/* Theme Toggle */}
              {/* <button
                onClick={toggleTheme}
                className="ml-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                aria-label="Toggle Theme"
              >
                {darkMode ? '🌙' : '☀️'}
              </button> */}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* <button
              onClick={toggleTheme}
              className="mr-4 p-2 rounded-full bg-white/5 text-slate-300"
            >
              {darkMode ? '🌙' : '☀️'}
            </button> */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="icon-button h-10 w-10 text-[var(--text-secondary)] hover:text-white"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="glass-panel absolute top-full left-0 right-0 mx-4 mt-3 overflow-hidden rounded-3xl md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              link.href ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="block rounded-xl px-3 py-2 text-base font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/10 hover:text-white"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="block w-full rounded-xl px-3 py-2 text-left text-base font-medium text-[var(--text-secondary)] transition-colors hover:bg-white/10 hover:text-white"
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