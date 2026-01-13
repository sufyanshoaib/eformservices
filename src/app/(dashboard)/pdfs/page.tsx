import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Trash, Plus } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function getPdfs() {
    try {
        // In a real production app we might check auth here too
        // Check if we can even connect first to avoid hard crashes
        // This is a safety check for development environments
        const pdfs = await prisma.pdf.findMany({
            orderBy: { uploadedAt: 'desc' },
            include: {
                _count: {
                    select: { forms: true },
                },
                forms: {
                    select: { id: true }
                }
            },
        });
        return pdfs;
    } catch (e) {
        console.error('Failed to fetch PDFs:', e);
        // Return empty array to allow page to render with empty state instead of crashing 
        return [];
    }
}

async function createFormAction(formData: FormData) {
    'use server';
    const pdfId = formData.get('pdfId') as string;
    const pdfName = formData.get('pdfName') as string;

    if (!pdfId) return;

    // Manual check for "dev-user-id" since we don't have full auth wired up
    const userId = 'dev-user-id';

    let newFormId = null;

    try {
        // Ensure dev user exists
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                email: 'dev@example.com',
                name: 'Dev User',
            },
        });

        const form = await prisma.form.create({
            data: {
                userId,
                pdfId,
                name: `${pdfName} Form`,
                fieldMappings: [],
            },
        });

        newFormId = form.id;
    } catch (error) {
        console.error('Failed to create form:', error);
        // Silent fail for now in server action, ideally shoudl redirect to error page
        return;
    }

    if (newFormId) {
        redirect(`/dashboard/forms/${newFormId}/edit`);
    }
}

async function deletePdfAction(formData: FormData) {
    'use server';
    const pdfId = formData.get('pdfId') as string;
    if (!pdfId) return;

    await prisma.pdf.delete({
        where: { id: pdfId },
    });

    revalidatePath('/dashboard/pdfs');
}

export default async function PdfLibraryPage() {
    const pdfs = await getPdfs();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">PDF Library</h1>
                <Link
                    href="/dashboard/pdfs/upload"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Upload New PDF
                </Link>
            </div>

            {pdfs.length === 0 ? (
                <div className="bg-white rounded-lg border border-dashed border-slate-300 p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No PDFs Uploaded</h3>
                    <p className="mt-1 text-sm text-gray-500">Upload a PDF template to get started with creating forms.</p>
                    <div className="mt-6">
                        <Link
                            href="/dashboard/pdfs/upload"
                            className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                        >
                            <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                            Upload PDF
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pdfs.map((pdf) => (
                        <div key={pdf.id} className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-red-50 rounded-lg">
                                            <FileText className="h-6 w-6 text-red-500" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 truncate max-w-[150px]" title={pdf.name}>
                                                {pdf.name}
                                            </h3>
                                            <p className="text-xs text-slate-500">
                                                {(pdf.fileSize / 1024 / 1024).toFixed(2)} MB • {formatDistanceToNow(pdf.uploadedAt)} ago
                                            </p>
                                        </div>
                                    </div>

                                    <form action={deletePdfAction}>
                                        <input type="hidden" name="pdfId" value={pdf.id} />
                                        <button type="submit" className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Delete PDF">
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>

                                <div className="mt-6">
                                    {pdf.forms.length > 0 ? (
                                        <Link
                                            href={`/dashboard/forms/${pdf.forms[0].id}/edit`}
                                            className="block w-full text-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            Edit Existing Form
                                        </Link>
                                    ) : (
                                        <form action={createFormAction}>
                                            <input type="hidden" name="pdfId" value={pdf.id} />
                                            <input type="hidden" name="pdfName" value={pdf.name} />
                                            <button
                                                type="submit"
                                                className="w-full px-4 py-2 bg-white border border-primary text-primary rounded-md text-sm font-medium hover:bg-blue-50 transition-colors"
                                            >
                                                Create Form
                                            </button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
