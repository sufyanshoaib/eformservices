import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import PublicFormClient from './client-page';
import type { Metadata } from 'next';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
    const params = await props.params;
    const form = await prisma.form.findUnique({
        where: { shareableLink: params.slug },
        include: { pdf: true }
    });

    if (!form) return { title: 'Form Not Found' };

    return {
        title: form.name,
        description: `Fill out ${form.name} securely online with eFormServices.`,
        openGraph: {
            title: form.name,
            description: `Fill out ${form.name} securely online.`,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: form.name,
            description: `Fill out ${form.name} securely online.`,
        },
        robots: {
            index: true,
            follow: true,
        },
    };
}

export default async function PublicFormPage(props: PageProps) {
    const params = await props.params;

    const form = await prisma.form.findUnique({
        where: { shareableLink: params.slug },
        include: {
            pdf: {
                select: {
                    fileUrl: true,
                    name: true
                }
            }
        }
    });

    if (!form || !form.isPublished) {
        notFound();
    }

    return (
        <PublicFormClient
            form={{
                id: form.id,
                name: form.name,
                fileUrl: form.pdf.fileUrl,
                fieldMappings: form.fieldMappings as any // Cast JSON to proper type in client
            }}
        />
    );
}
