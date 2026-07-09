import React, { useState, useCallback } from 'react';

const DEFAULT_CONFIG = `{
  "oldApi": {
    "url": "https://jsonplaceholder.typicode.com/posts/{{id}}",
    "method": "GET",
    "headers": {},
    "params": {}
  },
  "newApi": {
    "url": "https://jsonplaceholder.typicode.com/posts/{{id}}",
    "method": "GET",
    "headers": {},
    "params": {}
  },
  "ids": [1, 2, 3]
}`;

function deepCompare(oldObj, newObj, path = '') {
  const missing = [];
  const extra = [];
  const typeChanges = [];

  const allKeys = new Set([...Object.keys(oldObj || {}), ...Object.keys(newObj || {})]);

  for (const key of allKeys) {
    const currentPath = path ? `${path}.${key}` : key;

    if (!(key in oldObj)) {
      extra.push({ path: currentPath, value: newObj[key] });
      continue;
    }
    if (!(key in newObj)) {
      missing.push({ path: currentPath, value: oldObj[key] });
      continue;
    }

    const oldVal = oldObj[key];
    const newVal = newObj[key];

    if (oldVal === null && newVal === null) continue;
    if (oldVal === null || newVal === null) {
      typeChanges.push({ path: currentPath, oldType: oldVal === null ? 'null' : typeof oldVal, newType: newVal === null ? 'null' : typeof newVal, oldValue: oldVal, newValue: newVal });
      continue;
    }

    if (Array.isArray(oldVal) && Array.isArray(newVal)) {
      if (oldVal.length === 0 && newVal.length === 0) continue;
      if (typeof oldVal[0] === 'object' && typeof newVal[0] === 'object') {
        const maxLen = Math.max(oldVal.length, newVal.length);
        for (let i = 0; i < maxLen; i++) {
          if (i >= oldVal.length) {
            extra.push({ path: `${currentPath}[${i}]`, value: newVal[i] });
          } else if (i >= newVal.length) {
            missing.push({ path: `${currentPath}[${i}]`, value: oldVal[i] });
          } else {
            const sub = deepCompare(oldVal[i], newVal[i], `${currentPath}[${i}]`);
            missing.push(...sub.missing);
            extra.push(...sub.extra);
            typeChanges.push(...sub.typeChanges);
          }
        }
      } else {
        const oldSet = new Set(oldVal.map(v => JSON.stringify(v)));
        const newSet = new Set(newVal.map(v => JSON.stringify(v)));
        for (const item of oldVal) {
          if (!newSet.has(JSON.stringify(item))) {
            missing.push({ path: `${currentPath}`, value: item });
          }
        }
        for (const item of newVal) {
          if (!oldSet.has(JSON.stringify(item))) {
            extra.push({ path: `${currentPath}`, value: item });
          }
        }
      }
      continue;
    }

    if (typeof oldVal === 'object' && typeof newVal === 'object' && oldVal !== null && newVal !== null) {
      const sub = deepCompare(oldVal, newVal, currentPath);
      missing.push(...sub.missing);
      extra.push(...sub.extra);
      typeChanges.push(...sub.typeChanges);
      continue;
    }

    if (typeof oldVal !== typeof newVal) {
      typeChanges.push({ path: currentPath, oldType: typeof oldVal, newType: typeof newVal, oldValue: oldVal, newValue: newVal });
    }
  }

  return { missing, extra, typeChanges };
}

function collectFields(obj, prefix = '') {
  const fields = [];
  for (const [key, value] of Object.entries(obj || {})) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      fields.push(...collectFields(value, path));
    } else if (Array.isArray(value) && typeof value?.[0] === 'object') {
      fields.push({ path, type: 'array<object>' });
      if (value[0]) fields.push(...collectFields(value[0], `${path}[]`));
    } else {
      fields.push({ path, type: Array.isArray(value) ? 'array' : typeof value });
    }
  }
  return fields;
}

function fillTemplate(template, id) {
  return template.replace(/\{\{id\}\}/g, id);
}

