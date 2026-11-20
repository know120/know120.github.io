import React, { useState, useEffect } from 'react';
import Button from '../components/common/Button';

const HeroSection = () => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = ['Crafting Full Stack Solutions with AI'];

  useEffect(() => {
    const timeout = setTimeout(() => {
      const current = texts[currentIndex];

      if (isDeleting) {
        setCurrentText(current.substring(0, currentText.length - 1));
      } else {
        setCurrentText(current.substring(0, currentText.length + 1));
      }

      if (!isDeleting && currentText === current) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentText === '') {
        setIsDeleting(false);
        setCurrentIndex((currentIndex + 1) % texts.length);
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [currentText, currentIndex, isDeleting, texts]);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden pt-24">
      {/* Oversized background wordmark */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span className="translate-y-6 whitespace-nowrap font-mono text-[22vw] font-bold leading-none tracking-tighter text-white/[0.025]">
          SUJAY
        </span>
        <div className="absolute -left-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[var(--accent-primary)]/[0.07] blur-[130px]" />
        <div className="absolute -right-40 bottom-1/4 h-[26rem] w-[26rem] rounded-full bg-[var(--accent-secondary)]/[0.08] blur-[130px]" />
      </div>

      <div className="section-container w-full">
        <div className="flex flex-col-reverse items-center justify-between gap-16 lg:flex-row">
          <div className="z-10 flex-1 text-center lg:text-left">
            <div className="glass-chip mb-7 px-3 py-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-primary)]/70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent-primary)]" />
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                Available for select work · 2026
              </span>
            </div>

            <h1 className="mb-6 text-[clamp(3.5rem,8vw,7rem)] font-extrabold leading-[0.95] tracking-[-0.055em] text-[var(--text-primary)]">
              Hi, I'm <br />
              <span className="heading-gradient">Sujay Halder</span>
            </h1>

            <div className="mb-8 flex h-10 items-center font-mono text-base text-[var(--accent-tertiary)] sm:text-lg">
              <span className="font-semibold text-[var(--accent-primary)]">{currentText}</span>
              <span className="ml-1 animate-pulse">|</span>
            </div>

            <div className="editorial-rule mb-8 max-w-xl" />

            <p className="mb-10 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)] sm:text-lg">
              I build scalable, high-performance web applications where thoughtful
              engineering meets considered design — from full-stack products to
              browser-based tools and AI-assisted workflows.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button text="Get In Touch" onClick={() => scrollToSection('contact')} />
              <Button text="View My Work" variant="secondary" onClick={() => scrollToSection('projects')} />
            </div>

            <div className="mt-12 flex items-center justify-center gap-3 lg:justify-start">
              {[
                { href: 'https://github.com/know120', icon: 'pi-github', label: 'GitHub' },
                { href: 'https://www.linkedin.com/in/sujayhalder', icon: 'pi-linkedin', label: 'LinkedIn' },
                { href: 'https://twitter.com/TheSujayHalder', icon: 'pi-twitter', label: 'Twitter' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="icon-button h-11 w-11"
                  aria-label={social.label}
                >
                  <i className={`pi ${social.icon} text-base`} />
                </a>
              ))}
              <span className="ml-3 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] sm:inline">
                Find me online
              </span>
            </div>
          </div>

          <div className="relative flex flex-1 justify-center lg:justify-end">
            <div className="relative w-64 sm:w-80 lg:w-[26rem]">
              {/* Corner brackets */}
              <span className="pointer-events-none absolute -left-3 -top-3 h-10 w-10 border-l-2 border-t-2 border-[var(--accent-primary)]" />
              <span className="pointer-events-none absolute -right-3 -top-3 h-10 w-10 border-r-2 border-t-2 border-[var(--accent-primary)]" />
              <span className="pointer-events-none absolute -bottom-3 -left-3 h-10 w-10 border-b-2 border-l-2 border-[var(--accent-primary)]" />
              <span className="pointer-events-none absolute -bottom-3 -right-3 h-10 w-10 border-b-2 border-r-2 border-[var(--accent-primary)]" />

              <div className="glass-panel overflow-hidden rounded-sm p-2">
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-tertiary)]">
                  <img
                    className="h-full w-full object-cover grayscale transition-all duration-700 hover:scale-105 hover:grayscale-0"
                    src="assets/img/me.jpg"
                    alt="Sujay Halder"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(7,9,14,0.85))]" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accent-primary)]">
                      Fig. 01 — Portrait
                    </span>
                    <p className="mt-1 text-sm font-semibold text-white">Sujay Halder</p>
                  </div>
                </div>
              </div>

              <div className="glass-panel absolute -bottom-8 left-6 hidden rounded-sm px-4 py-3 sm:block">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-tertiary)]">
                  Based in
                </span>
                <span className="text-sm font-semibold text-[var(--text-primary)]">India · Remote</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
