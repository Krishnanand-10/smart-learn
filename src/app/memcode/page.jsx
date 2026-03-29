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
    if (!inputText) return;
    setIsGenerating(true);
    setTimeout(() => {
      // Mock generated mnemonic based on typical long answers
      setMemCode({
        acronym: "M-O-C-K",
        points: [
          { letter: "M", text: "Main point extracted from your text" },
          { letter: "O", text: "Other supporting details" },
          { letter: "C", text: "Core concepts to remember" },
          { letter: "K", text: "Key takeaways for the exam" }
        ]
      });
      setIsGenerating(false);
    }, 1500);
  };

  const handleGenerateImage = () => {
    setIsImageGenerating(true);
    setTimeout(() => {
      // Mock generated image URL (Using a placeholder for premium feel)
      setGeneratedImage("https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800&h=400");
      setIsImageGenerating(false);
    }, 2000);
  };

  return (
    <main className="main-content">
      <header style={{ marginBottom: '2rem' }}>
        <h1>MemCode Generator ⭐</h1>
        <p style={{ color: 'var(--text-main)' }}>Turn long answers into memorable shortcuts and visual mind maps.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
        {/* Input Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Lightbulb size={20} color="var(--accent-color)" /> Source Text
          </h3>
          <textarea 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste a long paragraph, definition, or answer here to generate a mnemonic..."
            style={{ flex: 1, minHeight: '200px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'white', padding: '1rem', borderRadius: 'var(--radius)', resize: 'none', marginBottom: '1.5rem', fontFamily: 'inherit' }}
          />
          <button className="btn-primary" onClick={handleGenerate} disabled={isGenerating || !inputText} style={{ justifyContent: 'center' }}>
            {isGenerating ? 'Analyzing Key Points...' : 'Generate MemCode'}
          </button>
        </div>

        {/* Output Panel */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem' }}>Generated MemCode</h3>
          
          {!memCode && !isGenerating && (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-main)', opacity: 0.5 }}>
              Enter text and generate to see your MemCode
            </div>
          )}

          {memCode && (
            <div style={{ animation: 'glow 1s ease-out' }}>
              <div style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', letterSpacing: '8px', color: 'var(--accent-color)', marginBottom: '2rem', textShadow: '0 0 20px rgba(102, 252, 241, 0.4)' }}>
                {memCode.acronym}
              </div>
              
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                {memCode.points.map((point, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                    <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold', fontSize: '1.25rem' }}>{point.letter}</span>
                    <span style={{ lineHeight: '1.4' }}>{point.text}</span>
                  </li>
                ))}
              </ul>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn-primary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--accent-secondary)' }}>
                  <Save size={18} /> Save to Collection
                </button>
                <button className="btn-primary" style={{ flex: 1, background: 'transparent', border: '1px solid var(--text-main)', color: 'var(--text-main)' }} onClick={handleGenerate}>
                  <RefreshCw size={18} /> Regenerate
                </button>
              </div>

              <div style={{ marginTop: '2rem', borderTop: '1px dashed var(--border-color)', paddingTop: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Visual Associations</h4>
                {generatedImage ? (
                  <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={generatedImage} alt="Visual mnemonic" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  </div>
                ) : (
                  <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleGenerateImage} disabled={isImageGenerating}>
                    <ImageIcon size={18} /> {isImageGenerating ? 'Creating AI Image...' : 'Generate Image for Topic'}
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
