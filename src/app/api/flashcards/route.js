import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt, questionCount } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Default to a generous amount of cards if not provided, just in case
    const countText = questionCount ? `exactly ${questionCount}` : `a high-yield, comprehensive set of`;

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are a highly intelligent study assistant. Your main task is to create ${countText} concise flashcards based on the user's input. Output ONLY a valid JSON object with a single key "flashcards" containing an array of objects. Each object must have a "question" string and an "answer" string. For example: { "flashcards": [{"question": "...", "answer": "..."}] }`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2048,
        response_format: { type: "json_object" } // Or we can rely on standard prompt, but this needs specific JSON. wait, `response_format` requires `"json_object"` and prompt must contain "JSON". Since we ask for array, `json_object` requires an object `{ "flashcards": [...] }`.
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data?.error?.message || 'OpenAI error' }, { status: res.status });
    }

    const raw = data?.choices?.[0]?.message?.content || '';
    const cleaned = raw.replace(/```(?:json)?|```/g, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
      // Fallback extraction in case OpenAI uses capitalized keys or different wrappers
      if (!Array.isArray(parsed)) {
        parsed = parsed.flashcards || parsed.Flashcards || parsed.cards || parsed.Cards || Object.values(parsed)[0];
      }
    } catch (e) {
      throw new Error('Failed to parse JSON response: ' + raw);
    }

    if (!Array.isArray(parsed)) {
      throw new Error('AI returned an unexpected object structure: ' + raw);
    }

    return NextResponse.json({ cards: parsed });
  } catch (err) {
    console.error('Flashcards Route Error:', err.message);
    return NextResponse.json({ error: err.message || 'Failed to generate flashcards' }, { status: 500 });
  }
}
