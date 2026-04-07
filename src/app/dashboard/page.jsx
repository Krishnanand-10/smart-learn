'use client';

import Link from 'next/link';
import { Zap, ClipboardList, CreditCard, MessageCircle, FileText, ArrowRight } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const [userName, setUserName] = useState("Krishna Nandi");

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
            Welcome back {userName}!
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
              <Zap size={18} color="var(--accent-color)" /> Monthly Generations
            </div>
            
            <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--text-highlight)', marginBottom: '0.5rem', lineHeight: 1 }}>
              0 <span style={{ color: 'var(--text-subtle)', fontSize: '2.5rem' }}>/ 10</span>
            </div>
            
            <p style={{ color: 'var(--text-subtle)', fontSize: '0.9rem' }}>
              Pro plan coming soon...
            </p>
          </div>

          {/* Breakdown Block */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <div style={{ color: 'var(--text-main)', marginBottom: '1.5rem', fontWeight: 600 }}>
              Monthly Generations Breakdown
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem', color: 'var(--text-subtle)' }}>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-highlight)', fontWeight: 600 }}>0</span> Flashcard Sets
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-highlight)', fontWeight: 600 }}>0</span> Quizzes
              </li>
              <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-highlight)', fontWeight: 600 }}>0</span> Tutors
              </li>
            </ul>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem'
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

      </div>
    </div>
  );
}
