import React, { useState, useEffect, useRef } from 'react';
import { generateInterviewQuestions, evaluateAnswer } from '../services/interviewService';

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

const AIInterview = () => {
  const [currentView, setCurrentView] = useState('setup');
  const [setupData, setSetupData] = useState({
    techStack: [],
    questionCount: 5,
    apiKey: '',
    difficulty: 'intermediate'
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [evaluations, setEvaluations] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showApiKey, setShowApiKey] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [interviewTime, setInterviewTime] = useState(0);
  const timerRef = useRef(null);
  const interviewTimerRef = useRef(null);

  useEffect(() => {
    const savedData = localStorage.getItem('aiInterview_setup');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setSetupData(prev => ({ ...prev, ...parsed }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('aiInterview_setup', JSON.stringify(setupData));
  }, [setupData]);

  useEffect(() => {
    if (currentView === 'interview' && questions.length > 0) {
      const question = questions[currentQuestionIndex];
      if (question.timeLimit) {
        setTimeRemaining(question.timeLimit * 60);
        timerRef.current = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }

      interviewTimerRef.current = setInterval(() => {
        setInterviewTime(prev => prev + 1);
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (interviewTimerRef.current) clearInterval(interviewTimerRef.current);
      };
    }
  }, [currentView, currentQuestionIndex, questions]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const validateSetup = () => {
    const newErrors = {};
    if (setupData.techStack.length === 0) {
      newErrors.techStack = 'Please select at least one tech stack';
    }
    if (!setupData.apiKey.trim()) {
      newErrors.apiKey = 'Gemini API key is required';
    }
    if (setupData.questionCount < 1 || setupData.questionCount > 20) {
      newErrors.questionCount = 'Question count must be between 1 and 20';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTechStackToggle = (stackId) => {
    setSetupData(prev => ({
      ...prev,
      techStack: prev.techStack.includes(stackId)
        ? prev.techStack.filter(id => id !== stackId)
        : [...prev.techStack, stackId]
    }));
    if (errors.techStack) {
      setErrors(prev => ({ ...prev, techStack: '' }));
    }
  };

  const handleStartInterview = async () => {
    if (!validateSetup()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const generatedQuestions = await generateInterviewQuestions({
        techStack: setupData.techStack,
        questionCount: setupData.questionCount,
        difficulty: setupData.difficulty,
        apiKey: setupData.apiKey
      });

      setQuestions(generatedQuestions);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setEvaluations({});
      setInterviewTime(0);
      setCurrentView('interview');
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to generate questions. Please check your API key.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: value
    }));
  };

  const handleNextQuestion = async () => {
    const currentAnswer = answers[currentQuestionIndex] || '';
    
    setIsLoading(true);
    try {
      const evaluation = await evaluateAnswer({
        question: questions[currentQuestionIndex],
        answer: currentAnswer,
        apiKey: setupData.apiKey
      });

      setEvaluations(prev => ({
        ...prev,
        [currentQuestionIndex]: evaluation
      }));

      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setCurrentView('report');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to evaluate answer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleExportReport = (format) => {
    const reportData = {
      candidate: 'Anonymous',
      date: new Date().toLocaleDateString(),
      techStack: setupData.techStack.map(id => TECH_STACKS.find(s => s.id === id)?.name).join(', '),
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(answers).filter(k => answers[k]?.trim()).length,
      totalTime: formatTime(interviewTime),
      averageScore: calculateAverageScore(),
      questions: questions.map((q, idx) => ({
        question: q.question,
        answer: answers[idx] || 'Not answered',
        evaluation: evaluations[idx] || null
      }))
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-report-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'txt') {
      let text = `AI INTERVIEW REPORT\n`;
      text += `==================\n\n`;
      text += `Date: ${reportData.date}\n`;
      text += `Tech Stack: ${reportData.techStack}\n`;
      text += `Total Questions: ${reportData.totalQuestions}\n`;
      text += `Answered: ${reportData.answeredQuestions}\n`;
      text += `Total Time: ${reportData.totalTime}\n`;
      text += `Average Score: ${reportData.averageScore}/10\n\n`;
      text += `DETAILED BREAKDOWN\n`;
      text += `==================\n\n`;
      
      reportData.questions.forEach((q, idx) => {
        text += `Question ${idx + 1}:\n`;
        text += `${q.question}\n\n`;
        text += `Answer:\n${q.answer}\n\n`;
        if (q.evaluation) {
          text += `Score: ${q.evaluation.score}/10\n`;
          text += `Feedback: ${q.evaluation.feedback}\n`;
          if (q.evaluation.suggestions) {
            text += `Suggestions: ${q.evaluation.suggestions}\n`;
          }
        }
        text += `\n${'='.repeat(50)}\n\n`;
      });

      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-report-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const calculateAverageScore = () => {
    const scores = Object.values(evaluations).map(e => e.score);
    if (scores.length === 0) return 0;
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 6) return 'text-yellow-400';
    if (score >= 4) return 'text-orange-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 8) return 'bg-green-500/20 border-green-500/30';
    if (score >= 6) return 'bg-yellow-500/20 border-yellow-500/30';
    if (score >= 4) return 'bg-orange-500/20 border-orange-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  const renderSetup = () => (
    <div className="w-full max-w-4xl mx-auto">
      <div className="glass-panel rounded-2xl p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">AI Technical Interview</h1>
          <p className="text-slate-400">Configure your interview settings and start practicing</p>
        </div>

        <div className="space-y-8">
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
                    setupData.techStack.includes(stack.id)
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Number of Questions <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={setupData.questionCount}
                onChange={(e) => setSetupData(prev => ({ ...prev, questionCount: parseInt(e.target.value) || 1 }))}
                className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {errors.questionCount && <p className="text-red-400 text-xs mt-1">{errors.questionCount}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={setupData.difficulty}
                onChange={(e) => setSetupData(prev => ({ ...prev, difficulty: e.target.value }))}
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
                Gemini API Key <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? 'text' : 'password'}
                  value={setupData.apiKey}
                  onChange={(e) => {
                    setSetupData(prev => ({ ...prev, apiKey: e.target.value }));
                    if (errors.apiKey) setErrors(prev => ({ ...prev, apiKey: '' }));
                  }}
                  placeholder="Enter your Gemini API key"
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

          {errors.submit && (
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-400">
                <i className="pi pi-exclamation-circle"></i>
                <span>{errors.submit}</span>
              </div>
            </div>
          )}

          <button
            onClick={handleStartInterview}
            disabled={isLoading}
            className={`w-full py-4 rounded-lg font-bold text-white transition-all ${
              isLoading
                ? 'bg-indigo-600/50 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg hover:scale-[1.02]'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <i className="pi pi-spin pi-spinner"></i>
                <span>Generating Questions...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <i className="pi pi-play"></i>
                <span>Start Interview</span>
              </div>
            )}
          </button>

          <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700">
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
    </div>
  );

  const renderInterview = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="glass-panel rounded-2xl p-8 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h2>
              <p className="text-slate-400 text-sm">
                Tech: {TECH_STACKS.find(s => s.id === currentQuestion.techStack)?.name}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {timeRemaining > 0 && (
                <div className={`text-lg font-mono font-bold ${timeRemaining < 60 ? 'text-red-400' : 'text-slate-300'}`}>
                  <i className="pi pi-clock mr-1"></i>
                  {formatTime(timeRemaining)}
                </div>
              )}
              <div className="text-slate-400 text-sm">
                <i className="pi pi-stopwatch mr-1"></i>
                {formatTime(interviewTime)}
              </div>
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
                <h3 className="text-lg text-white font-medium leading-relaxed">
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
              <span>{currentQuestion.difficulty} level</span>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0 || isLoading}
              className="px-6 py-3 rounded-lg font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i className="pi pi-chevron-left mr-2"></i>
              Previous
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-lg font-bold text-white transition-all ${
                isLoading
                  ? 'bg-indigo-600/50 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <i className="pi pi-spin pi-spinner"></i>
                  <span>Evaluating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>{currentQuestionIndex === questions.length - 1 ? 'Finish Interview' : 'Next Question'}</span>
                  <i className={`pi ${currentQuestionIndex === questions.length - 1 ? 'pi-check' : 'pi-chevron-right'}`}></i>
                </div>
              )}
            </button>
          </div>

          {errors.submit && (
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <div className="flex items-center gap-2 text-red-400">
                <i className="pi pi-exclamation-circle"></i>
                <span>{errors.submit}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReport = () => {
    const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;
    const avgScore = calculateAverageScore();
    const scoreColor = getScoreColor(parseFloat(avgScore));
    const scoreBgColor = getScoreBgColor(parseFloat(avgScore));

    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="glass-panel rounded-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
              <i className="pi pi-check-circle text-4xl text-white"></i>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Interview Complete!</h1>
            <p className="text-slate-400">Here's your performance report</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 text-center">
              <div className="text-3xl font-bold text-white">{questions.length}</div>
              <div className="text-sm text-slate-400">Total Questions</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 text-center">
              <div className="text-3xl font-bold text-white">{answeredCount}</div>
              <div className="text-sm text-slate-400">Answered</div>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-700 text-center">
              <div className="text-3xl font-bold text-white">{formatTime(interviewTime)}</div>
              <div className="text-sm text-slate-400">Total Time</div>
            </div>
            <div className={`p-4 rounded-lg border text-center ${scoreBgColor}`}>
              <div className={`text-3xl font-bold ${scoreColor}`}>{avgScore}/10</div>
              <div className="text-sm text-slate-400">Average Score</div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="pi pi-list"></i>
              Detailed Breakdown
            </h3>

            {questions.map((question, idx) => {
              const evaluation = evaluations[idx];
              const answer = answers[idx] || '';
              const hasAnswer = answer.trim().length > 0;

              return (
                <div key={idx} className="p-6 rounded-lg bg-slate-900/50 border border-slate-700">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="text-sm text-slate-400">
                          {TECH_STACKS.find(s => s.id === question.techStack)?.name}
                        </span>
                        <span className="text-slate-600 mx-2">|</span>
                        <span className="text-sm text-slate-400">{question.difficulty}</span>
                      </div>
                    </div>
                    {evaluation && (
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBgColor(evaluation.score)} ${getScoreColor(evaluation.score)}`}>
                        {evaluation.score}/10
                      </div>
                    )}
                  </div>

                  <p className="text-white mb-4">{question.question}</p>

                  {question.code && (
                    <pre className="mb-4 p-3 bg-slate-950 rounded-lg overflow-x-auto">
                      <code className="text-sm text-green-400">{question.code}</code>
                    </pre>
                  )}

                  <div className="mb-4">
                    <div className="text-sm font-medium text-slate-400 mb-2">Your Answer:</div>
                    {hasAnswer ? (
                      <div className="p-3 bg-slate-800/50 rounded-lg text-slate-300 text-sm whitespace-pre-wrap">
                        {answer}
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-800/50 rounded-lg text-slate-500 text-sm italic">
                        No answer provided
                      </div>
                    )}
                  </div>

                  {evaluation && (
                    <div className={`p-4 rounded-lg ${getScoreBgColor(evaluation.score)}`}>
                      <div className="text-sm font-medium text-slate-300 mb-2">AI Feedback:</div>
                      <p className="text-sm text-slate-300 mb-3">{evaluation.feedback}</p>
                      {evaluation.suggestions && (
                        <div>
                          <div className="text-sm font-medium text-slate-300 mb-1">Suggestions for improvement:</div>
                          <p className="text-sm text-slate-400">{evaluation.suggestions}</p>
                        </div>
                      )}
                      {evaluation.correctAnswer && (
                        <div className="mt-3">
                          <div className="text-sm font-medium text-slate-300 mb-1">Reference Answer:</div>
                          <p className="text-sm text-slate-400">{evaluation.correctAnswer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleExportReport('json')}
              className="flex-1 py-3 px-6 rounded-lg font-medium text-white bg-slate-800 hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <i className="pi pi-download"></i>
              Export as JSON
            </button>
            <button
              onClick={() => handleExportReport('txt')}
              className="flex-1 py-3 px-6 rounded-lg font-medium text-white bg-slate-800 hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <i className="pi pi-file"></i>
              Export as Text
            </button>
            <button
              onClick={() => setCurrentView('setup')}
              className="flex-1 py-3 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <i className="pi pi-refresh"></i>
              New Interview
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      {currentView === 'setup' && renderSetup()}
      {currentView === 'interview' && renderInterview()}
      {currentView === 'report' && renderReport()}
    </div>
  );
};

export default AIInterview;