'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Lead { _id: string; name: string; email: string; budget_range: string; message: string; status: 'New' | 'Contacted' | 'Closed'; createdAt: string; }

const STATUS_STYLES: Record<string, string> = { New: 'bg-blue-500/10 text-blue-400 border-blue-500/20', Contacted: 'bg-amber-500/10 text-amber-400 border-amber-500/20', Closed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };

export default function DashboardClient({ leads: initialLeads, stats: initialStats, currentSearch }: { leads: Lead[]; stats: { total: number; new_count: number; contacted_count: number; closed_count: number }; currentSearch: string }) {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [stats, setStats] = useState(initialStats);
  const [searchInput, setSearchInput] = useState(currentSearch);

  function handleSearch(e: React.FormEvent) { e.preventDefault(); router.push(`/admin/dashboard${searchInput ? `?search=${encodeURIComponent(searchInput)}` : ''}`); }
  function handleLogout() { fetch('/api/auth/logout').then(() => { router.push('/admin/login'); router.refresh(); }); }

  async function handleStatusChange(leadId: string, newStatus: string) {
    const original = leads.find(l => l._id === leadId);
    setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: newStatus as Lead['status'] } : l));
    try {
      const res = await fetch(`/api/leads/${leadId}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }) });
      if (!res.ok) { setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: original!.status } : l)); return; }
      const statsRes = await fetch('/api/stats');
      if (statsRes.ok) setStats(await statsRes.json());
    } catch { setLeads(prev => prev.map(l => l._id === leadId ? { ...l, status: original!.status } : l)); }
  }

  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
          <a href="/admin/dashboard" className="text-lg font-semibold tracking-tight shrink-0">LeadDesk<span className="text-emerald-500">Mini</span></a>
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search by name or email..." className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50" />
          </form>
          <button onClick={handleLogout} className="text-sm text-neutral-500 hover:text-white transition-colors">Logout</button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[{ l: 'Total Leads', v: stats.total, c: 'text-white' }, { l: 'New', v: stats.new_count, c: 'text-blue-400' }, { l: 'Contacted', v: stats.contacted_count, c: 'text-amber-400' }, { l: 'Closed', v: stats.closed_count, c: 'text-emerald-400' }].map(s => (
            <div key={s.l} className="bg-[#111111] border border-white/5 rounded-xl p-5">
              <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">{s.l}</p>
              <p className={`text-3xl font-semibold ${s.c}`}>{s.v}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-xs font-medium text-neutral-500 uppercase">
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr key={lead._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-neutral-600">{i + 1}</td>
                  <td className="px-6 py-4 font-medium">{lead.name}</td>
                  <td className="px-6 py-4 text-neutral-400">{lead.email}</td>
                  <td className="px-6 py-4">{lead.budget_range}</td>
                  <td className="px-6 py-4">
                    <select value={lead.status} onChange={e => handleStatusChange(lead._id, e.target.value)} className={`text-xs font-medium px-2.5 py-1.5 rounded-md border cursor-pointer focus:outline-none ${STATUS_STYLES[lead.status]}`}>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}