import React, { useEffect, useRef } from 'react';
import './ConfirmDialog.css';

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default' // 'default', 'danger', 'warning'
}) => {
  const dialogRef = useRef(null);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the cancel button by default for safety
      if (cancelButtonRef.current) {
        cancelButtonRef.current.focus();
      }
      
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
      
      // Add escape key listener
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      // Trap focus within the dialog
      const focusableElements = dialogRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="confirm-dialog-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
      aria-describedby="dialog-message"
    >
      <div 
        className={`confirm-dialog ${type}`}
        ref={dialogRef}
        onKeyDown={handleKeyDown}
      >
        <div className="dialog-header">
          <h3 id="dialog-title" className="dialog-title">
            {type === 'danger' && <i className="pi pi-exclamation-triangle me-2"></i>}
            {type === 'warning' && <i className="pi pi-exclamation-circle me-2"></i>}
            {type === 'default' && <i className="pi pi-question-circle me-2"></i>}
            {title}
          </h3>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <i className="pi pi-times"></i>
          </button>
        </div>
        
        <div className="dialog-body">
          <p id="dialog-message" className="dialog-message">
            {message}
          </p>
        </div>
        
        <div className="dialog-footer">
          <button 
            ref={cancelButtonRef}
            className="btn btn-secondary"
            onClick={onClose}
            type="button"
          >
            {cancelText}
          </button>
          <button 
            ref={confirmButtonRef}
            className={`btn ${type === 'danger' ? 'btn-danger' : type === 'warning' ? 'btn-warning' : 'btn-primary'}`}
            onClick={handleConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
        
        <div className="dialog-shine"></div>
      </div>
    </div>
  );
};

export default ConfirmDialog;