/**
 * Note Data Model and Validation Functions
 * Provides the core data structure and validation for notes
 */

/**
 * Note Schema Definition
 * @typedef {Object} Note
 * @property {string} id - UUID or timestamp-based unique identifier
 * @property {string} title - Note title (max 200 characters)
 * @property {string} content - Rich text content (HTML format)
 * @property {string} createdAt - ISO timestamp
 * @property {string} updatedAt - ISO timestamp
 * @property {string[]} tags - Array of strings for categorization
 * @property {Object} metadata - Additional note metadata
 * @property {number} metadata.wordCount - Word count
 * @property {number} metadata.characterCount - Character count
 * @property {number} metadata.readingTime - Estimated reading time in minutes
 */

/**
 * Creates a new note with default values
 * @param {Object} noteData - Initial note data
 * @param {string} [noteData.title='Untitled Note'] - Note title
 * @param {string} [noteData.content=''] - Note content
 * @param {string[]} [noteData.tags=[]] - Note tags
 * @returns {Note} New note object
 */
export const createNoteModel = (noteData = {}) => {
  const now = new Date().toISOString();
  const content = noteData.content || '';
  
  return {
    id: noteData.id || generateId(),
    title: noteData.title || 'Untitled Note',
    content,
    createdAt: noteData.createdAt || now,
    updatedAt: noteData.updatedAt || now,
    tags: noteData.tags || [],
    metadata: {
      wordCount: calculateWordCount(content),
      characterCount: content.length,
      readingTime: calculateReadingTime(content)
    }
  };
};

/**
 * Validates a note object
 * @param {Note} note - Note to validate
 * @returns {Object} Validation result with isValid boolean and errors array
 */
export const validateNote = (note) => {
  const errors = [];
  
  // Check required fields
  if (!note.id || typeof note.id !== 'string') {
    errors.push('Note must have a valid ID');
  }
  
  if (!note.title || typeof note.title !== 'string') {
    errors.push('Note must have a valid title');
  } else if (note.title.length > 200) {
    errors.push('Note title must be 200 characters or less');
  }
  
  if (typeof note.content !== 'string') {
    errors.push('Note content must be a string');
  }
  
  // Validate timestamps
  if (!note.createdAt || !isValidISODate(note.createdAt)) {
    errors.push('Note must have a valid createdAt timestamp');
  }
  
  if (!note.updatedAt || !isValidISODate(note.updatedAt)) {
    errors.push('Note must have a valid updatedAt timestamp');
  }
  
  // Validate tags
  if (!Array.isArray(note.tags)) {
    errors.push('Note tags must be an array');
  } else if (!note.tags.every(tag => typeof tag === 'string')) {
    errors.push('All note tags must be strings');
  }
  
  // Validate metadata
  if (!note.metadata || typeof note.metadata !== 'object') {
    errors.push('Note must have valid metadata');
  } else {
    const { wordCount, characterCount, readingTime } = note.metadata;
    if (typeof wordCount !== 'number' || wordCount < 0) {
      errors.push('Metadata wordCount must be a non-negative number');
    }
    if (typeof characterCount !== 'number' || characterCount < 0) {
      errors.push('Metadata characterCount must be a non-negative number');
    }
    if (typeof readingTime !== 'number' || readingTime < 0) {
      errors.push('Metadata readingTime must be a non-negative number');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Updates note metadata based on content
 * @param {Note} note - Note to update
 * @returns {Note} Note with updated metadata
 */
export const updateNoteMetadata = (note) => {
  const content = note.content || '';
  
  return {
    ...note,
    updatedAt: new Date().toISOString(),
    metadata: {
      ...note.metadata,
      wordCount: calculateWordCount(content),
      characterCount: content.length,
      readingTime: calculateReadingTime(content)
    }
  };
};

/**
 * Calculates word count from text content
 * @param {string} content - Text content
 * @returns {number} Word count
 */
const calculateWordCount = (content) => {
  if (!content || typeof content !== 'string') return 0;
  
  // Remove HTML tags and count words
  const textContent = content.replace(/<[^>]*>/g, '').trim();
  if (!textContent) return 0;
  
  return textContent.split(/\s+/).length;
};

/**
 * Calculates estimated reading time in minutes
 * @param {string} content - Text content
 * @returns {number} Reading time in minutes
 */
const calculateReadingTime = (content) => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = calculateWordCount(content);
  return Math.ceil(wordCount / wordsPerMinute) || 1;
};

/**
 * Validates ISO date string
 * @param {string} dateString - Date string to validate
 * @returns {boolean} True if valid ISO date
 */
const isValidISODate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && date.toISOString() === dateString;
};

/**
 * Generates a unique ID for notes
 * @returns {string} Unique identifier
 */
const generateId = () => {
  // Simple UUID v4 implementation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export { generateId };