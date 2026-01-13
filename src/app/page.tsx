import Link from 'next/link';

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50">
            <div className="text-center space-y-6 max-w-2xl">
                <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                    eFormServices
                </h1>
                <p className="text-xl text-slate-600">
                    Transform your PDF templates into interactive, fillable web forms in minutes.
                </p>

                <div className="flex justify-center gap-4 mt-8">
                    <Link
                        href="/dashboard/pdfs"
                        className="rounded-md bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                    >
                        Go to Dashboard
                    </Link>
                    <Link
                        href="/dashboard/pdfs/upload"
                        className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-colors"
                    >
                        Upload PDF
                    </Link>
                </div>
            </div>
        </main>
    );
}
