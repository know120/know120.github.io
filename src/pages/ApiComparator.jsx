import React, { useState, useCallback, useRef, useMemo } from 'react';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

function emptyRow() {
  return { key: '', value: '', enabled: true };
}

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

function rowsToObj(rows) {
  const obj = {};
  for (const row of rows) {
    if (row.enabled && row.key.trim()) {
      obj[row.key.trim()] = row.value;
    }
  }
  return obj;
}

function buildApiConfig(form) {
  return {
    url: form.url,
    method: form.method,
    headers: rowsToObj(form.headers),
    params: rowsToObj(form.params),
    body: (form.method === 'POST' || form.method === 'PUT' || form.method === 'PATCH') ? form.body : undefined,
  };
}

async function callApi(config, id) {
  const url = fillTemplate(config.url, id);
  const method = (config.method || 'GET').toUpperCase();
  const headers = { ...(config.headers || {}) };
  const params = config.params || {};

  const urlObj = new URL(url);
  for (const [k, v] of Object.entries(params)) {
    urlObj.searchParams.set(k, fillTemplate(String(v), id));
  }

  const fetchOptions = { method, headers };
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    if (config.body) {
      fetchOptions.body = fillTemplate(config.body, id);
    }
    if (fetchOptions.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
  }

  const res = await fetch(urlObj.toString(), fetchOptions);
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  return res.json();
}

