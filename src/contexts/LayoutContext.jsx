import { createContext, useContext, useState, useEffect } from 'react';

const LayoutContext = createContext();

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error('useLayout must be used within LayoutProvider');
  return context;
};

export const LayoutProvider = ({ children }) => {
  const [layout, setLayout] = useState(() => {
    return localStorage.getItem('landingLayout') || 'classic';
  });

  useEffect(() => {
    localStorage.setItem('landingLayout', layout);
  }, [layout]);

  return (
    <LayoutContext.Provider value={{ layout, setLayout }}>
      {children}
    </LayoutContext.Provider>
  );
};
