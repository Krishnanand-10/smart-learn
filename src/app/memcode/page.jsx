'use client';

import { useState } from 'react';
import { Lightbulb, Save, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

export default function MemCode() {
  const searchParams = useSearchParams();
  const initialText = searchParams?.get('text') || '';
  
  const [inputText, setInputText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(false);
  const [memCode, setMemCode] = useState(null);
  const [isImageGenerating, setIsImageGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);

  const handleGenerate = () => {
    if (!inputText.trim()) return;
    setIsGenerating(true);
    
    setTimeout(() => {
      // 1. ADVANCED DYNAMIC ALGORITHM
      const stopWords = ['the','is','at','which','and','on','it','of','to','in','a','that','this','for','with','as','by','an','be','are','was','were','what','when','where','how','why','who','from','your','have','has'];
      
      // Extract pseudo-sentences
      const sentences = inputText.match(/[^\.!\?]+[\.!\?]+/g) || [inputText];
      
      // Clean and extract meaningful words
      const words = inputText.replace(/[^\w\s-]/gi, ' ').toLowerCase().split(/\s+/).filter(w => w.length > 3 && !stopWords.includes(w));
      const uniqueWords = [...new Set(words)];
      const selectedWords = uniqueWords.slice(0, Math.min(uniqueWords.length, 5));
      
      if (selectedWords.length === 0) {
        setMemCode({
          acronym: "F-A-I-L",
          points: [
            { letter: "F", text: "Found no complex words" },
            { letter: "A", text: "Add more detailed definitions" },
            { letter: "I", text: "Input needs substantive terms" },
            { letter: "L", text: "Length of text is too short" }
          ],
          primaryKeyword: 'learning'
        });
      } else {
        const acronym = selectedWords.map(w => w[0].toUpperCase()).join('-');
        const points = selectedWords.map(word => {
          // Find the context sentence from the user's input
          const sentenceMatch = sentences.find(s => s.toLowerCase().includes(word));
          let explanation = sentenceMatch ? sentenceMatch.trim() : `Critical definition regarding "${word}".`;
          if (explanation.length > 100) explanation = explanation.substring(0, 100) + '...';
          
          return {
            letter: word[0].toUpperCase(),
            text: `${word.toUpperCase()}: ${explanation}`
          };
        });

        setMemCode({
          acronym: acronym,
          points: points,
          primaryKeyword: selectedWords[0]
        });
      }

      setIsGenerating(false);
    }, 800); // Faster generation
  };

  const handleGenerateImage = () => {
    setIsImageGenerating(true);
    const keyword = memCode?.primaryKeyword || inputText.split(' ').find(w => w.length > 4) || 'education';
    const prompt = `Educational concept art of ${keyword}, minimalist illustration, white background, clean infographic style, digital art`;
    const finalUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=400&nologo=true&seed=${Date.now()}`;

    // Don't wait for onload — just set the URL directly and let the <img> tag handle loading
    // Show a shimmer loading state via CSS while the image loads natively
    setGeneratedImage(finalUrl);
    setIsImageGenerating(false);
  };

  return (
    <main className="main-content">
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>MemCode Generator ⭐</h1>
        <p style={{ color: 'var(--text-main)' }}>Turn long answers into memorable shortcuts and visual mind maps.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Input Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={20} color="var(--accent-color)" /> Source Text
          </h3>
          <textarea 
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              // Clear previous generation on new input
              if(memCode) setMemCode(null);
              if(generatedImage) setGeneratedImage(null);
            }}
            placeholder="Paste a paragraph, definition, or answer here..."
            style={{ width: '100%', minHeight: '150px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'white', padding: '1rem', borderRadius: 'var(--radius)', resize: 'none', marginBottom: '1.5rem', fontFamily: 'inherit' }}
          />
          <button className="btn-primary" onClick={handleGenerate} disabled={isGenerating || !inputText} style={{ justifyContent: 'center' }}>
            {isGenerating ? 'Analyzing Key Points...' : 'Generate MemCode'}
          </button>
        </div>

        {/* Output Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Generated MemCode</h3>
          
          {!memCode && !isGenerating && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', opacity: 0.5, minHeight: '150px' }}>
              Enter text and generate to see your MemCode
            </div>
          )}

          {memCode && (
            <div style={{ animation: 'glow 1s ease-out' }}>
              <div style={{ textAlign: 'center', fontSize: '2.5rem', fontWeight: 'bold', letterSpacing: '6px', color: 'var(--accent-color)', marginBottom: '1rem', textShadow: '0 0 15px rgba(102, 252, 241, 0.4)' }}>
                {memCode.acronym}
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {memCode.points.map((point, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: 'rgba(0,0,0,0.2)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', fontSize: '1.1rem' }}>{point.letter}</span>
                    <span style={{ lineHeight: '1.3' }}>{point.text}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--accent-secondary)' }}>
                  <Save size={16} /> Save
                </button>
                <button className="btn-primary" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', background: 'transparent', border: '1px solid var(--text-main)', color: 'var(--text-main)' }} onClick={handleGenerate}>
                  <RefreshCw size={16} /> Regenerate
                </button>
              </div>

              <div style={{ marginTop: '1.5rem', borderTop: '1px dashed var(--border-color)', paddingTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem' }}>Visual Associations</h4>
                {generatedImage ? (
                  <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border-color)', height: '220px', background: 'rgba(0,0,0,0.2)', position: 'relative' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={generatedImage} 
                      alt="Visual mnemonic" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div style={{ display: 'none', position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-main)' }}>
                      <ImageIcon size={32} style={{ opacity: 0.4 }} />
                      <span style={{ fontSize: '0.85rem', opacity: 0.6 }}>Generating... this may take 30s (AI is working)</span>
                      <button onClick={handleGenerateImage} className="btn-primary" style={{ marginTop: '0.5rem', fontSize: '0.8rem', padding: '0.4rem 1rem' }}>Retry</button>
                    </div>
                  </div>
                ) : (
                  <button className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.9rem', justifyContent: 'center' }} onClick={handleGenerateImage} disabled={isImageGenerating}>
                    <ImageIcon size={16} /> {isImageGenerating ? 'Requesting AI image...' : 'Generate Visual for Topic'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
