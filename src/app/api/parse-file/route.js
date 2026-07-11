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
      const arrayBuffer = await file.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString('base64');
      
      let mimeType = file.type || '';
      if (!mimeType) {
        if (fileName.endsWith('.mp3')) mimeType = 'audio/mp3';
        else if (fileName.endsWith('.wav')) mimeType = 'audio/wav';
        else if (fileName.endsWith('.m4a')) mimeType = 'audio/m4a';
        else if (fileName.endsWith('.webm')) mimeType = 'audio/webm';
        else if (fileName.endsWith('.mpga')) mimeType = 'audio/mpeg';
        else if (fileName.endsWith('.mp4')) mimeType = 'video/mp4';
        else if (fileName.endsWith('.mpeg')) mimeType = 'video/mpeg';
        else mimeType = isAudio ? 'audio/mpeg' : 'video/mp4';
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                  }
                },
                {
                  text: "Provide a detailed transcription of this audio/video. Output ONLY the transcription text, do not add any introduction or explanations."
                }
              ]
            }
          ]
        })
      });

      const geminiData = await geminiRes.json();

      if (!geminiRes.ok) {
        return NextResponse.json({ error: geminiData?.error?.message || 'Gemini Audio API error' }, { status: geminiRes.status });
      }

      const transcription = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      return NextResponse.json({ text: transcription.trim() });
    }

    return NextResponse.json({ 
      error: `Unsupported file format: "${fileName}". Please upload a text, PDF, audio, or video file.` 
    }, { status: 400 });

  } catch (error) {
    console.error('File parsing API error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error during file parsing' }, { status: 500 });
  }
}
