// File: netlify/functions/call-gemini.js

exports.handler = async function (event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const { prompt } = JSON.parse(event.body);
  const apiKey = process.env.GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error('API Error:', errorBody);
      return {
        statusCode: response.status,
        body: JSON.stringify(errorBody)
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal error occurred.' })
    };
  }
};