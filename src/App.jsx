import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { HelmetProvider } from 'react-helmet-async';
import Dashboard from './pages/Dashboard';
import Note from './pages/Note';
import AdLibrary from './pages/AdLibrary';
import Tools from './pages/Tools';
import './App.css';


// Lazy load other components for better performance
const SuperApp = React.lazy(() => import('./pages/SuperApp'));
const Design = React.lazy(() => import('./pages/Design'));

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <div className="App bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 min-h-screen">
          <Suspense fallback={
            <div className="flex flex-col items-center justify-center h-screen">
              <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
              <p className="mt-4 text-lg">Loading...</p>
            </div>
          }>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/home" element={<Dashboard />} />
              <Route path="/tools" element={<Tools />} />
              <Route path="/tools/design" element={<Design />} />
              <Route path="/tools/super" element={<SuperApp />} />
              <Route path="/tools/note" element={<Note />} />
              <Route path="/tools/ad-library" element={<AdLibrary />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </Suspense>
        </div>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;