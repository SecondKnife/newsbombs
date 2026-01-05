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
    }
    
    // Method 2: globalThis (fallback for some edge runtimes)
    if (!apiUrl && typeof globalThis !== 'undefined') {
      apiUrl = (globalThis as any).NEXT_PUBLIC_API_URL;
    }
    
    if (apiUrl && typeof apiUrl === 'string' && apiUrl.trim() !== '') {
      return apiUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
    }
  } catch (error) {
    console.warn('Error reading API URL:', error);
  }
  
  // Fallback to backend URL
  return 'http://157.66.100.32:3001';
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (parseError: any) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate request body
    if (!body || !body.email || !body.password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const API_BASE_URL = getApiBaseUrl();
    const backendUrl = `${API_BASE_URL}/api/auth/login`;
    
    console.log('Forwarding login request to:', backendUrl);
    
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
        return NextResponse.json(
          { 
            message: `Invalid backend URL: ${backendUrl}. Please check NEXT_PUBLIC_API_URL environment variable.`,
            error: 'InvalidURL',
            backendUrl: backendUrl
          },
          { status: 500 }
        );
      }
      
      // Check if it's a network error
      if (fetchError.message?.includes('fetch') || fetchError.message?.includes('network')) {
        return NextResponse.json(
          { 
            message: `Cannot connect to backend at ${backendUrl}. Please ensure backend is running and accessible.`,
            error: 'NetworkError',
            backendUrl: backendUrl
          },
          { status: 503 }
        );
      }
      
      return NextResponse.json(
        { 
          message: `Failed to connect to backend: ${fetchError.message || 'Unknown network error'}`,
          error: fetchError.name || 'FetchError',
          backendUrl: backendUrl
        },
        { status: 503 }
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
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError: any) {
      console.error('Error parsing response JSON:', jsonError);
      return NextResponse.json(
        { message: 'Invalid response from backend' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Login proxy error:', error);
    
    // Return detailed error message for debugging
    const errorMessage = error.message || 'An error occurred during login';
    const errorStack = error.stack || '';
    
    // Log full error details
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      name: error.name,
      cause: error.cause,
    });
    
    return NextResponse.json(
      { 
        message: errorMessage,
        error: error.name || 'UnknownError',
        // Only include stack in development
        ...(process.env.NODE_ENV === 'development' && { stack: errorStack })
      },
      { status: 500 }
    );
  }
}

