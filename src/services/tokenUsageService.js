// Provider Registry - Easy to add new providers
const providerRegistry = {};

// Helper to register a new provider
export const registerProvider = (name, config) => {
  providerRegistry[name] = config;
};

// Base provider configuration with common functionality
const createBaseProvider = (name) => ({
  name,
  
  async fetchEndpoints(apiKey) {
    throw new Error(`fetchEndpoints not implemented for ${name}`);
  },
  
  getHeaders(apiKey) {
    throw new Error(`getHeaders not implemented for ${name}`);
  },
  
  async validateResponse(response, endpoint) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      let errorMessage = errorData.error?.message || errorData.error?.code || `${response.statusText}`;
      
      if (response.status === 401) {
        errorMessage = 'Invalid API key. Please check your key and try again.';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
      } else if (response.status >= 500) {
        errorMessage = `${name} server error. Please try again later.`;
      }
      
      throw new Error(errorMessage);
    }
    return response.json();
  },
  
  formatResponse(results) {
    throw new Error(`formatResponse not implemented for ${name}`);
  }
});

// OpenAI Provider
registerProvider('openai', {
  ...createBaseProvider('openai'),
  
  async fetchEndpoints(apiKey) {
    return [
      { url: 'https://api.openai.com/v1/usage', method: 'GET' },
      { url: 'https://api.openai.com/v1/dashboard/billing/subscription', method: 'GET' },
      { url: 'https://api.openai.com/v1/models', method: 'GET' }
    ];
  },
  
  getHeaders(apiKey) {
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };
  },
  
  formatResponse(results) {
    const [usageResult, billingResult, modelsResult] = results;
    
    const usageData = usageResult.status === 'fulfilled' ? usageResult.value : null;
    const billingData = billingResult.status === 'fulfilled' ? billingResult.value : null;
    const modelsData = modelsResult.status === 'fulfilled' ? modelsResult.value : null;
    
    // Process models data
    const models = modelsData?.data?.map(model => ({
      id: model.id,
      created: model.created,
      owned_by: model.owned_by,
      object: model.object,
      family: this.extractModelFamily(model.id),
      type: this.extractModelType(model.id)
    })) || [];
    
    // Group models by family
    const modelsByFamily = models.reduce((acc, model) => {
      acc[model.family] = (acc[model.family] || 0) + 1;
      return acc;
    }, {});
    
    return {
      provider: 'OpenAI',
      usage: {
        total_usage: usageData?.total_usage || 0,
        n_requests: usageData?.n_requests || 0,
        operation_id: usageData?.operation_id,
        snapshot_at: usageData?.snapshot_at,
        hard_limit_usd: billingData?.hard_limit_usd || 0,
        system_hard_limit_usd: billingData?.system_hard_limit_usd || 0,
        soft_limit_usd: billingData?.soft_limit_usd || 0,
        access_until: billingData?.access_until,
        plan: billingData?.plan || 'unknown',
        has_payment_method: billingData?.has_payment_method || false,
        remaining_credits: (billingData?.hard_limit_usd || 0) - ((usageData?.total_usage || 0) / 100),
        models,
        total_models: models.length,
        models_by_family: modelsByFamily
      }
    };
  },
  
  extractModelFamily(modelId) {
    if (modelId.includes('gpt-4')) return 'GPT-4';
    if (modelId.includes('gpt-3.5')) return 'GPT-3.5';
    if (modelId.includes('dall-e')) return 'DALL-E';
    if (modelId.includes('whisper')) return 'Whisper';
    if (modelId.includes('tts')) return 'TTS';
    return 'Other';
  },
  
  extractModelType(modelId) {
    if (modelId.includes('turbo')) return 'Turbo';
    if (modelId.includes('instruct')) return 'Instruct';
    if (modelId.includes('vision')) return 'Vision';
    return 'Standard';
  },
  
  // OpenAI requires at least models endpoint to succeed
  shouldThrowError(results) {
    return results[2]?.status === 'rejected';
  }
});

