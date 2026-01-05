import { NextRequest, NextResponse } from 'next/server';

// Edge runtime required for Cloudflare Pages
export const runtime = 'edge';

// Get API base URL
function getApiBaseUrl(): string {
  try {
    if (typeof process !== 'undefined' && process.env) {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (apiUrl && typeof apiUrl === 'string' && apiUrl.trim() !== '') {
        return apiUrl.trim().replace(/\/+$/, '').replace(/\/api$/, '');
      }
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
      console.error('Fetch error:', fetchError);
      return NextResponse.json(
        { message: `Failed to connect to backend: ${fetchError.message || 'Network error'}` },
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
    return NextResponse.json(
      { message: error.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
}

