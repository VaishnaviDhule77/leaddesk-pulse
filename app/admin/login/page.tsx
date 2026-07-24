'use client';
import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError(''); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: fd.get('username'), password: fd.get('password') }) });
    const data = await res.json();
    if (!res.ok) { setError(data.error || 'Login failed.'); setLoading(false); return; }
    router.push('/admin/dashboard'); router.refresh();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold inline-block">LeadDesk<span className="text-emerald-500">Mini</span></Link>
          <p className="text-sm text-neutral-500 mt-2">Sign in to your dashboard</p>
        </div>
        {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}
        <form onSubmit={handleSubmit} className="bg-[#111111] border border-white/5 rounded-2xl p-8">
          <div className="mb-5">
            <label htmlFor="username" className="block text-sm font-medium text-neutral-300 mb-2">Username</label>
            <input type="text" id="username" name="username" required className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
          </div>
          <div className="mb-8">
            <label htmlFor="password" className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
            <input type="password" id="password" name="password" required className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm py-3.5 rounded-lg transition-colors disabled:opacity-50">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  );
}