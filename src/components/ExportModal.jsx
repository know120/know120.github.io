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
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white">Export Interview Report</h2>
            <p className="text-sm text-slate-400 mt-1">
              Choose your preferred export format
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <i className="pi pi-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Candidate Info */}
          <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                <i className="pi pi-user text-xl text-white"></i>
              </div>
              <div>
                <h3 className="font-semibold text-white">{session.candidateName}</h3>
                <p className="text-sm text-slate-400">{session.candidateEmail}</p>
              </div>
              {session.result && (
                <div className="ml-auto text-right">
                  <div className="text-2xl font-bold text-white">{session.result.averageScore}/10</div>
                  <div className="text-xs text-slate-400">Average Score</div>
                </div>
              )}
            </div>
          </div>

          {/* Format Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Select Export Format
            </label>
            <div className="grid grid-cols-2 gap-4">
              {exportFormats.map(format => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedFormat === format.id
                      ? `${getSelectedFormatColor(format.color)} text-white`
                      : `bg-slate-800/50 border-slate-700 ${getFormatColor(format.color)}`
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      selectedFormat === format.id ? 'bg-white/20' : 'bg-slate-700/50'
                    }`}>
                      <i className={`pi ${format.icon} text-lg`}></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold">{format.name}</div>
                      <div className={`text-xs mt-1 ${
                        selectedFormat === format.id ? 'text-white/70' : 'text-slate-400'
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
          <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <i className="pi pi-info-circle text-slate-400"></i>
              <span className="text-sm font-medium text-slate-300">Format Details</span>
            </div>
            <p className="text-sm text-slate-400">
              {selectedFormat === 'json' && 'Standard JSON format containing all interview data, evaluations, and metadata. Ideal for developers and system integrations.'}
              {selectedFormat === 'md' && 'Markdown document with formatted tables, headers, and emojis. Perfect for documentation and GitHub-style reports.'}
              {selectedFormat === 'pdf' && 'Print-ready PDF with professional styling, tables, and color-coded scores. Best for sharing with stakeholders.'}
              {selectedFormat === 'powerbi' && 'Structured JSON optimized for PowerBI with separate tables for metadata, questions, and score distributions.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-lg font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleExportClick}
            disabled={isExporting}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all flex items-center gap-2 ${
              isExporting
                ? 'bg-indigo-600/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
            }`}
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