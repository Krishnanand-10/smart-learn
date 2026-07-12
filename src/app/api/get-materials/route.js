import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch all materials from the database
    const [quizzes, summaries, flashcards] = await Promise.all([
      prisma.quiz.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.summary.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.flashcardSet.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    // Parse JSON string columns back to Javascript arrays for frontend convenience
    const parsedQuizzes = quizzes.map(item => {
      const { questionsJson, ...rest } = item;
      return {
        ...rest,
        questions: JSON.parse(questionsJson || '[]'),
      };
    });

    const parsedSummaries = summaries.map(item => {
      const { keyPointsJson, ...rest } = item;
      return {
        ...rest,
        keyPoints: JSON.parse(keyPointsJson || '[]'),
      };
    });

    const parsedFlashcards = flashcards.map(item => {
      const { cardsJson, ...rest } = item;
      return {
        ...rest,
        cards: JSON.parse(cardsJson || '[]'),
      };
    });

    return NextResponse.json({
      quizzes: parsedQuizzes,
      summaries: parsedSummaries,
      flashcards: parsedFlashcards,
    });

  } catch (err) {
    console.error('Get Materials API Error:', err);
    return NextResponse.json({ error: 'Internal server error while fetching materials.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
