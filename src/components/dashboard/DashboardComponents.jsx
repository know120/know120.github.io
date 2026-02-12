import React from 'react';

const MetricCard = ({ title, value, icon, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className="glass-panel rounded-xl p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <i className={`pi ${icon} text-white text-lg`}></i>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-slate-400">{title}</div>
        </div>
      </div>
    </div>
  );
};

const ModelList = ({ models, modelsByFamily }) => {
  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        <i className="pi pi-list mr-2"></i>
        Available Models ({models.length})
      </h3>
      
      {modelsByFamily && Object.keys(modelsByFamily).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(modelsByFamily).map(([family, count]) => (
            <span key={family} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">
              {family}: {count}
            </span>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {models.map((model, index) => (
          <div key={index} className="p-4 bg-slate-800/50 rounded-lg">
            <div className="font-medium text-slate-200 mb-1">
              {model.displayName || model.id || model.name}
            </div>
            {(model.family || model.type) && (
              <div className="text-xs text-slate-400 mb-2">
                {model.family} {model.type && `• ${model.type}`}
              </div>
            )}
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
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { MetricCard, ModelList };
