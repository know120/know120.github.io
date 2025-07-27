import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SuperApp from './pages/SuperApp';
import Note from './pages/Note';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/super" element={<SuperApp />} />
        <Route path="/note" element={<Note />} />
      </Routes>
    </div>
  );
}

export default App;