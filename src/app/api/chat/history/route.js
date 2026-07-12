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

    // Fetch messages sorted chronologically
    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });

    // Map database fields to front-end schema
    const formatted = messages.map(m => ({
      role: m.role,
      text: m.text,
    }));

    return NextResponse.json({ messages: formatted });

  } catch (err) {
    console.error('Fetch Chat History Error:', err);
    return NextResponse.json({ error: 'Internal server error while fetching history.' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const userId = session.user.id;

    // Wipe chat history for this user
    await prisma.chatMessage.deleteMany({
      where: { userId },
    });

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error('Delete Chat History Error:', err);
    return NextResponse.json({ error: 'Internal server error while clearing history.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
