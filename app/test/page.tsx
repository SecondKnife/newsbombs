// Remove edge runtime to test if that's the issue
// export const runtime = 'edge';

export default function TestPage() {
  // Make it a simple client component first
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Test Page (No Edge Runtime)</h1>
      <p>If you see this, the page is working without edge runtime.</p>
    </div>
  );
}

