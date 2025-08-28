import React, { useState } from 'react';
import './NoteCard.css';

const NoteCard = ({ note, onEdit, onDelete }) => {
  const [transform, setTransform] = useState('');

  // Safety check for note data
  if (!note) {
    return (
      <div className="note-card-container h-100">
        <div className="note-card h-100" style={{ background: '#2a2a2a', padding: '2rem', borderRadius: '20px' }}>
          <p style={{ color: 'white', textAlign: 'center' }}>No note data available</p>
        </div>
      </div>
    );
  }

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const card = e.currentTarget;
      const rect = card.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(15px)`);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(note);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(note);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getContentPreview = (content) => {
    if (!content) return 'No content';
    
    // Strip HTML tags for preview
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > 150 
      ? textContent.substring(0, 150) + '...' 
      : textContent;
  };

  const highlightText = (text, searchTerm) => {
    if (!searchTerm || !text) return text;
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <mark key={index} className="search-highlight">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const getWordCount = (content) => {
    if (!content) return 0;
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  return (
    <div 
      className="note-card-container h-100"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleMouseLeave}
      onClick={handleEdit}
    >
      <div 
        className="note-card h-100"
        style={{ transform }}
      >
        <div className="note-header">
          <div className="note-date">
            <i className="pi pi-calendar me-2"></i>
            {formatDate(note.createdAt)}
          </div>
          <div className="note-actions">
            <button 
              className="action-btn edit-btn"
              onClick={handleEdit}
              title="Edit note"
            >
              <i className="pi pi-pencil"></i>
            </button>
            <button 
              className="action-btn delete-btn"
              onClick={handleDelete}
              title="Delete note"
            >
              <i className="pi pi-trash"></i>
            </button>
          </div>
        </div>
        
        <div className="note-content">
          <h3 className="note-title">
            {note.searchHighlight?.term 
              ? highlightText(note.title || 'Untitled Note', note.searchHighlight.term)
              : (note.title || 'Untitled Note')
            }
          </h3>
          <p className="note-preview">
            {note.searchHighlight?.term 
              ? highlightText(getContentPreview(note.content), note.searchHighlight.term)
              : getContentPreview(note.content)
            }
          </p>
        </div>
        
        <div className="note-footer">
          <div className="note-stats">
            <span className="word-count">
              <i className="pi pi-file-word me-1"></i>
              {getWordCount(note.content)} words
            </span>
            {note.updatedAt !== note.createdAt && (
              <span className="last-modified">
                <i className="pi pi-clock me-1"></i>
                Modified {formatDate(note.updatedAt)}
              </span>
            )}
          </div>
        </div>
        
        <div className="note-card-shine"></div>
      </div>
    </div>
  );
};

export default NoteCard;