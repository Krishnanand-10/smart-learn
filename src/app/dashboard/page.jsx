'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Zap, ClipboardList, CreditCard, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import QuizViewer from '@/components/QuizViewer';
import SummaryViewer from '@/components/SummaryViewer';
import FlashcardViewer from '@/components/FlashcardViewer';

export default function Dashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name ? session.user.name.split(' ')[0] : 'Student';

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
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, [session]);

  const totalGenerations = materials.quizzes.length + materials.summaries.length + materials.flashcards.length;

  // Quick action cards
  const quickActions = [
    { title: 'Quizzes', desc: 'View, create, edit, and delete AI generated quizzes', icon: ClipboardList, href: '/quiz' },
    { title: 'Flashcards', desc: 'View, create, edit, and delete AI generated flashcard sets', icon: CreditCard, href: '/flashcards' },
    { title: 'AI Tutors', desc: 'View, create, edit, and delete AI tutors', icon: MessageCircle, href: '/chat' },
    { title: 'Summary', desc: 'Summarize youtube videos', icon: FileText, href: '/input-hub' },
  ];

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
            marginBottom: '0.25rem'
          }}>
            Dashboard
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-subtle)' }}>
            Welcome back, {userName}!
          </p>
        </div>

        {/* Stats Section */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* Monthly Generations Block */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 600 }}>
              <Zap size={18} color="var(--accent-color)" /> Total Generations Saved
            </div>
            
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-highlight)', marginBottom: '0.5rem', lineHeight: 1 }}>
              {totalGenerations} <span style={{ color: 'var(--text-subtle)', fontSize: '2.5rem' }}>/ 10</span>
            </div>
            
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
              Pro plan coming soon...
            </p>
          </div>

          {/* Breakdown Block */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 600 }}>
              Saved Materials Breakdown
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-subtle)' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-highlight)', fontWeight: 600 }}>{materials.flashcards.length}</span> Flashcard Sets
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-highlight)', fontWeight: 600 }}>{materials.quizzes.length}</span> Quizzes
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-highlight)', fontWeight: 600 }}>{materials.summaries.length}</span> Summaries
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          {quickActions.map((action, i) => (
            <Link key={i} href={action.href} style={{ textDecoration: 'none' }}>
              <div className="glass-panel" style={{
                padding: '1.5rem',
                borderRadius: '16px',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent-color)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-highlight)', fontWeight: 600, marginBottom: '1rem' }}>
                  <action.icon size={20} />
                  {action.title}
                </div>
                
                <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', lineHeight: 1.5, flex: 1, marginBottom: '1.5rem' }}>
                  {action.desc}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', color: 'var(--text-subtle)' }}>
                  <ArrowRight size={18} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Saved Materials Section */}
        <div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.5rem' }}>
            My Saved Materials
          </h2>
          
          {loading ? (
            <p style={{ color: 'var(--text-subtle)' }}>Loading materials...</p>
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
                        onClick={() => setViewQuiz(q.questions)}
                        style={{ padding: '0.75rem', background: '#121212', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                      >
                        <span style={{ fontSize: '0.9rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{q.title}</span>
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
                        style={{ padding: '0.75rem', background: '#121212', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                      >
                        <span style={{ fontSize: '0.9rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{s.title}</span>
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
                        onClick={() => setViewFlashcards(f.cards)}
                        style={{ padding: '0.75rem', background: '#121212', borderRadius: '8px', border: '1px solid var(--border-color)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'border-color 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-color)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                      >
                        <span style={{ fontSize: '0.9rem', color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{f.title}</span>
                        <ArrowRight size={14} color="var(--text-subtle)" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

      </div>

      {/* Modal Overlays for saved items */}
      {viewQuiz && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', padding: '2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '800px', margin: '0 auto', width: '100%', marginBottom: '1rem' }}>
            <button onClick={() => setViewQuiz(null)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Close Viewer</button>
          </div>
          <QuizViewer questions={viewQuiz} onRestart={() => setViewQuiz(null)} />
        </div>
      )}

      {viewSummary && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', padding: '2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '800px', margin: '0 auto', width: '100%', marginBottom: '1rem' }}>
            <button onClick={() => setViewSummary(null)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Close Viewer</button>
          </div>
          <SummaryViewer data={viewSummary} />
        </div>
      )}

      {viewFlashcards && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.85)', display: 'flex', flexDirection: 'column', padding: '2rem', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', maxWidth: '700px', margin: '0 auto', width: '100%', marginBottom: '1rem' }}>
            <button onClick={() => setViewFlashcards(null)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Close Viewer</button>
          </div>
          <FlashcardViewer cards={viewFlashcards} onFinish={() => setViewFlashcards(null)} />
        </div>
      )}

    </div>
  );
}
