const INTERVIEW_STORAGE_KEY = 'aiInterview_sessions';

export const generateInterviewId = () => {
  return 'int_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
};

export const generateInterviewLink = (interviewId) => {
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}#/tools/ai-interview/candidate/${interviewId}`;
};

export const saveInterviewSession = (sessionData) => {
  const sessions = getAllSessions();
  const newSession = {
    id: generateInterviewId(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    ...sessionData
  };
  
  sessions.push(newSession);
  localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(sessions));
  return newSession;
};

export const getAllSessions = () => {
  try {
    const data = localStorage.getItem(INTERVIEW_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const getSessionById = (interviewId) => {
  const sessions = getAllSessions();
  return sessions.find(s => s.id === interviewId);
};

export const updateSession = (interviewId, updates) => {
  const sessions = getAllSessions();
  const index = sessions.findIndex(s => s.id === interviewId);
  
  if (index !== -1) {
    sessions[index] = { ...sessions[index], ...updates, updatedAt: new Date().toISOString() };
    localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(sessions));
    return sessions[index];
  }
  return null;
};

export const saveInterviewResult = (interviewId, resultData) => {
  return updateSession(interviewId, {
    status: 'completed',
    completedAt: new Date().toISOString(),
    result: resultData
  });
};

export const deleteSession = (interviewId) => {
  const sessions = getAllSessions();
  const filtered = sessions.filter(s => s.id !== interviewId);
  localStorage.setItem(INTERVIEW_STORAGE_KEY, JSON.stringify(filtered));
};

export const clearAllSessions = () => {
  localStorage.removeItem(INTERVIEW_STORAGE_KEY);
};