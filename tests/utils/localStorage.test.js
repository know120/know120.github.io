/**
 * Tests for localStorage utilities
 */

import {
  getFromStorage,
  saveToStorage,
  initializeStorage,
  createBackup,
  restoreFromBackup,
  clearStorage,
  getStorageInfo,
  migrateStorageFormat,
  DEFAULT_STORAGE,
  STORAGE_KEY
} from '../../src/utils/localStorage.js';

import { createNoteModel } from '../../src/utils/noteModel.js';

// Mock localStorage
let mockStorage = {};
const localStorageMock = {
  getItem: jest.fn((key) => mockStorage[key] || null),
  setItem: jest.fn((key, value) => { mockStorage[key] = value; }),
  removeItem: jest.fn((key) => { delete mockStorage[key]; }),
  clear: jest.fn(() => { mockStorage = {}; })
};

// Mock Blob for storage info calculation
global.Blob = jest.fn().mockImplementation((data) => ({
  size: JSON.stringify(data).length
}));

// Mock localStorage globally
Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('localStorage utilities', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    mockStorage = {};
    jest.clearAllMocks();
  });

  describe('getFromStorage', () => {
    test('returns null when no data exists', () => {
      const result = getFromStorage();
      expect(result).toBeNull();
    });

    test('returns parsed data when valid data exists', () => {
      const testData = { ...DEFAULT_STORAGE, notes: [] };
      mockStorage[STORAGE_KEY] = JSON.stringify(testData);
      
      const result = getFromStorage();
      expect(result).toMatchObject({
        notes: [],
        settings: expect.any(Object)
      });
    });

    test('returns default storage when invalid data structure', () => {
      mockStorage[STORAGE_KEY] = JSON.stringify({ invalid: 'structure' });
      
      const result = getFromStorage();
      expect(result).toMatchObject({
        notes: [],
        settings: expect.any(Object)
      });
    });

    test('handles JSON parse errors', () => {
      mockStorage[STORAGE_KEY] = 'invalid-json';
      
      const result = getFromStorage();
      expect(result).toBeNull();
    });
  });

  describe('saveToStorage', () => {
    test('saves valid data successfully', () => {
      // Mock successful storage operations
      localStorageMock.getItem.mockReturnValue(JSON.stringify(DEFAULT_STORAGE));
      
      const testData = { ...DEFAULT_STORAGE };
      const result = saveToStorage(testData);
      
      expect(result).toBe(true);
    });

    test('rejects invalid data structure', () => {
      const invalidData = { invalid: 'structure' };
      
      const result = saveToStorage(invalidData);
      
      expect(result).toBe(false);
    });

    test('handles storage errors', () => {
      localStorageMock.setItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      localStorageMock.getItem.mockReturnValue(JSON.stringify(DEFAULT_STORAGE));
      
      const result = saveToStorage(DEFAULT_STORAGE);
      
      expect(result).toBe(false);
    });

    test('handles quota exceeded error', () => {
      const quotaError = new Error('Quota exceeded');
      quotaError.name = 'QuotaExceededError';
      localStorageMock.setItem.mockImplementation(() => {
        throw quotaError;
      });
      localStorageMock.getItem.mockReturnValue(JSON.stringify(DEFAULT_STORAGE));
      
      const result = saveToStorage(DEFAULT_STORAGE);
      
      expect(result).toBe(false);
    });
  });

  describe('initializeStorage', () => {
    test('returns existing data when available', () => {
      const existingData = { ...DEFAULT_STORAGE, notes: [] };
      mockStorage[STORAGE_KEY] = JSON.stringify(existingData);
      
      const result = initializeStorage();
      
      expect(result).toMatchObject({
        notes: expect.any(Array),
        settings: expect.any(Object)
      });
    });

    test('creates and saves default data when none exists', () => {
      // Mock successful save operation
      localStorageMock.getItem.mockReturnValue(JSON.stringify(DEFAULT_STORAGE));
      
      const result = initializeStorage();
      
      expect(result).toMatchObject({
        notes: expect.any(Array),
        settings: expect.any(Object)
      });
    });
  });

  describe('createBackup', () => {
    test('creates backup successfully', () => {
      const testData = { ...DEFAULT_STORAGE };
      mockStorage[STORAGE_KEY] = JSON.stringify(testData);
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testData));
      
      const result = createBackup();
      
      expect(result).toBe(true);
    });

    test('fails when no data to backup', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = createBackup();
      
      expect(result).toBe(false);
    });
  });

  describe('restoreFromBackup', () => {
    test('restores from backup successfully', () => {
      const backupData = { ...DEFAULT_STORAGE };
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'portfolio-notes-backup') {
          return JSON.stringify(backupData);
        }
        return JSON.stringify(DEFAULT_STORAGE);
      });
      
      const result = restoreFromBackup();
      
      expect(result).toBe(true);
    });

    test('fails when no backup exists', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      const result = restoreFromBackup();
      
      expect(result).toBe(false);
    });
  });

  describe('clearStorage', () => {
    test('clears all storage successfully', () => {
      const result = clearStorage();
      
      expect(result).toBe(true);
    });

    test('handles clear errors', () => {
      localStorageMock.removeItem.mockImplementation(() => {
        throw new Error('Clear error');
      });
      
      const result = clearStorage();
      
      expect(result).toBe(false);
    });
  });

  describe('getStorageInfo', () => {
    test('returns storage information', () => {
      const testData = { ...DEFAULT_STORAGE, notes: [] };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(testData));
      
      const info = getStorageInfo();
      
      expect(info).toHaveProperty('usedBytes');
      expect(info).toHaveProperty('estimatedLimit');
      expect(info).toHaveProperty('usagePercentage');
      expect(info).toHaveProperty('notesCount');
      expect(typeof info.usedBytes).toBe('number');
      expect(typeof info.usagePercentage).toBe('number');
    });

    test('handles errors gracefully', () => {
      localStorageMock.getItem.mockImplementation(() => {
        throw new Error('Storage error');
      });
      
      const info = getStorageInfo();
      
      expect(info).toEqual({
        usedBytes: 0,
        estimatedLimit: 0,
        usagePercentage: 0,
        notesCount: 0
      });
    });
  });

  describe('migrateStorageFormat', () => {
    test('migrates legacy array format', () => {
      const legacyData = [createNoteModel()];
      
      const migrated = migrateStorageFormat(legacyData);
      
      expect(migrated).toHaveProperty('notes', legacyData);
      expect(migrated).toHaveProperty('settings');
      expect(migrated).toHaveProperty('lastBackup');
    });

    test('ensures all required properties exist', () => {
      const partialData = { notes: [] };
      
      const migrated = migrateStorageFormat(partialData);
      
      expect(migrated).toHaveProperty('notes', []);
      expect(migrated).toHaveProperty('settings');
      expect(migrated).toHaveProperty('lastBackup');
      expect(migrated.settings).toEqual(DEFAULT_STORAGE.settings);
    });

    test('preserves existing settings', () => {
      const dataWithSettings = {
        notes: [],
        settings: { theme: 'light', autoSaveInterval: 5000 }
      };
      
      const migrated = migrateStorageFormat(dataWithSettings);
      
      expect(migrated.settings.theme).toBe('light');
      expect(migrated.settings.autoSaveInterval).toBe(5000);
      expect(migrated.settings.defaultFontSize).toBe(DEFAULT_STORAGE.settings.defaultFontSize);
    });
  });
});