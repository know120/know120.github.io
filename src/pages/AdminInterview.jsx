import React, { useState, useEffect } from 'react';
import { 
  saveInterviewSession, 
  getAllSessions, 
  deleteSession, 
  clearAllSessions,
  generateInterviewLink 
} from '../services/interviewStorage';
import { generateInterviewQuestions } from '../services/interviewService';
import ExportModal from '../components/ExportModal';

const TECH_STACKS = [
  { id: 'javascript', name: 'JavaScript', icon: 'pi-bolt' },
  { id: 'typescript', name: 'TypeScript', icon: 'pi-file-edit' },
  { id: 'react', name: 'React', icon: 'pi-refresh' },
  { id: 'vue', name: 'Vue.js', icon: 'pi-check-circle' },
  { id: 'angular', name: 'Angular', icon: 'pi-shield' },
  { id: 'node', name: 'Node.js', icon: 'pi-server' },
  { id: 'python', name: 'Python', icon: 'pi-hashtag' },
  { id: 'java', name: 'Java', icon: 'pi-cup' },
  { id: 'go', name: 'Go', icon: 'pi-send' },
  { id: 'rust', name: 'Rust', icon: 'pi-wrench' },
  { id: 'sql', name: 'SQL & Databases', icon: 'pi-database' },
  { id: 'system-design', name: 'System Design', icon: 'pi-sitemap' },
  { id: 'devops', name: 'DevOps', icon: 'pi-cog' },
  { id: 'aws', name: 'AWS/Cloud', icon: 'pi-cloud' },
];

