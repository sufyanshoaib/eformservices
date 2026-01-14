import type { Metadata } from 'next';

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
                <h2 className="text-xl font-bold mb-8">eFormServices</h2>
                <nav className="space-y-4">
                    <a href="/dashboard/pdfs" className="block hover:text-blue-300">
                        PDF Library
                    </a>
                    <a href="/dashboard/forms" className="block hover:text-blue-300">
                        My Forms
                    </a>
                    <div className="pt-4 border-t border-slate-700">
                        <span className="block text-sm text-slate-400">User Settings</span>
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
