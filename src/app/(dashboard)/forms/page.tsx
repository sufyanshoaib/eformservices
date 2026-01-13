import Link from 'next/link';
import { prisma } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { FileText, MoreVertical, Plus, ExternalLink, Pencil, Trash } from 'lucide-react';

async function getUserId() {
    // Temporary: Return a mock user ID for development
    return 'dev-user-id';
}

async function getForms() {
    const userId = await getUserId();

    try {
        const forms = await prisma.form.findMany({
            where: { userId },
            orderBy: { updatedAt: 'desc' },
            include: {
                pdf: {
                    select: {
                        name: true,
                        fileName: true
                    }
                },
                _count: {
                    select: { submissions: true }
                }
            }
        });
        return forms;
    } catch (error) {
        console.error('Failed to fetch forms:', error);
        return [];
    }
}

async function deleteFormAction(formData: FormData) {
    'use server';
    const formId = formData.get('formId') as string;
    if (!formId) return;

    try {
        await prisma.form.delete({
            where: { id: formId }
        });
    } catch (error) {
        console.error('Failed to delete form', error);
    }
}

export default async function FormsPage() {
    const forms = await getForms();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Forms</h1>
                    <p className="text-slate-500 mt-1">Manage your created forms and submissions.</p>
                </div>
                <Link
                    href="/dashboard/pdfs"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Form
                </Link>
            </div>

            {forms.length === 0 ? (
                <div className="bg-white rounded-lg border border-dashed border-slate-300 p-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mt-2 text-sm font-semibold text-gray-900">No Forms Created</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't created any forms yet. Go to your PDF library to start.</p>
                    <div className="mt-6">
                        <Link
                            href="/dashboard/pdfs"
                            className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        >
                            Go to PDF Library
                        </Link>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Form Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Source PDF</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submissions</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {forms.map((form) => (
                                <tr key={form.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{form.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{form.pdf.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {form.isPublished ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Published
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {form._count.submissions}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDistanceToNow(form.updatedAt)} ago
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex items-center justify-end space-x-3">
                                            {form.isPublished && form.shareableLink && (
                                                <Link
                                                    href={`/s/${form.shareableLink}`}
                                                    target="_blank"
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="View Public Form"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </Link>
                                            )}

                                            <Link
                                                href={`/dashboard/forms/${form.id}/edit`}
                                                className="text-slate-600 hover:text-slate-900"
                                                title="Edit Form"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Link>

                                            <form action={deleteFormAction}>
                                                <input type="hidden" name="formId" value={form.id} />
                                                <button type="submit" className="text-red-400 hover:text-red-600" title="Delete Form">
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
