import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { FileText, Trash, Plus, Eye, Send, MousePointerClick, Folder as FolderIcon, ChevronLeft, MoreVertical, Pencil } from 'lucide-react';
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
import { FolderDialog } from '@/components/dashboard/folder-dialog';
import { CreateFormDialog } from '@/components/dashboard/create-form-dialog';
import { RenamePdfDialog } from '@/components/dashboard/rename-pdf-dialog';
import { MoveToFolderDialog } from '@/components/dashboard/move-to-folder-dialog';
import { CopyLinkButton } from '@/components/dashboard/copy-link-button';
import { ShareFormButton } from '@/components/dashboard/share-form-button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { auth } from '@/auth';

// Helper to get user ID
async function getUserId() {
    const session = await auth();
    return session?.user?.id;
}

async function getFolders(userId: string) {
    try {
        return await prisma.pdfFolder.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { pdfs: true },
                },
            },
        });
    } catch (e) {
        console.error('Failed to fetch folders:', e);
        return [];
    }
}

async function getPdfs(userId: string, folderId: string | null) {
    try {
        const where: any = { userId };
        if (folderId === 'root') {
            where.folderId = null;
        } else if (folderId) {
            where.folderId = folderId;
        }

        return await prisma.pdf.findMany({
            where,
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
    } catch (e) {
        console.error('Failed to fetch PDFs:', e);
        return [];
    }
}

async function createFormAction(formData: FormData) {
    'use server';
    const pdfId = formData.get('pdfId') as string;
    const pdfName = formData.get('pdfName') as string;

    if (!pdfId) return;
    if (!pdfId) return;
    const userId = await getUserId();

    if (!userId) {
        // Handle unauthorized
        return;
    }

    let newFormId = null;

    try {
        // Ensure user exists (in case they signed in but not in DB yet - though auth usually handles this)
        // With NextAuth + Prisma Adapter, user should exist.
        // We can skip the manual upsert mock.

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

async function deleteFolderAction(formData: FormData) {
    'use server';
    const folderId = formData.get('folderId') as string;
    if (!folderId) return;

    // PDFs in this folder will have folderId set to null (SetNull)
    await prisma.pdfFolder.delete({
        where: { id: folderId },
    });

    revalidatePath('/dashboard/pdfs');
}

export default async function PdfLibraryPage(props: { searchParams: Promise<{ folderId?: string }> }) {
    const searchParams = await props.searchParams;
    const userId = await getUserId();

    if (!userId) {
        redirect('/auth/signin');
    }

    const folderId = searchParams.folderId || null;

    // Fetch data in parallel
    const [folders, pdfs, currentFolder] = await Promise.all([
        getFolders(userId),
        getPdfs(userId, folderId || 'root'), // Default view is root (unfiled)
        folderId ? prisma.pdfFolder.findUnique({ where: { id: folderId } }) : null
    ]);

    const isRoot = !folderId;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2">
                        {!isRoot && (
                            <Link href="/dashboard/pdfs">
                                <Button variant="ghost" size="icon" className="-ml-2">
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>
                            </Link>
                        )}
                        <h1 className="text-3xl font-bold tracking-tight">
                            {currentFolder ? currentFolder.name : 'PDF Library'}
                        </h1>
                    </div>
                    <p className="text-slate-500 mt-2">
                        {currentFolder
                            ? `Viewing contents of ${currentFolder.name}`
                            : 'Manage your uploaded PDFs and folders.'}
                    </p>
                </div>
                <div className="flex gap-2">
                    {isRoot && <FolderDialog mode="create" />}
                    <Link href={currentFolder ? `/dashboard/pdfs/upload?folderId=${currentFolder.id}` : "/dashboard/pdfs/upload"}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Upload New PDF
                        </Button>
                    </Link>
                    {currentFolder && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <FolderDialog
                                    mode="edit"
                                    folderId={currentFolder.id}
                                    initialName={currentFolder.name}
                                    trigger={
                                        <div className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Rename Folder
                                        </div>
                                    }
                                />
                                <form action={deleteFolderAction}>
                                    <input type="hidden" name="folderId" value={currentFolder.id} />
                                    <button type="submit" className="w-full relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-red-50 hover:text-red-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600">
                                        <Trash className="mr-2 h-4 w-4" />
                                        Delete Folder
                                    </button>
                                </form>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>

            {/* Folders Section (Only show in root) */}
            {isRoot && folders.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {folders.map(folder => (
                        <Link key={folder.id} href={`/dashboard/pdfs?folderId=${folder.id}`} className="block">
                            <div className="flex items-center p-4 bg-white border rounded-lg hover:shadow-md transition-all group">
                                <div className="p-2 bg-yellow-50 rounded-lg mr-3 group-hover:bg-yellow-100 transition-colors">
                                    <FolderIcon className="h-6 w-6 text-yellow-500 fill-yellow-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-medium truncate text-slate-900">{folder.name}</h3>
                                    <p className="text-xs text-slate-500">{folder._count.pdfs} items</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* PDFs Grid */}
            {pdfs.length === 0 ? (
                <div className="bg-white rounded-lg border border-dashed border-slate-300 p-12 text-center shadow-sm">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No PDFs Found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {isRoot ? 'Upload a PDF or create a folder to get started.' : 'This folder is empty.'}
                    </p>
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
                                            <MoveToFolderDialog
                                                pdfId={pdf.id}
                                                currentFolderId={pdf.folderId}
                                                folders={folders}
                                            />
                                            <RenamePdfDialog
                                                pdfId={pdf.id}
                                                initialName={pdf.name}
                                            />
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
                                        <CreateFormDialog
                                            pdfId={pdf.id}
                                            pdfName={pdf.name}
                                            createFormAction={createFormAction}
                                            trigger={
                                                <Button className="w-full">
                                                    Create Form
                                                </Button>
                                            }
                                        />
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
