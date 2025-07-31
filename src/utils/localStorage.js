/**
 * localStorage Utility Functions
 * Provides persistent storage functionality for notes with error handling
 */

/**
 * Storage Structure Definition
 * @typedef {Object} StorageData
 * @property {Note[]} notes - Array of Note objects
 * @property {Object} settings - Application settings
 * @property {number} settings.autoSaveInterval - Auto-save interval in milliseconds
 * @property {string} settings.defaultFontSize - Default font size
 * @property {string} settings.theme - Theme preference ('dark' | 'light')
 * @property {string} lastBackup - ISO timestamp of last backup
 */

const STORAGE_KEY = 'portfolio-notes';
const BACKUP_KEY = 'portfolio-notes-backup';

/**
 * Default storage structure
 */
const DEFAULT_STORAGE = {
  notes: [],
  settings: {
    autoSaveInterval: 1000,
    defaultFontSize: '16px',
    theme: 'dark'
  },
  lastBackup: new Date().toISOString()
};

/**
 * Gets data from localStorage with error handling
 * @param {string} [key=STORAGE_KEY] - Storage key to retrieve
 * @returns {StorageData|null} Parsed data or null if error
 */
export const getFromStorage = (key = STORAGE_KEY) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      return null;
    }
    
    const parsed = JSON.parse(item);
    
    // Validate storage structure
    if (!isValidStorageStructure(parsed)) {
      console.warn('Invalid storage structure detected, using default');
      return DEFAULT_STORAGE;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Saves data to localStorage with error handling and automatic recovery
 * @param {StorageData} data - Data to save
 * @param {string} [key=STORAGE_KEY] - Storage key to use
 * @param {boolean} [attemptCleanup=true] - Whether to attempt cleanup on quota exceeded
 * @returns {boolean} True if successful, false otherwise
 */
export const saveToStorage = (data, key = STORAGE_KEY, attemptCleanup = true) => {
  try {
    // Validate data before saving
    if (!isValidStorageStructure(data)) {
      console.error('Invalid data structure, cannot save to storage');
      return false;
    }
    
    const serialized = JSON.stringify(data);
    
    // Create emergency backup before saving (only for main storage)
    if (key === STORAGE_KEY) {
      createEmergencyBackup(data);
    }
    
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    
    // Handle quota exceeded error with automatic cleanup
    if (error.name === 'QuotaExceededError' && attemptCleanup && key === STORAGE_KEY) {
      console.warn('Storage quota exceeded, attempting automatic cleanup...');
      
      const cleanedData = handleStorageQuotaExceeded(data);
      if (cleanedData) {
        // Try saving the cleaned data (without cleanup to avoid infinite loop)
        return saveToStorage(cleanedData, key, false);
      }
    }
    
    return false;
  }
};

/**
 * Initializes storage with default values if empty
 * @returns {StorageData} Initialized storage data
 */
export const initializeStorage = () => {
  let data = getFromStorage();
  
  if (!data) {
    data = { ...DEFAULT_STORAGE };
    saveToStorage(data);
  }
  
  return data;
};

/**
 * Creates a backup of current storage data
 * @param {boolean} [automatic=false] - Whether this is an automatic backup
 * @returns {boolean} True if backup successful
 */
export const createBackup = (automatic = false) => {
  const data = getFromStorage();
  if (!data) return false;
  
  const backupData = {
    ...data,
    lastBackup: new Date().toISOString(),
    backupType: automatic ? 'automatic' : 'manual'
  };
  
  return saveToStorage(backupData, BACKUP_KEY);
};

/**
 * Creates an emergency backup in sessionStorage for browser refresh recovery
 * @param {StorageData} data - Data to backup
 * @returns {boolean} True if backup successful
 */
export const createEmergencyBackup = (data) => {
  try {
    const emergencyData = {
      ...data,
      timestamp: new Date().toISOString(),
      type: 'emergency'
    };
    
    sessionStorage.setItem('portfolio-notes-emergency', JSON.stringify(emergencyData));
    return true;
  } catch (error) {
    console.error('Error creating emergency backup:', error);
    return false;
  }
};

/**
 * Recovers data from emergency backup (sessionStorage)
 * @returns {StorageData|null} Recovered data or null
 */
export const recoverFromEmergencyBackup = () => {
  try {
    const emergencyData = sessionStorage.getItem('portfolio-notes-emergency');
    if (!emergencyData) return null;
    
    const parsed = JSON.parse(emergencyData);
    
    // Check if emergency backup is recent (within last hour)
    const backupTime = new Date(parsed.timestamp);
    const now = new Date();
    const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
    
    if (backupTime < hourAgo) {
      // Emergency backup is too old, clean it up
      sessionStorage.removeItem('portfolio-notes-emergency');
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('Error recovering from emergency backup:', error);
    return null;
  }
};

/**
 * Clears emergency backup from sessionStorage
 */
export const clearEmergencyBackup = () => {
  try {
    sessionStorage.removeItem('portfolio-notes-emergency');
  } catch (error) {
    console.error('Error clearing emergency backup:', error);
  }
};

/**
 * Restores data from backup
 * @returns {boolean} True if restore successful
 */
export const restoreFromBackup = () => {
  const backupData = getFromStorage(BACKUP_KEY);
  if (!backupData) return false;
  
  return saveToStorage(backupData);
};

/**
 * Clears all storage data
 * @returns {boolean} True if successful
 */
export const clearStorage = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(BACKUP_KEY);
    clearEmergencyBackup();
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};

/**
 * Handles storage quota exceeded by cleaning up old data
 * @param {StorageData} data - Current data
 * @returns {StorageData|null} Cleaned data or null if cleanup failed
 */
export const handleStorageQuotaExceeded = (data) => {
  try {
    console.warn('Storage quota exceeded, attempting cleanup...');
    
    if (!data || !data.notes) return null;
    
    // Sort notes by last updated (oldest first)
    const sortedNotes = [...data.notes].sort((a, b) => 
      new Date(a.updatedAt) - new Date(b.updatedAt)
    );
    
    // Remove oldest 25% of notes or at least 1 note
    const notesToRemove = Math.max(1, Math.floor(sortedNotes.length * 0.25));
    const remainingNotes = sortedNotes.slice(notesToRemove);
    
    const cleanedData = {
      ...data,
      notes: remainingNotes
    };
    
    // Try to save the cleaned data
    if (saveToStorage(cleanedData)) {
      console.log(`Cleaned up ${notesToRemove} old notes to free storage space`);
      return cleanedData;
    }
    
    return null;
  } catch (error) {
    console.error('Error handling storage quota exceeded:', error);
    return null;
  }
};

/**
 * Attempts to recover from storage corruption
 * @returns {StorageData|null} Recovered data or null
 */
export const recoverFromCorruption = () => {
  console.warn('Attempting to recover from storage corruption...');
  
  // Try emergency backup first
  let recoveredData = recoverFromEmergencyBackup();
  if (recoveredData) {
    console.log('Recovered from emergency backup');
    return recoveredData;
  }
  
  // Try regular backup
  recoveredData = getFromStorage(BACKUP_KEY);
  if (recoveredData && isValidStorageStructure(recoveredData)) {
    console.log('Recovered from regular backup');
    return recoveredData;
  }
  
  // Last resort: return default structure
  console.warn('No valid backup found, using default structure');
  return { ...DEFAULT_STORAGE };
};

/**
 * Gets storage usage information
 * @returns {Object} Storage usage stats
 */
export const getStorageInfo = () => {
  try {
    const data = getFromStorage();
    const serialized = data ? JSON.stringify(data) : '';
    const usedBytes = new Blob([serialized]).size;
    
    // Estimate available storage (localStorage typically 5-10MB)
    const estimatedLimit = 5 * 1024 * 1024; // 5MB
    const usagePercentage = (usedBytes / estimatedLimit) * 100;
    
    return {
      usedBytes,
      estimatedLimit,
      usagePercentage: Math.min(usagePercentage, 100),
      notesCount: data ? data.notes.length : 0
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return {
      usedBytes: 0,
      estimatedLimit: 0,
      usagePercentage: 0,
      notesCount: 0
    };
  }
};

/**
 * Checks if there's enough storage quota for new data
 * @param {number} additionalBytes - Additional bytes to store
 * @returns {boolean} True if enough quota available
 */
const checkStorageQuota = (additionalBytes) => {
  try {
    const info = getStorageInfo();
    const newTotal = info.usedBytes + additionalBytes;
    const estimatedLimit = info.estimatedLimit;
    
    // Leave 10% buffer
    return newTotal < (estimatedLimit * 0.9);
  } catch (error) {
    console.error('Error checking storage quota:', error);
    return true; // Assume it's okay if we can't check
  }
};

/**
 * Validates storage data structure
 * @param {any} data - Data to validate
 * @returns {boolean} True if valid structure
 */
const isValidStorageStructure = (data) => {
  if (!data || typeof data !== 'object') return false;
  
  // Check required properties
  if (!Array.isArray(data.notes)) return false;
  if (!data.settings || typeof data.settings !== 'object') return false;
  if (typeof data.lastBackup !== 'string') return false;
  
  // Validate settings structure
  const { settings } = data;
  if (typeof settings.autoSaveInterval !== 'number') return false;
  if (typeof settings.defaultFontSize !== 'string') return false;
  if (typeof settings.theme !== 'string') return false;
  
  return true;
};

/**
 * Migrates old storage format to new format if needed
 * @param {any} data - Data to migrate
 * @returns {StorageData} Migrated data
 */
export const migrateStorageFormat = (data) => {
  // Handle legacy format where notes were stored directly as array
  if (Array.isArray(data)) {
    return {
      notes: data,
      settings: DEFAULT_STORAGE.settings,
      lastBackup: new Date().toISOString()
    };
  }
  
  // Ensure all required properties exist
  return {
    notes: data.notes || [],
    settings: {
      ...DEFAULT_STORAGE.settings,
      ...data.settings
    },
    lastBackup: data.lastBackup || new Date().toISOString()
  };
};

export { STORAGE_KEY, DEFAULT_STORAGE };