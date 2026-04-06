'use client';

import { useState, useRef } from 'react';
import { UploadCloud, Link, FileText, Film, Music, CheckCircle, X, AlertCircle } from 'lucide-react';

const FILE_TYPES = {
  'application/pdf': { label: 'PDF', icon: FileText, color: '#ef4444' },
  'video/mp4': { label: 'Video', icon: Film, color: '#8b5cf6' },
  'video/webm': { label: 'Video', icon: Film, color: '#8b5cf6' },
  'video/ogg': { label: 'Video', icon: Film, color: '#8b5cf6' },
  'audio/mpeg': { label: 'Audio', icon: Music, color: '#f59e0b' },
  'audio/wav': { label: 'Audio', icon: Music, color: '#f59e0b' },
  'audio/ogg': { label: 'Audio', icon: Music, color: '#f59e0b' },
  'audio/mp4': { label: 'Audio', icon: Music, color: '#f59e0b' },
  'image/png': { label: 'Image', icon: FileText, color: '#10b981' },
  'image/jpeg': { label: 'Image', icon: FileText, color: '#10b981' },
};

export default function InputHub() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [linkInput, setLinkInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const getFileInfo = (file) => FILE_TYPES[file?.type] || { label: 'File', icon: FileText, color: '#6366f1' };

  const handleFile = (file) => {
    setError('');
    setSaved(false);
    setUploadedFile(file);
    // Store file metadata in localStorage for other pages to use
    localStorage.setItem('smartLearn_content', JSON.stringify({
      type: 'file',
      name: file.name,
      fileType: file.type,
      size: file.size,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleLinkSave = () => {
    if (!linkInput.trim()) { setError('Please enter a valid URL.'); return; }
    try {
      new URL(linkInput.trim());
    } catch {
      setError('Invalid URL. Please include https://');
      return;
    }
    setError('');
    localStorage.setItem('smartLearn_content', JSON.stringify({
      type: 'link',
      url: linkInput.trim(),
    }));
    setSaved(true);
  };

  const clearContent = () => {
    setUploadedFile(null);
    setLinkInput('');
    setSaved(false);
    setError('');
    localStorage.removeItem('smartLearn_content');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const fileInfo = uploadedFile ? getFileInfo(uploadedFile) : null;
  const FileIcon = fileInfo?.icon || FileText;

  return (
    <main className="main-content">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Input Hub</h1>
        <p style={{ color: 'var(--text-main)' }}>
          Upload a PDF, video, or audio file — or paste a link — to power your AI tutor, flashcards, and quizzes.
        </p>
      </header>

      {/* Tab Switcher */}
      <div className="glass-panel">
        <div style={{ display: 'flex', gap: '0', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <button
            className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => { setActiveTab('upload'); setError(''); }}
          >
            <UploadCloud size={16} /> File Upload
          </button>
          <button
            className={`tab-btn ${activeTab === 'link' ? 'active' : ''}`}
            onClick={() => { setActiveTab('link'); setError(''); }}
          >
            <Link size={16} /> Paste Link
          </button>
        </div>

        {/* File Upload Tab */}
        {activeTab === 'upload' && (
          <div>
            {!uploadedFile ? (
              <div
                className="upload-dropzone"
                style={{
                  border: `2px dashed ${isDragging ? 'var(--accent-color)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius)',
                  padding: '4rem 2rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  background: isDragging ? 'rgba(99,102,241,0.05)' : 'transparent',
                  position: 'relative',
                }}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,video/*,audio/*,image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <UploadCloud size={48} color="var(--accent-color)" style={{ marginBottom: '1rem', opacity: 0.8 }} />
                <h3 style={{ color: 'var(--text-highlight)', marginBottom: '0.5rem' }}>
                  {isDragging ? 'Drop it here!' : 'Drag & Drop or Click to Browse'}
                </h3>
                <p style={{ color: 'var(--text-main)', fontSize: '0.875rem' }}>
                  Supports PDF, MP4, MP3, WAV, PNG, JPG
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '1.25rem',
                padding: '1.5rem', border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)', background: 'rgba(16,185,129,0.04)'
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '12px',
                  background: `${fileInfo.color}22`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <FileIcon size={24} color={fileInfo.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: 'var(--text-highlight)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {uploadedFile.name}
                  </p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-main)' }}>
                    {fileInfo.label} · {(uploadedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.875rem', fontWeight: 600 }}>
                    <CheckCircle size={16} /> Ready
                  </span>
                  <button onClick={clearContent} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', padding: '4px', borderRadius: '4px', display: 'flex' }}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Link Paste Tab */}
        {activeTab === 'link' && (
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem', color: 'var(--text-highlight)' }}>
              Paste a URL
            </label>
            <p style={{ color: 'var(--text-main)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
              Works with articles, YouTube videos, Wikipedia pages, documentation, blog posts, and more.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <input
                type="url"
                value={linkInput}
                onChange={(e) => { setLinkInput(e.target.value); setSaved(false); setError(''); }}
                placeholder="https://example.com/article"
                style={{ flex: 1, minWidth: '200px' }}
                onKeyDown={(e) => e.key === 'Enter' && handleLinkSave()}
              />
              <button className="btn-primary" onClick={handleLinkSave}>
                <Link size={16} /> Save Link
              </button>
            </div>

            {error && (
              <p style={{ marginTop: '0.75rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                <AlertCircle size={15} /> {error}
              </p>
            )}

            {saved && (
              <div style={{
                marginTop: '1.25rem', padding: '1rem 1.25rem',
                border: '1px solid var(--border-color)', borderRadius: 'var(--radius)',
                background: 'rgba(16,185,129,0.04)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                  <Link size={18} color="#10b981" />
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-highlight)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {linkInput}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  <span style={{ color: '#10b981', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle size={16} /> Saved
                  </span>
                  <button onClick={clearContent} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', display: 'flex' }}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom hint */}
        {(uploadedFile || saved) && (
          <p style={{ marginTop: '1.5rem', fontSize: '0.82rem', color: 'var(--text-main)', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
            ✅ Content saved. Head to <strong>AI Tutor Chat</strong>, <strong>Flashcards</strong>, or <strong>Quiz</strong> to use it.
          </p>
        )}
      </div>
    </main>
  );
}
