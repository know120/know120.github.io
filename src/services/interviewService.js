const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const techStackPrompts = {
  javascript: 'JavaScript fundamentals, ES6+, async/await, closures, prototypes, event loop',
  typescript: 'TypeScript types, interfaces, generics, decorators, type inference, utility types',
  react: 'React hooks, components, state management, lifecycle, virtual DOM, performance optimization',
  vue: 'Vue.js composition API, reactivity, components, directives, Vuex/Pinia',
  angular: 'Angular components, services, dependency injection, RxJS, NgModules',
  node: 'Node.js event loop, streams, Express, async programming, npm, error handling',
  python: 'Python data structures, OOP, decorators, generators, list comprehensions, async/await',
  java: 'Java OOP, collections, multithreading, JVM, Spring Boot, design patterns',
  go: 'Go routines, channels, interfaces, error handling, concurrency patterns',
  rust: 'Rust ownership, borrowing, lifetimes, traits, memory safety, cargo',
  sql: 'SQL queries, joins, indexes, normalization, transactions, database design',
  'system-design': 'System design principles, scalability, microservices, caching, load balancing, databases',
  devops: 'CI/CD, Docker, Kubernetes, Jenkins, Git, monitoring, infrastructure as code',
  aws: 'AWS services (EC2, S3, Lambda, RDS, etc.), cloud architecture, serverless'
};

const difficultySettings = {
  beginner: { complexity: 'basic concepts and fundamental knowledge', timeLimit: 5 },
  intermediate: { complexity: 'practical scenarios and common patterns', timeLimit: 7 },
  advanced: { complexity: 'complex scenarios, edge cases, and optimization', timeLimit: 10 },
  expert: { complexity: 'architecture decisions, trade-offs, and advanced optimization', timeLimit: 15 }
};

