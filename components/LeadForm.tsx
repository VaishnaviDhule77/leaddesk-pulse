'use client';
import { useState, FormEvent } from 'react';

export default function LeadForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({}); setToast(null);
    const fd = new FormData(e.currentTarget);
    const errs: Record<string, string> = {};
    if (!fd.get('name') || (fd.get('name') as string).trim().length < 2) errs.name = 'Name must be at least 2 characters.';
    if (!fd.get('email') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fd.get('email') as string)) errs.email = 'Please enter a valid email.';
    if (!fd.get('budget_range')) errs.budget_range = 'Please select a budget range.';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    const res = await fetch('/api/leads', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: fd.get('name'), email: fd.get('email'), budget_range: fd.get('budget_range'), message: fd.get('message') }),
    });
    const data = await res.json();
    setLoading(false);
    setToast({ message: data.success ? data.message : data.error, type: data.success ? 'success' : 'error' });
    if (data.success) { (e.target as HTMLFormElement).reset(); setCharCount(0); }
    setTimeout(() => setToast(null), 4000);
  }

  const inputCls = "w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors";

  return (
    <>
      <div className={`fixed top-6 right-6 z-50 transition-all duration-300 ${toast ? 'translate-x-0' : 'translate-x-[120%]'}`}>
        <div className={`px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 text-sm text-white ${toast?.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          <span>{toast?.message}</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="mb-5">
          <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-2">Full Name</label>
          <input type="text" id="name" name="name" required placeholder="Jane Smith" className={`${inputCls} ${errors.name ? 'border-red-500/50' : ''}`} onChange={() => setErrors(p => ({...p, name: ''}))} />
          {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">Email Address</label>
          <input type="email" id="email" name="email" required placeholder="jane@company.com" className={`${inputCls} ${errors.email ? 'border-red-500/50' : ''}`} onChange={() => setErrors(p => ({...p, email: ''}))} />
          {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
        </div>
        <div className="mb-5">
          <label htmlFor="budget" className="block text-sm font-medium text-neutral-300 mb-2">Budget Range</label>
          <select id="budget" name="budget_range" required className={`${inputCls} ${errors.budget_range ? 'border-red-500/50' : ''} cursor-pointer`} onChange={() => setErrors(p => ({...p, budget_range: ''}))}>
            <option value="" disabled selected>Select your budget</option>
            <option value="$1k - $5k">$1k – $5k</option>
            <option value="$5k - $10k">$5k – $10k</option>
            <option value="$10k - $25k">$10k – $25k</option>
            <option value="$25k+">$25k+</option>
          </select>
          {errors.budget_range && <p className="text-xs text-red-400 mt-1.5">{errors.budget_range}</p>}
        </div>
        <div className="mb-8">
          <label htmlFor="message" className="block text-sm font-medium text-neutral-300 mb-2">Message</label>
          <textarea id="message" name="message" rows={4} maxLength={2000} placeholder="Tell us about your project..." className={`${inputCls} resize-none`} onChange={(e) => setCharCount(e.target.value.length)} />
          <p className="text-xs text-neutral-600 mt-1 text-right">{charCount}/2000</p>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm py-3.5 rounded-lg transition-all disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Inquiry'}
        </button>
      </form>
    </>
  );
}