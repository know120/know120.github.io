# Design Document

## Overview

The Notes Management system will be built as a React-based single-page application that integrates seamlessly with the existing portfolio architecture. The design follows the current application patterns using React functional components, React Router for navigation, and Bootstrap 5 for styling consistency. The system will provide a rich text editing experience similar to Notion or Microsoft Loop, with persistent local storage and a responsive design that matches the existing dark theme aesthetic.

## Architecture

### Component Architecture
The notes system will follow the existing React component structure:

```
src/
├── pages/
│   └── Note.js (Enhanced main notes page)
├── components/
│   ├── notes/
│   │   ├── NoteEditor.js (Rich text editor component)
│   │   ├── NotesList.js (Notes listing and search)
│   │   ├── NoteCard.js (Individual note preview card)
│   │   └── NoteToolbar.js (Formatting toolbar)
│   └── common/
│       └── ConfirmDialog.js (Reusable confirmation dialog)
└── hooks/
    ├── useNotes.js (Notes management logic)
    ├── useLocalStorage.js (Persistent storage)
    └── useAutoSave.js (Auto-save functionality)
```

### State Management
The application will use React's built-in state management with custom hooks:
- **useNotes**: Central hook for all note operations (CRUD)
- **useLocalStorage**: Handles persistence to browser localStorage
- **useAutoSave**: Manages automatic saving with debouncing

### Routing Integration
The notes feature will integrate with the existing React Router setup in App.js, maintaining the current navigation structure while enhancing the `/note` route.

## Components and Interfaces

### Core Components

#### 1. Enhanced Note.js (Main Page)
```javascript
// Main interface structure
const Note = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' | 'editor'
  const [selectedNote, setSelectedNote] = useState(null);
  const { notes, createNote, updateNote, deleteNote } = useNotes();
  
  return (
    <div className="app">
      <Navigation />
      <div className="notes-container">
        {currentView === 'list' ? (
          <NotesList 
            notes={notes}
            onSelectNote={handleSelectNote}
            onCreateNote={handleCreateNote}
            onDeleteNote={handleDeleteNote}
          />
        ) : (
          <NoteEditor
            note={selectedNote}
            onSave={handleSaveNote}
            onBack={handleBackToList}
          />
        )}
      </div>
    </div>
  );
};
```

#### 2. NotesList Component
- Displays all notes in a responsive grid layout
- Includes search functionality with real-time filtering
- Shows note previews with title, date, and content snippet
- Provides create new note button
- Handles empty state when no notes exist

#### 3. NoteEditor Component
- Rich text editing capabilities using contentEditable or a lightweight editor
- Auto-save functionality with visual indicators
- Formatting toolbar with common options (bold, italic, headers, lists, code blocks)
- Syntax highlighting for code blocks
- Real-time character/word count
- Last modified timestamp display

#### 4. NoteCard Component
- Consistent with existing ProjectCard styling using 3D effects
- Shows note title, creation date, and content preview
- Hover effects and animations matching the current design system
- Action buttons for edit and delete

#### 5. NoteToolbar Component
- Formatting buttons (Bold, Italic, Headers H1-H3)
- List creation (Bulleted, Numbered)
- Code block insertion with language selection
- Undo/Redo functionality
- Save status indicator

### Custom Hooks

#### useNotes Hook
```javascript
const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const { getItem, setItem } = useLocalStorage('portfolio-notes');

  const createNote = (noteData) => {
    const newNote = {
      id: generateId(),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    // Implementation details...
  };

  const updateNote = (id, updates) => {
    // Implementation details...
  };

  const deleteNote = (id) => {
    // Implementation details...
  };

  return { notes, createNote, updateNote, deleteNote };
};
```

#### useAutoSave Hook
```javascript
const useAutoSave = (data, saveFunction, delay = 2000) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Debounced auto-save implementation
  // Visual feedback for save status
  
  return { isSaving, lastSaved };
};
```

## Data Models

### Note Model
```javascript
const NoteSchema = {
  id: String, // UUID or timestamp-based unique identifier
  title: String, // Note title (max 200 characters)
  content: String, // Rich text content (HTML format)
  createdAt: String, // ISO timestamp
  updatedAt: String, // ISO timestamp
  tags: Array, // Optional: Array of strings for future categorization
  metadata: {
    wordCount: Number,
    characterCount: Number,
    readingTime: Number // Estimated reading time in minutes
  }
};
```

