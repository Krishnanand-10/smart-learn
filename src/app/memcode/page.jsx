import { Suspense } from 'react';
import MemCodeClient from './MemCodeClient';

export default function MemCodePage() {
  return (
    <Suspense fallback={<main className="main-content"><p style={{ color: 'var(--text-main)' }}>Loading...</p></main>}>
      <MemCodeClient />
    </Suspense>
  );
}
