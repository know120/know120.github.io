import React, { useState, useEffect } from 'react';
import { migrateQuery, generateQueryFromSchema } from '../services/dbMigrationService';
import { fetchAvailableModels } from '../services/interviewService';

const DBMigration = () => {
  const [mode, setMode] = useState('migration'); // 'migration' or 'new-schema'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showConfig, setShowConfig] = useState(false);
  const [isFetchingModels, setIsFetchingModels] = useState(false);
  const [availableModels, setAvailableModels] = useState([]);

  const [formData, setFormData] = useState({
    apiKey: '',
    model: 'gemini-2.5-flash',
    oldSchema: '',
    newSchema: '',
    oldQuery: '',
    naturalLanguagePrompt: '',
  });

  const [schemaInputs, setSchemaInputs] = useState({
    old: 'text', // 'text' or 'file'
    new: 'text', // 'text' or 'file'
  });

  useEffect(() => {
    const updateModels = async () => {
      if (formData.apiKey.trim().length < 10) return;
      
      setIsFetchingModels(true);
      try {
        const models = await fetchAvailableModels(formData.apiKey);
        setAvailableModels(models);
        if (models.length > 0 && !models.find(m => m.id === formData.model)) {
          setFormData(prev => ({ ...prev, model: models[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch models:', err);
      } finally {
        setIsFetchingModels(false);
      }
    };

    const timer = setTimeout(updateModels, 500);
    return () => clearTimeout(timer);
  }, [formData.apiKey]);

  const handleFileChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      setFormData(prev => ({
        ...prev,
        [type === 'old' ? 'oldSchema' : 'newSchema']: content
      }));
    };
    reader.readAsText(file);
  };

  const handleProcess = async () => {
    if (!formData.apiKey) {
      setError('API Key is required. Please open configuration settings.');
      return;
    }
    if (!formData.newSchema) {
      setError('New Schema is required. Please provide it in configuration.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      if (mode === 'migration') {
        if (!formData.oldSchema || !formData.oldQuery) {
          throw new Error('Old Schema and Old Query are required for migration mode');
        }
        const res = await migrateQuery({
          oldSchema: formData.oldSchema,
          newSchema: formData.newSchema,
          oldQuery: formData.oldQuery,
          apiKey: formData.apiKey,
          model: formData.model,
        });
        setResult({ query: res.transformedQuery, explanation: res.explanation });
      } else {
        if (!formData.naturalLanguagePrompt) {
          throw new Error('Natural language prompt is required for query generation');
        }
        const res = await generateQueryFromSchema({
          newSchema: formData.newSchema,
          naturalLanguagePrompt: formData.naturalLanguagePrompt,
          apiKey: formData.apiKey,
          model: formData.model,
        });
        setResult({ query: res.generatedQuery, explanation: res.explanation });
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing your request');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="glass-panel rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                <i className="pi pi-database text-4xl text-white"></i>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">Database Migration Tool</h1>
              <p className="text-slate-400 text-lg">
                Transform queries or generate new ones using AI.
              </p>
            </div>
            <button 
              onClick={() => setShowConfig(true)}
              className="px-6 py-3 rounded-lg font-medium text-white bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all flex items-center gap-2"
            >
              <i className="pi pi-cog"></i>
              Configuration
            </button>
          </div>

          <div className="space-y-8">
            <div className="flex justify-center">
              <div className="p-1 bg-slate-800 rounded-xl flex gap-1">
                <button
                  onClick={() => setMode('migration')}
                  className={`px-8 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'migration' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'}`}
                >
                  Migration Mode
                </button>
                <button
                  onClick={() => setMode('new-schema')}
                  className={`px-8 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'new-schema' 
                    ? 'bg-blue-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-white'}`}
                >
                  Brand New Schema
                </button>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-700">
              {mode === 'migration' ? (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Old SQL Query</label>
                  <textarea
                    value={formData.oldQuery}
                    onChange={(e) => setFormData(prev => ({ ...prev, oldQuery: e.target.value }))}
                    placeholder="SELECT * FROM users WHERE..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Natural Language Request</label>
                  <textarea
                    value={formData.naturalLanguagePrompt}
                    onChange={(e) => setFormData(prev => ({ ...prev, naturalLanguagePrompt: e.target.value }))}
                    placeholder="Show me all users who joined in the last 30 days..."
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  />
                </div>
              )}
              
              <button
                onClick={handleProcess}
                disabled={loading}
                className={`w-full mt-6 py-4 rounded-lg font-bold text-white transition-all ${loading 
                  ? 'bg-blue-600/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:scale-[1.01]'}`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <i className="pi pi-spin pi-spinner"></i>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <i className="pi pi-bolt"></i>
                    <span>{mode === 'migration' ? 'Transform Query' : 'Generate Query'}</span>
                  </div>
                )}
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-2 text-red-400">
                  <i className="pi pi-exclamation-circle"></i>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {result && (
              <div className="p-6 rounded-xl bg-slate-900/80 border border-blue-500/30 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Result</h3>
                  <button 
                    onClick={() => copyToClipboard(result.query)}
                    className="px-3 py-1 text-xs font-medium text-blue-400 hover:text-blue-300 bg-blue-500/10 rounded border border-blue-500/20 transition-all flex items-center gap-1"
                  >
                    <i className="pi pi-copy"></i> Copy SQL
                  </button>
                </div>
                <div className="relative mb-6">
                  <pre className="p-4 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
                    <code className="text-green-400 font-mono text-sm">{result.query}</code>
                  </pre>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-2">Explanation</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {result.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl glass-panel rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Configuration</h2>
              <button onClick={() => setShowConfig(false)} className="text-slate-400 hover:text-white">
                <i className="pi pi-times text-xl"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Gemini API Key</label>
                  <input
                    type="password"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Enter API Key"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">AI Model</label>
                  <div className="relative">
                    <select
                      value={formData.model}
                      onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                      disabled={availableModels.length === 0}
                      className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {availableModels.length > 0 ? (
                        availableModels.map(model => (
                          <option key={model.id} value={model.id}>{model.name}</option>
                        ))
                      ) : (
                        <option value="">Enter API Key to load models</option>
                      )}
                    </select>
                    {isFetchingModels && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <i className="pi pi-spin pi-spinner text-blue-400"></i>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white">Database Schemas</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-slate-300">Old DB Schema (DDL)</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSchemaInputs(prev => ({ ...prev, old: 'text' }))}
                          className={`text-xs px-2 py-1 rounded ${schemaInputs.old === 'text' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                        >
                          Text
                        </button>
                        <button 
                          onClick={() => setSchemaInputs(prev => ({ ...prev, old: 'file' }))}
                          className={`text-xs px-2 py-1 rounded ${schemaInputs.old === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                        >
                          File
                        </button>
                      </div>
                    </div>
                    {schemaInputs.old === 'text' ? (
                      <textarea
                        value={formData.oldSchema}
                        onChange={(e) => setFormData(prev => ({ ...prev, oldSchema: e.target.value }))}
                        placeholder="CREATE TABLE users (...);"
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-dashed border-slate-600 text-center">
                        <input 
                          type="file" 
                          onChange={(e) => handleFileChange(e, 'old')}
                          className="hidden" 
                          id="config-old-schema-file"
                        />
                        <label htmlFor="config-old-schema-file" className="cursor-pointer text-slate-400 hover:text-white transition-all block py-4">
                          <i className="pi pi-upload block text-xl mb-1"></i>
                          {formData.oldSchema ? 'File loaded. Click to change.' : 'Upload old schema file'}
                        </label>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-slate-300">New DB Schema (DDL)</label>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setSchemaInputs(prev => ({ ...prev, new: 'text' }))}
                          className={`text-xs px-2 py-1 rounded ${schemaInputs.new === 'text' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                        >
                          Text
                        </button>
                        <button 
                          onClick={() => setSchemaInputs(prev => ({ ...prev, new: 'file' }))}
                          className={`text-xs px-2 py-1 rounded ${schemaInputs.new === 'file' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'}`}
                        >
                          File
                        </button>
                      </div>
                    </div>
                    {schemaInputs.new === 'text' ? (
                      <textarea
                        value={formData.newSchema}
                        onChange={(e) => setFormData(prev => ({ ...prev, newSchema: e.target.value }))}
                        placeholder="CREATE TABLE accounts (...);"
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
                      />
                    ) : (
                      <div className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-dashed border-slate-600 text-center">
                        <input 
                          type="file" 
                          onChange={(e) => handleFileChange(e, 'new')}
                          className="hidden" 
                          id="config-new-schema-file"
                        />
                        <label htmlFor="config-new-schema-file" className="cursor-pointer text-slate-400 hover:text-white transition-all block py-4">
                          <i className="pi pi-upload block text-xl mb-1"></i>
                          {formData.newSchema ? 'File loaded. Click to change.' : 'Upload new schema file'}
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setShowConfig(false)}
                className="w-full py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DBMigration;
