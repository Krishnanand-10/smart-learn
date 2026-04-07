'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, FileText, MessageCircle, CreditCard, ClipboardList } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('light-gfg');

  useEffect(() => {
    // Read the saved theme from local storage
    const savedTheme = localStorage.getItem('smartLearn_theme') || 'light-gfg';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('smartLearn_theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Brain },
    { name: 'Input Hub', path: '/input-hub', icon: FileText },
    { name: 'AI Tutor Chat', path: '/chat', icon: MessageCircle },
    { name: 'Flashcards', path: '/flashcards', icon: CreditCard },
    { name: 'Quiz', path: '/quiz', icon: ClipboardList },
  ];

  if (pathname === '/') return null;

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Brain size={24} />
        <h2>Smart Learn</h2>
      </div>

      <nav style={{ flex: 1 }}>
        <ul className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link 
                  href={item.path} 
                  className={`nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Minimalist Theme Dots */}
      <div className="theme-switcher-container">
        <label>Theme</label>
        <button 
          className={`theme-dot ${theme === 'light-gfg' ? 'active' : ''}`}
          onClick={() => changeTheme('light-gfg')}
          style={{ background: '#f8f9fa' }}
          title="Educational Light"
        />
        <button 
          className={`theme-dot ${theme === 'dark-linear' ? 'active' : ''}`}
          onClick={() => changeTheme('dark-linear')}
          style={{ background: '#000000' }}
          title="Minimal Dark"
        />
        <button 
          className={`theme-dot ${theme === 'dark-aurora' ? 'active' : ''}`}
          onClick={() => changeTheme('dark-aurora')}
          style={{ background: 'linear-gradient(135deg, #00f2fe, #4facfe)' }}
          title="Neon Glass"
        />
      </div>
    </aside>
  );
}
