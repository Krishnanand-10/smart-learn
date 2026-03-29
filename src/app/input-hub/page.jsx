'use client';

import { useState } from 'react';
import { UploadCloud, File, Type, CheckCircle } from 'lucide-react';

export default function InputHub() {
  const [activeTab, setActiveTab] = useState('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setSuccess(false);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccess(true);
    }, 2000); // Simulate API latency
  };

  return (
    <main className="main-content">
      <header style={{ marginBottom: '2rem' }}>
        <h1>Input Hub & Data Processing</h1>
        <p style={{ color: 'var(--text-main)' }}>Upload your notes, syllabus, or paste text directly for AI analysis.</p>
      </header>

      <div className="glass-panel" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
          <button 
            className={`tab-btn ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <UploadCloud size={18} /> File Upload
          </button>
          <button 
            className={`tab-btn ${activeTab === 'text' ? 'active' : ''}`}
            onClick={() => setActiveTab('text')}
          >
            <Type size={18} /> Paste Text
          </button>
          <button 
            className={`tab-btn ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            <File size={18} /> Manual Topics
          </button>
        </div>

        <div className="tab-content" style={{ minHeight: '300px' }}>
          {activeTab === 'upload' && (
            <div className="upload-area" style={{ textAlign: 'center', padding: '4rem 2rem', border: '2px dashed var(--border-color)', borderRadius: 'var(--radius)' }}>
              <UploadCloud size={48} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
              <h3>Drag & Drop Files Here</h3>
              <p style={{ margin: '1rem 0' }}>Supports PDF, Images (Notes), and Question Papers</p>
              <button className="btn-primary">Browse Files</button>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="text-area-container">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Raw Text or Syllabus</label>
              <textarea 
                placeholder="Paste your content here..."
                style={{ width: '100%', height: '250px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'white', padding: '1rem', borderRadius: 'var(--radius)', resize: 'none' }}
              />
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="manual-input">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Topic Name</label>
              <input 
                type="text" 
                placeholder="e.g. Topic 1, Topic 2..."
                style={{ width: '100%', padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-color)', color: 'white', borderRadius: 'var(--radius)', marginBottom: '1rem' }}
              />
              <button className="btn-primary" style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>+ Add Another Topic</button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem' }}>
          {success && <span style={{ color: '#4CAF50', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} /> Processing Complete</span>}
          <button className="btn-primary" onClick={handleSimulateUpload} disabled={isProcessing}>
            {isProcessing ? 'Extracting Data...' : 'Process Content'}
          </button>
        </div>
      </div>
    </main>
  );
}
