'use client';

import { useState } from 'react';
import GenerationForm from '@/components/GenerationForm';
import SummaryViewer from '@/components/SummaryViewer';

export default function InputHubPage() {
  const [summaryData, setSummaryData] = useState(null);

  return (
    <>
      {!summaryData ? (
        <GenerationForm 
          title="Summarize Content"
          subtitle="Extract high-yield executive summaries from long-winded documents, research papers, or exhausting video lectures."
          resourceName="Summary"
          apiEndpoint="/api/summarize"
          onGenerated={setSummaryData}
        />
      ) : (
        <div className="main-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5vh' }}>
          <SummaryViewer data={summaryData} />
          
          <button 
            onClick={() => setSummaryData(null)}
            style={{
              marginTop: '3rem',
              background: 'transparent',
              color: '#a1a1aa',
              border: '1px solid #333336',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 500,
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = '#52525b';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#a1a1aa';
              e.currentTarget.style.borderColor = '#333336';
            }}
          >
            Summarize Another Topic
          </button>
        </div>
      )}
    </>
  );
}
