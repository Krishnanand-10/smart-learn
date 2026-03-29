'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, FileText, Inbox } from 'lucide-react';
import Link from 'next/link';

export default function Summarizer() {
  const [expandedTopics, setExpandedTopics] = useState([0]);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [summaries, setSummaries] = useState([]); // Empty state by default

  const toggleTopic = (index) => {
    setExpandedTopics((prev) => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const simplifyFurther = () => {
    setIsSimplifying(true);
    setTimeout(() => setIsSimplifying(false), 1500); // Simulate AI api call
  };

  return (
    <main className="main-content">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Smart Summarizer</h1>
          <p style={{ color: 'var(--text-main)' }}>Your messy notes converted into structured, high-yield bullet points.</p>
        </div>
        <button className="btn-primary" onClick={simplifyFurther} disabled={isSimplifying || summaries.length === 0}>
          <Sparkles size={18} /> {isSimplifying ? 'Simplifying...' : 'Simplify Further'}
        </button>
      </header>

      {summaries.length === 0 ? (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
          <Inbox size={48} color="var(--text-main)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-main)' }}>No Summaries Yet</h2>
          <p style={{ color: 'var(--text-main)', opacity: 0.7, marginBottom: '1.5rem' }}>Upload your notes or syllabi in the Input Hub to generate AI summaries.</p>
          <Link href="/input-hub" className="btn-primary">Go to Input Hub</Link>
        </div>
      ) : (
        <div className="summary-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {summaries.map((topic, index) => (
            <div key={index} className="glass-panel" style={{ padding: '0' }}>
              <div 
                style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderBottom: expandedTopics.includes(index) ? '1px solid var(--border-color)' : 'none' }}
                onClick={() => toggleTopic(index)}
              >
                <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <FileText size={20} color="var(--accent-color)" /> {topic.title}
                </h2>
                {expandedTopics.includes(index) ? <ChevronUp /> : <ChevronDown />}
              </div>
              
              {expandedTopics.includes(index) && (
                <div style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                  <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', lineHeight: '1.6' }}>
                    {topic.bullets.map((bullet, bIndex) => (
                      <li key={bIndex} dangerouslySetInnerHTML={{ __html: bullet }} />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
