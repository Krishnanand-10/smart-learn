'use client';

import { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, XCircle, Link, FileText, Loader, ChevronRight, Trophy } from 'lucide-react';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export default function Quiz() {
  const [topic, setTopic] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedContent, setSavedContent] = useState(null);
  const [useUpload, setUseUpload] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('smartLearn_content');
    if (stored) setSavedContent(JSON.parse(stored));
  }, []);

  const generateQuiz = async () => {
    const source = useUpload && savedContent
      ? (savedContent.type === 'link' ? `the content from this URL: ${savedContent.url}` : `the uploaded file: ${savedContent.name}`)
      : topic.trim();

    if (!source) { setError('Please enter a topic or enable uploaded content.'); return; }

    setLoading(true);
    setError('');
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResult(false);
    setRevealed(false);

    const prompt = `Generate exactly 6 multiple choice quiz questions about: ${source}.
Return ONLY a valid JSON array with no markdown, no code fences, no extra text.
Format: [{"question": "...", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": "..."}, ...]
The "answer" field must be exactly one of the option strings (not just a letter).`;

    try {
      const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      if (!apiKey || apiKey === 'your_api_key_here') {
        throw new Error('API key not configured. Please add your OpenAI API key to .env.local and restart the server.');
      }
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
      if (!res.ok) {
        const apiMsg = data?.error?.message || `HTTP ${res.status}`;
        throw new Error(`OpenAI API error: ${apiMsg}`);
      }
      const raw = data?.choices?.[0]?.message?.content || '';
      const cleaned = raw.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) throw new Error('Unexpected response format from AI. Please try again.');
      setQuestions(parsed);
    } catch (e) {
      setError(e.message || 'Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (option) => {
    if (revealed) return;
    setSelectedAnswers(prev => ({ ...prev, [currentIndex]: option }));
    setRevealed(true);
  };

  const next = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1);
      setRevealed(!!selectedAnswers[currentIndex + 1]);
    } else {
      setShowResult(true);
    }
  };

  const score = questions.reduce((acc, q, i) => acc + (selectedAnswers[i] === q.answer ? 1 : 0), 0);
  const q = questions[currentIndex];

  const getOptionStyle = (option) => {
    if (!revealed) {
      return {
        background: selectedAnswers[currentIndex] === option ? 'rgba(99,102,241,0.1)' : 'var(--panel-bg)',
        borderColor: selectedAnswers[currentIndex] === option ? '#6366f1' : 'var(--border-color)',
        color: 'var(--text-highlight)',
      };
    }
    if (option === q.answer) return { background: 'rgba(16,185,129,0.1)', borderColor: '#10b981', color: '#10b981' };
    if (option === selectedAnswers[currentIndex]) return { background: 'rgba(239,68,68,0.1)', borderColor: '#ef4444', color: '#ef4444' };
    return { background: 'var(--panel-bg)', borderColor: 'var(--border-color)', color: 'var(--text-subtle)' };
  };

  return (
    <main className="main-content">
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>Quiz Generator</h1>
        <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>
          Test yourself on your uploaded content or any topic.
        </p>
      </header>

      {/* Generator Panel */}
      {questions.length === 0 && !showResult && (
        <div className="glass-panel">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {savedContent && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', background: useUpload ? 'rgba(99,102,241,0.06)' : 'transparent' }}>
                <input type="checkbox" id="useUpload" checked={useUpload} onChange={e => setUseUpload(e.target.checked)} style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--accent-color)' }} />
                <label htmlFor="useUpload" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-highlight)' }}>
                  {savedContent.type === 'link' ? <Link size={14} /> : <FileText size={14} />}
                  Use uploaded content: <strong>{savedContent.type === 'link' ? savedContent.url : savedContent.name}</strong>
                </label>
              </div>
            )}

            {!useUpload && (
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-highlight)' }}>Topic</label>
                <input
                  type="text" value={topic}
                  onChange={e => { setTopic(e.target.value); setError(''); }}
                  placeholder="e.g. The French Revolution, Machine Learning, DNA Replication..."
                  style={{ width: '100%' }}
                  onKeyDown={e => e.key === 'Enter' && generateQuiz()}
                />
              </div>
            )}

            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem' }}>{error}</p>}

            <button className="btn-primary" onClick={generateQuiz} disabled={loading} style={{ alignSelf: 'flex-start' }}>
              {loading ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> : <><Sparkles size={16} /> Generate Quiz</>}
            </button>
          </div>
        </div>
      )}

      {/* Quiz Question */}
      {questions.length > 0 && !showResult && q && (
        <div>
          {/* Progress */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Question {currentIndex + 1} of {questions.length}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>Score: {score}/{questions.length}</span>
          </div>
          <div style={{ height: 4, background: 'var(--border-color)', borderRadius: 4, marginBottom: '1.5rem', overflow: 'hidden' }}>
            <div style={{ height: '100%', background: 'var(--accent-color)', borderRadius: 4, width: `${((currentIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s ease' }} />
          </div>

          <div className="glass-panel" style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-highlight)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              {q.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {q.options.map((option, i) => {
                const style = getOptionStyle(option);
                return (
                  <button
                    key={i}
                    onClick={() => selectAnswer(option)}
                    disabled={revealed}
                    style={{
                      ...style,
                      padding: '0.9rem 1.25rem', border: '1px solid', borderRadius: 'var(--radius)',
                      textAlign: 'left', cursor: revealed ? 'default' : 'pointer',
                      fontFamily: 'inherit', fontSize: '0.95rem', transition: 'all 0.2s ease',
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                    }}
                  >
                    <span style={{ width: 24, height: 24, borderRadius: '50%', border: `1px solid currentColor`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                      {['A','B','C','D'][i]}
                    </span>
                    {option}
                    {revealed && option === q.answer && <CheckCircle size={16} style={{ marginLeft: 'auto' }} />}
                    {revealed && option === selectedAnswers[currentIndex] && option !== q.answer && <XCircle size={16} style={{ marginLeft: 'auto' }} />}
                  </button>
                );
              })}
            </div>

            {revealed && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 'var(--radius)' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-main)', lineHeight: 1.6 }}>
                  <strong style={{ color: 'var(--text-highlight)' }}>Explanation:</strong> {q.explanation}
                </p>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={next} disabled={!revealed}>
              {currentIndex < questions.length - 1 ? <>Next <ChevronRight size={16} /></> : <>See Results <Trophy size={16} /></>}
            </button>
          </div>
        </div>
      )}

      {/* Results Screen */}
      {showResult && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <Trophy size={56} color="#f59e0b" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-highlight)', marginBottom: '0.5rem' }}>
            {score}/{questions.length}
          </h2>
          <p style={{ color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
            {score === questions.length ? '🎉 Perfect score!' : score >= questions.length / 2 ? '👍 Good job! Keep it up.' : '📚 Keep studying, you\'ll get there!'}
          </p>
          <p style={{ color: 'var(--text-subtle)', fontSize: '0.875rem', marginBottom: '2rem' }}>
            {Math.round((score / questions.length) * 100)}% correct
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => { setQuestions([]); setShowResult(false); setSelectedAnswers({}); setCurrentIndex(0); }}>
              <Sparkles size={16} /> New Quiz
            </button>
            <button className="btn-primary" onClick={() => { setCurrentIndex(0); setShowResult(false); setRevealed(!!selectedAnswers[0]); }}
              style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-highlight)' }}>
              Review Answers
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
