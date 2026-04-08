'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import GenerationForm from '@/components/GenerationForm';
import QuizViewer from '@/components/QuizViewer';

export default function QuizApp() {
  const [questions, setQuestions] = useState(null);

  return (
    <div className="main-content" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Nav Bar */}
      <nav style={{ padding: '2rem 2rem 0', display: 'flex' }}>
        <Link 
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-subtle)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-highlight)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-subtle)'}
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </nav>

      {/* Main Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {!questions ? (
          <GenerationForm 
            title="Generate AI Quiz"
            subtitle="Test your knowledge efficiently. Request a custom number of multiple choice questions based on any subject or text."
            resourceName="multiple choice quiz"
            apiEndpoint="/api/quiz"
            showQuestionCount={true}
            onGenerated={(data) => {
              setQuestions(data);
            }}
          />
        ) : (
          <QuizViewer 
            questions={questions} 
            onRestart={() => setQuestions(null)}
          />
        )}
      </div>
    </div>
  );
}
