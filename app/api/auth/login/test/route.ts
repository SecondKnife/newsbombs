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

