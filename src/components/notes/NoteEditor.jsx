import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import useAutoSave from '../../hooks/useAutoSave';
import NoteToolbar from './NoteToolbar';
import './NoteEditor.css';

const NoteEditor = ({ note, onSave, onBack }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isEditing, setIsEditing] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const titleInputRef = useRef(null);
  const contentEditableRef = useRef(null);
  const undoTimeoutRef = useRef(null);

  // Auto-save functionality with enhanced error handling
  const noteData = useMemo(() => ({ title, content }), [title, content]);

  const {
    saveStatus,
    isSaving,
    lastSaved,
    lastError,
    retryCount,
    saveNow,
    resetSaveStatus
  } = useAutoSave(
    noteData,
    async (data) => {
      if (onSave) {
        try {
          const result = await onSave(note?.id, data);
          if (result?.success === false) {
            throw new Error(result.error || 'Save operation failed');
          }
          return result;
        } catch (error) {
          console.error('Auto-save error in NoteEditor:', error);
          throw error;
        }
      }
      throw new Error('No save function provided');
    },
    {
      delay: 1000,
      enabled: true, // Always enable auto-save, let shouldSave handle the logic
      shouldSave: (newData, oldData) => {
        // Don't save if there's no meaningful content
        if (!newData.title.trim() && !newData.content.trim()) {
          return false;
        }

        // Only save if content has actually changed
        if (!oldData) {
          return true;
        }

        const titleChanged = newData.title !== oldData.title;
        const contentChanged = newData.content !== oldData.content;
        return titleChanged || contentChanged;
      },
      maxRetries: 3,
      retryDelay: 1000,
      onSave: (data, result) => {
        console.log('Note auto-saved successfully:', { data, result });
      },
      onError: (error, data) => {
        console.error('Auto-save failed after retries:', error, data);
        // Could show a toast notification here
      }
    }
  );

  // Debug logging for save status and data changes
  useEffect(() => {
    console.log('Save status changed:', saveStatus);
  }, [saveStatus]);

  useEffect(() => {
    console.log('Note data changed:', noteData, 'isEditing:', isEditing);
  }, [noteData, isEditing]);

  // Track if content change is from user input
  const isUserInputRef = useRef(false);

  // Initialize content when note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      // Set content in contentEditable when note changes (external change)
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = note.content || '';
      }
    }
  }, [note]);

  // Only sync content to contentEditable when it's not from user input
  useEffect(() => {
    if (contentEditableRef.current && !isUserInputRef.current) {
      contentEditableRef.current.innerHTML = content;
    }
    // Reset the flag after processing
    isUserInputRef.current = false;
  }, [content]);

  // Handle code block events after content is updated
  useEffect(() => {
    if (contentEditableRef.current) {
      const codeBlocks = contentEditableRef.current.querySelectorAll('.code-block code');

      codeBlocks.forEach(codeElement => {
        // Add input event listener for syntax highlighting
        const handleCodeInput = () => {
          const language = codeElement.className.replace('language-', '');
          setTimeout(() => applySyntaxHighlighting(codeElement, language), 10);
        };

        codeElement.addEventListener('input', handleCodeInput);

        // Apply initial highlighting
        const language = codeElement.className.replace('language-', '');
        applySyntaxHighlighting(codeElement, language);
      });
    }
  }, [content]);

  // Focus title input on mount for new notes and set editing mode
  useEffect(() => {
    if (!note?.id && titleInputRef.current) {
      titleInputRef.current.focus();
      setIsEditing(true); // Set editing mode for new notes
    }
  }, [note?.id]);

  // Handle title changes
  const handleTitleChange = useCallback((e) => {
    setTitle(e.target.value);
    setIsEditing(true);
  }, []);

  // Save state to undo stack
  const saveToUndoStack = useCallback((currentContent) => {
    // Clear any pending timeout
    if (undoTimeoutRef.current) {
      clearTimeout(undoTimeoutRef.current);
    }

    // Debounce undo stack saves to avoid too many entries
    undoTimeoutRef.current = setTimeout(() => {
      setUndoStack(prev => {
        const newStack = [...prev];
        // Only add if content is different from last entry
        if (newStack.length === 0 || newStack[newStack.length - 1] !== currentContent) {
          newStack.push(currentContent);
          // Limit undo stack size
          if (newStack.length > 50) {
            newStack.shift();
          }
        }
        return newStack;
      });
      setCanUndo(true);
      // Clear redo stack when new content is added
      setRedoStack([]);
      setCanRedo(false);
    }, 1000);
  }, []);

  // Handle content changes from contentEditable
  const handleContentChange = useCallback(() => {
    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.innerHTML;
      // Save current content to undo stack before changing
      saveToUndoStack(content);
      // Mark this as user input to prevent sync loop
      isUserInputRef.current = true;
      setContent(newContent);
      setIsEditing(true);
    }
  }, [content, saveToUndoStack]);

  // Handle input events on contentEditable
  const handleContentInput = useCallback((e) => {
    // Get the content directly from the event target to ensure we have the latest content
    if (e.target && e.target === contentEditableRef.current) {
      const newContent = e.target.innerHTML;
      // Save current content to undo stack before changing
      saveToUndoStack(content);
      // Mark this as user input to prevent sync loop
      isUserInputRef.current = true;
      setContent(newContent);
      setIsEditing(true);
    }
  }, [content, saveToUndoStack]);

  // Additional content capture for better reliability
  const captureCurrentContent = useCallback(() => {
    if (contentEditableRef.current) {
      const currentContent = contentEditableRef.current.innerHTML;
      if (currentContent !== content) {
        console.log('Capturing content change:', { current: currentContent, state: content });
        isUserInputRef.current = true;
        setContent(currentContent);
        setIsEditing(true);
      }
    }
  }, [content]);

  // Handle paste events to clean up formatting
  const handlePaste = useCallback((e) => {
    e.preventDefault();

    // Get plain text from clipboard
    const text = e.clipboardData.getData('text/plain');

    // Insert text at cursor position
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }

    handleContentChange();
  }, [handleContentChange]);

  // Rich text formatting functions
  const execCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    handleContentChange();
    contentEditableRef.current?.focus();
  }, [handleContentChange]);

  const toggleBold = useCallback(() => {
    execCommand('bold');
  }, [execCommand]);

  const toggleItalic = useCallback(() => {
    execCommand('italic');
  }, [execCommand]);

  const formatHeader = useCallback((level) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      if (selectedText) {
        // Wrap selected text in header tag
        const headerTag = `h${level}`;
        execCommand('formatBlock', headerTag);
      } else {
        // Insert header at cursor position
        const headerElement = document.createElement(`h${level}`);
        headerElement.textContent = `Header ${level}`;
        range.insertNode(headerElement);

        // Select the header text for easy editing
        const newRange = document.createRange();
        newRange.selectNodeContents(headerElement);
        selection.removeAllRanges();
        selection.addRange(newRange);

        handleContentChange();
      }
    }
  }, [execCommand, handleContentChange]);

  const insertList = useCallback((ordered = false) => {
    const command = ordered ? 'insertOrderedList' : 'insertUnorderedList';
    execCommand(command);
  }, [execCommand]);

  const insertCodeBlock = useCallback((language = 'javascript') => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();

      // Create code block wrapper
      const codeBlockWrapper = document.createElement('div');
      codeBlockWrapper.className = 'code-block-wrapper';
      codeBlockWrapper.contentEditable = false;

      // Create language selector
      const languageSelector = document.createElement('div');
      languageSelector.className = 'code-block-header';

      const languageSelect = document.createElement('select');
      languageSelect.className = 'language-select';

      const languages = [
        { value: 'javascript', label: 'JavaScript' },
        { value: 'python', label: 'Python' },
        { value: 'java', label: 'Java' },
        { value: 'cpp', label: 'C++' },
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'json', label: 'JSON' },
        { value: 'sql', label: 'SQL' },
        { value: 'bash', label: 'Bash' },
        { value: 'plaintext', label: 'Plain Text' }
      ];

      languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.value;
        option.textContent = lang.label;
        option.selected = lang.value === language;
        languageSelect.appendChild(option);
      });

      languageSelector.appendChild(languageSelect);

      // Create code block element
      const preElement = document.createElement('pre');
      preElement.className = 'code-block';

      const codeElement = document.createElement('code');
      codeElement.className = `language-${language}`;
      codeElement.contentEditable = true;

      if (selectedText) {
        codeElement.textContent = selectedText;
        range.deleteContents();
      } else {
        codeElement.textContent = getDefaultCodeForLanguage(language);
      }

      preElement.appendChild(codeElement);

      // Assemble the code block
      codeBlockWrapper.appendChild(languageSelector);
      codeBlockWrapper.appendChild(preElement);

      // Insert the code block
      range.insertNode(codeBlockWrapper);

      // Add event listener for language changes
      languageSelect.addEventListener('change', (e) => {
        const newLanguage = e.target.value;
        codeElement.className = `language-${newLanguage}`;
        if (codeElement.textContent === getDefaultCodeForLanguage(language)) {
          codeElement.textContent = getDefaultCodeForLanguage(newLanguage);
        }
        applySyntaxHighlighting(codeElement, newLanguage);
      });

      // Position cursor inside the code block
      const newRange = document.createRange();
      newRange.selectNodeContents(codeElement);
      selection.removeAllRanges();
      selection.addRange(newRange);

      // Apply initial syntax highlighting
      applySyntaxHighlighting(codeElement, language);

      handleContentChange();
      codeElement.focus();
    }
  }, [handleContentChange]);

  // Get default code snippet for a language
  const getDefaultCodeForLanguage = (language) => {
    const defaults = {
      javascript: '// Your JavaScript code here\nconsole.log("Hello, World!");',
      python: '# Your Python code here\nprint("Hello, World!")',
      java: '// Your Java code here\nSystem.out.println("Hello, World!");',
      cpp: '// Your C++ code here\n#include <iostream>\nstd::cout << "Hello, World!" << std::endl;',
      html: '<!-- Your HTML code here -->\n<h1>Hello, World!</h1>',
      css: '/* Your CSS code here */\nbody {\n  color: #333;\n}',
      json: '{\n  "message": "Hello, World!"\n}',
      sql: '-- Your SQL code here\nSELECT "Hello, World!" AS message;',
      bash: '# Your Bash code here\necho "Hello, World!"',
      plaintext: 'Your text here...'
    };
    return defaults[language] || '// Your code here';
  };

  // Basic syntax highlighting function
  const applySyntaxHighlighting = (codeElement, language) => {
    if (!codeElement || !language) return;

    const code = codeElement.textContent;
    if (!code) return;

    // Escape HTML to prevent injection
    const escapeHtml = (text) => {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    };

    let highlightedCode = escapeHtml(code);

    // Basic highlighting patterns for different languages
    const patterns = {
      javascript: [
        { regex: /\b(function|const|let|var|if|else|for|while|return|class|extends|import|export|from|async|await|try|catch|finally|new|this|super)\b/g, className: 'keyword' },
        { regex: /\b(true|false|null|undefined)\b/g, className: 'boolean' },
        { regex: /\b\d+(\.\d+)?\b/g, className: 'number' },
        { regex: /&quot;([^&quot;\\]|\\.)*&quot;/g, className: 'string' },
        { regex: /&#x27;([^&#x27;\\]|\\.)*&#x27;/g, className: 'string' },
        { regex: /\/\/.*$/gm, className: 'comment' },
        { regex: /\/\*[\s\S]*?\*\//g, className: 'comment' }
      ],
      python: [
        { regex: /\b(def|class|if|elif|else|for|while|return|import|from|as|try|except|finally|with|lambda|and|or|not|in|is|pass|break|continue)\b/g, className: 'keyword' },
        { regex: /\b(True|False|None)\b/g, className: 'boolean' },
        { regex: /\b\d+(\.\d+)?\b/g, className: 'number' },
        { regex: /&quot;([^&quot;\\]|\\.)*&quot;/g, className: 'string' },
        { regex: /&#x27;([^&#x27;\\]|\\.)*&#x27;/g, className: 'string' },
        { regex: /#.*$/gm, className: 'comment' }
      ],
      java: [
        { regex: /\b(public|private|protected|static|final|class|interface|extends|implements|import|package|if|else|for|while|return|new|this|super|try|catch|finally)\b/g, className: 'keyword' },
        { regex: /\b(true|false|null)\b/g, className: 'boolean' },
        { regex: /\b\d+(\.\d+)?[fFdDlL]?\b/g, className: 'number' },
        { regex: /&quot;([^&quot;\\]|\\.)*&quot;/g, className: 'string' },
        { regex: /\/\/.*$/gm, className: 'comment' },
        { regex: /\/\*[\s\S]*?\*\//g, className: 'comment' }
      ],
      css: [
        { regex: /\b(color|background|margin|padding|border|width|height|display|position|font|text|flex|grid|transform|transition|animation)\b/g, className: 'property' },
        { regex: /#[a-fA-F0-9]{3,6}\b/g, className: 'color' },
        { regex: /\b\d+(\.\d+)?(px|em|rem|%|vh|vw|pt|pc|in|cm|mm)\b/g, className: 'number' },
        { regex: /\/\*[\s\S]*?\*\//g, className: 'comment' }
      ],
      html: [
        { regex: /&lt;\/?[a-zA-Z][^&gt;]*&gt;/g, className: 'keyword' },
        { regex: /&lt;!--[\s\S]*?--&gt;/g, className: 'comment' }
      ],
      json: [
        { regex: /&quot;[^&quot;]*&quot;(?=\s*:)/g, className: 'property' },
        { regex: /&quot;[^&quot;]*&quot;(?!\s*:)/g, className: 'string' },
        { regex: /\b\d+(\.\d+)?\b/g, className: 'number' },
        { regex: /\b(true|false|null)\b/g, className: 'boolean' }
      ]
    };

    if (patterns[language]) {
      patterns[language].forEach(pattern => {
        highlightedCode = highlightedCode.replace(pattern.regex, `<span class="syntax-${pattern.className}">$&</span>`);
      });

      // Preserve cursor position
      const selection = window.getSelection();
      const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
      const cursorOffset = range && range.startContainer === codeElement ? range.startOffset : 0;

      codeElement.innerHTML = highlightedCode;

      // Restore cursor position if it was in this element
      if (range && range.startContainer === codeElement) {
        try {
          const newRange = document.createRange();
          newRange.setStart(codeElement.firstChild || codeElement, Math.min(cursorOffset, codeElement.textContent.length));
          newRange.collapse(true);
          selection.removeAllRanges();
          selection.addRange(newRange);
        } catch (e) {
          // Ignore cursor restoration errors
        }
      }
    }
  };

  // Undo/Redo functionality
  const performUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const newUndoStack = [...undoStack];
      const previousContent = newUndoStack.pop();

      // Save current content to redo stack
      setRedoStack(prev => [...prev, content]);
      setCanRedo(true);

      // Restore previous content
      isUserInputRef.current = true; // Prevent sync loop
      setContent(previousContent);
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = previousContent;
      }

      setUndoStack(newUndoStack);
      setCanUndo(newUndoStack.length > 0);
    }
  }, [undoStack, content]);

  const performRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const newRedoStack = [...redoStack];
      const nextContent = newRedoStack.pop();

      // Save current content to undo stack
      setUndoStack(prev => [...prev, content]);
      setCanUndo(true);

      // Restore next content
      isUserInputRef.current = true; // Prevent sync loop
      setContent(nextContent);
      if (contentEditableRef.current) {
        contentEditableRef.current.innerHTML = nextContent;
      }

      setRedoStack(newRedoStack);
      setCanRedo(newRedoStack.length > 0);
    }
  }, [redoStack, content]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    // Ctrl+S for manual save
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      // Capture current content before saving
      captureCurrentContent();
      setTimeout(() => {
        if (saveNow) {
          saveNow();
        } else if (onSave) {
          const currentContent = contentEditableRef.current?.innerHTML || content;
          onSave(note?.id, { title, content: currentContent });
        }
      }, 100); // Small delay to ensure state is updated
    }

    // Ctrl+B for bold
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      toggleBold();
    }

    // Ctrl+I for italic
    if (e.ctrlKey && e.key === 'i') {
      e.preventDefault();
      toggleItalic();
    }

    // Ctrl+Z for undo
    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      performUndo();
    }

    // Ctrl+Y or Ctrl+Shift+Z for redo
    if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      performRedo();
    }

    // Escape to go back
    if (e.key === 'Escape') {
      e.preventDefault();
      if (onBack) {
        onBack();
      }
    }
  }, [title, content, note?.id, onSave, onBack, toggleBold, toggleItalic, performUndo, performRedo, captureCurrentContent, saveNow]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Periodic content sync to ensure we don't lose changes
  useEffect(() => {
    const syncInterval = setInterval(() => {
      captureCurrentContent();
    }, 1000); // Check every second

    return () => {
      clearInterval(syncInterval);
    };
  }, [captureCurrentContent]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (undoTimeoutRef.current) {
        clearTimeout(undoTimeoutRef.current);
      }
    };
  }, []);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    }
  }, [onBack]);



  return (
    <div className="note-editor">
      <div className="editor-header">
        <div className="editor-nav">
          <button
            className="btn btn-outline-secondary back-btn"
            onClick={handleBack}
            title="Back to notes list"
          >
            <i className="pi pi-arrow-left me-2"></i>
            {/* Back */}
          </button>
        </div>
      </div>

      <div className="editor-content">
        <div className="title-section">
          <input
            ref={titleInputRef}
            type="text"
            className="title-input"
            placeholder="Untitled Note"
            value={title}
            onChange={handleTitleChange}
            maxLength={200}
          />
        </div>

        <NoteToolbar
          onBold={toggleBold}
          onItalic={toggleItalic}
          onHeader={formatHeader}
          onList={insertList}
          onUndo={performUndo}
          onRedo={performRedo}
          onCodeBlock={insertCodeBlock}
          canUndo={canUndo}
          canRedo={canRedo}
          saveStatus={saveStatus}
          lastSaved={lastSaved}
          lastError={lastError}
          retryCount={retryCount}
          onManualSave={saveNow}
          onResetSaveStatus={resetSaveStatus}
        />

        <div className="content-section">
          <div
            ref={contentEditableRef}
            className="content-editor"
            contentEditable
            suppressContentEditableWarning={true}
            onInput={handleContentInput}
            onPaste={handlePaste}
            onBlur={captureCurrentContent}
            onKeyUp={captureCurrentContent}
            data-placeholder="Start writing your note..."
          />
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;