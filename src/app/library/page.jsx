'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import QuizViewer from '@/components/QuizViewer';
import SummaryViewer from '@/components/SummaryViewer';
import FlashcardViewer from '@/components/FlashcardViewer';

export default function Library() {
  const { data: session } = useSession();

  const [materials, setMaterials] = useState({ quizzes: [], summaries: [], flashcards: [] });
  const [loading, setLoading] = useState(true);

  // Modal active viewers
  const [viewQuiz, setViewQuiz] = useState(null);
  const [viewSummary, setViewSummary] = useState(null);
  const [viewFlashcards, setViewFlashcards] = useState(null);

  useEffect(() => {
    if (!session) return;
    
    const fetchMaterials = async () => {
      try {
        const res = await fetch('/api/get-materials');
        if (res.ok) {
          const data = await res.json();
          setMaterials(data);
        }
      } catch (err) {
        console.error('Failed to load library data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [session]);

  if (!session) {
    return (
      <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '15vh' }}>
        <div className="glass-panel" style={{ padding: '3rem', borderRadius: '16px', maxWidth: '500px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-highlight)', marginBottom: '1rem', fontWeight: 700 }}>My Study Library</h2>
          <p style={{ color: 'var(--text-subtle)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Please sign in to view and review your saved study materials, quizzes, flashcards, and summaries.
          </p>
          <Link href="/dashboard" style={{
            display: 'inline-flex',
            alignItems: 'center',
            background: '#fbbf24',
            color: '#000000',
            border: 'none',
            padding: '0.75rem 2rem',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none',
            fontSize: '1rem',
            cursor: 'pointer'
          }}>
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 800, 
            background: 'linear-gradient(to right, #818cf8, #c084fc)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            My Library
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-subtle)' }}>
            Review your saved quizzes, summaries, and flashcards to master your topics.
          </p>
        </div>

        {/* Saved Materials Lists */}
        {loading ? (
          <p style={{ color: 'var(--text-subtle)' }}>Loading library materials...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            {/* Quizzes list */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-highlight)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Saved Quizzes ({materials.quizzes.length})
              </h3>
              {materials.quizzes.length === 0 ? (
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>No saved quizzes yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {materials.quizzes.map((q) => (
                    <div 
                      key={q.id} 
                      onClick={() => setViewQuiz(q)}
                      style={{ padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{q.title}</span>
                      <ArrowRight size={14} color="var(--text-subtle)" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Summaries list */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-highlight)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Saved Summaries ({materials.summaries.length})
              </h3>
              {materials.summaries.length === 0 ? (
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>No saved summaries yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {materials.summaries.map((s) => (
                    <div 
                      key={s.id} 
                      onClick={() => setViewSummary(s)}
                      style={{ padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{s.title}</span>
                      <ArrowRight size={14} color="var(--text-subtle)" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Flashcards list */}
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-highlight)', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                Saved Flashcards ({materials.flashcards.length})
              </h3>
              {materials.flashcards.length === 0 ? (
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>No saved flashcards yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {materials.flashcards.map((f) => (
                    <div 
                      key={f.id} 
                      onClick={() => setViewFlashcards(f)}
                      style={{ padding: '0.75rem', background: 'var(--bg-color)', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{f.title}</span>
                      <ArrowRight size={14} color="var(--text-subtle)" />
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Modal Overlays for studying saved items */}
      {viewQuiz && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', padding: '2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '800px', margin: '0 auto', width: '100%', marginBottom: '1rem' }}>
            <button onClick={() => setViewQuiz(null)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Close Viewer</button>
          </div>
          <QuizViewer questions={viewQuiz.questions} isAlreadySaved={true} isReviewMode={true} onRestart={() => setViewQuiz(null)} />
        </div>
      )}

      {viewSummary && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', padding: '2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '800px', margin: '0 auto', width: '100%', marginBottom: '1rem' }}>
            <button onClick={() => setViewSummary(null)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Close Viewer</button>
          </div>
          <SummaryViewer data={viewSummary} isAlreadySaved={true} />
        </div>
      )}

      {viewFlashcards && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', padding: '2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '700px', margin: '0 auto', width: '100%', marginBottom: '1rem' }}>
            <button onClick={() => setViewFlashcards(null)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Close Viewer</button>
          </div>
          <FlashcardViewer cards={viewFlashcards.cards} isAlreadySaved={true} onFinish={() => setViewFlashcards(null)} />
        </div>
      )}

    </div>
  );
}
