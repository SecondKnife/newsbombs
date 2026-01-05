import { NextRequest, NextResponse } from 'next/server';

// Try Node.js runtime first - Edge Runtime may not support HTTP fetch
// If this doesn't work on Cloudflare Pages, we'll need to use Edge Runtime
// but with better error handling
export const runtime = 'edge';

// Get API base URL
// In Edge Runtime, environment variables are available via process.env at build time
// But at runtime, they might need to be accessed differently
function getApiBaseUrl(): string {
  try {
    // Try multiple methods to get environment variable
    let apiUrl: string | undefined;
    
    // Method 1: process.env (works in Edge Runtime)
    if (typeof process !== 'undefined' && process.env) {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log('[getApiBaseUrl] Method 1 (process.env):', apiUrl);
    }
    
    // Method 2: globalThis (fallback for some edge runtimes)
    if (!apiUrl && typeof globalThis !== 'undefined') {
      apiUrl = (globalThis as any).NEXT_PUBLIC_API_URL;
      console.log('[getApiBaseUrl] Method 2 (globalThis):', apiUrl);
    }
    
    if (apiUrl && typeof apiUrl === 'string' && apiUrl.trim() !== '') {
      const cleaned = apiUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
      console.log('[getApiBaseUrl] Found API URL:', cleaned);
      return cleaned;
    }
  } catch (error) {
    console.warn('[getApiBaseUrl] Error reading API URL:', error);
  }
  
  // Fallback to HTTPS tunnel endpoint
  console.log('[getApiBaseUrl] Using fallback: https://api.nhatbinhkt.com');
  return 'https://api.nhatbinhkt.com';
}

export async function POST(request: NextRequest) {
  // Wrap everything in try-catch to ensure we always return JSON
  try {
    console.log('[LOGIN API] Request received');
    
    // Get API URL first to check if it's available
    let API_BASE_URL: string;
    try {
      API_BASE_URL = getApiBaseUrl();
      console.log('[LOGIN API] API_BASE_URL:', API_BASE_URL);
    } catch (urlError: any) {
      console.error('[LOGIN API] Error getting API URL:', urlError);
      return new NextResponse(
        JSON.stringify({ 
          message: 'Failed to get backend URL', 
          error: 'ConfigError',
          details: urlError.message 
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('[LOGIN API] Error parsing request body:', parseError);
      return new NextResponse(
        JSON.stringify({ message: 'Invalid request body', error: 'ParseError' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Validate request body
    if (!body || !body.email || !body.password) {
      return new NextResponse(
        JSON.stringify({ message: 'Email and password are required', error: 'ValidationError' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const backendUrl = `${API_BASE_URL}/api/auth/login`;
    console.log('[LOGIN API] Forwarding login request to:', backendUrl);
    
    // Forward request to backend API
    let response;
    try {
      response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: body.email,
          password: body.password,
        }),
      });
    } catch (fetchError: any) {
      console.error('Fetch error details:', {
        message: fetchError.message,
        name: fetchError.name,
        stack: fetchError.stack,
        cause: fetchError.cause,
      });
      
      // Check if it's a URL-related error
      if (fetchError.message?.includes('URL') || fetchError.message?.includes('Invalid')) {
        return new NextResponse(
          JSON.stringify({ 
            message: `Invalid backend URL: ${backendUrl}. Please check NEXT_PUBLIC_API_URL environment variable.`,
            error: 'InvalidURL',
            backendUrl: backendUrl
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      // Check if it's a network error
      if (fetchError.message?.includes('fetch') || fetchError.message?.includes('network')) {
        return new NextResponse(
          JSON.stringify({ 
            message: `Cannot connect to backend at ${backendUrl}. Please ensure backend is running and accessible.`,
            error: 'NetworkError',
            backendUrl: backendUrl
          }),
          { 
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
      
      return new NextResponse(
        JSON.stringify({ 
          message: `Failed to connect to backend: ${fetchError.message || 'Unknown network error'}`,
          error: fetchError.name || 'FetchError',
          backendUrl: backendUrl
        }),
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!response.ok) {
      let errorText = '';
      let errorData;
      try {
        errorText = await response.text();
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: `Login failed: ${response.status} ${response.statusText}` };
        }
      } catch (textError) {
        errorData = { message: `Login failed: ${response.status} ${response.statusText}` };
      }
      
      console.error('Backend error:', response.status, errorData);
      return new NextResponse(
        JSON.stringify(errorData),
        { 
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError: any) {
      console.error('Error parsing response JSON:', jsonError);
      return new NextResponse(
        JSON.stringify({ message: 'Invalid response from backend', error: 'ParseError' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return new NextResponse(
      JSON.stringify(data),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    // Ensure we always return JSON, even for unexpected errors
    console.error('Login proxy error:', error);
    
    const errorMessage = error?.message || 'An error occurred during login';
    const errorName = error?.name || 'UnknownError';
    const errorStack = error?.stack || '';
    
    // Log full error details
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
      cause: error?.cause,
    });
    
    // Always return JSON response
    try {
      return new NextResponse(
        JSON.stringify({ 
          message: errorMessage,
          error: errorName,
        }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    } catch (responseError: any) {
      // Last resort: return plain text if JSON.stringify fails
      console.error('Failed to create JSON response:', responseError);
      return new NextResponse(
        `Internal Server Error: ${errorMessage}`,
        { 
          status: 500,
          headers: { 'Content-Type': 'text/plain' }
        }
      );
    }
  }
}
