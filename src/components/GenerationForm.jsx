'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

export default function GenerationForm({ title, subtitle, resourceName }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload', 'subject', 'link'
  const [file, setFile] = useState(null);
  const [subjectText, setSubjectText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  const tabs = [
    { id: 'upload', label: 'Upload' },
    { id: 'subject', label: 'Subject' },
    { id: 'link', label: 'Link' },
  ];

  return (
    <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10vh' }}>
      <div style={{ maxWidth: '600px', width: '100%' }}>
        
        {/* Simple Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-highlight)', marginBottom: '0.5rem', letterSpacing: '-0.01em' }}>
            {title}
          </h1>
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.5 }}>
            {subtitle}
          </p>
        </div>

        {/* Compact Form Box */}
        <div style={{ 
          background: '#0a0a0a', 
          border: '1px solid #1f1f22',
          borderRadius: '12px',
          padding: '2rem' 
        }}>
          
          {/* Simple Segmented Tabs */}
          <div style={{ 
            display: 'flex', 
            background: '#121212', 
            borderRadius: '8px',
            marginBottom: '2rem',
            padding: '4px'
          }}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '0.5rem',
                    background: isActive ? '#1f1f22' : 'transparent',
                    color: isActive ? '#ffffff' : '#a1a1aa',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 500,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Dynamic Content Area */}
          <div style={{ minHeight: '120px' }}>
            
            {activeTab === 'upload' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  cursor: 'pointer',
                  padding: '0.75rem 1rem',
                  background: '#121212',
                  border: '1px solid #1f1f22',
                  borderRadius: '8px',
                  width: '100%',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#333336'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#1f1f22'}
                >
                  <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>Choose File</span>
                  <span style={{ color: '#a1a1aa', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {file ? file.name : ''}
                  </span>
                  <input 
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                </label>
                <p style={{ color: '#52525b', fontSize: '0.85rem' }}>
                  Upload a plain text, pdf, video, or audio file
                </p>
              </div>
            )}

            {activeTab === 'subject' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <textarea 
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  placeholder="Define your subject..."
                  style={{
                    width: '100%',
                    minHeight: '100px',
                    resize: 'vertical',
                    background: '#121212',
                    border: '1px solid #1f1f22',
                    color: '#ffffff',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            )}

            {activeTab === 'link' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input 
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="Paste URL here..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#121212',
                    border: '1px solid #1f1f22',
                    color: '#ffffff',
                    borderRadius: '8px',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            )}

          </div>

          {/* Footer Action */}
          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-start' }}>
            <button style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#fbbf24',
              color: '#000000',
              border: 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 14px 0 rgba(251, 191, 36, 0.39)'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Continue <ArrowRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
