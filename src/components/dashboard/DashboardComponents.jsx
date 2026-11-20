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
    <div className="glass-panel glass-interactive rounded-2xl p-6">
      <div className="flex items-center gap-4">
        <div className={`rounded-xl border border-white/20 p-3 bg-linear-to-br ${colorClasses[color]} shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_12px_28px_-14px_rgba(99,102,241,0.9)]`}>
          <i className={`pi ${icon} text-white text-lg`}></i>
        </div>
        <div>
          <div className="text-2xl font-bold text-white">{value}</div>
          <div className="text-sm text-[var(--text-secondary)]">{title}</div>
        </div>
      </div>
    </div>
  );
};

const ModelList = ({ models, modelsByFamily }) => {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4">
        <i className="pi pi-list mr-2"></i>
        Available Models ({models.length})
      </h3>
      
      {modelsByFamily && Object.keys(modelsByFamily).length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {Object.entries(modelsByFamily).map(([family, count]) => (
            <span key={family} className="glass-chip px-3 py-1 text-sm">
              {family}: {count}
            </span>
          ))}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {models.map((model, index) => (
          <div key={index} className="glass-chip rounded-xl p-4 text-left">
            <div className="mb-1 font-medium text-[var(--text-primary)]">
              {model.displayName || model.id || model.name}
            </div>
            {(model.family || model.type) && (
              <div className="mb-2 text-xs text-[var(--accent-secondary)]">
                {model.family} {model.type && `• ${model.type}`}
              </div>
            )}
            {model.description && (
              <div className="line-clamp-2 text-xs text-[var(--text-tertiary)]">
                {model.description}
              </div>
            )}
            {model.supportedGenerationMethods && (
              <div className="mt-2 flex flex-wrap gap-1">
                {model.supportedGenerationMethods.slice(0, 3).map((method, i) => (
                  <span key={i} className="rounded bg-white/5 px-2 py-1 text-xs text-[var(--text-secondary)]">
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