async function callApi(config, id) {
  const url = fillTemplate(config.url, id);
  const method = (config.method || 'GET').toUpperCase();
  const headers = config.headers || {};
  const params = config.params || {};

  const urlObj = new URL(url);
  for (const [k, v] of Object.entries(params)) {
    urlObj.searchParams.set(k, fillTemplate(String(v), id));
  }

  const fetchOptions = { method, headers };
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    fetchOptions.body = config.body ? JSON.stringify(fillTemplate(JSON.stringify(config.body), id)) : undefined;
    if (fetchOptions.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  const res = await fetch(urlObj.toString(), fetchOptions);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

export default function ApiComparator() {
  const [configText, setConfigText] = useState(DEFAULT_CONFIG);
  const [configError, setConfigError] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(true);

  const handleCompare = useCallback(async () => {
    setLoading(true);
    setError('');
    setResults(null);

    let config;
    try {
      config = JSON.parse(configText);
    } catch (e) {
      setError('Invalid JSON configuration: ' + e.message);
      setLoading(false);
      return;
    }

    if (!config.oldApi?.url || !config.newApi?.url) {
      setError('Both oldApi and newApi must have a url');
      setLoading(false);
      return;
    }
    if (!config.ids || !Array.isArray(config.ids) || config.ids.length === 0) {
      setError('Provide at least one id in the ids array');
      setLoading(false);
      return;
    }

    const allResults = [];

    for (const id of config.ids) {
      try {
        const [oldData, newData] = await Promise.all([
          callApi(config.oldApi, id),
          callApi(config.newApi, id)
        ]);

        const comparison = deepCompare(oldData, newData);
        const oldFields = collectFields(oldData);
        const newFields = collectFields(newData);

        allResults.push({
          id,
          oldData,
          newData,
          oldFields,
          newFields,
          ...comparison
        });
      } catch (err) {
        allResults.push({
          id,
          error: err.message,
          missing: [], extra: [], typeChanges: [],
          oldFields: [], newFields: []
        });
      }
    }

    // Aggregate across all IDs
    const aggregatedMissing = new Map();
    const aggregatedExtra = new Map();
    const aggregatedTypeChanges = new Map();

    for (const r of allResults) {
      if (r.error) continue;
      for (const item of r.missing) {
        const key = item.path;
        if (!aggregatedMissing.has(key)) aggregatedMissing.set(key, { path: key, value: item.value, ids: [] });
        aggregatedMissing.get(key).ids.push(r.id);
      }
      for (const item of r.extra) {
        const key = item.path;
        if (!aggregatedExtra.has(key)) aggregatedExtra.set(key, { path: key, value: item.value, ids: [] });
        aggregatedExtra.get(key).ids.push(r.id);
      }
      for (const item of r.typeChanges) {
        const key = item.path;
        if (!aggregatedTypeChanges.has(key)) aggregatedTypeChanges.set(key, { ...item, ids: [] });
        aggregatedTypeChanges.get(key).ids.push(r.id);
      }
    }

    setResults({
      perId: allResults,
      summary: {
        totalIds: config.ids.length,
        successCount: allResults.filter(r => !r.error).length,
        errorCount: allResults.filter(r => r.error).length,
        aggregatedMissing: [...aggregatedMissing.values()],
        aggregatedExtra: [...aggregatedExtra.values()],
        aggregatedTypeChanges: [...aggregatedTypeChanges.values()],
      }
    });
    setLoading(false);
    setShowConfig(false);
  }, [configText]);

  const renderValue = (val) => {
    if (val === null) return <span className="text-gray-500 italic">null</span>;
    if (val === undefined) return <span className="text-gray-500 italic">undefined</span>;
    if (typeof val === 'object') {
      return <pre className="text-xs text-cyan-300 max-w-xs overflow-x-auto">{JSON.stringify(val, null, 1)}</pre>;
    }
    return <span className="text-amber-300">{String(val)}</span>;
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="glass-panel rounded-2xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 mb-4">
                <i className="pi pi-sync text-4xl text-white"></i>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">API Comparator</h1>
              <p className="text-slate-400 text-lg">
                Compare old vs new API responses to find differences.
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

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-400">
                <i className="pi pi-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="flex justify-center mb-8">
            <button
              onClick={handleCompare}
              disabled={loading}
              className={`px-10 py-4 rounded-lg font-bold text-white transition-all ${
                loading
                  ? 'bg-emerald-600/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg hover:scale-[1.01]'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <i className="pi pi-spin pi-spinner"></i>
                  <span>Comparing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <i className="pi pi-play"></i>
                  <span>Run Comparison</span>
                </div>
              )}
            </button>
          </div>

          {results && !showConfig && (
            <div className="space-y-8">
              <SummaryCard summary={results.summary} renderValue={renderValue} />

              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Per-ID Breakdown</h2>
                {results.perId.map((r) => (
                  <PerIdCard key={r.id} result={r} renderValue={renderValue} />
                ))}
              </div>

              <RawDataSection perId={results.perId} />
            </div>
          )}
        </div>
      </div>

      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-3xl glass-panel rounded-2xl p-6 md:p-8 border border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Configuration</h2>
              <button
                onClick={() => setShowConfig(false)}
                className="text-slate-400 hover:text-white"
              >
                <i className="pi pi-times text-xl"></i>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-slate-400 text-sm mb-4">
                Provide a JSON configuration with your API details. Use <code className="text-emerald-400 bg-slate-800 px-1 rounded">{'{{id}}'}</code> as a placeholder for the ID parameter.
              </p>
              <div className="bg-slate-900/80 rounded-lg p-4 mb-4 border border-slate-700">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Configuration Format</h3>
                <pre className="text-xs text-slate-400 font-mono leading-relaxed">{`{
  "oldApi": {
    "url": "https://api.example.com/v1/users/{{id}}",
    "method": "GET",
    "headers": { "Authorization": "Bearer token" },
    "params": { "include": "profile" }
  },
  "newApi": {
    "url": "https://api.example.com/v2/users/{{id}}",
    "method": "GET",
    "headers": {},
    "params": {}
  },
  "ids": [1, 2, 3, 5]
}`}</pre>
              </div>
            </div>

            <textarea
              value={configText}
              onChange={(e) => setConfigText(e.target.value)}
              rows={18}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none font-mono text-sm"
              spellCheck={false}
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  try {
                    JSON.parse(configText);
                    setConfigError('');
                    setShowConfig(false);
                  } catch (e) {
                    setConfigError('Invalid JSON: ' + e.message);
                  }
                }}
                className="flex-1 py-3 rounded-lg font-bold text-white bg-slate-700 hover:bg-slate-600 transition-all"
              >
                Save & Close
              </button>
              <button
                onClick={() => {
                  setConfigText(DEFAULT_CONFIG);
                  setConfigError('');
                }}
                className="px-6 py-3 rounded-lg font-medium text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-all"
              >
                Reset
              </button>
            </div>

            {configError && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 text-sm">{configError}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ summary, renderValue }) {
  const hasChanges = summary.aggregatedMissing.length > 0 || summary.aggregatedExtra.length > 0 || summary.aggregatedTypeChanges.length > 0;

  return (
    <div className="p-6 rounded-xl bg-slate-900/80 border border-emerald-500/30">
      <h2 className="text-xl font-bold text-white mb-4">Summary Report</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
          <div className="text-3xl font-bold text-white">{summary.totalIds}</div>
          <div className="text-sm text-slate-400">Total IDs</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
          <div className="text-3xl font-bold text-emerald-400">{summary.successCount}</div>
          <div className="text-sm text-slate-400">Successful</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
          <div className="text-3xl font-bold text-red-400">{summary.errorCount}</div>
          <div className="text-sm text-slate-400">Errors</div>
        </div>
        <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-center">
          <div className={`text-3xl font-bold ${hasChanges ? 'text-amber-400' : 'text-emerald-400'}`}>
            {hasChanges ? 'Changes' : 'No Changes'}
          </div>
          <div className="text-sm text-slate-400">Status</div>
        </div>
      </div>

      {hasChanges ? (
        <div className="space-y-4">
          {summary.aggregatedMissing.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-red-400 mb-2 flex items-center gap-2">
                <i className="pi pi-minus-circle"></i>
                Missing Fields (in old, not in new) — {summary.aggregatedMissing.length}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left py-2 pr-4">Field Path</th>
                      <th className="text-left py-2 pr-4">Old Value</th>
                      <th className="text-left py-2">Affected IDs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.aggregatedMissing.map((item) => (
                      <tr key={item.path} className="border-b border-slate-800">
                        <td className="py-2 pr-4 font-mono text-red-300">{item.path}</td>
                        <td className="py-2 pr-4">{renderValue(item.value)}</td>
                        <td className="py-2 text-slate-400">{item.ids.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {summary.aggregatedExtra.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-emerald-400 mb-2 flex items-center gap-2">
                <i className="pi pi-plus-circle"></i>
                Extra Fields (new, not in old) — {summary.aggregatedExtra.length}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left py-2 pr-4">Field Path</th>
                      <th className="text-left py-2 pr-4">New Value</th>
                      <th className="text-left py-2">Affected IDs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.aggregatedExtra.map((item) => (
                      <tr key={item.path} className="border-b border-slate-800">
                        <td className="py-2 pr-4 font-mono text-emerald-300">{item.path}</td>
                        <td className="py-2 pr-4">{renderValue(item.value)}</td>
                        <td className="py-2 text-slate-400">{item.ids.join(', ')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {summary.aggregatedTypeChanges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-amber-400 mb-2 flex items-center gap-2">
                <i className="pi pi-exclamation-triangle"></i>
                Type Changes — {summary.aggregatedTypeChanges.length}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-700">
                      <th className="text-left py-2 pr-4">Field Path</th>
                      <th className="text-left py-2 pr-4">Old Type</th>
                      <th className="text-left py-2 pr-4">New Type</th>
                      <th className="text-left py-2 pr-4">Old Value</th>
                      <th className="text-left py-2">New Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.aggregatedTypeChanges.map((item) => (
                      <tr key={item.path} className="border-b border-slate-800">
                        <td className="py-2 pr-4 font-mono text-amber-300">{item.path}</td>
                        <td className="py-2 pr-4"><span className="text-red-400">{item.oldType}</span></td>
                        <td className="py-2 pr-4"><span className="text-emerald-400">{item.newType}</span></td>
                        <td className="py-2 pr-4">{renderValue(item.oldValue)}</td>
                        <td className="py-2">{renderValue(item.newValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-center">
          <i className="pi pi-check-circle text-4xl text-emerald-400 mb-2 block"></i>
          <p className="text-emerald-300 font-medium">No differences found between old and new API responses.</p>
        </div>
      )}
    </div>
  );
}

function PerIdCard({ result, renderValue }) {
  const [expanded, setExpanded] = useState(false);
  const hasDiff = result.missing.length > 0 || result.extra.length > 0 || result.typeChanges.length > 0;

  return (
    <div className={`p-4 rounded-xl border ${
      result.error
        ? 'bg-red-900/20 border-red-500/30'
        : hasDiff
          ? 'bg-slate-900/60 border-amber-500/20'
          : 'bg-slate-900/60 border-slate-700'
    }`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-white">ID: {result.id}</span>
          {result.error ? (
            <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Error</span>
          ) : hasDiff ? (
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400">
              {result.missing.length} missing, {result.extra.length} extra, {result.typeChanges.length} type changes
            </span>
          ) : (
            <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">Identical</span>
          )}
        </div>
        <i className={`pi pi-chevron-${expanded ? 'up' : 'down'} text-slate-400`}></i>
      </button>

      {expanded && (
        <div className="mt-4 space-y-3">
          {result.error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
              {result.error}
            </div>
          )}

          {result.missing.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-red-400 mb-1">Missing Fields</h4>
              <div className="space-y-1">
                {result.missing.map((item) => (
                  <div key={item.path} className="flex items-start gap-2 text-sm">
                    <span className="font-mono text-red-300 shrink-0">{item.path}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-slate-400">{renderValue(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.extra.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-emerald-400 mb-1">Extra Fields</h4>
              <div className="space-y-1">
                {result.extra.map((item) => (
                  <div key={item.path} className="flex items-start gap-2 text-sm">
                    <span className="font-mono text-emerald-300 shrink-0">{item.path}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-slate-400">{renderValue(item.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.typeChanges.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-amber-400 mb-1">Type Changes</h4>
              <div className="space-y-1">
                {result.typeChanges.map((item) => (
                  <div key={item.path} className="flex items-start gap-2 text-sm">
                    <span className="font-mono text-amber-300 shrink-0">{item.path}</span>
                    <span className="text-slate-500">:</span>
                    <span className="text-red-400">{item.oldType}</span>
                    <span className="text-slate-500">→</span>
                    <span className="text-emerald-400">{item.newType}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!result.error && !hasDiff && (
            <p className="text-emerald-400 text-sm">Fields match perfectly.</p>
          )}
        </div>
      )}
    </div>
  );
}

function RawDataSection({ perId }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4">Raw Responses</h2>
      <div className="space-y-2">
        {perId.map((r) => (
          <div key={r.id}>
            <button
              onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
              className="flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
            >
              <i className={`pi pi-chevron-${expandedId === r.id ? 'down' : 'right'} text-xs`}></i>
              <span className="font-mono">ID: {r.id}</span>
            </button>
            {expandedId === r.id && !r.error && (
              <div className="mt-2 ml-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Old API</h4>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-green-400 overflow-x-auto max-h-64 overflow-y-auto">
                    {JSON.stringify(r.oldData, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">New API</h4>
                  <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-400 overflow-x-auto max-h-64 overflow-y-auto">
                    {JSON.stringify(r.newData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            {expandedId === r.id && r.error && (
              <div className="mt-2 ml-4 p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">
                {r.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
