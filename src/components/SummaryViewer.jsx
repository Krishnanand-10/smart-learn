import { useState } from 'react';
import { AlignLeft, CheckCircle2, ChevronRight, FileText } from 'lucide-react';

export default function SummaryViewer({ data }) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState(null);

  if (!data) return null;

  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/save-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'summary',
          payload: {
            title: data.title || 'Generated Summary',
            prompt: '',
            executiveSummary: data.executiveSummary,
            keyPoints: data.keyPoints,
            conclusion: data.conclusion
          }
        })
      });

      const dataJson = await res.json();
      if (!res.ok) throw new Error(dataJson.error || 'Failed to save summary.');

      setSaved(true);
    } catch (err) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '2.5rem', 
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(to right, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))',
        border: '1px solid #1f1f22',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <div style={{ background: '#121212', padding: '0.75rem', borderRadius: '12px', border: '1px solid #333336' }}>
            <FileText size={32} color="#fbbf24" />
          </div>
        </div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
          {data.title || "Content Summary"}
        </h1>
        <p style={{ color: 'var(--text-subtle)', fontSize: '0.95rem' }}>
          AI-generated synthesis
        </p>

        {/* Save Actions */}
        <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
          <button 
            onClick={handleSave}
            disabled={saving || saved}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: saved ? 'rgba(16, 185, 129, 0.2)' : '#10b981',
              color: saved ? '#10b981' : '#000000',
              border: saved ? '1px solid #10b981' : 'none',
              padding: '0.6rem 1.25rem',
              borderRadius: '8px',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: saving || saved ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {saving ? 'Saving...' : saved ? 'Saved to Dashboard' : 'Save to Dashboard'}
          </button>
          {saveError && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              {saveError}
            </p>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Executive Summary */}
        <div style={{ 
          background: '#0a0a0a', 
          border: '1px solid #1f1f22', 
          borderRadius: '12px', 
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <AlignLeft size={20} color="#3b82f6" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff' }}>Executive Summary</h2>
          </div>
          <p style={{ 
            color: '#e2e8f0', 
            fontSize: '1.05rem', 
            lineHeight: 1.7,
            position: 'relative',
            zIndex: 1 
          }}>
            {data.executiveSummary}
          </p>
        </div>

        {/* Key Points */}
        <div style={{ 
          background: '#0a0a0a', 
          border: '1px solid #1f1f22', 
          borderRadius: '12px', 
          padding: '2rem' 
        }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 600, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 size={20} color="#10b981" />
            Key Takeaways
          </h2>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.keyPoints?.map((point, index) => (
              <li key={index} style={{ 
                display: 'flex', 
                alignItems: 'flex-start', 
                gap: '1rem',
                background: '#121212',
                padding: '1.25rem',
                borderRadius: '8px',
                borderLeft: '4px solid #fbbf24'
              }}>
                <ChevronRight size={18} color="#fbbf24" style={{ marginTop: '0.2rem', minWidth: '18px' }} />
                <span style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.5 }}>
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Conclusion */}
        {data.conclusion && (
          <div style={{ 
            background: 'rgba(251, 191, 36, 0.05)', 
            border: '1px solid rgba(251, 191, 36, 0.2)', 
            borderRadius: '12px', 
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Conclusion
            </strong>
            <span style={{ color: '#ffffff', fontSize: '1.1rem', fontStyle: 'italic', lineHeight: 1.5 }}>
              "{data.conclusion}"
            </span>
          </div>
        )}

      </div>
    </div>
  );
}
