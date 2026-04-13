const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export const migrateQuery = async ({ oldSchema, newSchema, oldQuery, apiKey, model = 'gemini-2.5-flash' }) => {
  if (!apiKey) throw new Error('API key is required');

  const prompt = `You are an expert Database Administrator and SQL specialist.
  
Task: Transform a SQL query from an old database schema to a new database schema.

Old Schema:
${oldSchema}

New Schema:
${newSchema}

Old Query:
${oldQuery}

Instructions:
1. Analyze the mapping between the old schema and the new schema.
2. Rewrite the old query so that it works perfectly with the new schema.
3. Ensure all table and column names are updated according to the new schema.
4. Maintain the original logic and intent of the query.
5. Provide the transformed SQL query.
6. Provide a brief explanation of the changes made.

Format the response as JSON:
{
  "transformedQuery": "the new SQL query",
  "explanation": "explanation of changes"
}

Return ONLY the JSON object, no markdown formatting.`;

  try {
    const response = await fetch(`${GEMINI_API_URL.replace('gemini-2.5-flash', model)}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 }
      })
    });

    if (!response.ok) throw new Error('Failed to transform query');
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text.replace(/```json\n?|```/g, '').trim());
  } catch (error) {
    console.error('Migration error:', error);
    throw error;
  }
};

export const generateQueryFromSchema = async ({ newSchema, naturalLanguagePrompt, apiKey, model = 'gemini-2.5-flash' }) => {
  if (!apiKey) throw new Error('API key is required');

  const prompt = `You are an expert Database Administrator and SQL specialist.
  
Task: Generate a SQL query based on a provided database schema and a natural language request.

New Schema:
${newSchema}

Request:
${naturalLanguagePrompt}

Instructions:
1. Use the provided schema to identify the correct tables and columns.
2. Write a valid, optimized SQL query that satisfies the request.
3. Ensure the query is accurate and follows SQL best practices.
4. Provide the generated SQL query.
5. Provide a brief explanation of how the query works.

Format the response as JSON:
{
  "generatedQuery": "the SQL query",
  "explanation": "explanation of the query"
}

Return ONLY the JSON object, no markdown formatting.`;

  try {
    const response = await fetch(`${GEMINI_API_URL.replace('gemini-2.5-flash', model)}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 }
      })
    });

    if (!response.ok) throw new Error('Failed to generate query');
    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    return JSON.parse(text.replace(/```json\n?|```/g, '').trim());
  } catch (error) {
    console.error('Generation error:', error);
    throw error;
  }
};
