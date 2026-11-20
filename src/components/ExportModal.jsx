import React, { useState } from 'react';
import { handleExport, exportFormats } from '../services/interviewExport';

const ExportModal = ({ isOpen, onClose, session }) => {
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !session) return null;

  const handleExportClick = async () => {
    setIsExporting(true);
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 300));
    
    handleExport(selectedFormat, session);
    
    setIsExporting(false);
    onClose();
  };

  const getFormatColor = (color) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/30 hover:bg-purple-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
    };
    return colors[color] || colors.blue;
  };

  const getSelectedFormatColor = (color) => {
    const colors = {
      blue: 'bg-blue-600 border-blue-500 ring-2 ring-blue-500/50',
      purple: 'bg-purple-600 border-purple-500 ring-2 ring-purple-500/50',
      red: 'bg-red-600 border-red-500 ring-2 ring-red-500/50',
      yellow: 'bg-yellow-600 border-yellow-500 ring-2 ring-yellow-500/50'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#05070b]/75 backdrop-blur-md"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="glass-panel relative w-full max-w-2xl animate-fade-in rounded-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[var(--glass-border)] p-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Export Interview Report</h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Choose your preferred export format
            </p>
          </div>
          <button
            onClick={onClose}
            className="icon-button h-9 w-9 rounded-sm"
          >
            <i className="pi pi-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Candidate Info */}
          <div className="glass-panel mb-6 rounded-sm p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#d6ff4b,#5eead4)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_10px_24px_-12px_rgba(214,255,75,0.6)]">
                <i className="pi pi-user text-xl text-[var(--text-primary)]"></i>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--text-primary)]">{session.candidateName}</h3>
                <p className="text-sm text-[var(--text-secondary)]">{session.candidateEmail}</p>
              </div>
              {session.result && (
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold text-[var(--text-primary)]">{session.result.averageScore}/10</div>
                  <div className="text-xs text-[var(--text-tertiary)]">Average Score</div>
                </div>
              )}
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Select Export Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              {exportFormats.map(format => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`glass-chip rounded-sm p-4 text-left ${
                    selectedFormat === format.id
                      ? `${getSelectedFormatColor(format.color)} text-[var(--text-primary)]`
                      : `bg-[var(--bg-tertiary)] border-[var(--glass-border)] ${getFormatColor(format.color)}`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-sm flex items-center justify-center ${
                      selectedFormat === format.id ? 'bg-white/20' : 'bg-[var(--bg-tertiary)]'
                    }`}>
                      <i className={`pi ${format.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{format.name}</div>
                      <div className={`text-xs mt-1 ${
                        selectedFormat === format.id ? 'text-[var(--text-primary)]/70' : 'text-[var(--text-secondary)]'
                      }`}>
                        {format.description}
                      </div>
                    </div>
                    {selectedFormat === format.id && (
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <i className="pi pi-check text-xs"></i>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Format Preview */}
          <div className="glass-panel rounded-sm p-4">
            <div className="mb-2 flex items-center gap-2">
              <i className="pi pi-info-circle text-[var(--accent-secondary)]"></i>
              <span className="text-sm font-medium text-[var(--text-secondary)]">Format Details</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)]/80">
              {selectedFormat === 'json' && 'Standard JSON format containing all interview data, evaluations, and metadata. Ideal for developers and system integrations.'}
              {selectedFormat === 'md' && 'Markdown document with formatted tables, headers, and emojis. Perfect for documentation and GitHub-style reports.'}
              {selectedFormat === 'pdf' && 'Print-ready PDF with professional styling, tables, and color-coded scores. Best for sharing with stakeholders.'}
              {selectedFormat === 'powerbi' && 'Structured JSON optimized for PowerBI with separate tables for metadata, questions, and score distributions.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 p-6">
          <button
            onClick={onClose}
            className="btn-secondary px-6 py-3 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExportClick}
            disabled={isExporting}
            className={`btn-primary px-8 py-3 font-bold ${isExporting ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            {isExporting ? (
              <>
                <i className="pi pi-spin pi-spinner"></i>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <i className="pi pi-download"></i>
                <span>Export Report</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;