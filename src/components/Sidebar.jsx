'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, FileText, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [theme, setTheme] = useState('light-gfg');

  useEffect(() => {
    // Read the saved theme from local storage
    const savedTheme = localStorage.getItem('examBrain_theme') || 'light-gfg';
    setTheme(savedTheme);
    document.body.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('examBrain_theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  const navItems = [
    { name: 'Input Hub', path: '/input-hub', icon: FileText },
    { name: 'Summarizer', path: '/summarizer', icon: Zap },
  ];

  return (
    <aside className="sidebar">
      <div className="logo-container">
        <Brain size={24} />
        <h2>Exam Brain</h2>
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
