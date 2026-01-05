import { NextRequest, NextResponse } from 'next/server';

// Test endpoint WITHOUT Edge Runtime to see if that's the issue
// export const runtime = 'edge'; // COMMENTED OUT

export async function GET() {
  try {
    return NextResponse.json({ 
      message: 'Simple GET endpoint is working',
      timestamp: new Date().toISOString(),
      runtime: 'nodejs' // Default runtime
    });
  } catch (error: any) {
    return NextResponse.json({ 
      message: 'Error in simple GET endpoint',
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Try to parse body
    let body: any = {};
    
    try {
      body = await request.json();
    } catch (e) {
      body = { error: 'Failed to parse JSON' };
    }
    
    return NextResponse.json({ 
      message: 'Simple POST endpoint is working',
      receivedBody: body,
      timestamp: new Date().toISOString(),
      runtime: 'nodejs' // Default runtime
    });
  } catch (error: any) {
    return NextResponse.json({ 
      message: 'Error in simple POST endpoint',
      error: error.message,
      errorType: error.name
    }, { status: 500 });
  }
}

