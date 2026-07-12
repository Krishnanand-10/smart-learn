import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const { type, payload } = await request.json();

    if (!type || !payload) {
      return NextResponse.json({ error: 'Type and payload are required.' }, { status: 400 });
    }

    const userId = session.user.id;

    if (type === 'quiz') {
      const { title, prompt, questions } = payload;
      if (!Array.isArray(questions)) {
        return NextResponse.json({ error: 'Invalid payload structure for quiz.' }, { status: 400 });
      }
      
      const newQuiz = await prisma.quiz.create({
        data: {
          userId,
          title: title || 'Generated Quiz',
          prompt: prompt || '',
          questionsJson: JSON.stringify(questions),
        },
      });
      return NextResponse.json({ success: true, id: newQuiz.id });
    } 

    if (type === 'summary') {
      const { title, prompt, executiveSummary, keyPoints, conclusion } = payload;
      if (!executiveSummary || !Array.isArray(keyPoints)) {
        return NextResponse.json({ error: 'Invalid payload structure for summary.' }, { status: 400 });
      }

      const newSummary = await prisma.summary.create({
        data: {
          userId,
          title: title || 'Generated Summary',
          prompt: prompt || '',
          executiveSummary,
          keyPointsJson: JSON.stringify(keyPoints),
          conclusion: conclusion || '',
        },
      });
      return NextResponse.json({ success: true, id: newSummary.id });
    }

    if (type === 'flashcards') {
      const { title, prompt, cards } = payload;
      if (!Array.isArray(cards)) {
        return NextResponse.json({ error: 'Invalid payload structure for flashcards.' }, { status: 400 });
      }

      const newFlashcardSet = await prisma.flashcardSet.create({
        data: {
          userId,
          title: title || 'Generated Flashcards',
          prompt: prompt || '',
          cardsJson: JSON.stringify(cards),
        },
      });
      return NextResponse.json({ success: true, id: newFlashcardSet.id });
    }

    return NextResponse.json({ error: `Unsupported material type: ${type}` }, { status: 400 });

  } catch (err) {
    console.error('Save Material API Error:', err);
    return NextResponse.json({ error: 'Internal server error while saving.' }, { status: 500 });
  }
}
