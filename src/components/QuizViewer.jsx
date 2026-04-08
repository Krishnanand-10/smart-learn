'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react';

export default function QuizViewer({ questions, onRestart }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // If no questions are provided somehow
  if (!questions || questions.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
        No quiz questions generated.
      </div>
    );
  }

  const handleSelectOption = (option) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [currentIndex]: option });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    return correct;
  };

  // If the quiz is finished and submitted
  if (isSubmitted) {
    const score = calculateScore();
    const percentage = Math.round((score / questions.length) * 100);
    
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', width: '100%' }}>
        {/* Score Header */}
        <div style={{ 
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 5, 5, 0.8) 100%)', 
          border: '1px solid #10b981', 
          borderRadius: '16px', 
          padding: '2rem', 
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Quiz Completed!
          </h2>
          <div style={{ fontSize: '3rem', fontWeight: 900, color: '#10b981', marginBottom: '1rem' }}>
            {score} / {questions.length}
          </div>
          <p style={{ color: '#a1a1aa', fontSize: '1rem' }}>
            You scored {percentage}%. Let's review your answers below.
          </p>
        </div>

        {/* Review Answers */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <div key={i} style={{ 
                background: '#0a0a0a', 
                border: '1px solid #1f1f22', 
                borderRadius: '12px', 
                padding: '1.5rem' 
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ marginTop: '0.2rem' }}>
                    {isCorrect ? <CheckCircle color="#10b981" size={24} /> : <XCircle color="#ef4444" size={24} />}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.4, marginBottom: '0.5rem' }}>
                      {i + 1}. {q.question}
                    </h3>
                    <p style={{ fontSize: '0.9rem', color: isCorrect ? '#10b981' : '#ef4444', marginBottom: '0.25rem' }}>
                      Your Answer: {userAnswer || 'Skipped'}
                    </p>
                    {!isCorrect && (
                      <p style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 500, marginBottom: '0.5rem' }}>
                        Correct Answer: {q.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
                
                {q.explanation && (
                  <div style={{ 
                    background: '#121212', 
                    padding: '1rem', 
                    borderRadius: '8px', 
                    marginTop: '1rem',
                    borderLeft: '4px solid #3b82f6'
                  }}>
                    <strong style={{ color: '#ffffff', fontSize: '0.85rem' }}>Explanation: </strong>
                    <span style={{ color: '#a1a1aa', fontSize: '0.85rem', lineHeight: 1.5 }}>
                      {q.explanation}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Restart Button */}
        <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
          <button 
            onClick={onRestart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#ffffff',
              color: '#000000',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
            onMouseLeave={e => e.currentTarget.style.opacity = 1}
          >
            <RefreshCw size={18} />
            Generate Another Quiz
          </button>
        </div>
      </div>
    );
  }

  // Active Quiz View
  const currentQ = questions[currentIndex];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', width: '100%' }}>
      {/* Progress Bar */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#a1a1aa', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{progress}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', background: '#1f1f22', borderRadius: '3px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: '#fbbf24', transition: 'width 0.3s ease' }} />
        </div>
      </div>

      {/* Question Card */}
      <div style={{ 
        background: '#0a0a0a', 
        border: '1px solid #1f1f22', 
        borderRadius: '16px', 
        padding: '2.5rem',
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)'
      }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.5, marginBottom: '2rem' }}>
          {currentQ.question}
        </h2>
        
        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {currentQ.options.map((opt, i) => {
            const isSelected = answers[currentIndex] === opt;
            return (
              <button
                key={i}
                onClick={() => handleSelectOption(opt)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '1.25rem 1.5rem',
                  background: isSelected ? 'rgba(251, 191, 36, 0.1)' : '#121212',
                  border: `1px solid ${isSelected ? '#fbbf24' : '#1f1f22'}`,
                  color: isSelected ? '#fbbf24' : '#e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative'
                }}
                onMouseEnter={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = '#333336';
                }}
                onMouseLeave={e => {
                  if (!isSelected) e.currentTarget.style.borderColor = '#1f1f22';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    minWidth: '24px', height: '24px', borderRadius: '50%',
                    border: `2px solid ${isSelected ? '#fbbf24' : '#52525b'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {isSelected && <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#fbbf24' }} />}
                  </div>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1f1f22' }}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              background: 'transparent', color: currentIndex === 0 ? '#52525b' : '#a1a1aa',
              border: 'none', cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              fontSize: '0.95rem', fontWeight: 500
            }}
          >
            <ChevronLeft size={18} /> Prev
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={Object.keys(answers).length < questions.length && !answers[currentIndex]}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: '#10b981', color: '#000000', padding: '0.6rem 1.5rem',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '0.95rem', fontWeight: 600, transition: 'opacity 0.2s',
                opacity: (Object.keys(answers).length < questions.length && !answers[currentIndex]) ? 0.5 : 1
              }}
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: '#ffffff', color: '#000000', padding: '0.5rem 1.25rem',
                border: 'none', borderRadius: '8px', cursor: 'pointer',
                fontSize: '0.95rem', fontWeight: 600
              }}
            >
              Next <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
