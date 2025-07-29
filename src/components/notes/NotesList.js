import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import NoteCard from './NoteCard';
import ConfirmDialog from '../common/ConfirmDialog';
import './NotesList.css';

const NotesList = ({ notes = [], onSelectNote, onCreateNote, onDeleteNote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, note: null });
  const debounceTimeoutRef = useRef(null);

  // Debounce search term updates
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Filter notes based on debounced search term with highlighting
  const filteredNotes = useMemo(() => {
    if (!debouncedSearchTerm.trim()) {
      return notes.map(note => ({ ...note, searchHighlight: null }));
    }

    const searchLower = debouncedSearchTerm.toLowerCase();
    return notes.filter(note => {
      const titleMatch = note.title?.toLowerCase().includes(searchLower);
      const contentMatch = note.content?.toLowerCase().includes(searchLower);
      return titleMatch || contentMatch;
    }).map(note => {
      // Add search highlighting information
      const titleMatch = note.title?.toLowerCase().includes(searchLower);
      const contentMatch = note.content?.toLowerCase().includes(searchLower);
      
      return {
        ...note,
        searchHighlight: {
          term: debouncedSearchTerm,
          titleMatch,
          contentMatch
        }
      };
    });
  }, [notes, debouncedSearchTerm]);

  const handleSearchChange = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleEditNote = (note) => {
    if (onSelectNote) {
      onSelectNote(note);
    }
  };

  const handleDeleteClick = (note) => {
    setDeleteConfirm({ isOpen: true, note });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.note && onDeleteNote) {
      onDeleteNote(deleteConfirm.note);
    }
    setDeleteConfirm({ isOpen: false, note: null });
  };

  const handleCancelDelete = () => {
    setDeleteConfirm({ isOpen: false, note: null });
  };

  const handleCreateNote = () => {
    if (onCreateNote) {
      onCreateNote();
    }
  };

  const renderEmptyState = () => (
    <div className="empty-state">
      <div className="empty-state-icon">
        <i className="pi pi-file-edit"></i>
      </div>
      <h3 className="empty-state-title">No Notes Yet</h3>
      <p className="empty-state-message">
        Start documenting your thoughts, ideas, and code snippets by creating your first note.
      </p>
      <button 
        className="btn btn-primary create-first-note-btn"
        onClick={handleCreateNote}
      >
        <i className="pi pi-plus me-2"></i>
        Create Your First Note
      </button>
    </div>
  );

  const renderNoResults = () => (
    <div className="no-results">
      <div className="no-results-icon">
        <i className="pi pi-search"></i>
      </div>
      <h3 className="no-results-title">No Notes Found</h3>
      <p className="no-results-message">
        No notes match your search for "{debouncedSearchTerm}". Try different keywords or create a new note.
      </p>
      <div className="no-results-actions">
        <button 
          className="btn btn-secondary"
          onClick={handleClearSearch}
        >
          <i className="pi pi-times me-2"></i>
          Clear Search
        </button>
        <button 
          className="btn btn-primary"
          onClick={handleCreateNote}
        >
          <i className="pi pi-plus me-2"></i>
          Create New Note
        </button>
      </div>
    </div>
  );

  return (
    <div className="notes-list">
      <div className="notes-header">
        <div className="notes-title-section">
          <h2 className="notes-title">
            <i className="pi pi-file-edit me-3"></i>
            My Notes
          </h2>
          {/* <span className="notes-count">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
            {debouncedSearchTerm && ` found`}
            {searchTerm !== debouncedSearchTerm && (
              <i className="pi pi-spin pi-spinner ms-2" style={{ fontSize: '0.8rem' }}></i>
            )}
          </span> */}
        </div>
        
        <button 
          className="btn btn-primary create-note-btn"
          onClick={handleCreateNote}
        >
          <i className="pi pi-plus me-2"></i>
          New Note
        </button>
      </div>

      <div className="search-section">
        <div className="search-input-container">
          <i className="pi pi-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder="Search notes by title or content..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button 
              className="clear-search-btn"
              onClick={handleClearSearch}
              title="Clear search"
            >
              <i className="pi pi-times"></i>
            </button>
          )}
        </div>
      </div>

      <div className="notes-content">
        {notes.length === 0 ? (
          renderEmptyState()
        ) : filteredNotes.length === 0 ? (
          renderNoResults()
        ) : (
          <div className="notes-grid">
            {filteredNotes.map((note) => (
              <div key={note.id} className="note-grid-item">
                <NoteCard
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        message={`Are you sure you want to delete "${deleteConfirm.note?.title || 'this note'}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default NotesList;