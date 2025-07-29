/**
 * Utilities Index
 * Central export point for all utility functions
 */

// Note model utilities
export {
  createNoteModel,
  validateNote,
  updateNoteMetadata,
  generateId
} from './noteModel.js';

// localStorage utilities
export {
  getFromStorage,
  saveToStorage,
  initializeStorage,
  createBackup,
  restoreFromBackup,
  clearStorage,
  getStorageInfo,
  migrateStorageFormat,
  STORAGE_KEY,
  DEFAULT_STORAGE
} from './localStorage.js';

// ID generation utilities
export {
  generateUUID,
  generateTimestampId,
  generateShortId,
  generateReadableId,
  generateId as generateUniqueId,
  isValidUUID,
  isValidTimestampId,
  extractTimestamp,
  generateBatch,
  generateUniqueId as ensureUniqueId
} from './idGenerator.js';