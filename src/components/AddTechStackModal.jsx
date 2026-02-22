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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-800 sticky top-0 bg-slate-900 z-10">
          <div>
            <h2 className="text-xl font-bold text-white">Add Custom Tech Stack</h2>
            <p className="text-sm text-slate-400 mt-1">Create a new tech stack for interviews</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <i className="pi pi-times"></i>
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tech Stack Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={newTechStack.name}
              onChange={(e) => setNewTechStack(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Flutter, Kubernetes, Docker"
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Select Icon</label>
            <div className="grid grid-cols-8 gap-2 max-h-40 overflow-y-auto p-2 bg-slate-800/50 rounded-lg border border-slate-700">
              {AVAILABLE_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setNewTechStack(prev => ({ ...prev, icon }))}
                  className={`p-2 rounded-lg transition-all ${
                    newTechStack.icon === icon
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <i className={`pi ${icon}`}></i>
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description/Prompt <span className="text-red-400">*</span>
            </label>
            <textarea
              value={newTechStack.prompt}
              onChange={(e) => setNewTechStack(prev => ({ ...prev, prompt: e.target.value }))}
              placeholder="Describe what topics this tech stack covers for AI question generation..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
            <p className="text-xs text-slate-500 mt-1">This helps the AI generate relevant questions for this tech stack.</p>
          </div>

          {customTechStacks.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Existing Custom Tech Stacks ({customTechStacks.length})
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {customTechStacks.map(stack => (
                  <span 
                    key={stack.id} 
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-sm flex items-center gap-2 border border-slate-700"
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
        
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800 sticky bottom-0 bg-slate-900">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            disabled={!newTechStack.name.trim() || !newTechStack.prompt.trim()}
            className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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