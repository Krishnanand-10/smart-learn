import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request) {
  try {
    const { prompt, questionCount } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Default to a generous amount of cards if not provided, just in case
    const countText = questionCount ? `exactly ${questionCount}` : `a high-yield, comprehensive set of`;

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
          parts: [{ text: `You are a highly intelligent study assistant. Your main task is to create ${countText} concise flashcards based on the user's input. Output ONLY a valid JSON object with a single key "flashcards" containing an array of objects. Each object must have a "question" string and an "answer" string. For example: { "flashcards": [{"question": "...", "answer": "..."}] }` }]
        },
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
          maxOutputTokens: 2048,
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

    // Auto-save to Supabase if user is logged in
    let savedId = null;
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      try {
        const newFlashcardSet = await prisma.flashcardSet.create({
          data: {
            userId: session.user.id,
            title: `Flashcards on ${new Date().toLocaleDateString()}`,
            prompt: prompt ? prompt.substring(0, 500) : '',
            cardsJson: JSON.stringify(parsed),
          },
        });
        savedId = newFlashcardSet.id;
      } catch (saveErr) {
        console.error('Failed to auto-save generated flashcard set:', saveErr);
      }
    }

    return NextResponse.json({ cards: parsed, id: savedId });
  } catch (err) {
    console.error('Flashcards Route Error:', err.message);
    return NextResponse.json({ error: err.message || 'Failed to generate flashcards' }, { status: 500 });
  }
}
