'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import GenerationForm from '@/components/GenerationForm';
import QuizViewer from '@/components/QuizViewer';

export default function QuizApp() {
  const [questions, setQuestions] = useState(null);

  return (
    <>
      {!questions ? (
        <GenerationForm 
          title="Generate AI Quiz"
          subtitle="Test your knowledge efficiently. Request a custom number of multiple choice questions based on any subject or text."
          resourceName="multiple choice quiz"
          apiEndpoint="/api/quiz"
          showQuestionCount={true}
          onGenerated={(data) => setQuestions(data)}
        />
      ) : (
        <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5vh' }}>
          <QuizViewer 
            questions={questions} 
            onRestart={() => setQuestions(null)}
          />
        </div>
      )}
    </>
  );
}
