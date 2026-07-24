import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '../../../lib/db';
import Lead from '../../../lib/models/Lead';

const VALID_BUDGETS = ['$1k - $5k', '$5k - $10k', '$10k - $25k', '$25k+'];

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, email, budget_range, message } = body;
    const errors: string[] = [];
    if (!name || typeof name !== 'string' || name.trim().length < 2) errors.push('Name must be between 2 and 100 characters.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
    if (!VALID_BUDGETS.includes(budget_range)) errors.push('Please select a valid budget range.');
    if (message && message.length > 2000) errors.push('Message must be under 2000 characters.');
    if (errors.length > 0) return NextResponse.json({ error: errors.join(' ') }, { status: 400 });

    const lead = await Lead.create({ name: name.trim(), email: email.trim().toLowerCase(), budget_range, message: (message || '').trim() });
    return NextResponse.json({ success: true, id: lead._id, message: "Thank you! We'll be in touch soon." }, { status: 201 });
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'code' in err && err.code === 11000) return NextResponse.json({ error: 'This email has already been submitted.' }, { status: 409 });
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}