'use client';

import { Activity, Target, TrendingUp, AlertTriangle } from 'lucide-react';

export default function Tracker() {
  const mockData = [
    { topic: "Thermodynamics", correct: 18, total: 20, status: "strong" },
    { topic: "Kinetics", correct: 15, total: 20, status: "good" },
    { type: "separator" },
    { topic: "Machine Learning Concepts", correct: 12, total: 20, status: "average" },
    { topic: "Data Structures", correct: 8, total: 20, status: "weak" },
    { topic: "Operating Systems", correct: 5, total: 20, status: "critical" },
  ];

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
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-highlight)' }}>342</p>
          </div>
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(76, 175, 80, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <TrendingUp color="#4CAF50" size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Global Accuracy</h3>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-highlight)' }}>68%</p>
          </div>
        </div>

        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderColor: 'var(--accent-secondary)' }}>
          <div style={{ background: 'rgba(244, 67, 54, 0.2)', padding: '1rem', borderRadius: '50%' }}>
            <Target color="#F44336" size={32} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-main)' }}>Primary Target</h3>
            <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-highlight)' }}>Operating Systems</p>
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <AlertTriangle color="var(--accent-secondary)" /> Focus Topics Dashboard
        </h2>
        
        {/* Mock Heatmap visualization using grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {mockData.map((item, idx) => {
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
      </div>
      
      <div className="glass-panel" style={{ background: 'linear-gradient(45deg, rgba(244, 67, 54, 0.1), rgba(0,0,0,0.2))' }}>
        <h3 style={{ margin: '0 0 1rem 0' }}>AI Study Recommendation</h3>
        <p style={{ lineHeight: '1.6', margin: 0 }}>
          Your performance in <strong>Operating Systems</strong> has dropped below 30% in the last two mock exams. We recommend reviewing the generated <a href="/summarizer" style={{ color: 'var(--accent-color)' }}>Smart Summaries</a> for this topic and attempting 10 targeted practice questions.
        </p>
        <button className="btn-primary" style={{ marginTop: '1.5rem' }}>Start Targeted Practice</button>
      </div>

    </main>
  );
}
