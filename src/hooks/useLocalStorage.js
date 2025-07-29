import { useState, useEffect, useCallback } from 'react';
import {
  getFromStorage,
  saveToStorage,
  initializeStorage,
  createBackup,
  restoreFromBackup,
  clearStorage,
  getStorageInfo,
  migrateStorageFormat,
  createEmergencyBackup,
  recoverFromEmergencyBackup,
  clearEmergencyBackup,
  recoverFromCorruption,
  STORAGE_KEY
} from '../utils/localStorage';

/**
 * Custom hook for managing localStorage with React state synchronization
 * Provides persistent data management with error handling and quota detection
 * 
 * @param {string} [key=STORAGE_KEY] - Storage key to use
 * @returns {Object} Hook interface with data and methods
 */
const useLocalStorage = (key = STORAGE_KEY) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [storageInfo, setStorageInfo] = useState({
    usedBytes: 0,
    estimatedLimit: 0,
    usagePercentage: 0,
    notesCount: 0
  });

  /**
   * Updates storage info state
   */
  const updateStorageInfo = useCallback(() => {
    try {
      const info = getStorageInfo();
      setStorageInfo(info);
    } catch (err) {
      console.error('Error updating storage info:', err);
    }
  }, []);

  /**
   * Loads data from localStorage and initializes if needed
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let storageData = getFromStorage(key);
      
      // Initialize storage if empty
      if (!storageData) {
        // Try to recover from emergency backup first
        const emergencyData = recoverFromEmergencyBackup();
        if (emergencyData) {
          console.log('Recovered data from emergency backup');
          storageData = emergencyData;
          saveToStorage(storageData, key);
          clearEmergencyBackup();
        } else {
          storageData = initializeStorage();
        }
      } else {
        // Migrate old format if needed
        storageData = migrateStorageFormat(storageData);
        saveToStorage(storageData, key);
      }
      
      setData(storageData);
      updateStorageInfo();
      
      // Create automatic backup periodically
      const lastBackup = new Date(storageData.lastBackup);
      const now = new Date();
      const hoursSinceBackup = (now - lastBackup) / (1000 * 60 * 60);
      
      if (hoursSinceBackup > 1) { // Backup every hour
        createBackup(true);
      }
      
    } catch (err) {
      console.error('Error loading data from storage:', err);
      setError(err.message);
      
      // Try to recover from corruption
      try {
        const recoveredData = recoverFromCorruption();
        if (recoveredData) {
          setData(recoveredData);
          saveToStorage(recoveredData, key);
          setError('Data recovered from backup due to corruption');
        } else {
          setError('Failed to recover data');
        }
      } catch (recoveryError) {
        console.error('Failed to recover from corruption:', recoveryError);
        setError('Failed to initialize storage');
      }
    } finally {
      setIsLoading(false);
    }
  }, [key, updateStorageInfo]);

  /**
   * Saves data to localStorage and updates state
   * @param {Object} newData - Data to save
   * @returns {Promise<boolean>} Success status
   */
  const saveData = useCallback(async (newData) => {
    setError(null);
    
    try {
      const success = saveToStorage(newData, key);
      
      if (success) {
        setData(newData);
        updateStorageInfo();
        return true;
      } else {
        const errorMsg = 'Failed to save data to storage';
        setError(errorMsg);
        return false;
      }
    } catch (err) {
      console.error('Error saving data:', err);
      setError(err.message);
      return false;
    }
  }, [key, updateStorageInfo]);

  /**
   * Updates specific part of the data
   * @param {Function|Object} updater - Function or object to update data
   * @returns {Promise<boolean>} Success status
   */
  const updateData = useCallback(async (updater) => {
    if (!data) {
      setError('No data available to update');
      return false;
    }

    try {
      const newData = typeof updater === 'function' 
        ? updater(data) 
        : { ...data, ...updater };
      
      return await saveData(newData);
    } catch (err) {
      console.error('Error updating data:', err);
      setError(err.message);
      return false;
    }
  }, [data, saveData]);

  /**
   * Creates a backup of current data
   * @returns {Promise<boolean>} Success status
   */
  const backup = useCallback(async () => {
    setError(null);
    
    try {
      const success = createBackup();
      if (!success) {
        setError('Failed to create backup');
      }
      return success;
    } catch (err) {
      console.error('Error creating backup:', err);
      setError(err.message);
      return false;
    }
  }, []);

  /**
   * Restores data from backup
   * @returns {Promise<boolean>} Success status
   */
  const restore = useCallback(async () => {
    setError(null);
    
    try {
      const success = restoreFromBackup();
      if (success) {
        // Reload data after restore
        await loadData();
        return true;
      } else {
        setError('Failed to restore from backup');
        return false;
      }
    } catch (err) {
      console.error('Error restoring from backup:', err);
      setError(err.message);
      return false;
    }
  }, [loadData]);

  /**
   * Clears all storage data
   * @returns {Promise<boolean>} Success status
   */
  const clear = useCallback(async () => {
    setError(null);
    
    try {
      const success = clearStorage();
      if (success) {
        // Reinitialize after clearing
        await loadData();
        return true;
      } else {
        setError('Failed to clear storage');
        return false;
      }
    } catch (err) {
      console.error('Error clearing storage:', err);
      setError(err.message);
      return false;
    }
  }, [loadData]);

  /**
   * Checks if storage quota is approaching limit
   * @returns {boolean} True if quota is critical (>80%)
   */
  const isQuotaCritical = useCallback(() => {
    return storageInfo.usagePercentage > 80;
  }, [storageInfo.usagePercentage]);

  /**
   * Gets a specific item from the data
   * @param {string} path - Dot notation path to the item
   * @returns {any} The requested item or undefined
   */
  const getItem = useCallback((path) => {
    if (!data) return undefined;
    
    return path.split('.').reduce((obj, key) => {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, data);
  }, [data]);

  /**
   * Sets a specific item in the data
   * @param {string} path - Dot notation path to set
   * @param {any} value - Value to set
   * @returns {Promise<boolean>} Success status
   */
  const setItem = useCallback(async (path, value) => {
    return await updateData((currentData) => {
      const newData = { ...currentData };
      const keys = path.split('.');
      const lastKey = keys.pop();
      
      // Navigate to the parent object
      let target = newData;
      for (const key of keys) {
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = {};
        }
        target = target[key];
      }
      
      // Set the value
      target[lastKey] = value;
      return newData;
    });
  }, [updateData]);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for storage events from other tabs
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newData = JSON.parse(e.newValue);
          setData(newData);
          updateStorageInfo();
        } catch (err) {
          console.error('Error parsing storage event data:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key, updateStorageInfo]);

  return {
    // Data state
    data,
    isLoading,
    error,
    storageInfo,
    
    // Data operations
    saveData,
    updateData,
    loadData,
    getItem,
    setItem,
    
    // Backup operations
    backup,
    restore,
    clear,
    
    // Utility methods
    isQuotaCritical,
    
    // Status checks
    isReady: !isLoading && !error && data !== null,
    hasError: !!error,
    isEmpty: data && data.notes && data.notes.length === 0
  };
};

export default useLocalStorage;