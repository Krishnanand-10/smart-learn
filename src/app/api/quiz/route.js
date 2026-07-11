import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, questionCount = 5 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        systemInstruction: {
          parts: [{ text: `You are an expert AI professor. Your task is to generate a high-quality multiple choice quiz based on the user's input. The user requested ${questionCount} questions. Output ONLY a valid JSON object with a single key "quiz" containing an array of exactly ${questionCount} objects. Each object must have a "question" string, an "options" array of exactly 4 strings, a "correctAnswer" string (which must exactly match one of the options), and an "explanation" string. For example: { "quiz": [{"question": "What is 2+2?", "options": ["3", "4", "5", "6"], "correctAnswer": "4", "explanation": "2+2 equals 4 based on basic arithmetic."}] }` }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 3000,
        }
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message || 'Gemini error' }, { status: res.status });
    }

    const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const cleaned = raw.replace(/```(?:json)?|```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) {
        parsed = parsed.quiz || parsed.Quiz || parsed.questions || parsed.Questions || Object.values(parsed)[0];
      }
    } catch (e) {
      throw new Error('Failed to parse JSON response: ' + raw);
    }

    if (!Array.isArray(parsed)) throw new Error('Invalid format returned by AI: ' + raw);

    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error('Quiz API Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate quiz' }, { status: 500 });
  }
}

