'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, RotateCw, Link, FileText, Loader, Plus } from 'lucide-react';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export default function Flashcards() {
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedContent, setSavedContent] = useState(null);
  const [useUpload, setUseUpload] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('smartLearn_content');
    if (stored) setSavedContent(JSON.parse(stored));
  }, []);

  const generateCards = async () => {
    const source = useUpload && savedContent
      ? (savedContent.type === 'link' ? `the content from this URL: ${savedContent.url}` : `the uploaded file: ${savedContent.name}`)
      : topic.trim();

    if (!source) { setError('Please enter a topic or enable uploaded content.'); return; }

    setLoading(true);
    setError('');
    setCards([]);
    setCurrentIndex(0);
    setFlipped(false);

    const prompt = `Generate exactly 8 flashcards about: ${source}.
Return ONLY a valid JSON array with no markdown, no code fences, no extra text.
Format: [{"front": "Question or term", "back": "Answer or definition"}, ...]`;

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      const res = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 2048
        }),
      });
      const data = await res.json();
      const raw = data?.choices?.[0]?.message?.content || '';
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) throw new Error('Invalid format');
      setCards(parsed);
    } catch (e) {
      setError('Failed to generate flashcards. Try again or check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const prev = () => { setCurrentIndex(i => Math.max(0, i - 1)); setFlipped(false); };
  const next = () => { setCurrentIndex(i => Math.min(cards.length - 1, i + 1)); setFlipped(false); };

  return (
    <main className="main-content">
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>Flashcard Generator</h1>
        <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
          Generate flashcards from your uploaded content or any topic.
        </p>
      </header>

      {/* Generator Panel */}
      <div className="glass-panel" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Upload toggle */}
          {savedContent && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', background: useUpload ? 'rgba(99,102,241,0.06)' : 'transparent' }}>
              <input type="checkbox" id="useUpload" checked={useUpload} onChange={e => setUseUpload(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--accent-color)' }} />
              <label htmlFor="useUpload" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-highlight)' }}>
                {savedContent.type === 'link' ? <Link size={14} /> : <FileText size={14} />}
                Use uploaded content: <strong>{savedContent.type === 'link' ? savedContent.url : savedContent.name}</strong>
              </label>
            </div>
          )}

          {/* Topic input */}
          {!useUpload && (
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-highlight)' }}>Topic</label>
              <input
                type="text"
                value={topic}
                onChange={e => { setTopic(e.target.value); setError(''); }}
                placeholder="e.g. Photosynthesis, World War II, Recursion..."
                style={{ width: '100%' }}
                onKeyDown={e => e.key === 'Enter' && generateCards()}
              />
            </div>
          )}

          {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

          <button className="btn-primary" onClick={generateCards} disabled={loading} style={{ alignSelf: 'flex-start' }}>
            {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Sparkles size={16} /> Generate Flashcards</>}
          </button>
        </div>
      </div>

      {/* Flashcard Display */}
      {cards.length > 0 && (
        <div>
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>
              Card {currentIndex + 1} of {cards.length}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>Click card to flip</span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 4, background: 'var(--border-color)', borderRadius: 4, marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--accent-color)', borderRadius: 4, width: `${((currentIndex + 1) / cards.length) * 100}%`, transition: 'width 0.3s ease' }} />
          </div>

          {/* Card */}
          <div
            onClick={() => setFlipped(f => !f)}
            style={{
              perspective: '1000px', cursor: 'pointer', marginBottom: '1.5rem',
              height: '260px',
            }}
          >
            <div style={{
              position: 'relative', width: '100%', height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1)',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
            }}>
              {/* Front */}
              <div className="glass-panel" style={{
                position: 'absolute', width: '100%', height: '100%',
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '2.5rem',
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: 'var(--accent-color)', textTransform: 'uppercase', marginBottom: '1rem' }}>Question</span>
                <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-highlight)', lineHeight: 1.5 }}>{cards[currentIndex].front}</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-subtle)', fontSize: '0.8rem' }}>
                  <RotateCw size={13} /> Tap to reveal answer
                </div>
              </div>
              {/* Back */}
              <div className="glass-panel" style={{
                position: 'absolute', width: '100%', height: '100%',
                backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '2.5rem',
                background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.3)'
              }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#6366f1', textTransform: 'uppercase', marginBottom: '1rem' }}>Answer</span>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-highlight)', lineHeight: 1.6 }}>{cards[currentIndex].back}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center' }}>
            <button className="btn-primary" onClick={prev} disabled={currentIndex === 0}
              style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-highlight)', padding: '0.6rem 1.25rem' }}>
              <ChevronLeft size={18} /> Prev
            </button>
            <button className="btn-primary" onClick={next} disabled={currentIndex === cards.length - 1}
              style={{ padding: '0.6rem 1.25rem' }}>
              Next <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
