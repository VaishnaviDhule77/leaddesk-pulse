import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = { title: 'LeadDesk Mini', description: 'Lightweight lead management system' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a] text-white min-h-screen antialiased flex flex-col">
        {children}
        <footer className="border-t border-white/5 py-8 mt-auto">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-600">
              Built for{' '}
              <a href="https://digitalheroesco.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-white transition-colors underline underline-offset-2 decoration-neutral-700 hover:decoration-neutral-400">
                Digital Heroes Training Task
              </a>
            </p>
            <p className="text-xs text-neutral-700">&copy; {new Date().getFullYear()} LeadDesk Mini</p>
          </div>
        </footer>
      </body>
    </html>
  );
}