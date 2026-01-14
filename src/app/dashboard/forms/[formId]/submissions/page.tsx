
import { prisma } from '@/lib/db';
import { formatDistanceToNow } from 'date-fns';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

interface PageProps {
    params: Promise<{
        formId: string;
    }>;
}

export default async function SubmissionsPage(props: PageProps) {
    const params = await props.params;
    const form = await prisma.form.findUnique({
        where: { id: params.formId },
        include: {
            submissions: {
                orderBy: { submittedAt: 'desc' }
            }
        }
    });

    if (!form) {
        notFound();
    }

    // Extract all unique keys from submissions data to build table headers
    // Using simple flat keys for now. Nested logic would be more complex.
    const allKeys = new Set<string>();
    form.submissions.forEach(sub => {
        if (sub.data && typeof sub.data === 'object') {
            Object.keys(sub.data).forEach(key => allKeys.add(key));
        }
    });
    const headers = Array.from(allKeys).sort();

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/dashboard/pdfs">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Submissions: {form.name}</h1>
                    <p className="text-slate-500 text-sm">
                        {form.submissions.length} total submissions
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[180px]">Submitted At</TableHead>
                            {headers.map(header => (
                                <TableHead key={header} className="min-w-[150px] whitespace-nowrap">
                                    {header}
                                </TableHead>
                            ))}
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {form.submissions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={headers.length + 2} className="h-24 text-center text-slate-500">
                                    No submissions yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            form.submissions.map((submission) => (
                                <TableRow key={submission.id}>
                                    <TableCell className="font-medium text-slate-600">
                                        {formatDistanceToNow(submission.submittedAt)} ago
                                    </TableCell>
                                    {headers.map(header => {
                                        const val = (submission.data as Record<string, any>)[header];
                                        return (
                                            <TableCell key={`${submission.id}-${header}`} className="truncate max-w-[200px]" title={String(val)}>
                                                {String(val || '-')}
                                            </TableCell>
                                        );
                                    })}
                                    <TableCell className="text-right">
                                        {submission.filledPdfUrl ? (
                                            <a href={submission.filledPdfUrl} target="_blank" rel="noopener noreferrer">
                                                <Button variant="outline" size="sm" className="h-8">
                                                    <Download className="mr-2 h-3.5 w-3.5" />
                                                    PDF
                                                </Button>
                                            </a>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No PDF</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
