import { NextResponse } from 'next/server';

// Ultra-simple endpoint to test Edge Runtime
export const runtime = 'edge';

export async function GET() {
  // Try-catch to catch any runtime errors
  try {
    // Return simple JSON without any complex operations
    return NextResponse.json({ 
      status: 'ok',
      message: 'Edge Runtime is working',
      timestamp: Date.now()
    });
  } catch (error: any) {
    // Return error details as JSON
    return NextResponse.json({ 
      status: 'error',
      message: 'Error in GET handler',
      error: error?.message || String(error),
      errorType: error?.name || 'UnknownError'
    }, { status: 500 });
  }
}

export async function POST() {
  // Try-catch to catch any runtime errors
  try {
    // Return simple JSON without parsing body
    return NextResponse.json({ 
      status: 'ok',
      message: 'POST endpoint is working',
      timestamp: Date.now()
    });
  } catch (error: any) {
    // Return error details as JSON
    return NextResponse.json({ 
      status: 'error',
      message: 'Error in POST handler',
      error: error?.message || String(error),
      errorType: error?.name || 'UnknownError'
    }, { status: 500 });
  }
}

