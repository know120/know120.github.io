import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import Dashboard from './pages/Dashboard';
import Note from './pages/Note';

// Lazy load other components for better performance
const SuperApp = React.lazy(() => import('./pages/SuperApp'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <div className="App">
          <Suspense fallback={
            <div className="loading-fallback">
              <div className="spinner"></div>
              <p>Loading...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Dashboard />} />
              <Route path="/super" element={<SuperApp />} />
              <Route path="/note" element={<Note />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;