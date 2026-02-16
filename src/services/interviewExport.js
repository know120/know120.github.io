const TECH_STACK_NAMES = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  react: 'React',
  vue: 'Vue.js',
  angular: 'Angular',
  node: 'Node.js',
  python: 'Python',
  java: 'Java',
  go: 'Go',
  rust: 'Rust',
  sql: 'SQL & Databases',
  'system-design': 'System Design',
  devops: 'DevOps',
  aws: 'AWS/Cloud'
};

const getTechStackNames = (techStack) => {
  return techStack.map(id => TECH_STACK_NAMES[id] || id).join(', ');
};

const getScoreColor = (score) => {
  if (score >= 8) return 'green';
  if (score >= 6) return 'yellow';
  if (score >= 4) return 'orange';
  return 'red';
};

export const exportToJSON = (session) => {
  const reportData = {
    interviewId: session.id,
    candidate: {
      name: session.candidateName,
      email: session.candidateEmail
    },
    interviewConfig: {
      techStack: getTechStackNames(session.techStack),
      questionCount: session.questionCount,
      difficulty: session.difficulty,
      timeLimit: session.timeLimit,
      notes: session.notes
    },
    timing: {
      createdAt: session.createdAt,
      completedAt: session.completedAt,
      totalTime: session.result?.totalTime || 'N/A',
      totalTimeSeconds: session.result?.interviewTimeSeconds || 0
    },
    results: {
      totalQuestions: session.result?.totalQuestions || 0,
      answeredCount: session.result?.answeredCount || 0,
      averageScore: session.result?.averageScore || 0,
      completionRate: session.result?.totalQuestions 
        ? ((session.result.answeredCount / session.result.totalQuestions) * 100).toFixed(1)
        : 0
    },
    questions: session.result?.questions?.map((q, idx) => ({
      questionNumber: idx + 1,
      question: q.question,
      answer: q.answer,
      score: q.evaluation?.score || 0,
      feedback: q.evaluation?.feedback || '',
      suggestions: q.evaluation?.suggestions || '',
      correctAnswer: q.evaluation?.correctAnswer || ''
    })) || [],
    exportMetadata: {
      exportedAt: new Date().toISOString(),
      format: 'JSON',
      version: '1.0'
    }
  };

  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `interview-report-${session.candidateName.replace(/\s+/g, '-')}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToMarkdown = (session) => {
  const techStackNames = getTechStackNames(session.techStack);
  const completionRate = session.result?.totalQuestions 
    ? ((session.result.answeredCount / session.result.totalQuestions) * 100).toFixed(1)
    : 0;

  let md = `# Technical Interview Report\n\n`;
  md += `## Candidate Information\n\n`;
  md += `- **Name:** ${session.candidateName}\n`;
  md += `- **Email:** ${session.candidateEmail}\n`;
  md += `- **Interview ID:** ${session.id}\n\n`;

  md += `## Interview Configuration\n\n`;
  md += `- **Tech Stack:** ${techStackNames}\n`;
  md += `- **Difficulty:** ${session.difficulty}\n`;
  md += `- **Total Questions:** ${session.questionCount}\n`;
  md += `- **Time Limit:** ${session.timeLimit} minutes\n`;
  md += `- **Created:** ${new Date(session.createdAt).toLocaleString()}\n`;
  if (session.completedAt) {
    md += `- **Completed:** ${new Date(session.completedAt).toLocaleString()}\n`;
  }
  md += `\n`;

  if (session.notes) {
    md += `## Notes\n\n${session.notes}\n\n`;
  }

  if (session.result) {
    md += `## Results Summary\n\n`;
    md += `| Metric | Value |\n`;
    md += `|--------|-------|\n`;
    md += `| **Average Score** | ${session.result.averageScore}/10 |\n`;
    md += `| **Questions Answered** | ${session.result.answeredCount}/${session.result.totalQuestions} (${completionRate}%) |\n`;
    md += `| **Total Time** | ${session.result.totalTime} |\n`;
    md += `| **Status** | ${session.status} |\n\n`;

    md += `## Detailed Breakdown\n\n`;

    session.result.questions?.forEach((q, idx) => {
      const evaluation = q.evaluation;
      const score = evaluation?.score || 0;
      const scoreEmoji = score >= 8 ? '✅' : score >= 6 ? '⚠️' : score >= 4 ? '⚡' : '❌';

      md += `### Question ${idx + 1} ${scoreEmoji}\n\n`;
      md += `**Question:**\n${q.question}\n\n`;
      
      md += `**Candidate's Answer:**\n`;
      md += q.answer?.trim() ? q.answer : '*No answer provided*';
      md += `\n\n`;

      if (evaluation) {
        md += `**Score:** ${score}/10\n\n`;
        md += `**Feedback:**\n${evaluation.feedback}\n\n`;
        
        if (evaluation.suggestions) {
          md += `**Suggestions for Improvement:**\n${evaluation.suggestions}\n\n`;
        }

        if (evaluation.correctAnswer) {
          md += `**Reference Answer:**\n${evaluation.correctAnswer}\n\n`;
        }
      }

      md += `---\n\n`;
    });
  } else {
    md += `## Status\n\nInterview not yet completed.\n\n`;
  }

  md += `## Export Information\n\n`;
  md += `- **Exported At:** ${new Date().toLocaleString()}\n`;
  md += `- **Format:** Markdown\n`;
  md += `- **Version:** 1.0\n`;

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `interview-report-${session.candidateName.replace(/\s+/g, '-')}-${Date.now()}.md`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportToPDF = async (session) => {
  const techStackNames = getTechStackNames(session.techStack);
  
  // Create a hidden div with formatted content for printing
  const printDiv = document.createElement('div');
  printDiv.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: 800px;
    padding: 40px;
    background: white;
    color: black;
    font-family: Arial, sans-serif;
    font-size: 12px;
    line-height: 1.6;
  `;

  let html = `
    <style>
      @page { size: A4; margin: 20mm; }
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
      h1 { color: #1a1a1a; border-bottom: 3px solid #4f46e5; padding-bottom: 10px; }
      h2 { color: #2d2d2d; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; margin-top: 30px; }
      h3 { color: #374151; margin-top: 25px; }
      table { width: 100%; border-collapse: collapse; margin: 15px 0; }
      th, td { border: 1px solid #d1d5db; padding: 10px; text-align: left; }
      th { background: #f3f4f6; font-weight: bold; }
      .score-box { 
        display: inline-block; 
        padding: 8px 16px; 
        border-radius: 8px; 
        font-size: 18px; 
        font-weight: bold;
        margin: 10px 0;
      }
      .score-high { background: #d1fae5; color: #065f46; }
      .score-medium { background: #fef3c7; color: #92400e; }
      .score-low { background: #fee2e2; color: #991b1b; }
      .answer-box { background: #f9fafb; padding: 15px; border-left: 4px solid #4f46e5; margin: 10px 0; }
      .feedback-box { background: #eff6ff; padding: 15px; border-left: 4px solid #3b82f6; margin: 10px 0; }
      .question-separator { border-top: 2px dashed #e5e7eb; margin: 30px 0; }
      pre { background: #1f2937; color: #10b981; padding: 15px; border-radius: 6px; overflow-x: auto; }
      .header-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
      .info-card { background: #f9fafb; padding: 15px; border-radius: 8px; flex: 1; margin: 0 10px; }
      .info-card:first-child { margin-left: 0; }
      .info-card:last-child { margin-right: 0; }
      .info-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
      .info-value { font-size: 16px; font-weight: bold; color: #1f2937; }
    </style>
    <h1>Technical Interview Report</h1>
    
    <div class="header-info">
      <div class="info-card">
        <div class="info-label">Candidate</div>
        <div class="info-value">${session.candidateName}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Email</div>
        <div class="info-value">${session.candidateEmail}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Interview ID</div>
        <div class="info-value">${session.id}</div>
      </div>
    </div>
  `;

  html += `
    <h2>Interview Configuration</h2>
    <table>
      <tr><th>Property</th><th>Value</th></tr>
      <tr><td>Tech Stack</td><td>${techStackNames}</td></tr>
      <tr><td>Difficulty</td><td>${session.difficulty}</td></tr>
      <tr><td>Questions</td><td>${session.questionCount}</td></tr>
      <tr><td>Time Limit</td><td>${session.timeLimit} minutes</td></tr>
      <tr><td>Created</td><td>${new Date(session.createdAt).toLocaleString()}</td></tr>
      ${session.completedAt ? `<tr><td>Completed</td><td>${new Date(session.completedAt).toLocaleString()}</td></tr>` : ''}
    </table>
  `;

  if (session.notes) {
    html += `<h2>Notes</h2><p>${session.notes}</p>`;
  }

  if (session.result) {
    const score = parseFloat(session.result.averageScore);
    const scoreClass = score >= 7 ? 'score-high' : score >= 5 ? 'score-medium' : 'score-low';
    const completionRate = ((session.result.answeredCount / session.result.totalQuestions) * 100).toFixed(1);

    html += `
      <h2>Results Summary</h2>
      <div class="score-box ${scoreClass}">
        Average Score: ${session.result.averageScore}/10
      </div>
      <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Questions Answered</td><td>${session.result.answeredCount}/${session.result.totalQuestions} (${completionRate}%)</td></tr>
        <tr><td>Total Time</td><td>${session.result.totalTime}</td></tr>
        <tr><td>Status</td><td>${session.status}</td></tr>
      </table>
    `;

    html += `<h2>Detailed Breakdown</h2>`;

    session.result.questions?.forEach((q, idx) => {
      const evaluation = q.evaluation;
      const qScore = evaluation?.score || 0;
      const qScoreClass = qScore >= 7 ? 'score-high' : qScore >= 5 ? 'score-medium' : 'score-low';

      html += `
        <h3>Question ${idx + 1}</h3>
        <div class="answer-box">
          <strong>Question:</strong><br>
          ${q.question.replace(/\n/g, '<br>')}
        </div>
        
        <div class="answer-box">
          <strong>Candidate's Answer:</strong><br>
          ${q.answer?.trim() ? q.answer.replace(/\n/g, '<br>') : '<em>No answer provided</em>'}
        </div>
      `;

      if (evaluation) {
        html += `
          <div class="score-box ${qScoreClass}">Score: ${qScore}/10</div>
          <div class="feedback-box">
            <strong>Feedback:</strong><br>
            ${evaluation.feedback.replace(/\n/g, '<br>')}
          </div>
        `;

        if (evaluation.suggestions) {
          html += `
            <div class="feedback-box">
              <strong>Suggestions:</strong><br>
              ${evaluation.suggestions.replace(/\n/g, '<br>')}
            </div>
          `;
        }

        if (evaluation.correctAnswer) {
          html += `
            <div class="feedback-box">
              <strong>Reference Answer:</strong><br>
              ${evaluation.correctAnswer.replace(/\n/g, '<br>')}
            </div>
          `;
        }
      }

      html += `<div class="question-separator"></div>`;
    });
  }

  html += `
    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #6b7280;">
      Exported on ${new Date().toLocaleString()} | Format: PDF
    </div>
  `;

  printDiv.innerHTML = html;
  document.body.appendChild(printDiv);

  // Trigger print dialog
  const originalTitle = document.title;
  document.title = `Interview Report - ${session.candidateName}`;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
      <head>
        <title>${document.title}</title>
      </head>
      <body>
        ${html}
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();

  document.title = originalTitle;
  document.body.removeChild(printDiv);
};

export const exportToPowerBI = (session) => {
  // PowerBI-friendly format - structured data optimized for import
  const techStackNames = getTechStackNames(session.techStack);
  
  const powerBIData = {
    interview_metadata: [{
      interview_id: session.id,
      candidate_name: session.candidateName,
      candidate_email: session.candidateEmail,
      tech_stack: techStackNames,
      difficulty: session.difficulty,
      question_count: session.questionCount,
      time_limit_minutes: session.timeLimit,
      created_at: session.createdAt,
      completed_at: session.completedAt || null,
      status: session.status,
      total_time_taken: session.result?.totalTime || null,
      total_time_seconds: session.result?.interviewTimeSeconds || 0,
      average_score: parseFloat(session.result?.averageScore || 0),
      questions_answered: session.result?.answeredCount || 0,
      questions_total: session.result?.totalQuestions || 0,
      completion_rate: session.result?.totalQuestions 
        ? parseFloat(((session.result.answeredCount / session.result.totalQuestions) * 100).toFixed(2))
        : 0,
      exported_at: new Date().toISOString()
    }],
    
    questions_detail: session.result?.questions?.map((q, idx) => ({
      interview_id: session.id,
      question_number: idx + 1,
      question_text: q.question,
      answer_text: q.answer || '',
      was_answered: !!q.answer?.trim(),
      answer_length: (q.answer || '').length,
      score: q.evaluation?.score || 0,
      feedback: q.evaluation?.feedback || '',
      suggestions: q.evaluation?.suggestions || '',
      has_suggestions: !!q.evaluation?.suggestions,
      has_correct_answer: !!q.evaluation?.correctAnswer
    })) || [],
    
    tech_stack_breakdown: session.techStack.map(stackId => {
      const stackQuestions = session.result?.questions?.filter((q, idx) => 
        session.questions[idx]?.techStack === stackId
      ) || [];
      
      const scores = stackQuestions.map(q => q.evaluation?.score || 0);
      const avgScore = scores.length > 0 
        ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
        : 0;
      
      return {
        interview_id: session.id,
        tech_stack_id: stackId,
        tech_stack_name: TECH_STACK_NAMES[stackId] || stackId,
        questions_count: stackQuestions.length,
        average_score: parseFloat(avgScore),
        total_score: scores.reduce((a, b) => a + b, 0)
      };
    }),
    
    score_distribution: (() => {
      const distribution = { excellent: 0, good: 0, average: 0, poor: 0, unanswered: 0 };
      
      session.result?.questions?.forEach(q => {
        if (!q.answer?.trim()) {
          distribution.unanswered++;
        } else if (!q.evaluation) {
          distribution.unanswered++;
        } else if (q.evaluation.score >= 8) {
          distribution.excellent++;
        } else if (q.evaluation.score >= 6) {
          distribution.good++;
        } else if (q.evaluation.score >= 4) {
          distribution.average++;
        } else {
          distribution.poor++;
        }
      });
      
      return Object.entries(distribution).map(([category, count]) => ({
        interview_id: session.id,
        score_category: category,
        question_count: count,
        percentage: session.result?.totalQuestions 
          ? parseFloat(((count / session.result.totalQuestions) * 100).toFixed(2))
          : 0
      }));
    })()
  };

  // Create a comprehensive JSON optimized for PowerBI
  const blob = new Blob([JSON.stringify(powerBIData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `interview-powerbi-${session.candidateName.replace(/\s+/g, '-')}-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const exportFormats = [
  { 
    id: 'json', 
    name: 'JSON', 
    description: 'Raw data format for developers',
    icon: 'pi-code',
    color: 'blue'
  },
  { 
    id: 'md', 
    name: 'Markdown', 
    description: 'Readable format for documentation',
    icon: 'pi-file-edit',
    color: 'purple'
  },
  { 
    id: 'pdf', 
    name: 'PDF', 
    description: 'Print-ready formatted report',
    icon: 'pi-file-pdf',
    color: 'red'
  },
  { 
    id: 'powerbi', 
    name: 'PowerBI', 
    description: 'Structured data for PowerBI analysis',
    icon: 'pi-chart-bar',
    color: 'yellow'
  }
];

export const handleExport = (format, session) => {
  switch (format) {
    case 'json':
      exportToJSON(session);
      break;
    case 'md':
      exportToMarkdown(session);
      break;
    case 'pdf':
      exportToPDF(session);
      break;
    case 'powerbi':
      exportToPowerBI(session);
      break;
    default:
      console.error('Unknown export format:', format);
  }
};