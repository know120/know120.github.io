import { useState, useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import { createNoteModel, validateNote, updateNoteMetadata } from '../utils/noteModel';
import { generateUniqueId } from '../utils/idGenerator';

/**
 * Custom hook for managing notes with CRUD operations
 * Provides comprehensive note management functionality with search and filtering
 * 
 * @returns {Object} Hook interface with notes data and operations
 */
const useNotes = () => {
  const {
    data: storageData,
    isLoading: storageLoading,
    error: storageError,
    updateData,
    isReady: storageReady
  } = useLocalStorage();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [sortBy, setSortBy] = useState('updatedAt'); // 'updatedAt', 'createdAt', 'title', 'wordCount'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  // Extract notes from storage data
  const allNotes = useMemo(() => {
    return storageData?.notes || [];
  }, [storageData]);

  // Get all unique tags from notes
  const availableTags = useMemo(() => {
    const tagSet = new Set();
    allNotes.forEach(note => {
      note.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [allNotes]);

  // Filter and search notes
  const filteredNotes = useMemo(() => {
    let filtered = [...allNotes];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(note => {
        const titleMatch = note.title.toLowerCase().includes(query);
        const contentMatch = note.content.toLowerCase().includes(query);
        const tagMatch = note.tags?.some(tag =>
          tag.toLowerCase().includes(query)
        );
        return titleMatch || contentMatch || tagMatch;
      });
    }

    // Apply tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(note => {
        return selectedTags.every(selectedTag =>
          note.tags?.includes(selectedTag)
        );
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case 'wordCount':
          aValue = a.metadata?.wordCount || 0;
          bValue = b.metadata?.wordCount || 0;
          break;
        case 'updatedAt':
        default:
          aValue = new Date(a.updatedAt);
          bValue = new Date(b.updatedAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [allNotes, searchQuery, selectedTags, sortBy, sortOrder]);

  /**
   * Creates a new note
   * @param {Object} noteData - Initial note data
   * @param {string} [noteData.title] - Note title
   * @param {string} [noteData.content] - Note content
   * @param {string[]} [noteData.tags] - Note tags
   * @returns {Promise<{success: boolean, note?: Note, error?: string}>}
   */
  const createNote = useCallback(async (noteData = {}) => {
    if (!storageReady) {
      return { success: false, error: 'Storage not ready' };
    }

    try {
      // Generate unique ID
      const existingIds = allNotes.map(note => note.id);
      const uniqueId = generateUniqueId(existingIds);

      // Create new note with unique ID
      const newNote = createNoteModel({
        ...noteData,
        id: uniqueId
      });

      // Validate the note
      const validation = validateNote(newNote);
      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid note data: ${validation.errors.join(', ')}`
        };
      }

      // Update storage with new note
      const success = await updateData(currentData => ({
        ...currentData,
        notes: [newNote, ...currentData.notes]
      }));

      if (success) {
        return { success: true, note: newNote };
      } else {
        return { success: false, error: 'Failed to save note to storage' };
      }
    } catch (error) {
      console.error('Error creating note:', error);
      return { success: false, error: error.message };
    }
  }, [storageReady, allNotes, updateData]);

  /**
   * Updates an existing note
   * @param {string} id - Note ID to update
   * @param {Object} updates - Updates to apply
   * @param {string} [updates.title] - New title
   * @param {string} [updates.content] - New content
   * @param {string[]} [updates.tags] - New tags
   * @returns {Promise<{success: boolean, note?: Note, error?: string}>}
   */
  const updateNote = useCallback(async (id, updates) => {

    if (!storageReady) {
      console.log('Storage not ready');
      return { success: false, error: 'Storage not ready' };
    }

    if (!id || typeof id !== 'string') {
      console.log('Invalid note ID:', id);
      return { success: false, error: 'Invalid note ID' };
    }

    try {
      const existingNote = allNotes.find(note => note.id === id);
      console.log('Existing note found:', existingNote);

      if (!existingNote) {
        console.log('Note not found with ID:', id);
        return { success: false, error: 'Note not found' };
      }

      // Create updated note with metadata refresh
      const updatedNote = updateNoteMetadata({
        ...existingNote,
        ...updates,
        id, // Ensure ID cannot be changed
        createdAt: existingNote.createdAt // Preserve creation date
      });

      console.log('Updated note created:', updatedNote);

      // Validate the updated note
      const validation = validateNote(updatedNote);
      console.log('Validation result:', validation);

      if (!validation.isValid) {
        return {
          success: false,
          error: `Invalid note data: ${validation.errors.join(', ')}`
        };
      }

      // Update storage
      const success = await updateData(currentData => {
        const newData = {
          ...currentData,
          notes: currentData.notes.map(note =>
            note.id === id ? updatedNote : note
          )
        };
        return newData;
      });

      console.log('updateData success:', success);

      if (success) {
        return { success: true, note: updatedNote };
      } else {
        return { success: false, error: 'Failed to save note to storage' };
      }
    } catch (error) {
      console.error('Error updating note:', error);
      return { success: false, error: error.message };
    }
  }, [storageReady, allNotes, updateData]);

  /**
   * Deletes a note
   * @param {string} id - Note ID to delete
   * @param {boolean} [skipConfirmation=false] - Skip confirmation dialog
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deleteNote = useCallback(async (id, skipConfirmation = false) => {
    if (!storageReady) {
      return { success: false, error: 'Storage not ready' };
    }

    if (!id || typeof id !== 'string') {
      return { success: false, error: 'Invalid note ID' };
    }

    try {
      const existingNote = allNotes.find(note => note.id === id);
      if (!existingNote) {
        return { success: false, error: 'Note not found' };
      }

      // Show confirmation dialog unless skipped
      // if (!skipConfirmation) {
      //   const confirmed = window.confirm(
      //     `Are you sure you want to delete "${existingNote.title}"? This action cannot be undone.`
      //   );
      //   if (!confirmed) {
      //     return { success: false, error: 'Deletion cancelled by user' };
      //   }
      // }

      // Update storage by removing the note
      const success = await updateData(currentData => ({
        ...currentData,
        notes: currentData.notes.filter(note => note.id !== id)
      }));

      if (success) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to delete note from storage' };
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      return { success: false, error: error.message };
    }
  }, [storageReady, allNotes, updateData]);

  /**
   * Gets a single note by ID
   * @param {string} id - Note ID
   * @returns {Note|null} Note object or null if not found
   */
  const getNote = useCallback((id) => {
    if (!id || typeof id !== 'string') return null;
    return allNotes.find(note => note.id === id) || null;
  }, [allNotes]);

  /**
   * Duplicates an existing note
   * @param {string} id - Note ID to duplicate
   * @returns {Promise<{success: boolean, note?: Note, error?: string}>}
   */
  const duplicateNote = useCallback(async (id) => {
    const originalNote = getNote(id);
    if (!originalNote) {
      return { success: false, error: 'Note not found' };
    }

    return await createNote({
      title: `${originalNote.title} (Copy)`,
      content: originalNote.content,
      tags: [...originalNote.tags]
    });
  }, [getNote, createNote]);

  /**
   * Bulk delete multiple notes
   * @param {string[]} ids - Array of note IDs to delete
   * @param {boolean} [skipConfirmation=false] - Skip confirmation dialog
   * @returns {Promise<{success: boolean, deletedCount: number, errors: string[]}>}
   */
  const bulkDeleteNotes = useCallback(async (ids, skipConfirmation = false) => {
    if (!Array.isArray(ids) || ids.length === 0) {
      return { success: false, deletedCount: 0, errors: ['No notes selected'] };
    }

    // if (!skipConfirmation) {
    //   const confirmed = window.confirm(
    //     `Are you sure you want to delete ${ids.length} note(s)? This action cannot be undone.`
    //   );
    //   if (!confirmed) {
    //     return { success: false, deletedCount: 0, errors: ['Deletion cancelled by user'] };
    //   }
    // }

    const errors = [];
    let deletedCount = 0;

    for (const id of ids) {
      const result = await deleteNote(id, true); // Skip individual confirmations
      if (result.success) {
        deletedCount++;
      } else {
        errors.push(`Failed to delete note ${id}: ${result.error}`);
      }
    }

    return {
      success: deletedCount > 0,
      deletedCount,
      errors
    };
  }, [deleteNote]);

  /**
   * Search notes with highlighting information
   * @param {string} query - Search query
   * @returns {Array} Notes with search highlighting info
   */
  const searchNotes = useCallback((query) => {
    if (!query || typeof query !== 'string') return allNotes;

    const searchTerm = query.toLowerCase().trim();
    return allNotes.map(note => {
      const titleMatch = note.title.toLowerCase().includes(searchTerm);
      const contentMatch = note.content.toLowerCase().includes(searchTerm);
      const tagMatches = note.tags?.filter(tag =>
        tag.toLowerCase().includes(searchTerm)
      ) || [];

      return {
        ...note,
        searchHighlight: {
          titleMatch,
          contentMatch,
          tagMatches,
          hasMatch: titleMatch || contentMatch || tagMatches.length > 0
        }
      };
    }).filter(note => note.searchHighlight.hasMatch);
  }, [allNotes]);

  // Statistics
  const stats = useMemo(() => {
    const totalNotes = allNotes.length;
    const totalWords = allNotes.reduce((sum, note) =>
      sum + (note.metadata?.wordCount || 0), 0
    );
    const totalCharacters = allNotes.reduce((sum, note) =>
      sum + (note.metadata?.characterCount || 0), 0
    );
    const averageWordsPerNote = totalNotes > 0 ? Math.round(totalWords / totalNotes) : 0;

    return {
      totalNotes,
      totalWords,
      totalCharacters,
      averageWordsPerNote,
      totalTags: availableTags.length
    };
  }, [allNotes, availableTags]);

  return {
    // Data
    notes: filteredNotes,
    allNotes,
    availableTags,
    stats,

    // Loading and error states
    isLoading: storageLoading,
    error: storageError,
    isReady: storageReady,

    // CRUD operations
    createNote,
    updateNote,
    deleteNote,
    getNote,
    duplicateNote,
    bulkDeleteNotes,

    // Search and filtering
    searchQuery,
    setSearchQuery,
    selectedTags,
    setSelectedTags,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    searchNotes,

    // Utility methods
    isEmpty: allNotes.length === 0,
    hasNotes: allNotes.length > 0,
    filteredCount: filteredNotes.length,
    totalCount: allNotes.length
  };
};

export default useNotes;