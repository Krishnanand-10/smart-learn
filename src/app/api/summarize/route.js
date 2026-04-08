import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

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
            content: `You are an expert academic summarizer. Your task is to analyze the user's input and provide a deeply synthesized summary. Output ONLY a valid JSON object with the following exact keys: "title" (a catchy title for the summary), "executiveSummary" (a concise 1-2 paragraph overview), "keyPoints" (an array of exactly 3-5 crucial bullet points summarizing core concepts), and "conclusion" (a single concluding sentence or takeaway). For example: { "title": "Biology 101", "executiveSummary": "...", "keyPoints": ["Point 1", "Point 2"], "conclusion": "..." }`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
        max_tokens: 2000,
        response_format: { type: "json_object" }
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
    } catch (e) {
      throw new Error('Failed to parse JSON response: ' + raw);
    }

    if (!parsed.title || !parsed.executiveSummary || !parsed.keyPoints) {
      throw new Error('Invalid format returned by AI: missing required structure.');
    }

    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error('Summarize API Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate summary' }, { status: 500 });
  }
}
