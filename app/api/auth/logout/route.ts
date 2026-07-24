import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ success: true }, { status: 200, headers: { 'Set-Cookie': 'leaddesk-token=; HttpOnly; Path=/; Max-Age=0' } });
}