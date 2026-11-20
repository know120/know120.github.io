import { Suspense, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import Router from './router';

function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <HelmetProvider>
      <ThemeProvider>
        <div className="app-shell text-[var(--text-primary)] min-h-screen min-w-screen">
          <div className="liquid-canvas" aria-hidden="true">
            <div className="liquid-blob liquid-blob--indigo" />
            <div className="liquid-blob liquid-blob--cyan" />
            <div className="liquid-blob liquid-blob--violet" />
            <div className="liquid-blob liquid-blob--rose" />
          </div>

          <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="relative h-16 w-16">
                <div className="absolute inset-0 rounded-full border border-white/20" />
                <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[var(--accent-primary)] border-r-[var(--accent-secondary)]" />
                <div className="absolute inset-3 rounded-full bg-[var(--accent-primary)]/20 blur-md" />
              </div>
              <p className="mt-5 text-sm font-medium tracking-wide text-[var(--text-secondary)]">Loading…</p>
            </div>
          }>
            <Router />
          </Suspense>
        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;