### Storage Structure
```javascript
// localStorage key: 'portfolio-notes'
const StorageStructure = {
  notes: Array, // Array of Note objects
  settings: {
    autoSaveInterval: Number, // milliseconds
    defaultFontSize: String,
    theme: String // 'dark' | 'light'
  },
  lastBackup: String // ISO timestamp of last backup
};
```

## User Interface Design

### Design System Integration
- **Colors**: Maintain existing gradient themes (#6366f1, #8b5cf6, #a855f7)
- **Typography**: Use existing font stack and sizing hierarchy
- **Spacing**: Follow Bootstrap 5 spacing utilities
- **Components**: Consistent with existing Card and Button styles
- **Animations**: Integrate with existing fadeInUp and 3D transform effects

### Layout Structure
```
┌─────────────────────────────────────────┐
│ Navigation Bar (existing)               │
├─────────────────────────────────────────┤
│ Notes Header & Search                   │
├─────────────────────────────────────────┤
│ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│ │ Note 1  │ │ Note 2  │ │ Note 3  │    │
│ │ Card    │ │ Card    │ │ Card    │    │
│ └─────────┘ └─────────┘ └─────────┘    │
│                                         │
│ [+ Create New Note]                     │
└─────────────────────────────────────────┘
```

### Editor Layout
```
┌─────────────────────────────────────────┐
│ [← Back] Note Title        [Save Status]│
├─────────────────────────────────────────┤
│ [B] [I] [H1] [H2] [•] [1.] [</>]       │
├─────────────────────────────────────────┤
│                                         │
│ Rich Text Editor Area                   │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### Responsive Behavior
- **Desktop**: 3-column grid for note cards, full-width editor
- **Tablet**: 2-column grid, optimized toolbar layout
- **Mobile**: Single column, collapsible toolbar, touch-friendly controls

## Error Handling

### Storage Error Handling
- **Quota Exceeded**: Notify user and suggest cleanup of old notes
- **Storage Unavailable**: Graceful degradation with session-only storage
- **Corruption Detection**: Backup validation and recovery mechanisms

### Editor Error Handling
- **Auto-save Failures**: Retry mechanism with exponential backoff
- **Content Loss Prevention**: Periodic content snapshots in sessionStorage
- **Format Validation**: Sanitize and validate HTML content

### User Experience Error Handling
- **Loading States**: Skeleton screens and loading indicators
- **Network Issues**: Offline-first approach with sync indicators
- **Validation Errors**: Inline validation with helpful error messages

## Testing Strategy

### Unit Testing
- **Custom Hooks**: Test useNotes, useLocalStorage, useAutoSave in isolation
- **Utility Functions**: Test note formatting, search, and validation functions
- **Component Logic**: Test component state management and event handling

### Integration Testing
- **Storage Integration**: Test localStorage read/write operations
- **Component Integration**: Test data flow between NotesList and NoteEditor
- **Auto-save Integration**: Test debouncing and save status updates

### User Experience Testing
- **Accessibility**: Screen reader compatibility, keyboard navigation
- **Performance**: Large note handling, search performance
- **Cross-browser**: localStorage compatibility, editor functionality

### Test Structure
```javascript
// Example test structure
describe('Notes Management', () => {
  describe('useNotes Hook', () => {
    test('creates new note with correct structure');
    test('updates existing note');
    test('deletes note and updates storage');
  });
  
  describe('NoteEditor Component', () => {
    test('auto-saves content after typing stops');
    test('applies formatting correctly');
    test('handles large content efficiently');
  });
  
  describe('Search Functionality', () => {
    test('filters notes by title');
    test('searches within note content');
    test('highlights search results');
  });
});
```

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Load note content only when needed
- **Debounced Search**: Prevent excessive filtering operations
- **Virtual Scrolling**: Handle large numbers of notes efficiently
- **Content Chunking**: Split large notes for better performance

### Memory Management
- **Component Cleanup**: Proper useEffect cleanup for timers and listeners
- **Storage Optimization**: Compress note content for storage
- **Caching Strategy**: Cache frequently accessed notes in memory

### Bundle Size Optimization
- **Code Splitting**: Lazy load editor components
- **Tree Shaking**: Import only necessary utilities
- **Lightweight Dependencies**: Avoid heavy rich text editor libraries