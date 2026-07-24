import Link from 'next/link';
import LeadForm from '../components/LeadForm';
export default function Home() {
  return (
    <>
      <nav className="fixed top-0 w-full z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="text-lg font-semibold tracking-tight">LeadDesk<span className="text-emerald-500">Mini</span></span>
          <Link href="/admin/login" className="text-sm text-neutral-400 hover:text-white transition-colors">Admin</Link>
        </div>
      </nav>
      <section className="min-h-screen flex items-center pt-16">
        <div className="max-w-6xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center py-16">
          <div>
            <h1 className="text-4xl sm:text-5xl font-medium tracking-tight mb-6">
              Capture every lead.<br /><span className="text-neutral-500">Never miss one.</span>
            </h1>
            <p className="text-lg text-neutral-400 mb-10">A lightweight lead management system built for teams that move fast.</p>
          </div>
          <div className="bg-[#111111] border border-white/5 rounded-2xl p-8">
            <h2 className="text-xl font-medium mb-1">Get in touch</h2>
            <p className="text-sm text-neutral-500 mb-8">We&apos;ll respond within 24 hours.</p>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}