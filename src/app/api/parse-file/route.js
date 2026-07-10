import { NextResponse } from 'next/server';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('pdf-parse/worker');
const { PDFParse } = require('pdf-parse');

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileName = file.name || 'document';
    const fileType = file.type || '';

    // 1. Handle plain text files (.txt, .md, etc.)
    if (fileName.endsWith('.txt') || fileName.endsWith('.md') || fileType === 'text/plain') {
      const text = await file.text();
      return NextResponse.json({ text });
    }

    // 2. Handle PDF files
    if (fileName.endsWith('.pdf') || fileType === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const parser = new PDFParse({ data: buffer });
      const parsedPdf = await parser.getText();
      return NextResponse.json({ text: parsedPdf.text || '' });
    }

    // 3. Handle Audio & Video files (Whisper API)
    const isAudio = fileType.startsWith('audio/') || 
                    fileName.endsWith('.mp3') || 
                    fileName.endsWith('.wav') || 
                    fileName.endsWith('.m4a') || 
                    fileName.endsWith('.webm') || 
                    fileName.endsWith('.mpga');
    const isVideo = fileType.startsWith('video/') || 
                    fileName.endsWith('.mp4') || 
                    fileName.endsWith('.mpeg');

    if (isAudio || isVideo) {
      const openAiFormData = new FormData();
      openAiFormData.append('file', file, fileName);
      openAiFormData.append('model', 'whisper-1');

      const openAiRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: openAiFormData
      });

      const openAiData = await openAiRes.json();

      if (!openAiRes.ok) {
        return NextResponse.json({ error: openAiData?.error?.message || 'OpenAI Whisper API error' }, { status: openAiRes.status });
      }

      return NextResponse.json({ text: openAiData.text || '' });
    }

    return NextResponse.json({ 
      error: `Unsupported file format: "${fileName}". Please upload a text, PDF, audio, or video file.` 
    }, { status: 400 });

  } catch (error) {
    console.error('File parsing API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error during file parsing' }, { status: 500 });
  }
}
