import React, { useState } from 'react';

const AVAILABLE_ICONS = [
  'pi-bolt', 'pi-code', 'pi-database', 'pi-server', 'pi-cloud', 'pi-cog',
  'pi-wrench', 'pi-shield', 'pi-lock', 'pi-unlock', 'pi-key',
  'pi-link', 'pi-share-alt', 'pi-sitemap', 'pi-send', 'pi-inbox', 'pi-folder',
  'pi-folder-open', 'pi-file', 'pi-file-edit', 'pi-pencil', 'pi-trash', 'pi-copy',
  'pi-search', 'pi-search-plus', 'pi-eye', 'pi-eye-slash', 'pi-star', 'pi-star-fill',
  'pi-heart', 'pi-heart-fill', 'pi-bookmark', 'pi-flag', 'pi-tag', 'pi-tags',
  'pi-cart', 'pi-shopping-cart', 'pi-credit-card', 'pi-wallet', 'pi-money-bill',
  'pi-calendar', 'pi-clock', 'pi-stopwatch', 'pi-bell', 'pi-envelope', 'pi-comment',
  'pi-comments', 'pi-user', 'pi-users', 'pi-user-plus', 'pi-user-minus',
  'pi-home', 'pi-building', 'pi-map-marker', 'pi-globe', 'pi-planet',
  'pi-mobile', 'pi-tablet', 'pi-desktop', 'pi-monitor', 'pi-keyboard', 'pi-mouse',
  'pi-printer', 'pi-save', 'pi-download', 'pi-upload', 'pi-external-link',
  'pi-refresh', 'pi-sync', 'pi-replay', 'pi-play', 'pi-pause', 'pi-stop',
  'pi-step-backward', 'pi-step-forward', 'pi-fast-backward', 'pi-fast-forward',
  'pi-skip-backward', 'pi-skip-forward', 'pi-shuffle', 'pi-random',
  'pi-volume-up', 'pi-volume-down', 'pi-volume-off', 'pi-bars', 'pi-chart-bar',
  'pi-chart-line', 'pi-chart-pie', 'pi-images', 'pi-image', 'pi-video', 'pi-music',
  'pi-headphones', 'pi-microphone', 'pi-camera', 'pi-video-camera', 'pi-id-card',
  'pi-verified', 'pi-check-circle', 'pi-check-square', 'pi-times-circle',
  'pi-exclamation-circle', 'pi-info-circle', 'pi-question-circle', 'pi-help',
  'pi-ban', 'pi-times', 'pi-plus', 'pi-minus', 'pi-plus-circle', 'pi-minus-circle',
  'pi-arrow-up', 'pi-arrow-down', 'pi-arrow-left', 'pi-arrow-right',
  'pi-arrows-h', 'pi-arrows-v', 'pi-expand', 'pi-compress', 'pi-maximize',
  'pi-sort-alt', 'pi-filter', 'pi-sort-amount-up', 'pi-sort-amount-down'
];

const AddTechStackModal = ({ isOpen, onClose, customTechStacks, onAddStack, onDeleteStack }) => {
  const [newTechStack, setNewTechStack] = useState({ name: '', icon: 'pi-code', prompt: '' });

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newTechStack.name.trim() || !newTechStack.prompt.trim()) {
      return;
    }
    const newStack = {
      id: 'custom_' + Date.now().toString(36),
      name: newTechStack.name.trim(),
      icon: newTechStack.icon,
      prompt: newTechStack.prompt.trim(),
      isCustom: true
    };
    onAddStack(newStack);
    setNewTechStack({ name: '', icon: 'pi-code', prompt: '' });
    onClose();
  };

  const handleDelete = (stackId) => {
    onDeleteStack(stackId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#05070b]/75 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="glass-panel relative max-h-[90vh] w-full max-w-lg animate-fade-in overflow-y-auto rounded-sm">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[var(--glass-border)] bg-[rgba(10,14,21,0.92)] p-6 backdrop-blur-xl">
          <div>
            <h2 className="text-xl font-bold text-white">Add Custom Tech Stack</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Create a new tech stack for interviews</p>
          </div>
          <button 
            onClick={onClose} 
            className="icon-button h-9 w-9 rounded-sm"
          >
            <i className="pi pi-times"></i>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Tech Stack Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newTechStack.name}
              onChange={(e) => setNewTechStack(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Flutter, Kubernetes, Docker"
              className="glass-input w-full px-4 py-3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Select Icon</label>
            <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto rounded-sm border border-[var(--glass-border)] bg-[var(--bg-tertiary)] p-2">
              {AVAILABLE_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewTechStack(prev => ({ ...prev, icon }))}
                  className={`icon-button rounded-sm p-2 ${
                    newTechStack.icon === icon
                      ? 'glass-chip-active border-[var(--accent-primary)] text-[#080a0f]'
                      : 'text-[var(--text-secondary)]'
                  }`}
                >
                  <i className={`pi ${icon}`}></i>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Description/Prompt <span className="text-red-400">*</span>
            </label>
            <textarea
              value={newTechStack.prompt}
              onChange={(e) => setNewTechStack(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Describe what topics this tech stack covers for AI question generation..."
              rows={3}
              className="glass-input w-full px-4 py-3 resize-none"
            />
            <p className="mt-1 text-xs text-[var(--text-tertiary)]">This helps the AI generate relevant questions for this tech stack.</p>
          </div>

          {customTechStacks.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Existing Custom Tech Stacks ({customTechStacks.length})
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {customTechStacks.map(stack => (
                  <span 
                    key={stack.id} 
                    className="glass-chip rounded-sm px-3 py-1.5 text-sm"
                  >
                    <i className={`pi ${stack.icon} text-indigo-400`}></i>
                    {stack.name}
                    <button
                      type="button"
                      onClick={() => handleDelete(stack.id)}
                      className="ml-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <i className="pi pi-times"></i>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-[var(--glass-border)] bg-[rgba(10,14,21,0.92)] p-6 backdrop-blur-xl">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary px-6 py-3 font-medium"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newTechStack.name.trim() || !newTechStack.prompt.trim()}
            className="btn-primary px-6 py-3 font-bold disabled:cursor-not-allowed disabled:opacity-50"
          >
            <i className="pi pi-plus"></i>
            Add Tech Stack
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTechStackModal;