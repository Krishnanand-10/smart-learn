'use client';

import { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function Summarizer() {
  const [expandedTopics, setExpandedTopics] = useState([0]);
  const [isSimplifying, setIsSimplifying] = useState(false);

  const mockSummary = [
    {
      title: "1. Introduction to Thermodynamics",
      bullets: [
        "Thermodynamics is the branch of physics that deals with <strong>heat</strong>, <strong>work</strong>, and <strong>temperature</strong>.",
        "The <strong>Zeroth Law</strong> introduces the concept of thermal equilibrium.",
        "It defines macroscopic variables such as <strong>internal energy</strong> and <strong>entropy</strong>."
      ]
    },
    {
      title: "2. The First Law (Conservation of Energy)",
      bullets: [
        "Energy cannot be created or destroyed, only transformed.",
        "Equation: <strong>ΔQ = ΔU + ΔW</strong> (Heat added = change in internal energy + work done by the system).",
        "Applies to <strong>isothermal</strong>, <strong>adiabatic</strong>, and <strong>isobaric</strong> processes."
      ]
    }
  ];

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
        <button className="btn-primary" onClick={simplifyFurther} disabled={isSimplifying}>
          <Sparkles size={18} /> {isSimplifying ? 'Simplifying...' : 'Simplify Further'}
        </button>
      </header>

      <div className="summary-list" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {mockSummary.map((topic, index) => (
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
    </main>
  );
}