// Anthropic Provider
registerProvider('anthropic', {
  ...createBaseProvider('anthropic'),
  
  async fetchEndpoints(apiKey) {
    return [
      {
        url: 'https://api.anthropic.com/v1/messages',
        method: 'POST',
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'test' }]
        })
      }
    ];
  },
  
  getHeaders(apiKey) {
    return {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    };
  },
  
  formatResponse(results) {
    const result = results[0];
    const data = result.status === 'fulfilled' ? result.value : null;
    
    return {
      provider: 'Anthropic',
      usage: {
        status: 'valid',
        message: 'API key is valid. Anthropic does not provide detailed usage statistics via API.',
        model: data?.model,
        usage_info: data?.usage || {}
      }
    };
  },
  
  shouldThrowError(results) {
    return results[0]?.status === 'rejected';
  }
});

// Google AI Provider
registerProvider('google', {
  ...createBaseProvider('google'),
  
  async fetchEndpoints(apiKey) {
    return [
      { url: `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, method: 'GET' }
    ];
  },
  
  getHeaders(apiKey) {
    return { 'Content-Type': 'application/json' };
  },
  
  formatResponse(results) {
    const result = results[0];
    const data = result.status === 'fulfilled' ? result.value : null;
    
    const models = data?.models?.map(model => ({
      name: model.name,
      displayName: model.displayName,
      description: model.description,
      supportedGenerationMethods: model.supportedGenerationMethods,
      family: this.extractModelFamily(model.name),
      type: this.extractModelType(model.supportedGenerationMethods)
    })) || [];
    
    const modelsByFamily = models.reduce((acc, model) => {
      acc[model.family] = (acc[model.family] || 0) + 1;
      return acc;
    }, {});
    
    return {
      provider: 'Google AI',
      usage: {
        models,
        status: 'valid',
        total_models: models.length,
        models_by_family: modelsByFamily
      }
    };
  },
  
  extractModelFamily(modelName) {
    if (modelName.includes('gemini-pro')) return 'Gemini Pro';
    if (modelName.includes('gemini')) return 'Gemini';
    if (modelName.includes('palm')) return 'PaLM';
    return 'Other';
  },
  
  extractModelType(methods) {
    if (methods?.includes('generateContent')) return 'Content Generation';
    if (methods?.includes('embedContent')) return 'Embedding';
    return 'Other';
  },
  
  shouldThrowError(results) {
    return results[0]?.status === 'rejected';
  }
});

// Main function to check token usage
export const checkTokenUsage = async (provider, apiKey) => {
  const providerConfig = providerRegistry[provider];
  
  if (!providerConfig) {
    throw new Error(`Unsupported provider: ${provider}`);
  }
  
  try {
    const endpoints = await providerConfig.fetchEndpoints(apiKey);
    const headers = providerConfig.getHeaders(apiKey);
    
    const results = await Promise.allSettled(
      endpoints.map(async (endpoint) => {
        const response = await fetch(endpoint.url, {
          method: endpoint.method,
          headers,
          ...(endpoint.body && { body: endpoint.body })
        });
        
        return providerConfig.validateResponse(response, endpoint);
      })
    );
    
    // Check for auth errors
    const authErrors = results.filter(
      r => r.status === 'rejected' && 
      (r.reason.message.toLowerCase().includes('invalid') || 
       r.reason.message.toLowerCase().includes('unauthorized') ||
       r.reason.message.toLowerCase().includes('authentication') ||
       r.reason.message.toLowerCase().includes('401') ||
       r.reason.message.toLowerCase().includes('403'))
    );
    
    if (authErrors.length > 0) {
      throw authErrors[0].reason;
    }
    
    // Check if provider requires all endpoints to succeed
    if (providerConfig.shouldThrowError && providerConfig.shouldThrowError(results)) {
      const error = results.find(r => r.status === 'rejected');
      if (error) throw error.reason;
    }
    
    return providerConfig.formatResponse(results);
    
  } catch (error) {
    const userFriendlyMessages = ['invalid', 'unauthorized', 'rate limit', 'server error'];
    const isUserFriendly = userFriendlyMessages.some(msg => error.message.toLowerCase().includes(msg));
    
    if (isUserFriendly) {
      throw error;
    }
    throw new Error(`Failed to check ${provider} usage: ${error.message}`);
  }
};

// Get list of registered providers
export const getRegisteredProviders = () => Object.keys(providerRegistry);

// Export provider registry for testing or extension
export { providerRegistry };
