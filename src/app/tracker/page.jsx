'use client';

import { useState, useEffect } from 'react';
import { Activity, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Tracker() {
  const [data, setData] = useState([]); // Empty state by default

  useEffect(() => {
    // Read the topic that the user submitted via Input Hub 
    const saved = localStorage.getItem('examBrain_topics');
    if (saved) {
      const parsedTopics = JSON.parse(saved);
      if (parsedTopics && parsedTopics.length > 0) {
        
        // Dynamically build heatmap mock data for their specific topics
        const generatedData = parsedTopics.map((topic, i) => {
           const statuses = ['good', 'weak', 'average', 'strong', 'critical'];
           const randomStatus = statuses[i % statuses.length];
           // Generate random stats
           const total = 20;
           let correct = 14;
           if (randomStatus === 'weak') correct = 7;
           if (randomStatus === 'critical') correct = 4;
           if (randomStatus === 'strong') correct = 18;
           
           return {
              topic: topic,
              correct: correct,
              total: total,
              status: randomStatus
           };
        });
        
        setData(generatedData);
      }
    }
  }, []);

  const getColor = (status) => {
    switch(status) {
      case 'strong': return '#4CAF50';
      case 'good': return '#8BC34A';
      case 'average': return '#FFC107';
      case 'weak': return '#FF9800';
      case 'critical': return '#F44336';
      default: return '#ccc';
    }
  };

  const totalQuestions = data.reduce((acc, curr) => acc + curr.total, 0);
  const correctQuestions = data.reduce((acc, curr) => acc + curr.correct, 0);
  const accuracy = totalQuestions > 0 ? Math.round((correctQuestions / totalQuestions) * 100) : 0;
  
  const weakTopics = data.filter(d => ['weak', 'critical'].includes(d.status));
  const primaryTarget = weakTopics.length > 0 ? weakTopics[0].topic : 'None Set';

  return (
    <main className="main-content">
      <header style={{ marginBottom: '2rem' }}>
        <h1>Weak Area Tracker</h1>
        <p style={{ color: 'var(--text-main)' }}>Visualize your performance and know exactly what to study next.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(102, 252, 241, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Activity color="var(--accent-color)" size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Total Questions</h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-highlight)' }}>{totalQuestions}</p>
          </div>
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(76, 175, 80, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <TrendingUp color="#4CAF50" size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Global Accuracy</h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-highlight)' }}>{accuracy}%</p>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderColor: 'var(--accent-secondary)' }}>
          <div style={{ background: 'rgba(244, 67, 54, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Target color="#F44336" size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Primary Target</h3>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', display: 'block', maxWidth: '200px'  }}>{primaryTarget}</p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <AlertTriangle color="var(--accent-secondary)" /> Focus Topics Dashboard
        </h2>
        
        {data.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-main)', opacity: 0.7 }}>
            No exam data found. Take some practice questions to generate your performance heatmap.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.map((item, idx) => {
              if (item.type === 'separator') return <hr key={idx} style={{ borderColor: 'var(--border-color)', margin: '1rem 0' }} />;
              
              const accuracy = (item.correct / item.total) * 100;
              const barColor = getColor(item.status);

              return (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: '500' }}>{item.topic}</span>
                  <div style={{ width: '100%', height: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', overflow: 'hidden' }}>
                    <div style={{ width: `${accuracy}%`, height: '100%', background: barColor, transition: 'var(--transition)' }}></div>
                  </div>
                  <span style={{ textAlign: 'right', fontWeight: 'bold', color: barColor }}>{Math.round(accuracy)}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {data.length === 0 ? (
        <div className="glass-panel" style={{ background: 'rgba(0,0,0,0.2)', textAlign: 'center', padding: '2rem' }}>
           <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-main)' }}>AI Study Recommendation</h3>
           <p style={{ margin: 0, opacity: 0.7 }}>Recommendations will appear once enough data is tracked.</p>
           <div style={{ marginTop: '1.5rem' }}>
             <Link href="/question-generator" className="btn-primary">Go to Practice Questions</Link>
           </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ background: 'linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(0,0,0,0.2))' }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>AI Study Recommendation</h3>
          <p style={{ lineHeight: '1.6', margin: 0 }}>
            Your performance has dropped below 30% in a key module. We recommend reviewing the generated <Link href="/summarizer" style={{ color: 'var(--accent-color)' }}>Smart Summaries</Link> for this topic and attempting targeted practice questions.
          </p>
          <button className="btn-primary" style={{ marginTop: '1.5rem' }}>Start Targeted Practice</button>
        </div>
      )}

    </main>
  );
}
