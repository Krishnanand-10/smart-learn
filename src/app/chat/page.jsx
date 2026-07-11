'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader, Link, FileText, Film, Music, Trash2, Paperclip, X } from 'lucide-react';



function getContextInfo(content) {
  if (!content) return null;
  if (content.type === 'link') return { label: content.url, icon: Link, color: '#6366f1' };
  if (content.fileType?.startsWith('video/')) return { label: content.name, icon: Film, color: '#8b5cf6' };
  if (content.fileType?.startsWith('audio/')) return { label: content.name, icon: Music, color: '#f59e0b' };
  return { label: content.name, icon: FileText, color: '#ef4444' };
}

function formatInline(text) {
  if (!text) return '';
  const parts = [];
  const boldItalicRegex = /(\*\*\*.*?\*\*\*)|(\*\*.*?\*\*)|(\*.*?\*)/g;
  let match;
  let lastIndex = 0;
  
  while ((match = boldItalicRegex.exec(text)) !== null) {
    const matchText = match[0];
    const matchIndex = match.index;
    
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }
    
    if (matchText.startsWith('***') && matchText.endsWith('***')) {
      parts.push(<strong key={matchIndex}><em>{matchText.slice(3, -3)}</em></strong>);
    } else if (matchText.startsWith('**') && matchText.endsWith('**')) {
      parts.push(<strong key={matchIndex}>{matchText.slice(2, -2)}</strong>);
    } else if (matchText.startsWith('*') && matchText.endsWith('*')) {
      parts.push(<em key={matchIndex}>{matchText.slice(1, -1)}</em>);
    }
    
    lastIndex = boldItalicRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return parts.length > 0 ? parts : text;
}

function parseMarkdown(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, index) => {
    let content = line;
    
    // Headers
    const headerMatch = content.match(/^(#{1,6})\s+(.*)$/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const textVal = headerMatch[2];
      const Tag = `h${level}`;
      const sizeMap = { h1: '1.4rem', h2: '1.2rem', h3: '1.05rem' };
      return (
        <Tag key={index} style={{ 
          margin: '0.75rem 0 0.4rem 0', 
          fontWeight: '700', 
          fontSize: sizeMap[Tag] || '1rem',
          color: 'var(--text-highlight)'
        }}>
          {formatInline(textVal)}
        </Tag>
      );
    }
    
    // Bullet lists
    const listMatch = content.match(/^[\*\-\+]\s+(.*)$/);
    if (listMatch) {
      return (
        <ul key={index} style={{ margin: '0.2rem 0 0.2rem 1.2rem', paddingLeft: '0', listStyleType: 'disc' }}>
          <li style={{ margin: '0.1rem 0' }}>{formatInline(listMatch[1])}</li>
        </ul>
      );
    }
    
    // Empty line
    if (!content.trim()) {
      return <div key={index} style={{ height: '0.5rem' }} />;
    }
    
    // Normal paragraph
    return <p key={index} style={{ margin: '0.35rem 0' }}>{formatInline(content)}</p>;
  });
}

export default function Chat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: "Hi! I'm your AI tutor. Ask me anything — about your uploaded content or any topic you're studying." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedContent, setSavedContent] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem('smartLearn_content');
    if (stored) setSavedContent(JSON.parse(stored));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const newMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      let systemContext = 'You are a helpful and extremely intelligent AI study tutor. Be concise, clear, and educational.';
      
      if (uploadedFile) {
        const uploadFormData = new FormData();
        uploadFormData.append('file', uploadedFile);

        const parseRes = await fetch('/api/parse-file', {
          method: 'POST',
          body: uploadFormData,
        });

        const parseData = await parseRes.json();
        if (!parseRes.ok) {
          throw new Error(parseData.error || 'Failed to extract text from file.');
        }

        const fileText = parseData.text || '';
        systemContext += `\n\nThe user has attached a document named "${uploadedFile.name}". Reference it heavily context:\n\n${fileText.substring(0, 15000)}`;
      } else if (savedContent?.type === 'link') {
        systemContext += `\n\nThe user has provided this reference link: ${savedContent.url}. Use this as context.`;
      }

      // Convert our UI message format into strict OpenAI format
      const openAiMessages = [
        { role: 'system', content: systemContext },
        ...newMessages.filter(m => m.role !== 'error').map(m => ({
          role: m.role,
          content: m.text
        }))
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: openAiMessages }),
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
                background: msg.role === 'user' ? '#3b82f6' : msg.role === 'error' ? '#ef4444' : 'var(--border-color)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {msg.role === 'user' ? <User size={16} color="white" /> : <Bot size={16} color="var(--text-highlight)" />}
              </div>
              {/* Bubble */}
              <div style={{
                maxWidth: '75%', padding: '0.75rem 1rem',
                borderRadius: msg.role === 'user' ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                background: msg.role === 'user' ? '#3b82f6' : msg.role === 'error' ? 'rgba(239,68,68,0.1)' : 'var(--panel-bg)',
                border: '1px solid',
                color: msg.role === 'user' ? '#ffffff' : msg.role === 'error' ? '#ef4444' : 'var(--text-highlight)',
                fontSize: '0.9rem', lineHeight: '1.6',
                borderColor: msg.role === 'user' ? '#2563eb' : msg.role === 'error' ? '#ef4444' : 'var(--border-color)'
              }}>
                {parseMarkdown(msg.text)}
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

        {/* Input Region */}
        <div style={{ borderTop: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
          
          {/* Attached File Pill */}
          {uploadedFile && (
            <div style={{ padding: '0.75rem 1.5rem 0 1.5rem', display: 'flex' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', gap: '0.5rem', 
                background: 'var(--border-color)', padding: '0.4rem 0.75rem', 
                borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-highlight)',
                border: '1px solid var(--border-hover)'
              }}>
                <FileText size={14} color="var(--accent-color)" />
                <span style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {uploadedFile.name}
                </span>
                <button 
                  onClick={() => setUploadedFile(null)} 
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', marginLeft: '0.25rem' }}
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Input Bar */}
          <div style={{ padding: '1rem 1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <button
              title="Clear chat"
              onClick={() => {
                setMessages([{ role: 'assistant', text: "Hi! I'm your AI tutor. Ask me anything — about your uploaded content or any topic you're studying." }]);
                setUploadedFile(null);
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '6px', borderRadius: '8px', display: 'flex', flexShrink: 0 }}
            >
              <Trash2 size={18} />
            </button>
            <label 
              title="Upload Document"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '6px', borderRadius: '8px', display: 'flex', flexShrink: 0 }}
            >
              <Paperclip size={18} />
              <input 
                type="file" 
                style={{ display: 'none' }} 
                onChange={(e) => {
                  if (e.target.files[0]) setUploadedFile(e.target.files[0]);
                }} 
              />
            </label>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder={uploadedFile ? `Ask about ${uploadedFile.name}...` : "Ask a question..."}
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
      </div>
    </main>
  );
}
