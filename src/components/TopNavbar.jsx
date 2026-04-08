'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function TopNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [theme, setTheme] = useState('dark-aurora');

  useEffect(() => {
    // Read the saved theme from local storage
    const savedTheme = localStorage.getItem('smartLearn_theme') || 'dark-aurora';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('smartLearn_theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Flashcards', path: '/flashcards' },
    { name: 'AI Tutors', path: '/chat' },
    { name: 'Quizzes', path: '/quiz' },
    { name: 'Summarize', path: '/input-hub' },
  ];

  if (pathname === '/') return null;

  return (
    <nav style={{
      width: '100%',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--bg-sidebar)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(10px)',
      WebkitBackdropFilter: 'blur(10px)'
    }}>
      {/* Brand */}
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-highlight)', textDecoration: 'none', fontWeight: 700, fontSize: '1.25rem' }}>
        <Brain size={24} />
        Smart Learn
      </Link>

      {/* Navigation Links */}
      <ul style={{ 
        display: 'flex', 
        listStyle: 'none', 
        gap: '2.5rem', 
        margin: 0, 
        padding: 0 
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.path}>
              <Link 
                href={item.path} 
                style={{
                  color: isActive ? 'var(--text-highlight)' : 'var(--text-main)',
                  textDecoration: 'none',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.95rem',
                  padding: '0.5rem 0',
                  borderBottom: isActive ? '2px solid var(--accent-color)' : '2px solid transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Right Side: Theme switcher & Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => changeTheme('light-gfg')}
            style={{ width: '16px', height: '16px', borderRadius: '50%', border: theme === 'light-gfg' ? '2px solid var(--text-highlight)' : '2px solid var(--border-color)', background: '#f8f9fa', cursor: 'pointer' }}
            title="Educational Light"
          />
          <button 
            onClick={() => changeTheme('dark-linear')}
            style={{ width: '16px', height: '16px', borderRadius: '50%', border: theme === 'dark-linear' ? '2px solid var(--text-highlight)' : '2px solid var(--border-color)', background: '#000000', cursor: 'pointer' }}
            title="Minimal Dark"
          />
          <button 
            onClick={() => changeTheme('dark-aurora')}
            style={{ width: '16px', height: '16px', borderRadius: '50%', border: theme === 'dark-aurora' ? '2px solid var(--text-highlight)' : '2px solid var(--border-color)', background: 'linear-gradient(135deg, #00f2fe, #4facfe)', cursor: 'pointer' }}
            title="Neon Glass"
          />
        </div>
        
        <Link href="/profile" style={{ display: 'flex' }}>
          {session?.user?.image ? (
            <img 
              src={session.user.image} 
              alt="Profile Picture" 
              style={{ 
                width: '36px', height: '36px', 
                borderRadius: '50%', 
                objectFit: 'cover',
                border: '2px solid var(--border-color)',
                cursor: 'pointer'
              }} 
            />
          ) : (
            <div style={{ 
              width: '36px', height: '36px', 
              borderRadius: '50%', 
              background: 'linear-gradient(to bottom right, #f472b6, #db2777)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#ffffff', cursor: 'pointer'
            }}>
              <User size={18} />
            </div>
          )}
        </Link>
      </div>
    </nav>
  );
}
