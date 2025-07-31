import React, { useState } from 'react';
import useAutoSave, { SAVE_STATUS } from '../../hooks/useAutoSave';

/**
 * Example component demonstrating useAutoSave hook usage
 * This shows how to integrate auto-save functionality with visual feedback
 */
const AutoSaveExample = () => {
  const [content, setContent] = useState('');

  // Mock save function that simulates API call
  const saveContent = async (data) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate occasional failures for testing
    if (Math.random() < 0.1) {
      throw new Error('Network error occurred');
    }
    
    console.log('Saved content:', data);
    return true;
  };

  // Use the auto-save hook
  const {
    saveStatus,
    isSaving,
    isSaved,
    isPending,
    hasError,
    lastSaved,
    lastError,
    retryCount,
    saveNow,
    resetSaveStatus
  } = useAutoSave(content, saveContent, {
    delay: 1000, // 1 second delay
    maxRetries: 3,
    onSave: (data) => console.log('Auto-save successful:', data),
    onError: (error) => console.error('Auto-save failed:', error)
  });

  // Get status display text and styling
  const getStatusDisplay = () => {
    switch (saveStatus) {
      case SAVE_STATUS.PENDING:
        return { text: 'Pending...', className: 'text-warning' };
      case SAVE_STATUS.SAVING:
        return { text: 'Saving...', className: 'text-info' };
      case SAVE_STATUS.SAVED:
        return { text: 'Saved', className: 'text-success' };
      case SAVE_STATUS.ERROR:
        return { 
          text: `Error (${retryCount}/${3} retries)`, 
          className: 'text-danger' 
        };
      default:
        return { text: 'Ready', className: 'text-muted' };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Auto-Save Example</h5>
              <div className="d-flex align-items-center gap-3">
                <span className={`badge ${statusDisplay.className}`}>
                  {statusDisplay.text}
                </span>
                {lastSaved && (
                  <small className="text-muted">
                    Last saved: {lastSaved.toLocaleTimeString()}
                  </small>
                )}
              </div>
            </div>
            
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="content" className="form-label">
                  Content (auto-saves after 2 seconds of inactivity)
                </label>
                <textarea
                  id="content"
                  className="form-control"
                  rows="6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Start typing to see auto-save in action..."
                />
              </div>

              {hasError && lastError && (
                <div className="alert alert-danger" role="alert">
                  <strong>Save Error:</strong> {lastError}
                  {retryCount > 0 && (
                    <div className="mt-1">
                      <small>Retry attempt: {retryCount}/3</small>
                    </div>
                  )}
                </div>
              )}

              <div className="d-flex gap-2">
                <button
                  className="btn btn-primary"
                  onClick={saveNow}
                  disabled={isSaving || !content.trim()}
                >
                  {isSaving ? 'Saving...' : 'Save Now'}
                </button>
                
                <button
                  className="btn btn-secondary"
                  onClick={resetSaveStatus}
                  disabled={isSaving}
                >
                  Reset Status
                </button>
              </div>

              <div className="mt-3">
                <h6>Status Information:</h6>
                <ul className="list-unstyled">
                  <li><strong>Status:</strong> {saveStatus}</li>
                  <li><strong>Is Saving:</strong> {isSaving ? 'Yes' : 'No'}</li>
                  <li><strong>Is Saved:</strong> {isSaved ? 'Yes' : 'No'}</li>
                  <li><strong>Is Pending:</strong> {isPending ? 'Yes' : 'No'}</li>
                  <li><strong>Has Error:</strong> {hasError ? 'Yes' : 'No'}</li>
                  <li><strong>Retry Count:</strong> {retryCount}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoSaveExample;