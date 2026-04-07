'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader, Link, FileText, Film, Music, Trash2 } from 'lucide-react';



function getContextInfo(content) {
  if (!content) return null;
  if (content.type === 'link') return { label: content.url, icon: Link, color: '#6366f1' };
  if (content.fileType?.startsWith('video/')) return { label: content.name, icon: Film, color: '#8b5cf6' };
  if (content.fileType?.startsWith('audio/')) return { label: content.name, icon: Music, color: '#f59e0b' };
  return { label: content.name, icon: FileText, color: '#ef4444' };
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI tutor. Ask me anything — about your uploaded content or any topic you're studying." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedContent, setSavedContent] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('smartLearn_content');
    if (stored) setSavedContent(JSON.parse(stored));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const buildPrompt = (userMessage) => {
    let systemContext = '';
    if (savedContent?.type === 'link') {
      systemContext = `The user has provided this reference link: ${savedContent.url}. Use this as context if relevant to their question.`;
    } else if (savedContent?.type === 'file') {
      systemContext = `The user has uploaded a file named "${savedContent.name}" (type: ${savedContent.fileType}). Reference it when answering if relevant.`;
    }

    const history = messages
      .filter(m => m.role !== 'error')
      .map(m => `${m.role === 'assistant' ? 'AI' : 'Student'}: ${m.text}`)
      .join('\n');

    return `You are a helpful AI tutor. Be concise, clear, and educational.
${systemContext}

Conversation so far:
${history}

Student: ${userMessage}
AI:`;
  };

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', text: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: buildPrompt(trimmed) }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'API error');
      const reply = data?.reply || 'Sorry, I could not generate a response.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'error', text: err.message || 'Failed to reach the AI. Please try again.' }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const contextInfo = getContextInfo(savedContent);
  const CtxIcon = contextInfo?.icon;

  return (
    <main className="main-content">
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ marginBottom: '0.25rem' }}>AI Tutor Chat</h1>
        <p style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>Ask anything about your uploaded content or any topic.</p>
      </header>

      {/* Context badge */}
      {contextInfo && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.6rem 1rem', marginBottom: '1rem',
          border: '1px solid var(--border-color)', borderRadius: 'var(--radius)',
          background: 'var(--panel-bg)', fontSize: '0.8rem', color: 'var(--text-main)'
        }}>
          <CtxIcon size={14} color={contextInfo.color} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            Context: <strong style={{ color: 'var(--text-highlight)' }}>{contextInfo.label}</strong>
          </span>
        </div>
      )}

      {/* Chat Window */}
      <div className="glass-panel" style={{ padding: '0', display: 'flex', flexDirection: 'column', height: '65vh' }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex', gap: '0.75rem',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}>
              {/* Avatar */}
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                background: msg.role === 'user' ? 'var(--accent-color)' : msg.role === 'error' ? '#ef4444' : 'var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {msg.role === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="var(--text-highlight)" />}
              </div>
              {/* Bubble */}
              <div style={{
                maxWidth: '75%', padding: '0.75rem 1rem',
                borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                background: msg.role === 'user' ? 'var(--accent-color)' : msg.role === 'error' ? 'rgba(239,68,68,0.1)' : 'var(--panel-bg)',
                border: '1px solid var(--border-color)',
                color: msg.role === 'user' ? 'white' : msg.role === 'error' ? '#ef4444' : 'var(--text-highlight)',
                fontSize: '0.9rem', lineHeight: '1.6', whiteSpace: 'pre-wrap',
                borderColor: msg.role === 'error' ? '#ef4444' : 'var(--border-color)'
              }}>
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot size={16} color="var(--text-highlight)" />
              </div>
              <div style={{ padding: '0.75rem 1rem', borderRadius: '4px 16px 16px 16px', border: '1px solid var(--border-color)', background: 'var(--panel-bg)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <span className="typing-dot" /><span className="typing-dot" style={{ animationDelay: '0.2s' }} /><span className="typing-dot" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            title="Clear chat"
            onClick={() => setMessages([{ role: 'assistant', text: "Hi! I'm your AI tutor. Ask me anything — about your uploaded content or any topic you're studying." }])}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '6px', borderRadius: '8px', display: 'flex', flexShrink: 0 }}
          >
            <Trash2 size={18} />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Ask a question..."
            style={{ flex: 1 }}
            disabled={loading}
          />
          <button
            className="btn-primary"
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            style={{ flexShrink: 0, padding: '0.65rem' }}
          >
            {loading ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </main>
  );
}
