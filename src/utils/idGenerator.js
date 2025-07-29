/**
 * Unique ID Generation Utility
 * Provides various methods for generating unique identifiers for notes
 */

/**
 * Generates a UUID v4 compliant unique identifier
 * @returns {string} UUID v4 string
 */
export const generateUUID = () => {
  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Generates a timestamp-based unique identifier
 * @returns {string} Timestamp-based ID
 */
export const generateTimestampId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `${timestamp}-${random}`;
};

/**
 * Generates a short unique identifier (8 characters)
 * @returns {string} Short unique ID
 */
export const generateShortId = () => {
  return Math.random().toString(36).substr(2, 8);
};

/**
 * Generates a human-readable unique identifier
 * @returns {string} Human-readable ID
 */
export const generateReadableId = () => {
  const adjectives = [
    'quick', 'bright', 'clever', 'swift', 'bold', 'calm', 'wise', 'keen',
    'sharp', 'clear', 'fresh', 'cool', 'warm', 'light', 'dark', 'deep'
  ];
  
  const nouns = [
    'note', 'idea', 'thought', 'memo', 'draft', 'text', 'doc', 'page',
    'entry', 'record', 'item', 'piece', 'work', 'file', 'data', 'info'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 1000);
  
  return `${adjective}-${noun}-${number}`;
};

/**
 * Default ID generator (uses UUID v4)
 * @returns {string} Unique identifier
 */
export const generateId = generateUUID;

/**
 * Validates if a string is a valid UUID v4
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid UUID v4
 */
export const isValidUUID = (id) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return typeof id === 'string' && uuidRegex.test(id);
};

/**
 * Validates if a string is a valid timestamp-based ID
 * @param {string} id - ID to validate
 * @returns {boolean} True if valid timestamp ID
 */
export const isValidTimestampId = (id) => {
  if (typeof id !== 'string') return false;
  
  const parts = id.split('-');
  if (parts.length !== 2) return false;
  
  const timestamp = parseInt(parts[0], 10);
  const random = parts[1];
  
  return !isNaN(timestamp) && 
         timestamp > 0 && 
         typeof random === 'string' && 
         random.length > 0;
};

/**
 * Extracts timestamp from timestamp-based ID
 * @param {string} id - Timestamp-based ID
 * @returns {number|null} Timestamp or null if invalid
 */
export const extractTimestamp = (id) => {
  if (!isValidTimestampId(id)) return null;
  
  const timestamp = parseInt(id.split('-')[0], 10);
  return isNaN(timestamp) ? null : timestamp;
};

/**
 * Generates a batch of unique IDs
 * @param {number} count - Number of IDs to generate
 * @param {Function} [generator=generateUUID] - ID generator function
 * @returns {string[]} Array of unique IDs
 */
export const generateBatch = (count, generator = generateUUID) => {
  const ids = new Set();
  
  while (ids.size < count) {
    ids.add(generator());
  }
  
  return Array.from(ids);
};

/**
 * Ensures ID uniqueness within a collection
 * @param {string[]} existingIds - Array of existing IDs
 * @param {Function} [generator=generateUUID] - ID generator function
 * @returns {string} Unique ID not in existingIds
 */
export const generateUniqueId = (existingIds = [], generator = generateUUID) => {
  const existingSet = new Set(existingIds);
  let newId;
  
  do {
    newId = generator();
  } while (existingSet.has(newId));
  
  return newId;
};