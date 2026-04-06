'use client';

import Link from 'next/link';

export default function Home() {
  const features = [
    { title: 'Input Hub', desc: 'Upload PDFs, videos, audio or paste any link to power your AI study session.', href: '/input-hub', emoji: '📂' },
    { title: 'AI Tutor Chat', desc: 'Chat with an AI tutor about your uploaded content or any topic you want to learn.', href: '/chat', emoji: '💬' },
    { title: 'Flashcards', desc: 'Generate interactive flashcards from your content or any topic for active recall.', href: '/flashcards', emoji: '🃏' },
    { title: 'Quiz', desc: 'Test yourself with AI-generated quizzes and get instant feedback with explanations.', href: '/quiz', emoji: '🧪' },
  ];

  return (
    <main className="main-content">
      <div style={{ textAlign: 'center', padding: '3rem 0 2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-highlight)', marginBottom: '1rem', lineHeight: 1.2 }}>
          Welcome to Smart Learn
        </h1>
        <p style={{ color: 'var(--text-main)', fontSize: '1.05rem', maxWidth: '520px', margin: '0 auto' }}>
          Upload your study material, chat with an AI tutor, and generate flashcards &amp; quizzes instantly.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
        {features.map((f) => (
          <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
            <div className="glass-panel" style={{ height: '100%', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow)'; }}
            >
              <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{f.emoji}</div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-highlight)', marginBottom: '0.5rem' }}>{f.title}</h2>
              <p style={{ color: 'var(--text-main)', fontSize: '0.875rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
