'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { Loader2, Send } from 'lucide-react';
import PdfViewer from '@/components/pdf/pdf-viewer';
import type { FormField } from '@/components/forms/form-canvas';
import { cn } from '@/lib/utils'; // Keep import, will fix if missing

// Client Component wrapper since PdfViewer uses client features
// Note: In Next 14/15, for public pages usually better to fetch on server, 
// but PdfViewer is heavily client-side. We can fetch data here or props.
// Let's implement fully client-side fetch for the "view" part to keep it simple with existing components for now,
// OR pass data from a Server Component parent.
// Let's do Server Component parent -> Client Component child for best practice.

export default function PublicFormLoading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-slate-900">Loading Form...</h2>
            </div>
        </div>
    );
}
