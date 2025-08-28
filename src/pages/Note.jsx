import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import NotesList from '../components/notes/NotesList';
import NoteEditor from '../components/notes/NoteEditor';
import RecoveryNotification from '../components/common/RecoveryNotification';
import useNotes from '../hooks/useNotes';
import './Note.css';

const Note = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'editor'
  const [selectedNote, setSelectedNote] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [recoveryNotification, setRecoveryNotification] = useState(null);

  const {
    notes,
    createNote,
    updateNote,
    deleteNote,
    isLoading,
    error
  } = useNotes();

  // Check for recovery scenarios on mount
  useEffect(() => {
    const checkForRecovery = async () => {
      try {
        const { recoverFromEmergencyBackup } = await import('../utils/localStorage');
        const emergencyData = recoverFromEmergencyBackup();

        if (emergencyData) {
          setRecoveryNotification({
            type: 'success',
            message: 'Your notes were recovered from an emergency backup after a browser refresh.'
          });
        }
      } catch (err) {
        console.error('Error checking for recovery:', err);
      }
    };

    checkForRecovery();
  }, []);

  // Show recovery notification if error indicates data was recovered
  useEffect(() => {
    if (error && error.includes('recovered from backup')) {
      setRecoveryNotification({
        type: 'warning',
        message: 'Your notes were recovered from a backup due to data corruption.'
      });
    }
  }, [error]);

  // Handle window resize for responsive behavior
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up periodic backup (every 5 minutes)
  useEffect(() => {
    const backupInterval = setInterval(() => {
      if (notes.length > 0) {
        // Import backup function dynamically to avoid circular dependencies
        import('../utils/localStorage').then(({ createBackup }) => {
          createBackup(true);
        });
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(backupInterval);
  }, [notes.length]);

  // Handle orientation change on mobile devices
  useEffect(() => {
    const handleOrientationChange = () => {
      // Small delay to allow for orientation change to complete
      setTimeout(() => {
        setIsMobile(window.innerWidth <= 768);
      }, 100);
    };

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  // Create emergency backup before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (notes.length > 0) {
        // Import backup function dynamically
        import('../utils/localStorage').then(({ createEmergencyBackup, getFromStorage }) => {
          const currentData = getFromStorage();
          if (currentData) {
            createEmergencyBackup(currentData);
          }
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [notes]);

  // Handle selecting a note for editing
  const handleSelectNote = useCallback((note) => {
    setSelectedNote(note);
    setCurrentView('editor');
  }, []);

  // Handle creating a new note
  const handleCreateNote = useCallback(async () => {
    const result = await createNote({
      title: '',
      content: ''
    });

    if (result.success) {
      setSelectedNote(result.note);
      setCurrentView('editor');
    } else {
      console.error('Failed to create note:', result.error);
      // TODO: Show error toast/notification
    }
  }, [createNote]);

  // Handle saving a note
  const handleSaveNote = useCallback(async (noteId, updates) => {
    if (noteId) {
      // Update existing note
      const result = await updateNote(noteId, updates);
      if (result.success) {
        setSelectedNote(result.note);
      }
      return result;
    } else {
      // Create new note if no ID
      const result = await createNote(updates);
      if (result.success) {
        setSelectedNote(result.note);
      }
      return result;
    }
  }, [updateNote, createNote]);

  // Handle deleting a note
  const handleDeleteNote = useCallback(async (note) => {
    const result = await deleteNote(note.id);
    if (result.success) {
      // If we're currently editing the deleted note, go back to list
      if (selectedNote && selectedNote.id === note.id) {
        setCurrentView('list');
        setSelectedNote(null);
      }
    } else {
      console.error('Failed to delete note:', result.error);
      // TODO: Show error toast/notification
    }
  }, [deleteNote, selectedNote]);

  // Handle going back to notes list
  const handleBackToList = useCallback(() => {
    setCurrentView('list');
    setSelectedNote(null);
  }, []);

  // Show loading state
  if (isLoading) {
    return (
      <div className="app">
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
            <i className="pi pi-spin pi-spinner" style={{ fontSize: '3rem', color: '#6366f1' }}></i>
            <p className="mt-3">Loading notes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="app">
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
            <i className="pi pi-exclamation-triangle" style={{ fontSize: '3rem', color: '#ef4444' }}></i>
            <h3 className="mt-3 mb-3">Error Loading Notes</h3>
            <p className="mb-4">{error}</p>
            <button
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              <i className="pi pi-refresh me-2"></i>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Recovery notification */}
      {recoveryNotification && (
        <RecoveryNotification
          message={recoveryNotification.message}
          type={recoveryNotification.type}
          onDismiss={() => setRecoveryNotification(null)}
          hasNavbar={currentView === 'list'}
        />
      )}

      {/* Navigation - only show when in list view */}
      {currentView === 'list' && (
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
      )}

      <div className="notes-container" style={{ paddingTop: currentView === 'list' ? '80px' : '0' }}>
        {currentView === 'list' ? (
          <div className="container-fluid bg-dark min-vh-100" style={{}}>
            <NotesList
              notes={notes}
              onSelectNote={handleSelectNote}
              onCreateNote={handleCreateNote}
              onDeleteNote={handleDeleteNote}
            />
          </div>
        ) : (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
};

export default Note;