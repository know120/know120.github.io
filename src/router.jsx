
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BlogList from './pages/BlogList';
import BlogPost from './pages/BlogPost';
import Tools from './pages/Tools';
import Note from './pages/Note';
import AdLibrary from './pages/AdLibrary';

const SuperApp = React.lazy(() => import('./pages/SuperApp'));
const Design = React.lazy(() => import('./pages/Design'));

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/design" element={<Design />} />
            <Route path="/tools/super" element={<SuperApp />} />
            <Route path="/tools/note" element={<Note />} />
            <Route path="/tools/ad-library" element={<AdLibrary />} />
            <Route path="*" element={<Dashboard />} />
        </Routes>
    );
}