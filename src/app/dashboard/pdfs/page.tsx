
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Trash, Plus, Eye, Send, MousePointerClick, MoreVertical } from 'lucide-react';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Prisma } from '@prisma/client';
import { CopyLinkButton } from '@/components/dashboard/copy-link-button';
import { ShareFormButton } from '@/components/dashboard/share-form-button';

async function getPdfs() {
    try {
        const pdfs = await prisma.pdf.findMany({
            orderBy: { uploadedAt: 'desc' },
            include: {
                forms: {
                    select: {
                        id: true,
                        name: true,
                        views: true,
                        isPublished: true,
                        shareableLink: true,
                        submissions: {
                            select: { id: true }
                        }
                    }
                }
            },
        });
        return pdfs;
    } catch (e) {
        console.error('Failed to fetch PDFs:', e);
        return [];
    }
}

type PdfWithForms = Awaited<ReturnType<typeof getPdfs>>[number];

async function createFormAction(formData: FormData) {
    'use server';
    const pdfId = formData.get('pdfId') as string;
    const pdfName = formData.get('pdfName') as string;

    if (!pdfId) return;

    // Manual check for "dev-user-id" since we don't have full auth wired up in this function context yet
    // Ideally use auth() here
    const userId = 'dev-user-id';

    let newFormId = null;

    try {
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
    const pdfs: PdfWithForms[] = await getPdfs();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">PDF Library</h1>
                    <p className="text-slate-500 mt-2">Manage your uploaded PDFs and track form performance.</p>
                </div>
                <Link href="/dashboard/pdfs/upload">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Upload New PDF
                    </Button>
                </Link>
            </div>

            {pdfs.length === 0 ? (
                <div className="bg-white rounded-lg border border-dashed border-slate-300 p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No PDFs Uploaded</h3>
                    <p className="mt-1 text-sm text-gray-500">Upload a PDF template to get started with creating forms.</p>
                    <div className="mt-6">
                        <Link href="/dashboard/pdfs/upload">
                            <Button variant="default">
                                <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                Upload PDF
                            </Button>
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pdfs.map((pdf) => {
                        const form = pdf.forms[0];
                        const views = form?.views || 0;
                        const submissions = form?.submissions.length || 0;
                        const conversionRate = views > 0 ? Math.round((submissions / views) * 100) : 0;

                        return (
                            <Card key={pdf.id} className="flex flex-col h-full hover:shadow-lg transition-all duration-200">
                                <CardHeader className="pb-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="p-2 bg-blue-50 rounded-lg">
                                                <FileText className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="space-y-1">
                                                <CardTitle className="text-base font-medium leading-none truncate w-[160px]" title={pdf.name}>
                                                    {pdf.name}
                                                </CardTitle>
                                                <CardDescription className="text-xs">
                                                    {(pdf.fileSize / 1024 / 1024).toFixed(2)} MB • {formatDistanceToNow(pdf.uploadedAt)} ago
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            {form?.isPublished && form?.shareableLink && (
                                                <>
                                                    <CopyLinkButton shareableLink={form.shareableLink} />
                                                    <ShareFormButton shareableLink={form.shareableLink} formName={form.name} />
                                                </>
                                            )}
                                            <form action={deletePdfAction}>
                                                <input type="hidden" name="pdfId" value={pdf.id} />
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500">
                                                    <Trash className="h-4 w-4" />
                                                    <span className="sr-only">Delete</span>
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="pb-4 flex-grow">
                                    {form ? (
                                        <div className="grid grid-cols-3 gap-2 py-2">
                                            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg text-center">
                                                <Eye className="h-4 w-4 text-slate-500 mb-1" />
                                                <span className="text-lg font-bold text-slate-900">{views}</span>
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Views</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg text-center">
                                                <Send className="h-4 w-4 text-slate-500 mb-1" />
                                                <span className="text-lg font-bold text-slate-900">{submissions}</span>
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Submits</span>
                                            </div>
                                            <div className="flex flex-col items-center justify-center p-2 bg-slate-50 rounded-lg text-center">
                                                <MousePointerClick className="h-4 w-4 text-slate-500 mb-1" />
                                                <span className="text-lg font-bold text-green-600">{conversionRate}%</span>
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">Conv.</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center h-20 bg-slate-50 rounded-lg text-sm text-slate-500 italic border border-dashed">
                                            No form created yet
                                        </div>
                                    )}
                                </CardContent>

                                <CardFooter className="pt-0">
                                    {form ? (
                                        <div className="w-full space-y-2">
                                            <Link href={`/dashboard/forms/${form.id}/edit`} className="w-full">
                                                <Button variant="outline" className="w-full">
                                                    Edit Form
                                                </Button>
                                            </Link>
                                            <Link href={`/dashboard/forms/${form.id}/submissions`} className="w-full">
                                                <Button variant="secondary" className="w-full text-slate-600">
                                                    View Submissions
                                                </Button>
                                            </Link>
                                        </div>
                                    ) : (
                                        <form action={createFormAction} className="w-full">
                                            <input type="hidden" name="pdfId" value={pdf.id} />
                                            <input type="hidden" name="pdfName" value={pdf.name} />
                                            <Button type="submit" className="w-full">
                                                Create Form
                                            </Button>
                                        </form>
                                    )}
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
