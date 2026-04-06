'use client';

import { useState } from 'react';
import { UploadCloud, File, Type, CheckCircle } from 'lucide-react';

export default function InputHub() {
  const [activeTab, setActiveTab] = useState('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [textInput, setTextInput] = useState('');
  const [topicInput, setTopicInput] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleSimulateUpload = () => {
    setIsProcessing(true);
    setSuccess(false);
    setTimeout(() => {
      // Create a global list of generated topics based on what the user inputted
      let savedTopics = [];
      if (activeTab === 'manual' && topicInput.trim()) {
        savedTopics.push(topicInput.trim());
      } else if (activeTab === 'text' && textInput.trim()) {
        const words = textInput.split(' ');
        const extractedTopic = words.length > 2 ? words.slice(0, 3).join(' ') + '...' : 'Custom Notes';
        savedTopics.push(extractedTopic);
      } else if (activeTab === 'upload' && uploadedFile) {
        // Mocking AI file parsing: Extract the file name, strip extensions & symbols, format it into a Topic.
        let parsedTopic = uploadedFile.name.split('.')[0].replace(/[-_]/g, ' ');
        // Title Case capitalization
        parsedTopic = parsedTopic.replace(/\b\w/g, l => l.toUpperCase());
        savedTopics.push(`${parsedTopic} (From File)`);
      }

      if (savedTopics.length > 0) {
        localStorage.setItem('smartLearn_topics', JSON.stringify(savedTopics));
      }

      setIsProcessing(false);
      setSuccess(true);
    }, 1500); 
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0]);
      setSuccess(false); // Reset success state when a new file is uploaded
    }
  };

  return (
    <main className="main-content">
      <header style={{ marginBottom: '2rem' }}>
        <h1 style={{ marginBottom: '0.5rem' }}>Input Hub & Data Processing</h1>
        <p style={{ color: 'var(--text-main)' }}>Upload your notes, syllabus, or paste text directly for AI analysis.</p>
      </header>

      <div className="glass-panel">
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
            <div className="upload-area" style={{ textAlign: 'center', padding: '4rem 2rem', border: uploadedFile ? '2px solid #4CAF50' : '2px dashed var(--border-color)', borderRadius: 'var(--radius)', position: 'relative', background: uploadedFile ? 'rgba(76, 175, 80, 0.05)' : 'transparent', transition: 'all 0.3s ease' }}>
              <input 
                type="file" 
                accept=".pdf,image/*,.txt,.docx"
                onChange={handleFileChange}
                title="Upload Document"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
              />
              <UploadCloud size={48} color={uploadedFile ? '#4CAF50' : 'var(--accent-color)'} style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: uploadedFile ? '#4CAF50' : 'white' }}>{uploadedFile ? uploadedFile.name : "Drag & Drop Files Here"}</h3>
              {uploadedFile ? (
                 <p style={{ margin: '1rem 0', color: '#8BC34A', fontWeight: 'bold' }}>Document uploaded and ready for processing!</p>
              ) : (
                 <p style={{ margin: '1rem 0' }}>Supports PDF, Images (Notes), and Question Papers</p>
              )}
              {!uploadedFile && <button className="btn-primary" style={{ pointerEvents: 'none' }}>Browse Files</button>}
            </div>
          )}

          {activeTab === 'text' && (
            <div className="text-area-container">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Raw Text or Syllabus</label>
              <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
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
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
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
