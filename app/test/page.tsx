export const runtime = 'edge';

export default async function TestPage() {
  try {
    // Test 1: Basic rendering
    const test1 = 'Basic rendering works';
    
    // Test 2: Environment variable
    let apiUrl = '';
    try {
      if (typeof process !== 'undefined' && process.env) {
        apiUrl = process.env.NEXT_PUBLIC_API_URL || 'not found in process.env';
      } else {
        apiUrl = 'process is undefined';
      }
    } catch (e: any) {
      apiUrl = `Error: ${e.message}`;
    }
    
    // Test 3: Fetch from backend
    let fetchResult = 'not attempted';
    try {
      const backendUrl = 'http://157.66.100.32:3001/api/articles';
      const response = await fetch(backendUrl, {
        headers: { 'Accept': 'application/json' },
      });
      fetchResult = `Status: ${response.status} ${response.statusText}`;
    } catch (e: any) {
      fetchResult = `Error: ${e.message}`;
    }
    
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>Test Page</h1>
        <div style={{ marginTop: '20px' }}>
          <h2>Test 1: Basic Rendering</h2>
          <p>{test1}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2>Test 2: Environment Variable</h2>
          <p>NEXT_PUBLIC_API_URL: {apiUrl}</p>
        </div>
        <div style={{ marginTop: '20px' }}>
          <h2>Test 3: Fetch from Backend</h2>
          <p>{fetchResult}</p>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace', color: 'red' }}>
        <h1>Error in Test Page</h1>
        <p>{error?.message || String(error)}</p>
        <pre>{error?.stack || 'No stack trace'}</pre>
      </div>
    );
  }
}

