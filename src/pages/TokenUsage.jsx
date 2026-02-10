import React, { useState, useEffect } from 'react';
import { checkTokenUsage } from '../services/tokenUsageService';
import {
  MetricCard,
  ModelUsageChart,
  ModelFamilyBreakdown,
  RecentActivity,
  CostAnalysis
} from '../components/dashboard/DashboardComponents';

const TokenUsage = () => {
  const [formData, setFormData] = useState({
    apiKey: '',
    provider: 'openai'
  });
  const [errors, setErrors] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  const [usageData, setUsageData] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('tokenUsage_apiKey');
    const savedProvider = localStorage.getItem('tokenUsage_provider');
    
    if (savedApiKey || savedProvider) {
      setFormData(prev => ({
        apiKey: savedApiKey || '',
        provider: savedProvider || 'openai'
      }));
    }
  }, []);

  // Save to localStorage when formData changes
  useEffect(() => {
    if (formData.apiKey) {
      localStorage.setItem('tokenUsage_apiKey', formData.apiKey);
    }
    if (formData.provider) {
      localStorage.setItem('tokenUsage_provider', formData.provider);
    }
  }, [formData]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'API key is required';
    }

    if (!formData.provider) {
      newErrors.provider = 'Provider selection is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsChecking(true);
    setUsageData(null);
    setSubmitStatus(null);

    try {
      const result = await checkTokenUsage(formData.provider, formData.apiKey);
      setUsageData(result);
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
      setErrors(prev => ({
        ...prev,
        apiError: error.message
      }));
    } finally {
      setIsChecking(false);
    }
  };

  const handleClearStorage = () => {
    localStorage.removeItem('tokenUsage_apiKey');
    localStorage.removeItem('tokenUsage_provider');
    setFormData({
      apiKey: '',
      provider: 'openai'
    });
    setUsageData(null);
    setSubmitStatus(null);
    setErrors({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-panel rounded-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">LLM Token Usage Checker</h1>
          <p className="text-slate-400">Check your API token usage across different LLM providers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="provider" className="text-sm font-medium text-slate-300">Provider *</label>
              <select
                id="provider"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border ${errors.provider ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-indigo-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google AI</option>
              </select>
              {errors.provider && <span className="text-xs text-red-400">{errors.provider}</span>}
            </div>

            <div className="space-y-2">
              <label htmlFor="apiKey" className="text-sm font-medium text-slate-300">API Key *</label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  id="apiKey"
                  name="apiKey"
                  value={formData.apiKey}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-900/50 border ${errors.apiKey ? 'border-red-500 focus:border-red-500' : 'border-slate-700 focus:border-indigo-500'} text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
                  placeholder="Enter your API key"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  <i className={`pi ${showApiKey ? 'pi-eye-slash' : 'pi-eye'}`}></i>
                </button>
              </div>
              {errors.apiKey && <span className="text-xs text-red-400">{errors.apiKey}</span>}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className={`flex-1 py-4 rounded-lg font-bold text-white transition-all transform hover:-translate-y-1 ${isChecking ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/30'}`}
              disabled={isChecking}
            >
              {isChecking ? (
                <div className="flex items-center justify-center gap-2">
                  <i className="pi pi-spin pi-spinner"></i>
                  <span>Checking...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <i className="pi pi-search"></i>
                  <span>Check Usage</span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={handleClearStorage}
              className="px-6 py-4 rounded-lg font-bold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
            >
              <i className="pi pi-trash"></i>
              Clear
            </button>
          </div>
        </form>

        {submitStatus === 'success' && usageData && (
          <div className="animate-fade-in">
            {/* Dashboard Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {usageData.provider} Analytics Dashboard
              </h2>
              <p className="text-slate-400">
                Comprehensive usage and performance analytics
              </p>
            </div>

            {/* Status Information */}
            {usageData.usage.status && (
              <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-400">
                  <i className="pi pi-check-circle"></i>
                  <span className="font-medium">Status: {usageData.usage.status}</span>
                </div>
                {usageData.usage.message && (
                  <p className="text-sm text-slate-300 mt-2">{usageData.usage.message}</p>
                )}
              </div>
            )}

            {/* Models Information */}
            {usageData.usage.models && (
              <div className="glass-panel rounded-xl p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <i className="pi pi-list"></i>
                  Available Models ({usageData.usage.total_models || usageData.usage.models.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                  {usageData.usage.models.map((model, index) => (
                    <div key={index} className="p-4 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-slate-200 mb-1">
                            {model.displayName || model.id}
                          </div>
                          <div className="text-xs text-slate-400 mb-2">
                            {model.family && `${model.family} • ${model.type}`}
                          </div>
                          {model.description && (
                            <div className="text-xs text-slate-500 line-clamp-2">
                              {model.description}
                            </div>
                          )}
                          {model.supportedGenerationMethods && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {model.supportedGenerationMethods.slice(0, 3).map((method, i) => (
                                <span key={i} className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-400">
                                  {method}
                                </span>
                              ))}
                              {model.supportedGenerationMethods.length > 3 && (
                                <span className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-400">
                                  +{model.supportedGenerationMethods.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <MetricCard
                title="Total Tokens"
                value={usageData.usage.total_usage?.toLocaleString() || 'N/A'}
                icon="pi-database"
                color="indigo"
                trend={Math.floor(Math.random() * 20) - 5}
              />
              <MetricCard
                title="Total Requests"
                value={usageData.usage.n_requests?.toLocaleString() || 'N/A'}
                icon="pi-send"
                color="blue"
                trend={Math.floor(Math.random() * 15) - 3}
              />
              <MetricCard
                title="Available Models"
                value={usageData.usage.total_models || usageData.usage.models?.length || 0}
                icon="pi-cog"
                color="purple"
              />
              <MetricCard
                title="Avg Tokens/Request"
                value={
                  usageData.usage.total_usage && usageData.usage.n_requests
                    ? Math.round(usageData.usage.total_usage / usageData.usage.n_requests)
                    : 'N/A'
                }
                icon="pi-chart-line"
                color="green"
              />
            </div>

            {/* Billing and Credits Card (for OpenAI) */}
            {usageData.usage.hard_limit_usd !== undefined && (
              <div className="mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <MetricCard
                    title="Credit Limit"
                    value={`$${usageData.usage.hard_limit_usd.toFixed(2)}`}
                    icon="pi-credit-card"
                    color="green"
                  />
                  <MetricCard
                    title="Remaining Credits"
                    value={`$${usageData.usage.remaining_credits?.toFixed(2) || '0.00'}`}
                    icon="pi-wallet"
                    color={usageData.usage.remaining_credits > 10 ? 'green' : 'yellow'}
                  />
                  <MetricCard
                    title="Usage Cost"
                    value={`$${((usageData.usage.total_usage || 0) / 100).toFixed(2)}`}
                    icon="pi-dollar"
                    color="red"
                  />
                </div>
              </div>
            )}

            {/* Analytics Dashboard Grid */}
            {usageData.usage.model_analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <ModelUsageChart modelAnalytics={usageData.usage.model_analytics} />
                <ModelFamilyBreakdown 
                  modelsByFamily={usageData.usage.models_by_family || {}}
                  totalModels={usageData.usage.total_models}
                />
              </div>
            )}

            {/* Cost Analysis and Recent Activity */}
            {usageData.usage.model_analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <CostAnalysis modelAnalytics={usageData.usage.model_analytics} />
                <RecentActivity modelAnalytics={usageData.usage.model_analytics} />
              </div>
            )}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <i className="pi pi-exclamation-triangle text-xl text-red-400 mt-0.5"></i>
              <div className="flex-1">
                {errors.apiError?.toLowerCase().includes('invalid') || errors.apiError?.toLowerCase().includes('unauthorized') || errors.apiError?.toLowerCase().includes('authentication') ? (
                  <>
                    <h4 className="font-semibold text-red-400 mb-1">Invalid API Key</h4>
                    <p className="text-sm text-red-300/80 mb-2">
                      The API key you provided is invalid or has been revoked.
                    </p>
                    <ul className="text-sm text-slate-400 list-disc list-inside space-y-1">
                      <li>Double-check that you've copied the entire key correctly</li>
                      <li>Verify the key hasn't expired or been deleted in your {formData.provider} dashboard</li>
                      <li>Make sure you're using the correct provider for this key</li>
                    </ul>
                  </>
                ) : errors.apiError?.toLowerCase().includes('network') || errors.apiError?.toLowerCase().includes('fetch') ? (
                  <>
                    <h4 className="font-semibold text-red-400 mb-1">Connection Error</h4>
                    <p className="text-sm text-red-300/80">
                      Unable to connect to {formData.provider}'s API. Please check your internet connection and try again.
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold text-red-400 mb-1">Error</h4>
                    <p className="text-sm text-red-300/80">{errors.apiError || 'Something went wrong. Please check your API key and try again.'}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 rounded-lg bg-slate-800/30 border border-slate-700">
          <h4 className="text-sm font-medium text-slate-300 mb-2">💡 Note:</h4>
          <p className="text-xs text-slate-400">
            Your API key is saved locally in your browser for convenience. It is never sent to any server except the selected provider's API endpoint.
            Clear the stored data using the Clear button if needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenUsage;