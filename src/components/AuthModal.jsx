'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';

export default function AuthModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    }} onClick={onClose}>
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
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
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#ffffff',
          marginBottom: '1rem',
          fontFamily: "var(--font-family, 'Inter', sans-serif)"
        }}>
          Welcome back
        </h2>
        
        <p style={{
          color: '#a1a1aa',
          fontSize: '0.95rem',
          lineHeight: 1.5,
          marginBottom: '2rem',
          fontFamily: "var(--font-family, 'Inter', sans-serif)"
        }}>
          By continuing, you are setting up a Smart Learn account and agree to our User Agreement and Privacy Policy.
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
            transition: 'opacity 0.2s ease',
            fontFamily: "var(--font-family, 'Inter', sans-serif)"
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

        <div style={{
          marginTop: '2rem',
          fontSize: '0.9rem',
          color: '#a1a1aa'
        }}>
          New to Smart Learn? <span style={{ color: '#ffffff', cursor: 'pointer', textDecoration: 'underline' }}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}
