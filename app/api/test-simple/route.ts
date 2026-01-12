import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  return NextResponse.json({ 
    status: 'ok',
    message: 'GET endpoint is working',
    timestamp: Date.now()
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    status: 'ok',
    message: 'POST endpoint is working',
    timestamp: Date.now(),
    note: 'Body parsing skipped for testing'
  });
}

