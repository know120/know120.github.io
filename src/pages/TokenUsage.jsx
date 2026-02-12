import React, { useState, useEffect } from 'react';
import { checkTokenUsage } from '../services/tokenUsageService';
import { MetricCard, ModelList } from '../components/dashboard/DashboardComponents';

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
    setFormData(prev => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsChecking(true);
    setUsageData(null);
    setSubmitStatus(null);

    try {
      const result = await checkTokenUsage(formData.provider, formData.apiKey);
      setUsageData(result);
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
      setErrors(prev => ({ ...prev, apiError: error.message }));
    } finally {
      setIsChecking(false);
    }
  };

  const handleClearStorage = () => {
    localStorage.removeItem('tokenUsage_apiKey');
    localStorage.removeItem('tokenUsage_provider');
    setFormData({ apiKey: '', provider: 'openai' });
    setUsageData(null);
    setSubmitStatus(null);
    setErrors({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-panel rounded-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">LLM Token Checker</h1>
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
                className={`w-full px-4 py-3 rounded-lg bg-slate-900/50 border ${errors.provider ? 'border-red-500' : 'border-slate-700'} text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
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
                  className={`w-full px-4 py-3 pr-12 rounded-lg bg-slate-900/50 border ${errors.apiKey ? 'border-red-500' : 'border-slate-700'} text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all`}
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
              className={`flex-1 py-4 rounded-lg font-bold text-white transition-all ${isChecking ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'}`}
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
            </button>
          </div>
        </form>

        {submitStatus === 'success' && usageData && (
          <div className="animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white">{usageData.provider} Dashboard</h2>
              <p className="text-slate-400">API usage information</p>
            </div>

            {usageData.usage.status && (
              <div className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-2 text-green-400">
                  <i className="pi pi-check-circle"></i>
                  <span className="font-medium">{usageData.usage.message || `Status: ${usageData.usage.status}`}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <MetricCard
                title="Total Tokens"
                value={usageData.usage.total_usage?.toLocaleString() || 'N/A'}
                icon="pi-database"
                color="indigo"
              />
              <MetricCard
                title="Total Requests"
                value={usageData.usage.n_requests?.toLocaleString() || 'N/A'}
                icon="pi-send"
                color="blue"
              />
              <MetricCard
                title="Available Models"
                value={usageData.usage.total_models || 0}
                icon="pi-cog"
                color="purple"
              />
            </div>

            {usageData.usage.hard_limit_usd !== undefined && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            )}

            {usageData.usage.models?.length > 0 && (
              <ModelList models={usageData.usage.models} modelsByFamily={usageData.usage.models_by_family} />
            )}
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 animate-fade-in">
            <div className="flex items-start gap-3">
              <i className="pi pi-exclamation-triangle text-xl text-red-400 mt-0.5"></i>
              <div className="flex-1">
                {errors.apiError?.toLowerCase().includes('invalid') || errors.apiError?.toLowerCase().includes('unauthorized') ? (
                  <>
                    <h4 className="font-semibold text-red-400 mb-1">Invalid API Key</h4>
                    <p className="text-sm text-slate-400">{errors.apiError}</p>
                  </>
                ) : (
                  <>
                    <h4 className="font-semibold text-red-400 mb-1">Error</h4>
                    <p className="text-sm text-slate-400">{errors.apiError || 'Something went wrong. Please check your API key and try again.'}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 rounded-lg bg-slate-800/30 border border-slate-700">
          <p className="text-xs text-slate-400">
            Your API key is saved locally in your browser. It is never sent to any server except the selected provider's API endpoint.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TokenUsage;
