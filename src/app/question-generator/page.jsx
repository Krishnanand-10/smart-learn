'use client';

import { useState, useEffect } from 'react';
import { HelpCircle, RefreshCw, CheckCircle, XCircle, Inbox } from 'lucide-react';
import Link from 'next/link';

export default function QuestionGenerator() {
  const [selectedTopic, setSelectedTopic] = useState('All Topics');
  const [dropdownTopics, setDropdownTopics] = useState([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]); // Empty state by default
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  const generateNewQuestion = (topicName) => {
    const topic = topicName === 'All Topics' ? (dropdownTopics[0] || "General Subject") : topicName;
    const templates = [
      {
        q: `What is the primary functional use-case of ${topic}?`,
        o: ["To process incoming baseline logic", "To serve as the core structural component", "To handle physical storage tracking", "To deprecate outdated frameworks"],
        ca: 1,
        ex: `The core structural component represents the single most crucial attribute of ${topic} when applying it in real-world environments.`
      },
      {
        q: `Which of the following describes a critical vulnerability regarding ${topic}?`,
        o: ["Systematic over-reliance on local caching", "High susceptibility to structural collapse", "Inherently incompatible metric types", "Unpredictable data race conditions"],
        ca: 1,
        ex: `Due to its specific architectural design, ${topic} is highly susceptible to structural collapse during maximum load scenarios.`
      },
      {
         q: `How does ${topic} typically integrate with external exam concepts?`,
         o: ["Through synchronous API polling routes", "By establishing persistent websocket instances", "Via decoupled message queuing principles", "It explicitly avoids external integration natively"],
         ca: 2,
         ex: `Decoupled message queuing represents the absolute educational standard for learning how ${topic} operates safely in a vacuum.`
      }
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return {
      id: Math.random(),
      topic: topic,
      question: randomTemplate.q,
      options: randomTemplate.o,
      correctArea: randomTemplate.ca,
      explanation: randomTemplate.ex
    };
  };

  useEffect(() => {
    const saved = localStorage.getItem('examBrain_topics');
    if (saved) {
      const parsedTopics = JSON.parse(saved);
      if (parsedTopics && parsedTopics.length > 0) {
        setDropdownTopics(parsedTopics);
        setSelectedTopic(parsedTopics[0]);
        setQuestions([generateNewQuestion(parsedTopics[0])]);
      }
    }
  }, []);

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionSelect = (index) => {
    if (showAnswer) return;
    setSelectedOption(index);
    setShowAnswer(true);
  };

  const currentQuestion = questions[currentQuestionIdx];

  return (
    <main className="main-content">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Practice Questions</h1>
          <p style={{ color: 'var(--text-main)', margin: 0 }}>Test your knowledge on extracted topics.</p>
        </div>
        <select 
          value={selectedTopic} 
          onChange={(e) => {
            setSelectedTopic(e.target.value);
            setShowAnswer(false);
            setSelectedOption(null);
            setQuestions([generateNewQuestion(e.target.value)]);
            setCurrentQuestionIdx(0);
          }}
          style={{ background: 'var(--panel-bg)', color: 'var(--text-main)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)' }}
          disabled={questions.length === 0}
        >
          <option>All Topics</option>
          {dropdownTopics.map((topic, idx) => (
            <option key={idx} value={topic}>{topic}</option>
          ))}
        </select>
      </header>

      {questions.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem', opacity: 0.7 }}>
          <Inbox size={48} style={{ margin: '0 auto 1rem', display: 'block' }} />
          <h3>No exams yet</h3>
          <p>Upload your syllabus to generate questions.</p>
          <Link href="/input-hub" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>Go to Input Hub</Link>
        </div>
      ) : (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'var(--text-main)', fontSize: '0.9rem' }}>
            <span>Question {currentQuestionIdx + 1}</span>
            <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{currentQuestion.topic}</span>
          </div>

          <div className="glass-panel" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', lineHeight: '1.5', marginBottom: '2rem' }}>
              {currentQuestion.question}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {currentQuestion.options.map((opt, idx) => {
                let borderCol = 'var(--border-color)';
                let bgCol = 'rgba(0,0,0,0.2)';
                
                if (showAnswer) {
                  if (idx === currentQuestion.correctArea) {
                    borderCol = '#4CAF50';
                    bgCol = 'rgba(76, 175, 80, 0.1)';
                  } else if (idx === selectedOption) {
                    borderCol = '#F44336';
                    bgCol = 'rgba(244, 67, 54, 0.1)';
                  }
                } else if (idx === selectedOption) {
                  borderCol = 'var(--accent-color)';
                  bgCol = 'rgba(102, 252, 241, 0.1)';
                }

                return (
                  <button 
                    key={idx}
                    onClick={() => handleOptionSelect(idx)}
                    disabled={showAnswer}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '1rem', 
                      padding: '1rem', 
                      background: bgCol, 
                      border: `1px solid ${borderCol}`, 
                      borderRadius: 'var(--radius)', 
                      color: 'white', 
                      cursor: showAnswer ? 'default' : 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: `1px solid ${borderCol}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {showAnswer && idx === currentQuestion.correctArea && <CheckCircle size={16} color="#4CAF50" />}
                      {showAnswer && idx === selectedOption && idx !== currentQuestion.correctArea && <XCircle size={16} color="#F44336" />}
                    </div>
                    {opt}
                  </button>
                )
              })}
            </div>
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
