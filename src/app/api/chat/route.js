import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { callGemini } from '@/lib/gemini';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    const userId = session.user.id;
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Valid messages array is required' }, { status: 400 });
    }

    // Save the new user message to the database
    const lastUserMsg = messages[messages.length - 1];
    if (lastUserMsg && lastUserMsg.role === 'user') {
      await prisma.chatMessage.create({
        data: {
          userId,
          role: 'user',
          text: lastUserMsg.content,
        },
      });
    }

    const systemMessage = messages.find(m => m.role === 'system');
    const systemInstruction = systemMessage ? {
      parts: [{ text: systemMessage.content }]
    } : undefined;

    const chatContents = [];
    messages.forEach(msg => {
      if (msg.role === 'system') return;
      const role = msg.role === 'assistant' ? 'model' : 'user';
      
      // Handle consecutive roles if any to ensure alternating structure
      if (chatContents.length > 0 && chatContents[chatContents.length - 1].role === role) {
        chatContents[chatContents.length - 1].parts[0].text += '\n' + msg.content;
      } else {
        chatContents.push({
          role: role,
          parts: [{ text: msg.content }]
        });
      }
    });

    // Gemini conversation must start with 'user'
    if (chatContents.length > 0 && chatContents[0].role === 'model') {
      chatContents.unshift({ role: 'user', parts: [{ text: 'Hello' }] });
    }

    const { data } = await callGemini({
      contents: chatContents,
      systemInstruction: systemInstruction,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';

    // Save the generated assistant reply to the database
    await prisma.chatMessage.create({
      data: {
        userId,
        role: 'assistant',
        text: reply,
      },
    });

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: err.status || 500 });
  }
}
