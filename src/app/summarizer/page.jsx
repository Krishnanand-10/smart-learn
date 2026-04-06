'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, FileText, Inbox } from 'lucide-react';
import Link from 'next/link';

export default function Summarizer() {
  const [expandedTopics, setExpandedTopics] = useState([0]);
  const [isSimplifying, setIsSimplifying] = useState(false);
  const [summaries, setSummaries] = useState([]); // Empty state by default

  useEffect(() => {
    // Read the topic that the user submitted via Input Hub 
    const saved = localStorage.getItem('smartLearn_topics');
    if (saved) {
      const parsedTopics = JSON.parse(saved);
      if (parsedTopics && parsedTopics.length > 0) {
        // Dynamically build a summary reflecting their exact text
        const generatedSummaries = parsedTopics.map((topic, i) => ({
          title: `1. Key Concepts in ${topic}`,
          bullets: [
            `The foundational principles of <strong>${topic}</strong> dictate how its specific sub-components operate and interact.`,
            `Crucial methodology: Ensure that variables associated with <strong>${topic}</strong> are measured optimally.`,
            `Secondary impact: Understanding these core processes improves comprehension of broader exam metrics.`
          ]
        }));
        setSummaries(generatedSummaries);
      }
    }
  }, []);

  const toggleTopic = (index) => {
    setExpandedTopics((prev) => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleSimplify = () => {
    setIsSimplifying(true);
    setTimeout(() => {
      // Actually change the UI data to functionally "simplify" it!
      setSummaries(prev => prev.map(summary => ({
        ...summary,
        title: summary.title.replace('Key Concepts in', 'Simple Guide to'),
        bullets: summary.bullets.map((b, i) => {
           // Strip HTML and provide a direct, short explanation
           const cleanText = b.replace(/<[^>]*>?/gm, '');
           const simplificationOptions = [
             "Think of this as the main engine of the system.",
             "Basically: This makes sure everything runs smoothly.",
             "In short: It's the most critical rule to remember for the exam."
           ];
           return `🔍 <strong>Simplified:</strong> ${simplificationOptions[i % simplificationOptions.length]} (<em>Derived from: ${cleanText.substring(0, 20)}...</em>)`;
        })
      })));
      setIsSimplifying(false);
    }, 1500);
  };

  return (
    <main className="main-content">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Smart Summarizer</h1>
          <p style={{ color: 'var(--text-main)' }}>Your messy notes converted into structured, high-yield bullet points.</p>
        </div>
        {summaries.length > 0 && (
          <button 
            className="btn-primary" 
            onClick={handleSimplify} 
            disabled={isSimplifying}
            style={{ justifySelf: 'start' }}
          >
            <Sparkles size={18} /> {isSimplifying ? "Simplifying..." : "Simplify Further (AI)"}
          </button>
        )}
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
