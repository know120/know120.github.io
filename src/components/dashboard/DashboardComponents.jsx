import React from 'react';

const MetricCard = ({ title, value, subtitle, icon, color = 'indigo', trend }) => {
  const colorClasses = {
    indigo: 'from-indigo-500 to-indigo-600',
    green: 'from-green-500 to-green-600',
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    yellow: 'from-yellow-500 to-yellow-600',
    red: 'from-red-500 to-red-600'
  };

  return (
    <div className="glass-panel rounded-xl p-6 hover:shadow-lg hover:shadow-indigo-500/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <i className={`pi ${icon} text-white text-lg`}></i>
        </div>
        {trend && (
          <div className={`text-sm font-medium ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
            <i className={`pi ${trend > 0 ? 'pi-arrow-up' : 'pi-arrow-down'}`}></i>
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-sm text-slate-400">{title}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>
  );
};

const ModelUsageChart = ({ modelAnalytics }) => {
  // Sort models by usage
  const sortedModels = [...modelAnalytics]
    .sort((a, b) => b.estimated_usage - a.estimated_usage)
    .slice(0, 6);

  const maxUsage = Math.max(...sortedModels.map(m => m.estimated_usage));

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="pi pi-chart-bar"></i>
        Model Usage Distribution
      </h3>
      <div className="space-y-3">
        {sortedModels.map((model, index) => {
          const percentage = (model.estimated_usage / maxUsage) * 100;
          return (
            <div key={model.id} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-300 font-medium truncate max-w-[200px]">
                  {model.displayName || model.id}
                </span>
                <span className="text-slate-400">
                  {model.estimated_usage.toLocaleString()} tokens
                </span>
              </div>
              <div className="relative h-6 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>{model.estimated_requests.toLocaleString()} requests</span>
                <span>{model.avg_tokens_per_request} avg tokens</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const ModelFamilyBreakdown = ({ modelsByFamily, totalModels }) => {
  const families = Object.entries(modelsByFamily);
  const total = families.reduce((sum, [_, count]) => sum + count, 0);

  const colors = [
    'from-indigo-500 to-indigo-600',
    'from-purple-500 to-purple-600',
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-yellow-500 to-yellow-600'
  ];

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="pi pi-chart-pie"></i>
        Model Family Breakdown
      </h3>
      <div className="space-y-3">
        {families.map(([family, count], index) => {
          const percentage = ((count / total) * 100).toFixed(1);
          return (
            <div key={family} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded bg-gradient-to-br ${colors[index % colors.length]}`}></div>
                <span className="text-slate-300 font-medium">{family}</span>
              </div>
              <div className="text-right">
                <div className="text-white font-medium">{count} models</div>
                <div className="text-xs text-slate-500">{percentage}%</div>
              </div>
            </div>
          );
        })}
        <div className="pt-3 mt-3 border-t border-slate-700">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Models</span>
            <span className="text-white font-bold">{totalModels}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentActivity = ({ modelAnalytics }) => {
  const recentActivity = [...modelAnalytics]
    .sort((a, b) => new Date(b.last_used) - new Date(a.last_used))
    .slice(0, 5);

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="pi pi-clock"></i>
        Recent Model Activity
      </h3>
      <div className="space-y-3">
        {recentActivity.map((model) => {
          const lastUsed = new Date(model.last_used);
          const daysAgo = Math.floor((Date.now() - lastUsed) / (1000 * 60 * 60 * 24));
          
          return (
            <div key={model.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors">
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-200">
                  {model.displayName || model.id}
                </div>
                <div className="text-xs text-slate-500">
                  {model.estimated_requests.toLocaleString()} requests • {model.family}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">
                  {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`}
                </div>
                <div className="text-xs font-mono text-indigo-400">
                  {(model.estimated_usage / 1000).toFixed(1)}k tokens
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CostAnalysis = ({ modelAnalytics }) => {
  const totalCost = modelAnalytics.reduce((sum, model) => {
    const cost = (model.estimated_usage / 1000) * model.cost_per_1k_tokens;
    return sum + cost;
  }, 0);

  const topCostModels = [...modelAnalytics]
    .map(model => ({
      ...model,
      total_cost: (model.estimated_usage / 1000) * model.cost_per_1k_tokens
    }))
    .sort((a, b) => b.total_cost - a.total_cost)
    .slice(0, 5);

  return (
    <div className="glass-panel rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <i className="pi pi-dollar"></i>
        Cost Analysis
      </h3>
      
      <div className="mb-6">
        <div className="text-3xl font-bold text-white mb-1">
          ${totalCost.toFixed(4)}
        </div>
        <div className="text-sm text-slate-400">Estimated Total Cost</div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-slate-300 mb-3">Top Cost Models</div>
        {topCostModels.map((model) => {
          const percentage = (model.total_cost / totalCost) * 100;
          return (
            <div key={model.id} className="flex items-center justify-between p-2 bg-slate-800/50 rounded">
              <div className="flex-1">
                <div className="text-sm text-slate-200 truncate">
                  {model.displayName || model.id}
                </div>
                <div className="text-xs text-slate-500">
                  {model.cost_per_1k_tokens.toFixed(4)}/1k tokens
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  ${model.total_cost.toFixed(4)}
                </div>
                <div className="text-xs text-slate-500">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export {
  MetricCard,
  ModelUsageChart,
  ModelFamilyBreakdown,
  RecentActivity,
  CostAnalysis
};