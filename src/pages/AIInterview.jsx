import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AIInterview = () => {
  const navigate = useNavigate();
  const [interviewLink, setInterviewLink] = useState('');
  const [error, setError] = useState('');

  const handleCandidateAccess = (e) => {
    e.preventDefault();
    setError('');
    
    if (!interviewLink.trim()) {
      setError('Please enter your interview link');
      return;
    }

    try {
      let interviewId = '';
      
      if (interviewLink.includes('/candidate/')) {
        const match = interviewLink.match(/\/candidate\/([^/#\?]+)/);
        if (match) {
          interviewId = match[1];
        }
      } else {
        interviewId = interviewLink.trim();
      }

      if (!interviewId) {
        setError('Invalid interview link format');
        return;
      }

      navigate(`/tools/ai-interview/candidate/${interviewId}`);
    } catch {
      setError('Invalid interview link');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="glass-panel rounded-2xl p-8 md:p-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
              <i className="pi pi-comments text-5xl text-white"></i>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">AI Technical Interview</h1>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Create and conduct technical interviews powered by AI. Admins can set up interviews, 
              candidates can take them via unique links.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-indigo-500/50 transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-600/20 mb-6">
                <i className="pi pi-cog text-3xl text-indigo-400"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">I'm an Admin</h2>
              <p className="text-slate-400 mb-6">
                Create technical interviews, select tech stacks, set difficulty levels, 
                and generate unique links for candidates.
              </p>
              <ul className="text-sm text-slate-500 space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <i className="pi pi-check text-green-400"></i>
                  Create custom interviews
                </li>
                <li className="flex items-center gap-2">
                  <i className="pi pi-check text-green-400"></i>
                  Select multiple tech stacks
                </li>
                <li className="flex items-center gap-2">
                  <i className="pi pi-check text-green-400"></i>
                  Track candidate progress
                </li>
                <li className="flex items-center gap-2">
                  <i className="pi pi-check text-green-400"></i>
                  Review detailed reports
                </li>
              </ul>
              <button
                onClick={() => navigate('/tools/ai-interview/admin')}
                className="w-full py-4 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
              >
                <i className="pi pi-arrow-right"></i>
                Go to Admin Panel
              </button>
            </div>

            <div className="p-8 rounded-xl bg-slate-900/50 border border-slate-700 hover:border-green-500/50 transition-all">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600/20 mb-6">
                <i className="pi pi-user text-3xl text-green-400"></i>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">I'm a Candidate</h2>
              <p className="text-slate-400 mb-6">
                Take your technical interview. Enter the link provided by your interviewer 
                to access your personalized interview session.
              </p>
              
              <form onSubmit={handleCandidateAccess} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Interview Link
                  </label>
                  <input
                    type="text"
                    value={interviewLink}
                    onChange={(e) => {
                      setInterviewLink(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="Paste your interview link here"
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-green-500"
                  />
                  {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-lg font-bold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                  <i className="pi pi-play"></i>
                  Start My Interview
                </button>
              </form>

              <div className="mt-4 p-3 rounded-lg bg-slate-800/50">
                <p className="text-xs text-slate-500">
                  <i className="pi pi-info-circle mr-1"></i>
                  You should have received a unique interview link from your recruiter or interviewer.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-800">
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-400 mb-2">14+</div>
                <div className="text-sm text-slate-400">Tech Stacks</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">AI-Powered</div>
                <div className="text-sm text-slate-400">Question Generation</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">Instant</div>
                <div className="text-sm text-slate-400">Evaluation & Reports</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInterview;