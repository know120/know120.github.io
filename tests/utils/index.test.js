/**
 * Tests for utilities index exports
 */

import * as utils from '../../src/utils/index.js';

describe('Utilities Index', () => {
  test('exports note model utilities', () => {
    expect(utils.createNoteModel).toBeDefined();
    expect(utils.validateNote).toBeDefined();
    expect(utils.updateNoteMetadata).toBeDefined();
    expect(utils.generateId).toBeDefined();
  });

  test('exports localStorage utilities', () => {
    expect(utils.getFromStorage).toBeDefined();
    expect(utils.saveToStorage).toBeDefined();
    expect(utils.initializeStorage).toBeDefined();
    expect(utils.createBackup).toBeDefined();
    expect(utils.restoreFromBackup).toBeDefined();
    expect(utils.clearStorage).toBeDefined();
    expect(utils.getStorageInfo).toBeDefined();
    expect(utils.migrateStorageFormat).toBeDefined();
    expect(utils.STORAGE_KEY).toBeDefined();
    expect(utils.DEFAULT_STORAGE).toBeDefined();
  });

  test('exports ID generation utilities', () => {
    expect(utils.generateUUID).toBeDefined();
    expect(utils.generateTimestampId).toBeDefined();
    expect(utils.generateShortId).toBeDefined();
    expect(utils.generateReadableId).toBeDefined();
    expect(utils.generateUniqueId).toBeDefined();
    expect(utils.isValidUUID).toBeDefined();
    expect(utils.isValidTimestampId).toBeDefined();
    expect(utils.extractTimestamp).toBeDefined();
    expect(utils.generateBatch).toBeDefined();
    expect(utils.ensureUniqueId).toBeDefined();
  });

  test('all exports are functions or constants', () => {
    Object.entries(utils).forEach(([name, value]) => {
      if (name === 'STORAGE_KEY' || name === 'DEFAULT_STORAGE') {
        expect(typeof value).not.toBe('undefined');
      } else {
        expect(typeof value).toBe('function');
      }
    });
  });

  test('functions can be called without errors', () => {
    // Test a few key functions to ensure they work when imported from index
    expect(() => utils.generateId()).not.toThrow();
    expect(() => utils.createNoteModel()).not.toThrow();
    expect(() => utils.generateUUID()).not.toThrow();
  });
});