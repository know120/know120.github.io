/**
 * Basic functionality tests for core utilities
 * These tests focus on the core functionality without complex mocking
 */

import { createNoteModel, validateNote, generateId } from '../../src/utils/noteModel.js';
import { generateUUID, generateTimestampId, isValidUUID } from '../../src/utils/idGenerator.js';

describe('Core Utilities - Basic Functionality', () => {
  describe('Note Model', () => {
    test('creates a note with default values', () => {
      const note = createNoteModel();
      
      expect(note).toHaveProperty('id');
      expect(note).toHaveProperty('title', 'Untitled Note');
      expect(note).toHaveProperty('content', '');
      expect(note).toHaveProperty('tags');
      expect(Array.isArray(note.tags)).toBe(true);
      expect(note).toHaveProperty('metadata');
      expect(note.metadata).toHaveProperty('wordCount', 0);
    });

    test('creates a note with custom values', () => {
      const customData = {
        title: 'Test Note',
        content: 'Test content',
        tags: ['test']
      };
      
      const note = createNoteModel(customData);
      
      expect(note.title).toBe('Test Note');
      expect(note.content).toBe('Test content');
      expect(note.tags).toEqual(['test']);
    });

    test('validates a correct note', () => {
      const note = createNoteModel();
      const result = validateNote(note);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('detects invalid note structure', () => {
      const invalidNote = {
        id: '',
        title: '',
        content: 123,
        tags: 'not-array',
        metadata: null
      };
      
      const result = validateNote(invalidNote);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('ID Generation', () => {
    test('generates unique UUIDs', () => {
      const id1 = generateUUID();
      const id2 = generateUUID();
      
      expect(id1).not.toBe(id2);
      expect(isValidUUID(id1)).toBe(true);
      expect(isValidUUID(id2)).toBe(true);
    });

    test('generates timestamp-based IDs', () => {
      const id1 = generateTimestampId();
      const id2 = generateTimestampId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(id1).toMatch(/^\d+-[a-z0-9]+$/);
    });

    test('default generateId works', () => {
      const id = generateId();
      
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
      expect(isValidUUID(id)).toBe(true);
    });

    test('validates UUID format correctly', () => {
      expect(isValidUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
      expect(isValidUUID('invalid-uuid')).toBe(false);
      expect(isValidUUID('')).toBe(false);
      expect(isValidUUID(null)).toBe(false);
    });
  });

  describe('Integration', () => {
    test('note creation and validation work together', () => {
      const note = createNoteModel({
        title: 'Integration Test',
        content: 'This tests integration between utilities',
        tags: ['integration', 'test']
      });
      
      const validation = validateNote(note);
      
      expect(validation.isValid).toBe(true);
      expect(note.metadata.wordCount).toBe(5);
      expect(note.metadata.characterCount).toBe(42);
      expect(isValidUUID(note.id)).toBe(true);
    });
  });
});