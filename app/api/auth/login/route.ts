import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../lib/db';
import User from '../../../../lib/models/User';
import { signToken } from '../../../../lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) return NextResponse.json({ error: 'Please fill in all fields.' }, { status: 400 });
    await connectDB();
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password_hash))) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    const token = await signToken({ userId: String(user._id), username: user.username });
    return NextResponse.json({ success: true }, {
      status: 200,
      headers: { 'Set-Cookie': `leaddesk-token=${token}; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Lax; Path=/; Max-Age=86400` },
    });
  } catch { return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 }); }
}