const AdminInterview = () => {
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState('create');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLink, setGeneratedLink] = useState(null);
  const [errors, setErrors] = useState({});
  const [expandedSession, setExpandedSession] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportSession, setExportSession] = useState(null);
  
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    techStack: [],
    questionCount: 5,
    difficulty: 'intermediate',
    apiKey: '',
    timeLimit: 30,
    notes: ''
  });

  useEffect(() => {
    loadSessions();
    const savedApiKey = localStorage.getItem('aiInterview_adminApiKey');
    if (savedApiKey) {
      setFormData(prev => ({ ...prev, apiKey: savedApiKey }));
    }
  }, []);

  const loadSessions = () => {
    const allSessions = getAllSessions();
    setSessions(allSessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  };

  const handleTechStackToggle = (stackId) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(stackId)
        ? prev.techStack.filter(id => id !== stackId)
        : [...prev.techStack, stackId]
    }));
    if (errors.techStack) {
      setErrors(prev => ({ ...prev, techStack: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.candidateName.trim()) {
      newErrors.candidateName = 'Candidate name is required';
    }
    if (!formData.candidateEmail.trim()) {
      newErrors.candidateEmail = 'Candidate email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidateEmail)) {
      newErrors.candidateEmail = 'Invalid email address';
    }
    if (formData.techStack.length === 0) {
      newErrors.techStack = 'Please select at least one tech stack';
    }
    if (!formData.apiKey.trim()) {
      newErrors.apiKey = 'Gemini API key is required';
    }
    if (formData.questionCount < 1 || formData.questionCount > 20) {
      newErrors.questionCount = 'Question count must be between 1 and 20';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateInterview = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);
    setErrors({});

    try {
      localStorage.setItem('aiInterview_adminApiKey', formData.apiKey);
      
      const questions = await generateInterviewQuestions({
        techStack: formData.techStack,
        questionCount: formData.questionCount,
        difficulty: formData.difficulty,
        apiKey: formData.apiKey
      });

      const session = saveInterviewSession({
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        techStack: formData.techStack,
        questionCount: formData.questionCount,
        difficulty: formData.difficulty,
        timeLimit: formData.timeLimit,
        notes: formData.notes,
        questions: questions
      });

      const link = generateInterviewLink(session.id);
      setGeneratedLink({
        sessionId: session.id,
        link: link,
        candidateName: formData.candidateName
      });

      loadSessions();
      
      setFormData({
        candidateName: '',
        candidateEmail: '',
        techStack: [],
        questionCount: 5,
        difficulty: 'intermediate',
        apiKey: formData.apiKey,
        timeLimit: 30,
        notes: ''
      });
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to generate interview. Please check your API key.' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink.link);
    }
  };

  const handleDeleteSession = (sessionId) => {
    if (confirm('Are you sure you want to delete this interview session?')) {
      deleteSession(sessionId);
      loadSessions();
      if (expandedSession === sessionId) {
        setExpandedSession(null);
      }
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL interview sessions? This cannot be undone.')) {
      clearAllSessions();
      loadSessions();
      setExpandedSession(null);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'in-progress': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      completed: 'bg-green-500/20 text-green-400 border-green-500/30'
    };
    return styles[status] || styles.pending;
  };

  const renderCreateTab = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Candidate Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.candidateName}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, candidateName: e.target.value }));
              if (errors.candidateName) setErrors(prev => ({ ...prev, candidateName: '' }));
            }}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.candidateName && <p className="text-red-400 text-xs mt-1">{errors.candidateName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Candidate Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={formData.candidateEmail}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, candidateEmail: e.target.value }));
              if (errors.candidateEmail) setErrors(prev => ({ ...prev, candidateEmail: '' }));
            }}
            placeholder="candidate@example.com"
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.candidateEmail && <p className="text-red-400 text-xs mt-1">{errors.candidateEmail}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-3">
          Select Tech Stack <span className="text-red-400">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {TECH_STACKS.map(stack => (
            <button
              key={stack.id}
              onClick={() => handleTechStackToggle(stack.id)}
              className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                formData.techStack.includes(stack.id)
                  ? 'bg-indigo-600 border-indigo-500 text-white'
                  : 'bg-slate-900/50 border-slate-700 text-slate-300 hover:border-slate-600'
              }`}
            >
              <i className={`pi ${stack.icon} block mb-1`}></i>
              {stack.name}
            </button>
          ))}
        </div>
        {errors.techStack && <p className="text-red-400 text-sm mt-2">{errors.techStack}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Questions <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={formData.questionCount}
            onChange={(e) => setFormData(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 1 }))}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          {errors.questionCount && <p className="text-red-400 text-xs mt-1">{errors.questionCount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Difficulty
          </label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
            <option value="expert">Expert</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Time Limit (minutes)
          </label>
          <input
            type="number"
            min="5"
            max="180"
            value={formData.timeLimit}
            onChange={(e) => setFormData(prev => ({ ...prev, timeLimit: parseInt(e.target.value) || 30 }))}
            className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Gemini API Key <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showApiKey ? 'text' : 'password'}
              value={formData.apiKey}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, apiKey: e.target.value }));
                if (errors.apiKey) setErrors(prev => ({ ...prev, apiKey: '' }));
              }}
              placeholder="API Key"
              className="w-full px-4 py-3 pr-12 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <i className={`pi ${showApiKey ? 'pi-eye-slash' : 'pi-eye'}`}></i>
            </button>
          </div>
          {errors.apiKey && <p className="text-red-400 text-xs mt-1">{errors.apiKey}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any additional notes about this interview..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
        />
      </div>

      {errors.submit && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-center gap-2 text-red-400">
            <i className="pi pi-exclamation-circle"></i>
            <span>{errors.submit}</span>
          </div>
        </div>
      )}

      <button
        onClick={handleCreateInterview}
        disabled={isGenerating}
        className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
          isGenerating
            ? 'bg-indigo-600/50 cursor-not-allowed'
            : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-[1.02]'
        }`}
      >
        {isGenerating ? (
          <div className="flex items-center justify-center gap-2">
            <i className="pi pi-spin pi-spinner"></i>
            <span>Generating Interview...</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <i className="pi pi-plus"></i>
            <span>Create Interview & Generate Link</span>
          </div>
        )}
      </button>

      {generatedLink && (
        <div className="p-6 rounded-lg bg-green-500/10 border border-green-500/20 animate-fade-in">
          <div className="flex items-center gap-2 text-green-400 mb-3">
            <i className="pi pi-check-circle text-xl"></i>
            <span className="font-semibold">Interview Created Successfully!</span>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Share this link with <strong className="text-white">{generatedLink.candidateName}</strong>:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={generatedLink.link}
              readOnly
              className="flex-1 px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="px-6 py-3 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all flex items-center gap-2"
            >
              <i className="pi pi-copy"></i>
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderManageTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          All Interview Sessions ({sessions.length})
        </h3>
        {sessions.length > 0 && (
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all flex items-center gap-2"
          >
            <i className="pi pi-trash"></i>
            Clear All
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-12">
          <i className="pi pi-inbox text-4xl text-slate-600 mb-4"></i>
          <p className="text-slate-400">No interview sessions yet</p>
          <p className="text-sm text-slate-500 mt-2">Create your first interview to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map(session => (
            <div key={session.id} className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-white">{session.candidateName}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(session.status)}`}>
                      {session.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-400 mb-1">{session.candidateEmail}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>
                      <i className="pi pi-calendar mr-1"></i>
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      <i className="pi pi-list mr-1"></i>
                      {session.questionCount} questions
                    </span>
                    <span>
                      <i className="pi pi-clock mr-1"></i>
                      {session.timeLimit} min limit
                    </span>
                    <span className="capitalize">{session.difficulty}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                  >
                    <i className={`pi ${expandedSession === session.id ? 'pi-chevron-up' : 'pi-chevron-down'}`}></i>
                  </button>
                  <button
                    onClick={() => {
                      const link = generateInterviewLink(session.id);
                      navigator.clipboard.writeText(link);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
                    title="Copy link"
                  >
                    <i className="pi pi-link"></i>
                  </button>
                  <button
                    onClick={() => handleDeleteSession(session.id)}
                    className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    title="Delete"
                  >
                    <i className="pi pi-trash"></i>
                  </button>
                </div>
              </div>

              {expandedSession === session.id && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm font-medium text-slate-400">Interview Link:</span>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          value={generateInterviewLink(session.id)}
                          readOnly
                          className="flex-1 px-3 py-2 rounded bg-slate-950 border border-slate-700 text-slate-400 text-sm"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(generateInterviewLink(session.id))}
                          className="px-3 py-2 rounded text-sm text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all"
                        >
                          Copy
                        </button>
                      </div>
                    </div>

                    <div>
                      <span className="text-sm font-medium text-slate-400">Tech Stack:</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {session.techStack.map(stackId => {
                          const stack = TECH_STACKS.find(s => s.id === stackId);
                          return (
                            <span key={stackId} className="px-2 py-1 rounded bg-slate-800 text-slate-300 text-xs">
                              {stack?.name || stackId}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {session.notes && (
                      <div>
                        <span className="text-sm font-medium text-slate-400">Notes:</span>
                        <p className="text-sm text-slate-300 mt-1">{session.notes}</p>
                      </div>
                    )}

                    {session.status === 'completed' && session.result && (
                      <div className="p-4 rounded-lg bg-slate-800/50">
                        <div className="flex items-center gap-4 mb-4">
                          <div>
                            <span className="text-sm text-slate-400">Score</span>
                            <div className="text-2xl font-bold text-white">{session.result.averageScore}/10</div>
                          </div>
                          <div>
                            <span className="text-sm text-slate-400">Answered</span>
                            <div className="text-2xl font-bold text-white">{session.result.answeredCount}/{session.result.totalQuestions}</div>
                          </div>
                          <div>
                            <span className="text-sm text-slate-400">Time Taken</span>
                            <div className="text-2xl font-bold text-white">{session.result.totalTime}</div>
                          </div>
                          <div>
                            <span className="text-sm text-slate-400">Completed</span>
                            <div className="text-sm text-slate-300">
                              {session.completedAt ? new Date(session.completedAt).toLocaleString() : 'N/A'}
                            </div>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                            setExportSession(session);
                            setExportModalOpen(true);
                          }}
                          className="w-full py-2 rounded-lg text-sm font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all flex items-center justify-center gap-2"
                        >
                          <i className="pi pi-download"></i>
                          Export Report
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="w-full max-w-5xl mx-auto">
        <div className="glass-panel rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
              <i className="pi pi-cog text-2xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Interview Admin</h1>
            <p className="text-slate-400">Create and manage technical interviews for candidates</p>
          </div>

          <div className="flex gap-4 mb-8 border-b border-slate-700">
            <button
              onClick={() => setActiveTab('create')}
              className={`pb-4 px-4 font-medium transition-all ${
                activeTab === 'create'
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <i className="pi pi-plus mr-2"></i>
              Create Interview
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`pb-4 px-4 font-medium transition-all ${
                activeTab === 'manage'
                  ? 'text-indigo-400 border-b-2 border-indigo-500'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <i className="pi pi-list mr-2"></i>
              Manage Sessions
              {sessions.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs">
                  {sessions.length}
                </span>
              )}
            </button>
          </div>

          {activeTab === 'create' ? renderCreateTab() : renderManageTab()}

          <div className="mt-8 p-4 rounded-lg bg-slate-800/30 border border-slate-700">
            <p className="text-xs text-slate-400">
              <i className="pi pi-info-circle mr-1"></i>
              Your API key is stored locally in your browser and is only used to communicate with Google's Gemini API.
              Get your API key from{' '}
              <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">
                Google AI Studio
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => {
          setExportModalOpen(false);
          setExportSession(null);
        }}
        session={exportSession}
      />
    </div>
  );
};

export default AdminInterview;