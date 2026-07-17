'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { Brain } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Automatically redirect authenticated users to the dashboard
  useEffect(() => {
    if (session) {
      router.push('/dashboard');
    }
  }, [session, router]);

  // Set page background styles
  useEffect(() => {
    document.body.style.backgroundColor = '#050505';
    document.body.style.color = '#ffffff';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  // Show loading indicator while session state is determining
  if (status === 'loading' || session) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#050505',
        color: '#ffffff',
        fontFamily: "'Inter', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            background: '#ffffff',
            borderRadius: '12px',
            padding: '8px',
            marginBottom: '1rem',
            animation: 'pulse 1.5s infinite'
          }}>
            <Brain size={32} color="black" />
          </div>
          <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Loading study environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#050505',
      color: '#ffffff',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      width: '100%',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    }}>
      {/* Ambient glowing orbs */}
      <div style={{ position: 'absolute', top: '10%', left: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div 
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: '420px',
          padding: '2.5rem',
          backgroundColor: '#0a0a0a',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          gap: '0.6rem', 
          fontWeight: 800, 
          fontSize: '1.5rem', 
          letterSpacing: '-0.03em',
          marginBottom: '1.5rem'
        }}>
          <div style={{ background: '#ffffff', borderRadius: '8px', padding: '6px', display: 'flex' }}>
            <Brain size={26} color="black" />
          </div>
          Smart Learn
        </div>

        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '0.75rem'
        }}>
          Welcome back
        </h2>
        
        <p style={{
          color: '#a1a1aa',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          marginBottom: '2rem'
        }}>
          Sign in to access your study materials, chatbots, and quizzes.
        </p>

        <button 
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })} 
          style={{
            width: '100%',
            backgroundColor: '#fbbf24', // yellow background
            color: '#000000', // black text
            border: 'none',
            borderRadius: '8px',
            padding: '0.85rem',
            fontSize: '1rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#000000" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#000000" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#000000" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#000000" />
          </svg>
          Continue With Google
        </button>
      </div>
    </div>
  );
}
