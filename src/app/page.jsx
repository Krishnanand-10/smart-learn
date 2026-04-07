'use client';

import Link from 'next/link';
import { Brain, Sparkles, MessageCircle, CreditCard, ClipboardList, Upload, Link as LinkIcon } from 'lucide-react';
import { useEffect } from 'react';

export default function Home() {
  const features = [
    { title: 'OpenAI', desc: 'Driven by industry-leading LLMs to guarantee precise, hallucination-free studying.', icon: Sparkles, color: '#06b6d4' },
    { title: 'AI Tutor Chatbots', desc: 'Engage with an intelligent assistant that understands your uploaded course material deeply.', icon: MessageCircle, color: '#8b5cf6' },
    { title: 'Flashcards', desc: 'Automatically generate high-yield flashcards to harness the power of active recall.', icon: CreditCard, color: '#f59e0b' },
    { title: 'Quizzes', desc: 'Test your understanding with multiple-choice questions tailored to your weakest points.', icon: ClipboardList, color: '#10b981' },
    { title: 'Upload Files', desc: 'Upload PDFs, videos, or audio. We instantly parse context and create a unified knowledge base.', icon: Upload, color: '#3b82f6' },
    { title: 'Paste Links', desc: 'Paste YouTube links or web articles—our engine handles the rest seamlessly.', icon: LinkIcon, color: '#ec4899' }
  ];

  // Force a deeply engaging, dark base theme for the landing
  useEffect(() => {
    document.body.style.backgroundColor = '#050505';
    document.body.style.color = '#ffffff';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  return (
    <div style={{
      backgroundColor: '#050505', 
      color: '#ffffff',
      fontFamily: "var(--font-family, 'Inter', sans-serif)",
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Ambient glowing orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Hero Wrapper - set to 93vh to perfectly cut the Features section in half at the bottom */}
      <div style={{ minHeight: '93vh', display: 'flex', flexDirection: 'column' }}>
        {/* Navbar */}
        <nav style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 5%', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.03em' }}>
            <div style={{ background: '#ffffff', borderRadius: '8px', padding: '4px', display: 'flex' }}>
              <Brain size={22} color="black" />
            </div>
            Smart Learn
          </div>
          <Link href="/dashboard" style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            padding: '0.5rem 1.25rem', 
            borderRadius: '6px', 
            color: '#ffffff', 
            textDecoration: 'none', 
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          }}
          onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
          }}
          >Sign In</Link>
        </nav>

        {/* Hero Section Vertically Centered */}
        <main style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 5vh' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            background: 'transparent', 
            padding: '0.3rem 0.85rem', 
            borderRadius: '20px', 
            fontSize: '0.75rem', 
            fontWeight: 600,
            marginBottom: '2rem',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.15)'
          }}>
            1.0.0 Live Now
          </div>

          <h1 style={{ fontSize: '3.6rem', fontWeight: 800, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-0.02em', color: '#ffffff' }}>
            Helping Students Study Better Using<br />
            AI
          </h1>
          
          <p style={{ fontSize: '1.1rem', color: '#a1a1aa', maxWidth: '650px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
            We harness the power of artificial intelligence to help improve students' critical thinking skills with AI, rather than replace those skills.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/dashboard" style={{
              background: '#fbbf24',
              color: '#000000',
              fontWeight: 600,
              padding: '0.65rem 1.75rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center'
            }}>
              Get Started
            </Link>
            <Link href="/dashboard" style={{
              background: 'transparent',
              color: '#ffffff',
              fontWeight: 500,
              padding: '0.65rem 1.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.15)',
              textDecoration: 'none',
              fontSize: '0.95rem',
              display: 'inline-flex',
              alignItems: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              Sign Up
            </Link>
          </div>
        </main>
      </div>

      {/* Features Bento Grid */}
      <section style={{ position: 'relative', zIndex: 10, paddingTop: '4vh', paddingBottom: '8rem', paddingLeft: '2rem', paddingRight: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#ffffff', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1 }}>Features</h2>
          <p style={{ color: '#a1a1aa', fontSize: '1.05rem', maxWidth: '550px', margin: '0 auto' }}>
            Smart Learn includes many different features like file uploading and link parsing to help students study efficiently.
          </p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: 'linear-gradient(180deg, rgba(20,20,20,0.8) 0%, rgba(10,10,10,0.8) 100%)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '24px',
              padding: '2.5rem',
              transition: 'all 0.3s ease',
              position: 'relative',
              overflow: 'hidden',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.boxShadow = `0 10px 40px -10px ${f.color}30`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            >
              {/* Subtle top-glow to the card based on specific icon color */}
              <div style={{ position: 'absolute', top: 0, left: '20%', width: '60%', height: '2px', background: `radial-gradient(ellipse at center, ${f.color} 0%, transparent 70%)`, opacity: 0.8 }} />
              
              <div style={{ 
                background: `${f.color}15`, 
                width: '50px', height: '50px', 
                borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.5rem', border: `1px solid ${f.color}30`
              }}>
                <f.icon size={24} color={f.color} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc', marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
