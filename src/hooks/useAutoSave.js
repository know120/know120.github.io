import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Save status enumeration
 */
export const SAVE_STATUS = {
  IDLE: 'idle',
  SAVING: 'saving',
  SAVED: 'saved',
  ERROR: 'error',
  PENDING: 'pending'
};

/**
 * Custom hook for automatic content saving with debouncing
 * Provides auto-save functionality with configurable delay and visual feedback
 * 
 * @param {any} data - Data to auto-save
 * @param {Function} saveFunction - Function to call for saving (should return Promise<boolean>)
 * @param {Object} options - Configuration options
 * @param {number} [options.delay=1000] - Debounce delay in milliseconds
 * @param {boolean} [options.enabled=true] - Whether auto-save is enabled
 * @param {number} [options.maxRetries=3] - Maximum retry attempts on save failure
 * @param {number} [options.retryDelay=1000] - Delay between retry attempts
 * @param {Function} [options.onSave] - Callback fired when save succeeds
 * @param {Function} [options.onError] - Callback fired when save fails
 * @param {Function} [options.shouldSave] - Function to determine if save should occur
 * @returns {Object} Hook interface with save status and controls
 */
const useAutoSave = (
  data,
  saveFunction,
  options = {}
) => {
  const {
    delay = 1000,
    enabled = true,
    maxRetries = 3,
    retryDelay = 1000,
    onSave,
    onError,
    shouldSave
  } = options;

  const [saveStatus, setSaveStatus] = useState(SAVE_STATUS.IDLE);
  const [lastSaved, setLastSaved] = useState(null);
  const [lastError, setLastError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Refs to track state and avoid stale closures
  const saveTimeoutRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  const lastDataRef = useRef(data);
  const isMountedRef = useRef(true);
  const saveInProgressRef = useRef(false);
  


  /**
   * Clears any pending save operations
   */
  const clearPendingSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  /**
   * Performs the actual save operation with retry logic
   */
  const performSave = useCallback(async (dataToSave, attempt = 1) => {
    if (saveInProgressRef.current) {
      return;
    }

    saveInProgressRef.current = true;
    setSaveStatus(SAVE_STATUS.SAVING);
    setLastError(null);

    try {
      // Call the save function
      const result = await saveFunction(dataToSave);

      if (result === true || (result && result.success !== false)) {
        // Save successful
        setSaveStatus(SAVE_STATUS.SAVED);
        setLastSaved(new Date());
        setRetryCount(0);
        lastDataRef.current = dataToSave;

        // Call success callback
        if (onSave) {
          try {
            onSave(dataToSave, result);
          } catch (callbackError) {
            console.error('Error in onSave callback:', callbackError);
          }
        }

        // Reset to idle after showing saved status
        setTimeout(() => {
          setSaveStatus(SAVE_STATUS.IDLE);
        }, 1000);
      } else {
        throw new Error(result?.error || 'Save operation failed');
      }
    } catch (error) {
      console.error('Auto-save error:', error);

      setLastError(error.message || 'Save failed');

      // Retry logic
      if (attempt < maxRetries) {
        setRetryCount(attempt);
        setSaveStatus(SAVE_STATUS.PENDING);

        retryTimeoutRef.current = setTimeout(() => {
          performSave(dataToSave, attempt + 1);
        }, retryDelay);
      } else {
        // Max retries reached
        setSaveStatus(SAVE_STATUS.ERROR);
        setRetryCount(maxRetries);

        // Call error callback
        if (onError) {
          try {
            onError(error, dataToSave);
          } catch (callbackError) {
            console.error('Error in onError callback:', callbackError);
          }
        }
      }
    } finally {
      saveInProgressRef.current = false;
    }
  }, [saveFunction, maxRetries, retryDelay, onSave, onError]);

  /**
   * Schedules a save operation with debouncing
   */
  const scheduleSave = useCallback((dataToSave) => {
    if (!enabled || !saveFunction) {
      return;
    }

    // Check if we should save this data
    if (shouldSave && !shouldSave(dataToSave, lastDataRef.current)) {
      return;
    }

    // Clear any pending save
    clearPendingSave();

    // Set status to pending
    setSaveStatus(SAVE_STATUS.PENDING);

    // Schedule the save
    saveTimeoutRef.current = setTimeout(() => {
      performSave(dataToSave);
    }, delay);
  }, [enabled, saveFunction, shouldSave, delay, clearPendingSave, performSave]);

  /**
   * Manually trigger a save operation (bypasses debouncing)
   */
  const saveNow = useCallback(async () => {
    if (!enabled || !saveFunction) {
      return false;
    }

    clearPendingSave();

    try {
      await performSave(data);
      return true;
    } catch (error) {
      return false;
    }
  }, [enabled, saveFunction, data, clearPendingSave, performSave]);

  /**
   * Reset the save status and clear any errors
   */
  const resetSaveStatus = useCallback(() => {
    setSaveStatus(SAVE_STATUS.IDLE);
    setLastError(null);
    setRetryCount(0);
  }, []);

  // Effect to handle data changes and trigger auto-save
  useEffect(() => {
    // Skip initial render or if data hasn't changed
    if (lastDataRef.current === data) {
      return;
    }

    scheduleSave(data);
  }, [data, scheduleSave]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      clearPendingSave();
    };
  }, [clearPendingSave]);

  // Return the hook interface
  return {
    // Status information
    saveStatus,
    isSaving: saveStatus === SAVE_STATUS.SAVING,
    isSaved: saveStatus === SAVE_STATUS.SAVED,
    isPending: saveStatus === SAVE_STATUS.PENDING,
    hasError: saveStatus === SAVE_STATUS.ERROR,
    lastSaved,
    lastError,
    retryCount,

    // Control functions
    saveNow,
    resetSaveStatus,
    clearPendingSave,

    // Configuration
    isEnabled: enabled,
    delay
  };
};

export default useAutoSave;