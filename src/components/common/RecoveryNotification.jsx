import React, { useState, useEffect } from 'react';
import './RecoveryNotification.css';

const RecoveryNotification = ({ message, type = 'info', onDismiss, autoHide = true, duration = 5000, hasNavbar = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && duration > 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onDismiss) {
        onDismiss();
      }
    }, 300); // Wait for fade out animation
  };

  if (!isVisible) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'pi pi-check-circle';
      case 'warning':
        return 'pi pi-exclamation-triangle';
      case 'error':
        return 'pi pi-times-circle';
      default:
        return 'pi pi-info-circle';
    }
  };

  return (
    <div className={`recovery-notification ${type} ${isVisible ? 'visible' : 'hidden'} ${hasNavbar ? 'with-navbar' : 'without-navbar'}`}>
      <div className="notification-content">
        <i className={`notification-icon ${getIcon()}`}></i>
        <span className="notification-message">{message}</span>
        <button 
          className="notification-dismiss"
          onClick={handleDismiss}
          title="Dismiss"
        >
          <i className="pi pi-times"></i>
        </button>
      </div>
    </div>
  );
};

export default RecoveryNotification;