'use client';

import { useState } from 'react';
import { HelpCircle, RefreshCw, CheckCircle, XCircle, Inbox } from 'lucide-react';
import Link from 'next/link';

export default function QuestionGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]); // Empty state by default
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    setShowAnswer(true);
  };

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <main className="main-content">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Practice Questions</h1>
          <p style={{ color: 'var(--text-main)' }}>AI-generated exam-style questions based on previous papers.</p>
        </div>
        <select 
          value={selectedTopic} 
          onChange={(e) => setSelectedTopic(e.target.value)}
          style={{ background: 'var(--panel-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)' }}
          disabled={questions.length === 0}
        >
          <option>All Topics</option>
        </select>
      </header>

      {questions.length === 0 ? (
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
          <Inbox size={48} color="var(--text-main)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
          <h2 style={{ color: 'var(--text-main)' }}>No Questions Available</h2>
          <p style={{ color: 'var(--text-main)', opacity: 0.7, marginBottom: '1.5rem' }}>Upload your syllabus or text in the Input Hub to generate practice questions.</p>
          <Link href="/input-hub" className="btn-primary">Go to Input Hub</Link>
        </div>
      ) : (
        <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
            <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
            <span>Topic: {currentQuestion.topic}</span>
          </div>

          <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', lineHeight: '1.4' }}>
            {currentQuestion.question}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {currentQuestion.options.map((option, idx) => {
              let optionStyle = {
                padding: '1rem 1.5rem',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                background: 'rgba(0,0,0,0.2)',
                cursor: selectedOption === null ? 'pointer' : 'default',
                transition: 'var(--transition)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              };

              if (showAnswer) {
                if (idx === currentQuestion.correctArea) {
                  optionStyle.background = 'rgba(76, 175, 80, 0.2)';
                  optionStyle.borderColor = '#4CAF50';
                } else if (idx === selectedOption) {
                  optionStyle.background = 'rgba(244, 67, 54, 0.2)';
                  optionStyle.borderColor = '#F44336';
                }
              }

              return (
                <div 
                  key={idx} 
                  style={optionStyle}
                  onClick={() => handleOptionSelect(idx)}
                  onMouseEnter={(e) => {
                    if(selectedOption === null) e.currentTarget.style.background = 'rgba(102, 252, 241, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    if(selectedOption === null) e.currentTarget.style.background = 'rgba(0,0,0,0.2)';
                  }}
                >
                  <span>{String.fromCharCode(65 + idx)}. {option}</span>
                  {showAnswer && idx === currentQuestion.correctArea && <CheckCircle color="#4CAF50" size={20} />}
                  {showAnswer && idx === selectedOption && idx !== currentQuestion.correctArea && <XCircle color="#F44336" size={20} />}
                </div>
              );
            })}
          </div>

          {showAnswer && (
            <div style={{ padding: '1.5rem', background: 'rgba(102, 252, 241, 0.05)', borderLeft: '4px solid var(--accent-color)', borderRadius: '0 var(--radius) var(--radius) 0', marginBottom: '2rem' }}>
              <h4 style={{ color: 'var(--accent-color)', margin: '0 0 0.5rem 0' }}>Explanation:</h4>
              <p style={{ margin: 0, lineHeight: '1.5' }}>{currentQuestion.explanation}</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }}>
            <div>
              {showAnswer && (
                <Link href={`/memcode?text=${encodeURIComponent(currentQuestion.explanation)}`} className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent-secondary)' }}>
                  ⭐ Generate MemCode
                </Link>
              )}
            </div>
            <button className="btn-primary" onClick={() => { setSelectedOption(null); setShowAnswer(false); }}>
              Next Question <RefreshCw size={18} style={{ marginLeft: '0.5rem' }} />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
