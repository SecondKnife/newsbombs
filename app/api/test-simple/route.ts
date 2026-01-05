import { NextRequest, NextResponse } from 'next/server';

// Cloudflare Pages requires Edge Runtime for all routes
export const runtime = 'edge';

export async function GET() {
  // Ultra-simple response - no try-catch, no Date operations
  return NextResponse.json({ 
    status: 'ok',
    message: 'GET endpoint is working',
    timestamp: Date.now()
  });
}

export async function POST(request: NextRequest) {
  // Ultra-simple - don't parse body, just return success
  return NextResponse.json({ 
    status: 'ok',
    message: 'POST endpoint is working',
    timestamp: Date.now(),
    note: 'Body parsing skipped for testing'
  });
}