function applyFieldMappings(data, mappings) {
  if (!mappings.length || !data || typeof data !== 'object') return data;
  if (Array.isArray(data)) return data.map(item => applyFieldMappings(item, mappings));

  const map = {};
  for (const m of mappings) {
    if (m.oldPath && m.newPath) map[m.newPath] = m.oldPath;
  }

  function remap(obj, path = '') {
    if (!obj || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map((item, i) => remap(item, `${path}[${i}]`));

    const result = {};
    for (const [key, val] of Object.entries(obj)) {
      const currentPath = path ? `${path}.${key}` : key;
      const mappedKey = map[currentPath] || key;
      result[mappedKey] = remap(val, currentPath);
    }
    return result;
  }

  return remap(data);
}

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const defaultForm = {
  url: '',
  method: 'GET',
  headers: [emptyRow()],
  params: [emptyRow()],
  body: '',
};

export default function ApiComparator() {
  const [mode, setMode] = useState('compare'); // 'compare' | 'single'
  const [oldForm, setOldForm] = useState({
    ...defaultForm,
    url: 'https://jsonplaceholder.typicode.com/posts/{{id}}',
    params: [{ key: '', value: '', enabled: true }],
  });
  const [newForm, setNewForm] = useState({
    ...defaultForm,
    url: 'https://jsonplaceholder.typicode.com/posts/{{id}}',
    params: [{ key: '', value: '', enabled: true }],
  });
  const [singleForm, setSingleForm] = useState({
    ...defaultForm,
    url: 'https://jsonplaceholder.typicode.com/posts/{{id}}',
    params: [{ key: '', value: '', enabled: true }],
  });
  const [idsText, setIdsText] = useState('1, 2, 3');
  const [configTab, setConfigTab] = useState('old');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfig, setShowConfig] = useState(true);
  const [fieldMappings, setFieldMappings] = useState([]);
  const [showFieldMappings, setShowFieldMappings] = useState(false);
  const descriptionRef = useRef(null);

  const updateForm = useCallback((setter, field, value) => {
    setter(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleRowChange = useCallback((setter, rowsField, index, field, value) => {
    setter(prev => {
      const rows = [...prev[rowsField]];
      rows[index] = { ...rows[index], [field]: value };
      return { ...prev, [rowsField]: rows };
    });
  }, []);

  const addRow = useCallback((setter, rowsField) => {
    setter(prev => ({ ...prev, [rowsField]: [...prev[rowsField], emptyRow()] }));
  }, []);

  const removeRow = useCallback((setter, rowsField, index) => {
    setter(prev => {
      const rows = prev[rowsField].filter((_, i) => i !== index);
      return { ...prev, [rowsField]: rows.length ? rows : [emptyRow()] };
    });
  }, []);

  const toggleRow = useCallback((setter, rowsField, index) => {
    setter(prev => {
      const rows = [...prev[rowsField]];
      rows[index] = { ...rows[index], enabled: !rows[index].enabled };
      return { ...prev, [rowsField]: rows };
    });
  }, []);

  const handleFetch = useCallback(async () => {
    setLoading(true);
    setError('');
    setResults(null);

    const ids = idsText.split(/[,;\s]+/).map(s => s.trim()).filter(Boolean);
    if (!ids.length) {
      setError('Provide at least one ID');
      setLoading(false);
      return;
    }

    if (mode === 'compare') {
      if (!oldForm.url || !newForm.url) {
        setError('Both old and new API URLs are required');
        setLoading(false);
        return;
      }

      const oldConfig = buildApiConfig(oldForm);
      const newConfig = buildApiConfig(newForm);

      const allResults = [];

      for (const id of ids) {
        try {
          const [oldData, rawNewData] = await Promise.all([
            callApi(oldConfig, id),
            callApi(newConfig, id)
          ]);

          const newData = fieldMappings.length ? applyFieldMappings(rawNewData, fieldMappings) : rawNewData;

          const comparison = deepCompare(oldData, newData);
          const oldFields = collectFields(oldData);
          const newFields = collectFields(newData);

          allResults.push({
            id, oldData, newData,
            rawNewData: fieldMappings.length ? rawNewData : undefined,
            oldFields, newFields,
            ...comparison
          });
        } catch (err) {
          allResults.push({
            id, error: err.message,
            missing: [], extra: [], typeChanges: [],
            oldFields: [], newFields: []
          });
        }
      }

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
        type: 'compare',
        perId: allResults,
        summary: {
          totalIds: ids.length,
          successCount: allResults.filter(r => !r.error).length,
          errorCount: allResults.filter(r => r.error).length,
          aggregatedMissing: [...aggregatedMissing.values()],
          aggregatedExtra: [...aggregatedExtra.values()],
          aggregatedTypeChanges: [...aggregatedTypeChanges.values()],
        }
      });
    } else {
      if (!singleForm.url) {
        setError('API URL is required');
        setLoading(false);
        return;
      }

      const config = buildApiConfig(singleForm);
      const allResults = [];

      for (const id of ids) {
        try {
          const data = await callApi(config, id);
          allResults.push({ id, data, fields: collectFields(data) });
        } catch (err) {
          allResults.push({ id, error: err.message });
        }
      }

      setResults({
        type: 'single',
        perId: allResults,
        summary: {
          totalIds: ids.length,
          successCount: allResults.filter(r => !r.error).length,
          errorCount: allResults.filter(r => r.error).length,
        }
      });
    }

    setLoading(false);
    setShowConfig(false);
  }, [mode, oldForm, newForm, singleForm, idsText, fieldMappings]);

  const handleDownloadResults = useCallback(() => {
    if (!results) return;
    downloadJson(results, `api-results-${new Date().toISOString().slice(0, 10)}.json`);
  }, [results]);

  const handleDownloadRaw = useCallback(() => {
    if (!results) return;
    const rawData = {};
    for (const r of results.perId) {
      if (r.error) {
        rawData[r.id] = { error: r.error };
      } else if (results.type === 'compare') {
        rawData[r.id] = { old: r.oldData, new: r.newData };
      } else {
        rawData[r.id] = r.data;
      }
    }
    downloadJson(rawData, `api-raw-${new Date().toISOString().slice(0, 10)}.json`);
  }, [results]);

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
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 mb-4">
                <i className="pi pi-sync text-4xl text-white"></i>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">API Comparator</h1>
              <p className="text-slate-400 text-lg" ref={descriptionRef}>
                {mode === 'compare'
                  ? 'Compare old vs new API responses to find differences.'
                  : 'Fetch data from a single API across multiple IDs.'}
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

          {/* Mode toggle */}
          <div className="flex justify-center mb-6">
            <div className="p-1 bg-slate-800 rounded-xl flex gap-1">
              <button
                onClick={() => { setMode('compare'); setResults(null); setError(''); }}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'compare'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'}`}
              >
                <i className="pi pi-arrows-h mr-1.5"></i>
                Compare (Old vs New)
              </button>
              <button
                onClick={() => { setMode('single'); setResults(null); setError(''); }}
                className={`px-6 py-2 text-sm font-medium rounded-lg transition-all ${mode === 'single'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'}`}
              >
                <i className="pi pi-download mr-1.5"></i>
                Single API
              </button>
            </div>
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
              onClick={handleFetch}
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
                  <span>Fetching...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <i className="pi pi-play"></i>
                  <span>{mode === 'compare' ? 'Run Comparison' : 'Fetch Data'}</span>
                </div>
              )}
            </button>
          </div>

          {results && !showConfig && (
            <div className="space-y-8">
              {/* Download buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleDownloadRaw}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition-all flex items-center gap-2"
                >
                  <i className="pi pi-file-o"></i>
                  Download Raw JSON
                </button>
                <button
                  onClick={handleDownloadResults}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-emerald-700 hover:bg-emerald-600 transition-all flex items-center gap-2"
                >
                  <i className="pi pi-download"></i>
                  Download Full Report
                </button>
              </div>

              {results.type === 'compare' ? (
                <>
                  <SummaryCard
                    summary={results.summary}
                    renderValue={renderValue}
                    onConfigureMappings={() => setShowFieldMappings(true)}
                    fieldMappings={fieldMappings}
                  />

                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Per-ID Breakdown</h2>
                    {results.perId.map((r) => (
                      <PerIdCard key={r.id} result={r} renderValue={renderValue} />
                    ))}
                  </div>
                </>
              ) : (
                <SingleApiResults perId={results.perId} renderValue={renderValue} />
              )}

              <RawDataSection perId={results.perId} resultsType={results.type} />
            </div>
          )}
        </div>
      </div>

      {showConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl glass-panel rounded-2xl border border-slate-700 shadow-2xl animate-fade-in max-h-[95vh] flex flex-col overflow-hidden">
            <div className="overflow-y-auto p-6 md:p-8 min-h-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Configuration</h2>
              <button onClick={() => setShowConfig(false)} className="text-slate-400 hover:text-white">
                <i className="pi pi-times text-xl"></i>
              </button>
            </div>

            {mode === 'compare' ? (
              <>
                <div className="flex gap-1 mb-6 p-1 bg-slate-800 rounded-xl w-fit">
                  <button
                    onClick={() => setConfigTab('old')}
                    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                      configTab === 'old'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <i className="pi pi pi-angle-double-left mr-1.5"></i>
                    Old API
                  </button>
                  <button
                    onClick={() => setConfigTab('new')}
                    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                      configTab === 'new'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    New API
                    <i className="pi pi-angle-double-right ml-1.5"></i>
                  </button>
                  <button
                    onClick={() => setConfigTab('ids')}
                    className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                      configTab === 'ids'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <i className="pi pi-list mr-1.5"></i>
                    IDs
                  </button>
                </div>

                {configTab === 'old' && (
                  <ApiForm
                    label="Old API"
                    form={oldForm}
                    setForm={setOldForm}
                    updateForm={updateForm}
                    handleRowChange={handleRowChange}
                    addRow={addRow}
                    removeRow={removeRow}
                    toggleRow={toggleRow}
                  />
                )}

                {configTab === 'new' && (
                  <ApiForm
                    label="New API"
                    form={newForm}
                    setForm={setNewForm}
                    updateForm={updateForm}
                    handleRowChange={handleRowChange}
                    addRow={addRow}
                    removeRow={removeRow}
                    toggleRow={toggleRow}
                  />
                )}

                {configTab === 'ids' && (
                  <div className="p-6 rounded-xl bg-slate-900/50 border border-purple-500/20">
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      IDs to Compare
                    </label>
                    <p className="text-xs text-slate-500 mb-3">
                      Enter comma, space, or semicolon-separated IDs. Use <code className="text-purple-400 bg-slate-800 px-1 rounded">{'{{id}}'}</code> in your URLs above.
                    </p>
                    <textarea
                      value={idsText}
                      onChange={(e) => setIdsText(e.target.value)}
                      placeholder="1, 2, 3, 5, 10"
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none font-mono text-sm"
                    />
                  </div>
                )}
              </>
            ) : (
              <ApiForm
                label="API"
                form={singleForm}
                setForm={setSingleForm}
                updateForm={updateForm}
                handleRowChange={handleRowChange}
                addRow={addRow}
                removeRow={removeRow}
                toggleRow={toggleRow}
              />
            )}

            {mode !== 'compare' && (
            <div className="mt-6 p-6 rounded-xl bg-slate-900/50 border border-purple-500/20">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                IDs to Fetch
              </label>
              <p className="text-xs text-slate-500 mb-3">
                Enter comma, space, or semicolon-separated IDs. Use <code className="text-purple-400 bg-slate-800 px-1 rounded">{'{{id}}'}</code> in your URLs above.
              </p>
              <textarea
                value={idsText}
                onChange={(e) => setIdsText(e.target.value)}
                placeholder="1, 2, 3, 5, 10"
                rows={4}
                className="w-full px-4 py-3 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none font-mono text-sm"
              />
            </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfig(false)}
                className="flex-1 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg transition-all"
              >
                Done
              </button>
            </div>
            </div>
          </div>
        </div>
      )}

      {showFieldMappings && (
        <FieldMappingModal
          mappings={fieldMappings}
          setMappings={setFieldMappings}
          onApply={() => { setShowFieldMappings(false); handleFetch(); }}
          onClose={() => setShowFieldMappings(false)}
          missingFields={results?.summary?.aggregatedMissing || []}
          extraFields={results?.summary?.aggregatedExtra || []}
        />
      )}
    </div>
  );
}

function FieldMappingModal({ mappings, setMappings, onApply, onClose, missingFields, extraFields }) {
  const suggestionPaths = useMemo(() => {
    const paths = [];
    for (const f of missingFields) paths.push({ oldPath: f.path, newPath: '' });
    for (const f of extraFields) paths.push({ oldPath: '', newPath: f.path });
    return paths;
  }, [missingFields, extraFields]);

  const [rows, setRows] = useState(() => {
    if (mappings.length) return mappings.map(m => ({ ...m }));
    const initial = [];
    const seen = new Set();
    for (const m of missingFields) {
      const key = m.path.split('.').pop();
      initial.push({ oldPath: m.path, newPath: key, _suggested: true });
      seen.add(m.path);
    }
    for (const e of extraFields) {
      const key = e.path.split('.').pop();
      if (!seen.has(e.path)) {
        initial.push({ oldPath: key, newPath: e.path, _suggested: true });
      }
    }
    return initial.length ? initial : [{ oldPath: '', newPath: '' }];
  });

  const updateRow = (i, field, val) => {
    setRows(prev => {
      const next = [...prev];
      next[i] = { ...next[i], [field]: val, _suggested: false };
      return next;
    });
  };

  const addRow = () => setRows(prev => [...prev, { oldPath: '', newPath: '' }]);
  const removeRow = (i) => setRows(prev => prev.filter((_, idx) => idx !== i));

  const handleApply = () => {
    const valid = rows.filter(r => r.oldPath.trim() && r.newPath.trim()).map(r => ({
      oldPath: r.oldPath.trim(),
      newPath: r.newPath.trim()
    }));
    setMappings(valid);
    onApply();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-slate-700 shadow-2xl animate-fade-in max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-xl font-bold text-white">Field Mappings</h2>
            <p className="text-sm text-slate-400 mt-1">
              Map old API field paths to new API field paths so they are treated as equivalent.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <i className="pi pi-times text-xl"></i>
          </button>
        </div>
        <div className="overflow-y-auto p-6 min-h-0 space-y-3">
          {rows.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={row.oldPath}
                onChange={(e) => updateRow(i, 'oldPath', e.target.value)}
                placeholder="old.field.path"
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-mono"
              />
              <span className="text-slate-500 shrink-0">
                <i className="pi pi-arrow-right"></i>
              </span>
              <input
                value={row.newPath}
                onChange={(e) => updateRow(i, 'newPath', e.target.value)}
                placeholder="new.field.path"
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm font-mono"
              />
              <button
                onClick={() => removeRow(i)}
                className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
              >
                <i className="pi pi-trash text-xs"></i>
              </button>
            </div>
          ))}
          <button
            onClick={addRow}
            className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <i className="pi pi-plus text-xs"></i> Add mapping
          </button>

          {(missingFields.length > 0 || extraFields.length > 0) && rows.length === 0 && (
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
              <p className="text-sm text-slate-400">
                <i className="pi pi-info-circle mr-1.5"></i>
                Try adding the detected field paths above as suggestions.
              </p>
            </div>
          )}
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-lg font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-lg transition-all"
          >
            Apply & Re-run
          </button>
        </div>
      </div>
    </div>
  );
}

function ApiForm({ label, form, setForm, updateForm, handleRowChange, addRow, removeRow, toggleRow }) {
  return (
    <div className="space-y-5 p-6 rounded-xl bg-slate-900/50 border border-slate-700">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
        {label}
      </h3>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">URL <span className="text-slate-600">(use {'{{id}}'} as placeholder)</span></label>
          <input
            value={form.url}
            onChange={(e) => updateForm(setForm, 'url', e.target.value)}
            placeholder="https://api.example.com/v1/users/{{id}}"
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <div className="w-28 shrink-0">
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Method</label>
          <select
            value={form.method}
            onChange={(e) => updateForm(setForm, 'method', e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            {METHODS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-400">Headers</label>
          <button
            onClick={() => addRow(setForm, 'headers')}
            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <i className="pi pi-plus text-[10px]"></i> Add
          </button>
        </div>
        <div className="space-y-1.5">
          {form.headers.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={row.enabled}
                onChange={() => toggleRow(setForm, 'headers', i)}
                className="shrink-0"
              />
              <input
                value={row.key}
                onChange={(e) => handleRowChange(setForm, 'headers', i, 'key', e.target.value)}
                placeholder="Key"
                className="w-44 px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono"
              />
              <input
                value={row.value}
                onChange={(e) => handleRowChange(setForm, 'headers', i, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono"
              />
              <button
                onClick={() => removeRow(setForm, 'headers', i)}
                className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
              >
                <i className="pi pi-trash text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-400">Query Params</label>
          <button
            onClick={() => addRow(setForm, 'params')}
            className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          >
            <i className="pi pi-plus text-[10px]"></i> Add
          </button>
        </div>
        <div className="space-y-1.5">
          {form.params.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={row.enabled}
                onChange={() => toggleRow(setForm, 'params', i)}
                className="shrink-0"
              />
              <input
                value={row.key}
                onChange={(e) => handleRowChange(setForm, 'params', i, 'key', e.target.value)}
                placeholder="Key"
                className="w-44 px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono"
              />
              <input
                value={row.value}
                onChange={(e) => handleRowChange(setForm, 'params', i, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 px-3 py-1.5 rounded bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 text-xs font-mono"
              />
              <button
                onClick={() => removeRow(setForm, 'params', i)}
                className="text-slate-500 hover:text-red-400 transition-colors shrink-0"
              >
                <i className="pi pi-trash text-xs"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      {(form.method === 'POST' || form.method === 'PUT' || form.method === 'PATCH') && (
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">Request Body</label>
          <textarea
            value={form.body}
            onChange={(e) => updateForm(setForm, 'body', e.target.value)}
            placeholder='{"title": "foo", "body": "bar", "userId": {{id}} }'
            rows={5}
            className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
}

function SummaryCard({ summary, renderValue, onConfigureMappings, fieldMappings = [] }) {
  const hasMissingOrExtra = summary.aggregatedMissing.length > 0 || summary.aggregatedExtra.length > 0;
  const hasChanges = hasMissingOrExtra || summary.aggregatedTypeChanges.length > 0;

  return (
    <div className="p-6 rounded-xl bg-slate-900/80 border border-emerald-500/30">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Summary Report</h2>
        {hasMissingOrExtra && onConfigureMappings && (
          <button
            onClick={onConfigureMappings}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 transition-all flex items-center gap-2"
          >
            <i className="pi pi-link"></i>
            Configure Field Mappings{fieldMappings.length > 0 ? ` (${fieldMappings.length})` : ''}
          </button>
        )}
      </div>

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

function SingleApiResults({ perId, renderValue }) {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">API Responses</h2>
      </div>
      {perId.map((r) => (
        <div
          key={r.id}
          className={`p-4 rounded-xl border ${
            r.error
              ? 'bg-red-900/20 border-red-500/30'
              : 'bg-slate-900/60 border-slate-700'
          }`}
        >
          <button
            onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
            className="flex items-center justify-between w-full text-left"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg font-semibold text-white">ID: {r.id}</span>
              {r.error ? (
                <span className="text-xs px-2 py-0.5 rounded bg-red-500/20 text-red-400">Error</span>
              ) : (
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  {r.fields?.length || 0} fields
                </span>
              )}
            </div>
            <i className={`pi pi-chevron-${expandedId === r.id ? 'up' : 'down'} text-slate-400`}></i>
          </button>
          {expandedId === r.id && (
            <div className="mt-4">
              {r.error ? (
                <div className="p-3 rounded-lg bg-red-500/10 text-red-400 text-sm">{r.error}</div>
              ) : (
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-400 overflow-x-auto max-h-96 overflow-y-auto">
                  {JSON.stringify(r.data, null, 2)}
                </pre>
              )}
            </div>
          )}
        </div>
      ))}
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
                    {renderValue(item.value)}
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
                    {renderValue(item.value)}
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

function RawDataSection({ perId, resultsType }) {
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
            {expandedId === r.id && !r.error && resultsType === 'compare' && (
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
                    {JSON.stringify(r.rawNewData || r.newData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
            {expandedId === r.id && !r.error && resultsType !== 'compare' && (
              <div className="mt-2 ml-4">
                <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-400 overflow-x-auto max-h-64 overflow-y-auto">
                  {JSON.stringify(r.data, null, 2)}
                </pre>
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
