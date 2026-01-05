import { NextResponse } from 'next/server';

// Ultra-simple endpoint to test Edge Runtime
export const runtime = 'edge';

export async function GET() {
  // Return simple JSON without any complex operations
  return NextResponse.json({ 
    status: 'ok',
    message: 'Edge Runtime is working',
    timestamp: Date.now()
  });
}

export async function POST() {
  // Return simple JSON without parsing body
  return NextResponse.json({ 
    status: 'ok',
    message: 'POST endpoint is working',
    timestamp: Date.now()
  });
}

