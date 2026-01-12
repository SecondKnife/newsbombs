import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    return NextResponse.json({ 
      status: 'ok',
      message: 'Edge Runtime is working',
      timestamp: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Error in GET handler',
      error: error?.message || String(error),
      errorType: error?.name || 'UnknownError'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    return NextResponse.json({ 
      status: 'ok',
      message: 'POST endpoint is working',
      timestamp: Date.now()
    });
  } catch (error: any) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Error in POST handler',
      error: error?.message || String(error),
      errorType: error?.name || 'UnknownError'
    }, { status: 500 });
  }
}

