import type { Metadata } from 'next';
import { Logo } from '@/components/ui/logo';
import { signOutAction } from '@/actions/auth';
import { LogOut } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Dashboard - eFormServices',
    description: 'Manage your PDFs and forms',
};

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col md:flex-row">
            {/* Simple Sidebar */}
            <aside className="w-full md:w-64 bg-slate-900 text-white p-6 md:min-h-screen">
                <Logo dark className="mb-8" />
                <nav className="space-y-4">
                    <a href="/dashboard/pdfs" className="block hover:text-blue-300">
                        PDF Library
                    </a>
                    <a href="/dashboard/forms" className="block hover:text-blue-300">
                        My Forms
                    </a>
                    <a href="/quick-fill" className="block hover:text-blue-300">
                        Quick Fill & Sign
                    </a>
                    <div className="pt-4 border-t border-slate-700">
                        <span className="block text-sm text-slate-400 mb-4">User Settings</span>
                        <form action={signOutAction}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 text-sm text-slate-300 hover:text-red-400 transition-colors"
                            >
                                <LogOut className="h-4 w-4" />
                                Sign Out
                            </button>
                        </form>
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 bg-slate-50 overflow-auto">
                {children}
            </main>
        </div>
    );
}
