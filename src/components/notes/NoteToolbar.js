import React from 'react';
import './NoteToolbar.css';

const NoteToolbar = ({
  onBold,
  onItalic,
  onHeader,
  onList,
  onUndo,
  onRedo,
  onCodeBlock,
  canUndo = false,
  canRedo = false,
  saveStatus,
  lastSaved,
  lastError,
  retryCount,
  onManualSave,
  onResetSaveStatus
}) => {
  // Format last saved time
  const formatLastSaved = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  // Get save status display with enhanced error handling
  const getSaveStatusDisplay = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className="save-status saving">
            <i className="pi pi-spin pi-spinner me-2"></i>
            Saving...
          </span>
        );
      case 'saved':
        return (
          <span className="save-status saved">
            <i className="pi pi-check me-2"></i>
            Saved {formatLastSaved(lastSaved)}
          </span>
        );
      case 'error':
        return (
          <div className="save-status error">
            <span>
              <i className="pi pi-exclamation-triangle me-2"></i>
              Save failed
              {retryCount > 0 && ` (${retryCount} retries)`}
            </span>
            {lastError && (
              <div className="error-details" title={lastError}>
                {lastError.length > 30 ? `${lastError.substring(0, 30)}...` : lastError}
              </div>
            )}
            <div className="error-actions">
              {onManualSave && (
                <button 
                  className="btn btn-sm btn-outline-warning me-2"
                  onClick={onManualSave}
                  title="Try saving manually"
                >
                  <i className="pi pi-refresh"></i>
                </button>
              )}
              {onResetSaveStatus && (
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={onResetSaveStatus}
                  title="Dismiss error"
                >
                  <i className="pi pi-times"></i>
                </button>
              )}
            </div>
          </div>
        );
      case 'pending':
        return (
          <span className="save-status pending">
            <i className="pi pi-clock me-2"></i>
            {retryCount > 0 ? `Retrying... (${retryCount})` : 'Saving...'}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="note-toolbar">
      <div className="toolbar-left">
        {/* Text formatting group */}
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={onBold}
            title="Bold (Ctrl+B)"
            type="button"
          >
            <i className="pi pi-bold"></i>
          </button>
          <button
            className="toolbar-btn"
            onClick={onItalic}
            title="Italic (Ctrl+I)"
            type="button"
          >
            <i className="pi pi-italic"></i>
          </button>
        </div>

        {/* Header formatting group */}
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => onHeader(1)}
            title="Header 1"
            type="button"
          >
            H1
          </button>
          <button
            className="toolbar-btn"
            onClick={() => onHeader(2)}
            title="Header 2"
            type="button"
          >
            H2
          </button>
          <button
            className="toolbar-btn"
            onClick={() => onHeader(3)}
            title="Header 3"
            type="button"
          >
            H3
          </button>
        </div>

        {/* List formatting group */}
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => onList(false)}
            title="Bullet List"
            type="button"
          >
            <i className="pi pi-list"></i>
          </button>
          <button
            className="toolbar-btn"
            onClick={() => onList(true)}
            title="Numbered List"
            type="button"
          >
            <i className="pi pi-sort-numeric-up"></i>
          </button>
        </div>

        {/* Code block group */}
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={() => onCodeBlock('javascript')}
            title="Insert Code Block"
            type="button"
          >
            <i className="pi pi-code"></i>
          </button>
        </div>

        {/* Undo/Redo group */}
        <div className="toolbar-group">
          <button
            className="toolbar-btn"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            type="button"
          >
            <i className="pi pi-undo"></i>
          </button>
          <button
            className="toolbar-btn"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            type="button"
          >
            <i className="pi pi-redo"></i>
          </button>
        </div>
      </div>

      {/* Save status indicator */}
      <div className="toolbar-right">
        {getSaveStatusDisplay()}
      </div>
    </div>
  );
};

export default NoteToolbar;