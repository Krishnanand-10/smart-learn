'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';

export default function FlashcardViewer({ cards, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!cards || cards.length === 0) return null;

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.min(prev + 1, cards.length - 1));
    }, 150);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => Math.max(prev - 1, 0));
    }, 150);
  };

  const isLastCard = currentIndex === cards.length - 1;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '700px', margin: '0 auto', paddingTop: '2rem'
    }}>
      {/* Progress Bar */}
      <div style={{ width: '100%', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-subtle)', fontWeight: 600 }}>
          {currentIndex + 1} / {cards.length}
        </span>
        <div style={{ flex: 1, height: '6px', background: 'var(--border-color)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ 
            height: '100%', 
            background: 'var(--accent-color)', 
            width: `${((currentIndex + 1) / cards.length) * 100}%`,
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Flashcard 3D Wrapper */}
      <div 
        style={{
          perspective: '1000px',
          width: '100%',
          height: '400px',
          cursor: 'pointer',
          marginBottom: '3rem'
        }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}>
          
          {/* Front of Card */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: 'var(--bg-sidebar)',
            border: '1px solid var(--border-color)',
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem',
            textAlign: 'center',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
          }}>
            <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-subtle)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RotateCw size={14} /> Click to flip
            </span>
            <p style={{ fontSize: '1.5rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.6 }}>
              {currentCard.question || currentCard.Question || currentCard.front || currentCard.Front || 'Question missing'}
            </p>
          </div>

          {/* Back of Card */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            backgroundColor: 'var(--accent-color)', 
            borderRadius: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '3rem',
            textAlign: 'center',
            transform: 'rotateY(180deg)',
            boxShadow: '0 20px 60px -15px rgba(139, 92, 246, 0.3)'
          }}>
            <p style={{ fontSize: '1.35rem', fontWeight: 500, color: 'var(--btn-text, #000000)', lineHeight: 1.6 }}>
              {currentCard.answer || currentCard.Answer || currentCard.back || currentCard.Back || 'Answer missing'}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
        <button 
          onClick={handlePrev} 
          disabled={currentIndex === 0}
          style={{
            background: 'var(--bg-sidebar)',
            border: '1px solid var(--border-color)',
            color: currentIndex === 0 ? '#52525b' : '#ffffff',
            padding: '0.85rem 1.5rem',
            borderRadius: '12px',
            cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            fontWeight: 600, transition: 'all 0.2s'
          }}
        >
          <ArrowLeft size={18} /> Previous
        </button>

        {!isLastCard ? (
          <button 
            onClick={handleNext} 
            style={{
              background: '#ffffff',
              border: 'none',
              color: '#000000',
              padding: '0.85rem 1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontWeight: 600, transition: 'all 0.2s'
            }}
          >
            Next <ArrowRight size={18} />
          </button>
        ) : (
          <button 
            onClick={onFinish} 
            style={{
              background: '#10b981', // green finish
              border: 'none',
              color: '#ffffff',
              padding: '0.85rem 1.5rem',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              fontWeight: 600, transition: 'all 0.2s',
              boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)'
            }}
          >
            Finish Deck <CheckCircle2 size={18} />
          </button>
        )}
      </div>

    </div>
  );
}
