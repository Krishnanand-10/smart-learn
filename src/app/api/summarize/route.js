import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request) {
  try {
    const { prompt } = await request.json();

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
          parts: [{ text: `You are an expert academic summarizer. Your task is to analyze the user's input and provide a deeply synthesized summary. Output ONLY a valid JSON object with the following exact keys: "title" (a catchy title for the summary), "executiveSummary" (a concise 1-2 paragraph overview), "keyPoints" (an array of exactly 3-5 crucial bullet points summarizing core concepts), and "conclusion" (a single concluding sentence or takeaway). For example: { "title": "Biology 101", "executiveSummary": "...", "keyPoints": ["Point 1", "Point 2"], "conclusion": "..." }` }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.5,
          maxOutputTokens: 2000,
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
    } catch (e) {
      throw new Error('Failed to parse JSON response: ' + raw);
    }

    if (!parsed.title || !parsed.executiveSummary || !parsed.keyPoints) {
      throw new Error('Invalid format returned by AI: missing required structure.');
    }

    // Auto-save to Supabase if user is logged in
    let savedId = null;
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      try {
        const newSummary = await prisma.summary.create({
          data: {
            userId: session.user.id,
            title: parsed.title || 'Generated Summary',
            prompt: prompt ? prompt.substring(0, 500) : '',
            executiveSummary: parsed.executiveSummary || '',
            keyPointsJson: JSON.stringify(parsed.keyPoints || []),
            conclusion: parsed.conclusion || '',
          },
        });
        savedId = newSummary.id;
      } catch (saveErr) {
        console.error('Failed to auto-save generated summary:', saveErr);
      }
    }

    return NextResponse.json({ data: parsed, id: savedId });
  } catch (err) {
    console.error('Summarize API Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate summary' }, { status: 500 });
  }
}
