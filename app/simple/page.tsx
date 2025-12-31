// Removed edge runtime - not compatible with Cloudflare Pages
// export const runtime = 'edge';

export default function SimplePage() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Simple Test Page</h1>
      <p>If you see this, edge runtime is working!</p>
    </div>
  );
}

