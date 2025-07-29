/**
 * Tests for Note Model utilities
 */

import {
  createNoteModel,
  validateNote,
  updateNoteMetadata,
  generateId
} from '../../src/utils/noteModel.js';

describe('Note Model', () => {
  describe('createNoteModel', () => {
    test('creates a note with default values', () => {
      const note = createNoteModel();
      
      expect(note).toHaveProperty('id');
      expect(note.title).toBe('Untitled Note');
      expect(note.content).toBe('');
      expect(note.tags).toEqual([]);
      expect(note).toHaveProperty('createdAt');
      expect(note).toHaveProperty('updatedAt');
      expect(note.metadata).toHaveProperty('wordCount', 0);
      expect(note.metadata).toHaveProperty('characterCount', 0);
      expect(note.metadata).toHaveProperty('readingTime', 1);
    });

    test('creates a note with custom values', () => {
      const customData = {
        title: 'Test Note',
        content: 'This is a test note with some content.',
        tags: ['test', 'example']
      };
      
      const note = createNoteModel(customData);
      
      expect(note.title).toBe('Test Note');
      expect(note.content).toBe('This is a test note with some content.');
      expect(note.tags).toEqual(['test', 'example']);
      expect(note.metadata.wordCount).toBe(8);
      expect(note.metadata.characterCount).toBe(38);
    });

    test('calculates metadata correctly', () => {
      const content = 'This is a test note with exactly ten words here.';
      const note = createNoteModel({ content });
      
      expect(note.metadata.wordCount).toBe(10);
      expect(note.metadata.characterCount).toBe(content.length);
      expect(note.metadata.readingTime).toBe(1);
    });
  });

  describe('validateNote', () => {
    test('validates a correct note', () => {
      const note = createNoteModel();
      const result = validateNote(note);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    test('detects missing required fields', () => {
      const invalidNote = {
        id: '',
        title: '',
        content: 123,
        createdAt: 'invalid-date',
        updatedAt: 'invalid-date',
        tags: 'not-an-array',
        metadata: 'not-an-object'
      };
      
      const result = validateNote(invalidNote);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Note must have a valid ID');
      expect(result.errors).toContain('Note must have a valid title');
      expect(result.errors).toContain('Note content must be a string');
      expect(result.errors).toContain('Note tags must be an array');
      expect(result.errors).toContain('Note must have valid metadata');
    });

    test('validates title length', () => {
      const note = createNoteModel({ title: 'a'.repeat(201) });
      const result = validateNote(note);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Note title must be 200 characters or less');
    });

    test('validates metadata structure', () => {
      const note = createNoteModel();
      note.metadata = {
        wordCount: -1,
        characterCount: 'invalid',
        readingTime: null
      };
      
      const result = validateNote(note);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Metadata wordCount must be a non-negative number');
      expect(result.errors).toContain('Metadata characterCount must be a non-negative number');
      expect(result.errors).toContain('Metadata readingTime must be a non-negative number');
    });
  });

  describe('updateNoteMetadata', () => {
    test('updates metadata when content changes', () => {
      const note = createNoteModel({ content: 'Original content' });
      const originalUpdatedAt = note.updatedAt;
      
      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        const updatedNote = updateNoteMetadata({
          ...note,
          content: 'This is updated content with more words to test the calculation.'
        });
        
        expect(updatedNote.metadata.wordCount).toBe(11);
        expect(updatedNote.metadata.characterCount).toBe(63);
        expect(updatedNote.updatedAt).not.toBe(originalUpdatedAt);
      }, 1);
    });

    test('handles empty content', () => {
      const note = createNoteModel({ content: 'Some content' });
      const updatedNote = updateNoteMetadata({ ...note, content: '' });
      
      expect(updatedNote.metadata.wordCount).toBe(0);
      expect(updatedNote.metadata.characterCount).toBe(0);
      expect(updatedNote.metadata.readingTime).toBe(1);
    });

    test('handles HTML content', () => {
      const htmlContent = '<p>This is <strong>HTML</strong> content with <em>formatting</em>.</p>';
      const note = createNoteModel({ content: htmlContent });
      const updatedNote = updateNoteMetadata(note);
      
      // Should count words without HTML tags: "This is HTML content with formatting"
      expect(updatedNote.metadata.wordCount).toBe(6);
    });
  });

  describe('generateId', () => {
    test('generates unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
    });

    test('generates valid UUID format', () => {
      const id = generateId();
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      
      expect(uuidRegex.test(id)).toBe(true);
    });
  });
});