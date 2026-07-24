import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../../../lib/db';
import Lead from '../../../../../lib/models/Lead';
import { verifyToken } from '../../../../../lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!verifyToken(request)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    await connectDB();
    const { status } = await request.json();
    if (!['New', 'Contacted', 'Closed'].includes(status)) return NextResponse.json({ error: 'Invalid status.' }, { status: 400 });
    const lead = await Lead.findByIdAndUpdate(params.id, { status }, { new: true });
    if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
    return NextResponse.json({ success: true, status: lead.status });
  } catch { return NextResponse.json({ error: 'Failed to update status.' }, { status: 500 }); }
}