import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const MONGO_URI = process.env.MONGO_URI || '';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export async function GET() {
  try {
    if (!MONGO_URI) return NextResponse.json({ error: 'MONGO_URI missing' }, { status: 500 });
    
    await mongoose.connect(MONGO_URI);
    
    await User.deleteMany({});
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    await User.create({
      username: 'admin',
      password_hash: hashedPassword,
    });

    return NextResponse.json({ message: '✅ Admin user created successfully!' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}