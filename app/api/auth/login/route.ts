import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

function getApiBaseUrl(): string {
  try {
    let apiUrl: string | undefined;
    
    if (typeof process !== 'undefined' && process.env) {
      apiUrl = process.env.NEXT_PUBLIC_API_URL;
      console.log('[getApiBaseUrl] Method 1 (process.env):', apiUrl);
    }
    
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
  
  console.log('[getApiBaseUrl] Using fallback: https://api.nhatbinhkt.com');
  return 'https://api.nhatbinhkt.com';
}

export async function POST(request: NextRequest) {
  try {
    console.log('[LOGIN API] Request received');
    
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
    
    let body;
    try {
      if (!request.body) {
        throw new Error('Request has no body');
      }
      
      body = await request.json();
      console.log('[LOGIN API] Parsed body:', JSON.stringify(body));
    } catch (parseError: any) {
      console.error('[LOGIN API] Error parsing request body:', parseError);
      console.error('[LOGIN API] Error details:', {
        message: parseError.message,
        name: parseError.name,
        stack: parseError.stack
      });
      
      return new NextResponse(
        JSON.stringify({ 
          message: 'Invalid request body', 
          error: 'ParseError',
          details: parseError.message,
          errorType: parseError.name
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
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
    console.error('Login proxy error:', error);
    
    const errorMessage = error?.message || 'An error occurred during login';
    const errorName = error?.name || 'UnknownError';
    const errorStack = error?.stack || '';
    
    console.error('Full error details:', {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
      cause: error?.cause,
    });
    
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
