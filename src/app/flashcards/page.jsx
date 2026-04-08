'use client';

import { useState } from 'react';
import GenerationForm from '@/components/GenerationForm';
import FlashcardViewer from '@/components/FlashcardViewer';

export default function FlashcardPage() {
  const [generatedCards, setGeneratedCards] = useState(null);

  return (
    <div className="main-content">
      {!generatedCards ? (
        <GenerationForm 
          title="Generate Flashcards"
          subtitle="Utilize active recall immediately. Upload your lecture notes, point to a video, or describe a topic to instantly auto-generate an interactive flashcard set."
          resourceName="Flashcard Deck"
          apiEndpoint="/api/flashcards"
          onGenerated={setGeneratedCards}
          showQuestionCount={true}
          countLabel="Number of Flashcards"
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5vh' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-highlight)' }}>
              Your Flashcards are Ready!
            </h1>
            <p style={{ color: 'var(--text-subtle)', marginTop: '0.5rem' }}>
              Test your knowledge. Click a card to flip it.
            </p>
          </div>
          <FlashcardViewer 
            cards={generatedCards} 
            onFinish={() => setGeneratedCards(null)} 
          />
        </div>
      )}
    </div>
  );
}
