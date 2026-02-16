import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSessionById, updateSession, saveInterviewResult } from '../services/interviewStorage';
import { evaluateAnswer } from '../services/interviewService';

const CandidateInterview = () => {
  const { interviewId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState('intro');
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [interviewTime, setInterviewTime] = useState(0);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(0);
  
  const timerRef = useRef(null);
  const interviewTimerRef = useRef(null);

  useEffect(() => {
    const loadSession = () => {
      const sessionData = getSessionById(interviewId);
      
      if (!sessionData) {
        setError('Invalid interview link. Please check with your interviewer for the correct link.');
        setLoading(false);
        return;
      }

      if (sessionData.status === 'completed') {
        setError('This interview has already been completed.');
        setLoading(false);
        return;
      }

      setSession(sessionData);
      setTotalTimeRemaining((sessionData.timeLimit || 30) * 60);
      setLoading(false);
    };

    loadSession();
  }, [interviewId]);

  useEffect(() => {
    if (currentStep === 'interview' && session) {
      interviewTimerRef.current = setInterval(() => {
        setInterviewTime(prev => prev + 1);
      }, 1000);

      timerRef.current = setInterval(() => {
        setTotalTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (interviewTimerRef.current) clearInterval(interviewTimerRef.current);
      };
    }
  }, [currentStep, session]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUp = async () => {
    await finishInterview();
  };

  const handleStartInterview = () => {
    updateSession(interviewId, { status: 'in-progress' });
    setCurrentStep('interview');
  };

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
  };

  const handleNextQuestion = async () => {
    const currentAnswer = answers[currentQuestionIndex] || '';
    const currentQuestion = session.questions[currentQuestionIndex];
    
    setIsSubmitting(true);
    try {
      const evaluation = await evaluateAnswer({
        question: currentQuestion,
        answer: currentAnswer,
        apiKey: session.apiKey || localStorage.getItem('aiInterview_adminApiKey') || ''
      });

      setEvaluations(prev => ({
        ...prev,
        [currentQuestionIndex]: evaluation
      }));

      if (currentQuestionIndex < session.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        await finishInterview();
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      if (currentQuestionIndex < session.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        await finishInterview();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const finishInterview = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (interviewTimerRef.current) clearInterval(interviewTimerRef.current);

    const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;
    const scores = Object.values(evaluations).map(e => e.score);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;

    const resultData = {
      totalQuestions: session.questions.length,
      answeredCount: answeredCount,
      totalTime: formatTime(interviewTime),
      interviewTimeSeconds: interviewTime,
      averageScore: avgScore,
      questions: session.questions.map((q, idx) => ({
        question: q.question,
        answer: answers[idx] || 'Not answered',
        evaluation: evaluations[idx] || null
      })),
      evaluations: evaluations
    };

    saveInterviewResult(interviewId, resultData);
    setCurrentStep('completed');
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="pi pi-spin pi-spinner text-4xl text-indigo-500 mb-4"></i>
          <p className="text-slate-400">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/20 mb-6">
            <i className="pi pi-exclamation-circle text-4xl text-red-400"></i>
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">Interview Error</h1>
          <p className="text-slate-400 mb-6">{error}</p>
          <button
            onClick={() => navigate('/tools/ai-interview')}
            className="px-6 py-3 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-all"
          >
            Go to Interview Portal
          </button>
        </div>
      </div>
    );
  }

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="glass-panel rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
                <i className="pi pi-user text-4xl text-white"></i>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Welcome, {session.candidateName}!</h1>
              <p className="text-slate-400">Your technical interview is ready</p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Interview Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-slate-500">Questions</span>
                    <p className="text-lg text-white font-medium">{session.questionCount}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Time Limit</span>
                    <p className="text-lg text-white font-medium">{session.timeLimit} minutes</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Difficulty</span>
                    <p className="text-lg text-white font-medium capitalize">{session.difficulty}</p>
                  </div>
                  <div>
                    <span className="text-sm text-slate-500">Tech Stack</span>
                    <p className="text-lg text-white font-medium">{session.techStack.length} selected</p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-3">
                  <i className="pi pi-info-circle text-xl text-yellow-400 mt-0.5"></i>
                  <div>
                    <h4 className="font-medium text-yellow-400 mb-2">Important Instructions</h4>
                    <ul className="text-sm text-slate-400 space-y-1 list-disc list-inside">
                      <li>Once you start, the timer cannot be paused</li>
                      <li>Answer all questions to the best of your ability</li>
                      <li>Your answers will be evaluated by AI</li>
                      <li>You can navigate between questions</li>
                      <li>Make sure you have a stable internet connection</li>
                    </ul>
                  </div>
                </div>
              </div>

              {session.notes && (
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <i className="pi pi-comment text-xl text-blue-400 mt-0.5"></i>
                    <div>
                      <h4 className="font-medium text-blue-400 mb-1">Note from Interviewer</h4>
                      <p className="text-sm text-slate-400">{session.notes}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleStartInterview}
              className="w-full py-4 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              <i className="pi pi-play"></i>
              Start Interview
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'interview') {
    const currentQuestion = session.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / session.questions.length) * 100;

    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="glass-panel rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Question {currentQuestionIndex + 1} of {session.questions.length}
                </h2>
                <p className="text-slate-400 text-sm">
                  {session.candidateName}
                </p>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-mono font-bold ${totalTimeRemaining < 300 ? 'text-red-400' : 'text-slate-300'}`}>
                  {formatTime(totalTimeRemaining)}
                </div>
                <p className="text-xs text-slate-500">time remaining</p>
              </div>
            </div>

            <div className="w-full bg-slate-800 rounded-full h-2 mb-8">
              <div
                className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <div className="mb-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                  <i className="pi pi-question-circle text-white"></i>
                </div>
                <div className="flex-1">
                  <span className="text-xs text-slate-500 uppercase tracking-wider">{currentQuestion.type}</span>
                  <h3 className="text-lg text-white font-medium leading-relaxed mt-1">
                    {currentQuestion.question}
                  </h3>
                  {currentQuestion.code && (
                    <pre className="mt-4 p-4 bg-slate-900 rounded-lg overflow-x-auto">
                      <code className="text-sm text-green-400">{currentQuestion.code}</code>
                    </pre>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Your Answer
              </label>
              <textarea
                value={answers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
                rows={8}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
              <div className="flex justify-between mt-2 text-sm text-slate-400">
                <span>{(answers[currentQuestionIndex] || '').length} characters</span>
                <span className="capitalize">{currentQuestion.difficulty}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                className="px-6 py-3 rounded-lg font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <i className="pi pi-chevron-left mr-2"></i>
                Previous
              </button>

              <button
                onClick={handleNextQuestion}
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-lg font-bold text-white transition-all ${
                  isSubmitting
                    ? 'bg-indigo-600/50 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <i className="pi pi-spin pi-spinner"></i>
                    <span>Evaluating...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>{currentQuestionIndex === session.questions.length - 1 ? 'Finish Interview' : 'Next Question'}</span>
                    <i className={`pi ${currentQuestionIndex === session.questions.length - 1 ? 'pi-check' : 'pi-chevron-right'}`}></i>
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'completed') {
    const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;
    const scores = Object.values(evaluations).map(e => e.score);
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;

    return (
      <div className="min-h-screen p-4 md:p-8">
        <div className="w-full max-w-3xl mx-auto">
          <div className="glass-panel rounded-2xl p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 mb-6">
              <i className="pi pi-check-circle text-5xl text-green-400"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Interview Completed!</h1>
            <p className="text-slate-400 mb-8">Thank you for completing the interview, {session.candidateName}</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                <div className="text-3xl font-bold text-white">{session.questions.length}</div>
                <div className="text-sm text-slate-400">Questions</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                <div className="text-3xl font-bold text-white">{answeredCount}</div>
                <div className="text-sm text-slate-400">Answered</div>
              </div>
              <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700">
                <div className={`text-3xl font-bold ${getScoreColor(parseFloat(avgScore))}`}>{avgScore}</div>
                <div className="text-sm text-slate-400">Avg Score</div>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-slate-900/50 border border-slate-700 mb-8">
              <h3 className="text-lg font-semibold text-white mb-2">What's Next?</h3>
              <p className="text-slate-400">
                Your interview results have been submitted to the hiring team. 
                They will review your answers and get back to you soon.
              </p>
            </div>

            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default CandidateInterview;