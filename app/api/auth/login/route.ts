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
    const body = await request.json();
    
    // Validate request body
    if (!body.email || !body.password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const API_BASE_URL = getApiBaseUrl();
    
    // Forward request to backend API
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: body.email,
        password: body.password,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { message: `Login failed: ${response.status} ${response.statusText}` };
      }
      
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Login proxy error:', error);
    return NextResponse.json(
      { message: error.message || 'An error occurred during login' },
      { status: 500 }
    );
  }
}

