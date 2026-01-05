import { NextRequest, NextResponse } from 'next/server';

// Simple test endpoint to check if API route works
export const runtime = 'edge';

export async function GET() {
  try {
    return new NextResponse(
      JSON.stringify({ 
        message: 'API route is working',
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    return new NextResponse(
      JSON.stringify({ 
        message: 'Error in test endpoint',
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('[TEST POST] Request received');
    console.log('[TEST POST] Request method:', request.method);
    console.log('[TEST POST] Request headers:', Object.fromEntries(request.headers.entries()));
    
    // Test POST request parsing - try multiple methods
    let body: any = {};
    let parseMethod = 'none';
    
    try {
      // Method 1: Try request.json() directly (recommended for Edge Runtime)
      if (request.body) {
        body = await request.json();
        parseMethod = 'json()';
        console.log('[TEST POST] Successfully parsed with request.json()');
      } else {
        throw new Error('Request has no body');
      }
    } catch (jsonError: any) {
      console.error('[TEST POST] request.json() failed:', jsonError.message);
      
      try {
        // Method 2: Try request.text() then parse
        const bodyText = await request.text();
        parseMethod = 'text()';
        if (bodyText) {
          body = JSON.parse(bodyText);
          console.log('[TEST POST] Successfully parsed with request.text()');
        }
      } catch (textError: any) {
        console.error('[TEST POST] request.text() failed:', textError.message);
        body = { error: 'Failed to parse body', jsonError: jsonError.message, textError: textError.message };
      }
    }
    
    return new NextResponse(
      JSON.stringify({ 
        message: 'POST endpoint is working',
        receivedBody: body,
        parseMethod: parseMethod,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('[TEST POST] Unexpected error:', error);
    return new NextResponse(
      JSON.stringify({ 
        message: 'Error in POST test endpoint',
        error: error.message,
        errorType: error.name,
        stack: error.stack
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

