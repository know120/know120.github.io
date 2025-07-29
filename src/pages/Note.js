import React from 'react';
import { Link } from 'react-router-dom';

const Note = () => {
  return (
    <div className="app">
      {/* Simple Navigation */}
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Sujay Halder
            </span>
          </Link>
          <Link to="/" className="btn btn-outline-light btn-sm">
            <i className="pi pi-home me-2"></i>
            Home
          </Link>
        </div>
      </nav>

      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-dark" style={{ paddingTop: '80px' }}>
        <div className="text-center text-white">
          <h1 className="display-4 mb-4" style={{ color: '#6366f1' }}>📝 Notes</h1>
          <p className="lead mb-4">This is the Notes page. Content will be migrated from the Angular version.</p>
          <div className="card bg-secondary text-white p-4" style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            <h3 className="mb-3">Coming Soon</h3>
            <p>This section will include:</p>
            <ul className="list-unstyled">
              <li className="mb-2">📚 Technical Notes</li>
              <li className="mb-2">💡 Learning Resources</li>
              <li className="mb-2">🔧 Code Snippets</li>
              <li className="mb-2">📖 Documentation</li>
            </ul>
            <div className="mt-4">
              <Link to="/" className="btn btn-primary me-3">
                <i className="pi pi-home me-2"></i>
                Back to Home
              </Link>
              <Link to="/super" className="btn btn-outline-light">
                <i className="pi pi-cog me-2"></i>
                Super App
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Note;