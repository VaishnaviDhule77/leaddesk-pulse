import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Lead from '../../../lib/models/Lead';
import { verifyToken } from '../../../lib/auth';

export async function GET(request: NextRequest) {
  if (!verifyToken(request)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  try {
    await connectDB();
    const stats = await Lead.aggregate([{ $group: { _id: null, total: { $sum: 1 }, new_count: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } }, contacted_count: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } }, closed_count: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } } } }]);
    return NextResponse.json(stats[0] || { total: 0, new_count: 0, contacted_count: 0, closed_count: 0 });
  } catch { return NextResponse.json({ error: 'Failed to fetch stats.' }, { status: 500 }); }
}