import React, { useState, useEffect } from 'react';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      className={`fixed left-4 right-4 top-4 z-50 transition-all duration-300 md:left-1/2 md:w-full md:max-w-7xl md:-translate-x-1/2 ${
        isScrolled || isMobileMenuOpen
          ? 'glass-nav'
          : 'border border-transparent bg-transparent'
      }`}
    >
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="shrink-0">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('home');
              }}
              className="group flex items-center gap-3"
            >
              <span className="flex h-8 w-8 items-center justify-center bg-[var(--accent-primary)] font-mono text-xs font-bold text-[#080a0f]">
                SH
              </span>
              <span className="font-mono text-sm font-semibold uppercase tracking-[0.14em] text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)] sm:text-base">
                Sujay Halder
              </span>
            </a>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center gap-1">
              {navLinks.map((link) =>
                link.href ? (
                  <a key={link.name} href={link.href} className="nav-link">
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
              )}
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="icon-button h-10 w-10"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="square" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="glass-panel absolute left-0 right-0 top-full mx-4 mt-3 overflow-hidden rounded-sm md:hidden">
          <div className="space-y-1 px-2 py-3 sm:px-3">
            {navLinks.map((link) =>
              link.href ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="mobile-menu-link block px-3 py-2 font-mono text-sm uppercase tracking-widest text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)]"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.id)}
                  className="mobile-menu-link block w-full px-3 py-2 text-left font-mono text-sm uppercase tracking-widest text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-primary)]/10 hover:text-[var(--accent-primary)]"
                >
                  {link.name}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
