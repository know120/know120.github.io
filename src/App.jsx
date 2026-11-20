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
            <div className="flex h-screen flex-col items-center justify-center">
              <div className="relative h-14 w-14 border border-[var(--glass-border)]">
                <span className="absolute -left-px -top-px h-4 w-4 border-l-2 border-t-2 border-[var(--accent-primary)]" />
                <span className="absolute -bottom-px -right-px h-4 w-4 border-b-2 border-r-2 border-[var(--accent-primary)]" />
                <span className="absolute inset-0 animate-pulse bg-[var(--accent-primary)]/10" />
              </div>
              <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--text-secondary)]">
                Loading…
              </p>
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