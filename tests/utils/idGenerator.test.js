/**
 * Tests for ID generation utilities
 */

import {
  generateUUID,
  generateTimestampId,
  generateShortId,
  generateReadableId,
  generateId,
  isValidUUID,
  isValidTimestampId,
  extractTimestamp,
  generateBatch,
  generateUniqueId
} from '../../src/utils/idGenerator.js';

describe('ID Generation utilities', () => {
  describe('generateUUID', () => {
    test('generates valid UUID v4 format', () => {
      const uuid = generateUUID();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      expect(typeof uuid).toBe('string');
      expect(uuidRegex.test(uuid)).toBe(true);
    });

    test('generates unique UUIDs', () => {
      const uuid1 = generateUUID();
      const uuid2 = generateUUID();
      
      expect(uuid1).not.toBe(uuid2);
    });

    test('generates UUIDs with correct version', () => {
      const uuid = generateUUID();
      const versionChar = uuid.charAt(14);
      
      expect(versionChar).toBe('4');
    });
  });

  describe('generateTimestampId', () => {
    test('generates timestamp-based ID', () => {
      const id = generateTimestampId();
      
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^\d+-[a-z0-9]+$/);
    });

    test('generates unique timestamp IDs', () => {
      const id1 = generateTimestampId();
      const id2 = generateTimestampId();
      
      expect(id1).not.toBe(id2);
    });

    test('includes valid timestamp', () => {
      const beforeTime = Date.now();
      const id = generateTimestampId();
      const afterTime = Date.now();
      
      const timestamp = parseInt(id.split('-')[0], 10);
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('generateShortId', () => {
    test('generates 8-character ID', () => {
      const id = generateShortId();
      
      expect(typeof id).toBe('string');
      expect(id.length).toBe(8);
    });

    test('generates unique short IDs', () => {
      const id1 = generateShortId();
      const id2 = generateShortId();
      
      expect(id1).not.toBe(id2);
    });

    test('contains only alphanumeric characters', () => {
      const id = generateShortId();
      
      expect(id).toMatch(/^[a-z0-9]+$/);
    });
  });

  describe('generateReadableId', () => {
    test('generates human-readable format', () => {
      const id = generateReadableId();
      
      expect(typeof id).toBe('string');
      expect(id).toMatch(/^[a-z]+-[a-z]+-\d+$/);
    });

    test('generates unique readable IDs', () => {
      const id1 = generateReadableId();
      const id2 = generateReadableId();
      
      expect(id1).not.toBe(id2);
    });

    test('contains expected components', () => {
      const id = generateReadableId();
      const parts = id.split('-');
      
      expect(parts).toHaveLength(3);
      expect(parts[0]).toMatch(/^[a-z]+$/); // adjective
      expect(parts[1]).toMatch(/^[a-z]+$/); // noun
      expect(parts[2]).toMatch(/^\d+$/);    // number
    });
  });

  describe('generateId (default)', () => {
    test('uses UUID format by default', () => {
      const id = generateId();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      expect(uuidRegex.test(id)).toBe(true);
    });
  });

  describe('isValidUUID', () => {
    test('validates correct UUID v4', () => {
      const validUUID = '550e8400-e29b-41d4-a716-446655440000';
      
      expect(isValidUUID(validUUID)).toBe(true);
    });

    test('rejects invalid UUID formats', () => {
      expect(isValidUUID('invalid-uuid')).toBe(false);
      expect(isValidUUID('550e8400-e29b-41d4-a716')).toBe(false);
      expect(isValidUUID('550e8400-e29b-31d4-a716-446655440000')).toBe(false); // wrong version
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID(null)).toBe(false);
      expect(isValidUUID(undefined)).toBe(false);
    });

    test('validates generated UUIDs', () => {
      const uuid = generateUUID();
      
      expect(isValidUUID(uuid)).toBe(true);
    });
  });

  describe('isValidTimestampId', () => {
    test('validates correct timestamp ID', () => {
      const validId = '1627846261000-abc123def';
      
      expect(isValidTimestampId(validId)).toBe(true);
    });

    test('rejects invalid timestamp ID formats', () => {
      expect(isValidTimestampId('invalid-timestamp-id')).toBe(false);
      expect(isValidTimestampId('abc-def')).toBe(false);
      expect(isValidTimestampId('1627846261000')).toBe(false);
      expect(isValidTimestampId('')).toBe(false);
      expect(isValidTimestampId(null)).toBe(false);
    });

    test('validates generated timestamp IDs', () => {
      const id = generateTimestampId();
      
      expect(isValidTimestampId(id)).toBe(true);
    });
  });

  describe('extractTimestamp', () => {
    test('extracts timestamp from valid ID', () => {
      const testTimestamp = 1627846261000;
      const id = `${testTimestamp}-abc123def`;
      
      const extracted = extractTimestamp(id);
      
      expect(extracted).toBe(testTimestamp);
    });

    test('returns null for invalid ID', () => {
      expect(extractTimestamp('invalid-id')).toBeNull();
      expect(extractTimestamp('abc-def')).toBeNull();
      expect(extractTimestamp('')).toBeNull();
    });

    test('extracts timestamp from generated ID', () => {
      const beforeTime = Date.now();
      const id = generateTimestampId();
      const afterTime = Date.now();
      
      const timestamp = extractTimestamp(id);
      
      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });
  });

  describe('generateBatch', () => {
    test('generates requested number of IDs', () => {
      const batch = generateBatch(5);
      
      expect(batch).toHaveLength(5);
      expect(Array.isArray(batch)).toBe(true);
    });

    test('generates unique IDs in batch', () => {
      const batch = generateBatch(10);
      const uniqueIds = new Set(batch);
      
      expect(uniqueIds.size).toBe(batch.length);
    });

    test('uses custom generator function', () => {
      const customGenerator = jest.fn(() => 'custom-id');
      const batch = generateBatch(3, customGenerator);
      
      expect(customGenerator).toHaveBeenCalledTimes(3);
      expect(batch).toEqual(['custom-id', 'custom-id', 'custom-id']);
    });

    test('handles duplicate IDs from generator', () => {
      let callCount = 0;
      const duplicatingGenerator = () => {
        callCount++;
        return callCount === 1 ? 'duplicate' : `unique-${callCount}`;
      };
      
      const batch = generateBatch(2, duplicatingGenerator);
      
      expect(batch).toHaveLength(2);
      expect(new Set(batch).size).toBe(2);
    });
  });

  describe('generateUniqueId', () => {
    test('generates ID not in existing list', () => {
      const existingIds = ['id1', 'id2', 'id3'];
      const newId = generateUniqueId(existingIds);
      
      expect(existingIds).not.toContain(newId);
    });

    test('works with empty existing list', () => {
      const newId = generateUniqueId([]);
      
      expect(typeof newId).toBe('string');
      expect(newId.length).toBeGreaterThan(0);
    });

    test('uses custom generator function', () => {
      let counter = 0;
      const customGenerator = () => `custom-${++counter}`;
      const existingIds = ['custom-1'];
      
      const newId = generateUniqueId(existingIds, customGenerator);
      
      expect(newId).toBe('custom-2');
    });

    test('retries until unique ID found', () => {
      let callCount = 0;
      const retryingGenerator = () => {
        callCount++;
        return callCount === 1 ? 'existing' : 'unique';
      };
      
      const existingIds = ['existing'];
      const newId = generateUniqueId(existingIds, retryingGenerator);
      
      expect(newId).toBe('unique');
      expect(callCount).toBe(2);
    });
  });
});