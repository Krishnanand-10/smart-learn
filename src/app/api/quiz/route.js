import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { callGemini } from '@/lib/gemini';

export async function POST(request) {
  try {
    const { prompt, questionCount = 5 } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const { data } = await callGemini({
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
    });

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

    // Auto-save to Supabase if user is logged in
    let savedId = null;
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      try {
        const newQuiz = await prisma.quiz.create({
          data: {
            userId: session.user.id,
            title: `Quiz on ${new Date().toLocaleDateString()}`,
            prompt: prompt ? prompt.substring(0, 500) : '',
            questionsJson: JSON.stringify(parsed),
          },
        });
        savedId = newQuiz.id;
      } catch (saveErr) {
        console.error('Failed to auto-save generated quiz:', saveErr);
      }
    }

    return NextResponse.json({ data: parsed, id: savedId });
  } catch (err) {
    console.error('Quiz API Error:', err);
    return NextResponse.json({ error: err.message || 'Failed to generate quiz' }, { status: err.status || 500 });
  }
}