export const generateInterviewQuestions = async ({ techStack, questionCount, difficulty, apiKey }) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const stackDescriptions = techStack.map(stack => techStackPrompts[stack]).join('; ');
  const difficultyConfig = difficultySettings[difficulty];

  const prompt = `Generate ${questionCount} technical interview questions for the following tech stacks: ${stackDescriptions}.

Difficulty level: ${difficulty} - focus on ${difficultyConfig.complexity}

Requirements:
1. Each question should be clear and specific
2. Include a mix of theoretical and practical questions
3. For coding questions, include relevant code snippets
4. Questions should test both knowledge and problem-solving skills
5. Assign appropriate time limits based on complexity

Format the response as a JSON array with this structure:
[
  {
    "techStack": "one of: ${techStack.join(', ')}",
    "question": "the question text",
    "code": "optional code snippet if applicable (null if not needed)",
    "difficulty": "${difficulty}",
    "timeLimit": ${difficultyConfig.timeLimit},
    "type": "theoretical|coding|scenario"
  }
]

Important: Return ONLY the JSON array, no markdown formatting, no explanation text.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 8192,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400 && errorData.error?.message?.includes('API key')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      }
      throw new Error(errorData.error?.message || 'Failed to generate questions');
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const text = data.candidates[0].content.parts[0].text;

    // Try to extract JSON from the response
    let jsonStr = text;

    // Remove markdown code blocks if present
    if (text.includes('```json')) {
      jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.includes('```')) {
      jsonStr = text.replace(/```\n?/g, '');
    }

    // Trim whitespace
    jsonStr = jsonStr.trim();

    try {
      const questions = JSON.parse(jsonStr);

      // Validate and ensure proper structure
      if (!Array.isArray(questions)) {
        throw new Error('Response is not an array');
      }

      return questions.map((q, idx) => ({
        techStack: q.techStack || techStack[idx % techStack.length],
        question: q.question || 'Question generation failed',
        code: q.code || null,
        difficulty: q.difficulty || difficulty,
        timeLimit: q.timeLimit || difficultyConfig.timeLimit,
        type: q.type || 'theoretical'
      }));
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', text);

      // Fallback: create basic questions if parsing fails
      return createFallbackQuestions(techStack, questionCount, difficulty, difficultyConfig);
    }
  } catch (error) {
    console.error('Error generating questions:', error);

    // If API fails, create fallback questions
    if (error.message.includes('API key') || error.message.includes('quota')) {
      throw error;
    }

    return createFallbackQuestions(techStack, questionCount, difficulty, difficultyConfig);
  }
};

const createFallbackQuestions = (techStack, count, difficulty, difficultyConfig) => {
  const questions = [];
  const baseQuestions = {
    javascript: [
      'Explain the difference between let, const, and var in JavaScript.',
      'What is the event loop in JavaScript and how does it work?',
      'Explain closures in JavaScript with an example.',
      'What are Promises and how do they differ from async/await?',
      'Explain prototype inheritance in JavaScript.'
    ],
    typescript: [
      'What is the difference between interface and type in TypeScript?',
      'Explain generics in TypeScript with an example.',
      'What are decorators in TypeScript?',
      'Explain TypeScript utility types like Partial, Required, and Pick.',
      'What is type inference in TypeScript?'
    ],
    react: [
      'Explain React hooks and give examples of commonly used hooks.',
      'What is the Virtual DOM and how does it work?',
      'Explain the component lifecycle in React.',
      'What is the difference between useEffect and useLayoutEffect?',
      'How do you optimize React application performance?'
    ],
    node: [
      'Explain the Node.js event loop.',
      'What are streams in Node.js?',
      'How does Node.js handle asynchronous operations?',
      'Explain middleware in Express.js.',
      'What is the difference between process.nextTick() and setImmediate()?'
    ],
    sql: [
      'Explain the different types of SQL joins.',
      'What are database indexes and why are they important?',
      'Explain database normalization.',
      'What is the difference between WHERE and HAVING clauses?',
      'Explain ACID properties in databases.'
    ],
    'system-design': [
      'Design a URL shortening service.',
      'How would you design a distributed cache?',
      'Explain load balancing strategies.',
      'Design a rate limiting system.',
      'How would you handle database sharding?'
    ]
  };

  for (let i = 0; i < count; i++) {
    const stack = techStack[i % techStack.length];
    const stackQuestions = baseQuestions[stack] || baseQuestions.javascript;
    const question = stackQuestions[i % stackQuestions.length];

    questions.push({
      techStack: stack,
      question: `[${difficulty.toUpperCase()}] ${question}`,
      code: null,
      difficulty: difficulty,
      timeLimit: difficultyConfig.timeLimit,
      type: 'theoretical'
    });
  }

  return questions;
};

export const evaluateAnswer = async ({ question, answer, apiKey }) => {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  if (!answer || answer.trim().length === 0) {
    return {
      score: 0,
      feedback: 'No answer was provided for this question.',
      suggestions: 'Please provide an answer to receive feedback.',
      correctAnswer: null
    };
  }

  const prompt = `Evaluate the following technical interview answer:

Question: ${question.question}
${question.code ? `Code Context:\n${question.code}\n` : ''}
Candidate's Answer: ${answer}

Tech Stack: ${techStackPrompts[question.techStack] || question.techStack}
Difficulty Level: ${question.difficulty}

Please evaluate the answer and provide:
1. A score from 0-10 (where 10 is perfect)
2. Constructive feedback on the answer
3. Specific suggestions for improvement
4. A brief correct/reference answer for comparison

Format your response as JSON with this exact structure:
{
  "score": number (0-10),
  "feedback": "detailed feedback text",
  "suggestions": "specific improvement suggestions",
  "correctAnswer": "brief correct/reference answer"
}

Important: Return ONLY the JSON object, no markdown formatting, no explanation text before or after.`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to evaluate answer');
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error('Invalid response from Gemini API');
    }

    const text = data.candidates[0].content.parts[0].text;

    // Try to extract JSON from the response
    let jsonStr = text;

    // Remove markdown code blocks if present
    if (text.includes('```json')) {
      jsonStr = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.includes('```')) {
      jsonStr = text.replace(/```\n?/g, '');
    }

    // Trim whitespace
    jsonStr = jsonStr.trim();

    try {
      const evaluation = JSON.parse(jsonStr);

      // Validate and ensure proper structure
      return {
        score: Math.max(0, Math.min(10, parseFloat(evaluation.score) || 0)),
        feedback: evaluation.feedback || 'No feedback provided',
        suggestions: evaluation.suggestions || 'No suggestions provided',
        correctAnswer: evaluation.correctAnswer || null
      };
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response text:', text);

      // Fallback evaluation
      return createFallbackEvaluation(answer);
    }
  } catch (error) {
    console.error('Error evaluating answer:', error);
    return createFallbackEvaluation(answer);
  }
};

const createFallbackEvaluation = (answer) => {
  const answerLength = answer.trim().length;

  if (answerLength < 50) {
    return {
      score: 3,
      feedback: 'The answer is quite brief. While brevity can be good, this response may be missing important details or explanations.',
      suggestions: 'Try to expand your answer with more specific details, examples, or explanations of the underlying concepts.',
      correctAnswer: 'A more detailed answer would include specific technical details and explanations.'
    };
  } else if (answerLength < 200) {
    return {
      score: 6,
      feedback: 'The answer covers the basics but could benefit from more depth and technical detail.',
      suggestions: 'Consider adding specific examples, edge cases, or explaining the "why" behind your answer.',
      correctAnswer: 'A comprehensive answer would include technical details and practical considerations.'
    };
  } else {
    return {
      score: 8,
      feedback: 'Good answer with solid detail and explanation. The response shows understanding of the topic.',
      suggestions: 'To make it excellent, consider adding real-world examples or discussing trade-offs and alternatives.',
      correctAnswer: null
    };
  }
};