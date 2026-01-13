'use client';

import { useState } from 'react';
import type { FormField } from '@/components/forms/form-canvas';
import { cn } from '@/lib/utils';
import { Layout, FileText, Loader2, CheckCircle, Check } from 'lucide-react';
import PdfViewer from '@/components/pdf/pdf-viewer';
import SignatureInput from '@/components/forms/signature-input';

interface PublicFormClientProps {
    form: {
        id: string;
        name: string;
        fileUrl: string;
        fieldMappings: FormField[];
    };
}

export default function PublicFormClient({ form }: PublicFormClientProps) {
    const [viewMode, setViewMode] = useState<'form' | 'pdf'>('form');
    const [scale, setScale] = useState(1.0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Store form values: { [fieldId]: value }
    const [values, setValues] = useState<Record<string, string>>({});
    const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

    const handleInputChange = (fieldId: string, value: string) => {
        setValues(prev => ({
            ...prev,
            [fieldId]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Validate required fields
            const missingRequired = form.fieldMappings
                .filter(f => f.required && !values[f.id])
                .map(f => f.label || 'Untitled Field');

            if (missingRequired.length > 0) {
                alert(`Please fill in required fields: ${missingRequired.join(', ')}`);
                setIsSubmitting(false);
                return;
            }

            const res = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formId: form.id,
                    data: values
                })
            });

            if (!res.ok) throw new Error('Submission failed');

            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/pdf')) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                setDownloadUrl(url); // Save for manual download

                // Auto-trigger download
                const a = document.createElement('a');
                a.href = url;
                a.download = `${form.name}-filled.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }

            setIsSuccess(true);
        } catch (error) {
            console.error(error);
            alert('Failed to submit form. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Received!</h2>
                    <p className="text-gray-500 mb-6">
                        Thank you for filling out <strong>{form.name}</strong>. Your response has been recorded.
                    </p>

                    {downloadUrl && (
                        <a
                            href={downloadUrl}
                            download={`${form.name}-filled.pdf`}
                            className="block w-full text-center px-4 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors mb-4 shadow"
                        >
                            Download Filled PDF
                        </a>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Fill another response
                    </button>
                </div>
            </div>
        );
    }

    // Sort fields by page and Y position to approximate reading order
    const sortedFields = [...form.fieldMappings].sort((a, b) => {
        if (a.page !== b.page) return a.page - b.page;
        return a.y - b.y;
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 h-16 shrink-0 px-4 sm:px-6 lg:px-8 flex items-center justify-between z-20 shadow-sm sticky top-0">
                <h1 className="text-lg font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">{form.name}</h1>

                <div className="flex items-center space-x-4">
                    {/* View Toggle */}
                    <div className="bg-slate-100 p-1 rounded-lg flex items-center">
                        <button
                            onClick={() => setViewMode('form')}
                            className={cn(
                                "flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                viewMode === 'form' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            <Layout className="w-4 h-4 mr-2" />
                            Form View
                        </button>
                        <button
                            onClick={() => setViewMode('pdf')}
                            className={cn(
                                "flex items-center px-3 py-1.5 text-sm font-medium rounded-md transition-all",
                                viewMode === 'pdf' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            <FileText className="w-4 h-4 mr-2" />
                            PDF View
                        </button>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow transition-all text-sm"
                    >
                        {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Submit
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden relative">
                {viewMode === 'form' ? (
                    <div className="h-full overflow-y-auto py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="px-8 py-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">Fill Details</h2>
                                <p className="text-sm text-gray-500 mt-1">Please fill out the form below.</p>
                            </div>
                            <div className="px-8 py-6 space-y-6">
                                {sortedFields.map((field) => (
                                    <div key={field.id} className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                        </label>
                                        {renderInput(field, values[field.id] || '', (val) => handleInputChange(field.id, val), 'standard')}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <PdfViewer
                        url={form.fileUrl}
                        onPageChange={setCurrentPage}
                        scale={scale}
                        onScaleChange={setScale}
                    >
                        {/* Overlay Inputs */}
                        {(() => {
                            const pageFields = form.fieldMappings.filter(f => f.page === currentPage);
                            return pageFields.map((field) => (
                                <div
                                    key={field.id}
                                    className="absolute"
                                    style={{
                                        left: `${field.x * scale}px`,
                                        top: `${field.y * scale}px`,
                                        width: `${field.width * scale}px`,
                                        height: `${field.height * scale}px`,
                                    }}
                                >
                                    {renderInput(field, values[field.id] || '', (val) => handleInputChange(field.id, val), 'overlay')}
                                </div>
                            ));
                        })()}
                    </PdfViewer>
                )}
            </main>
        </div>
    );
}

function renderInput(
    field: FormField,
    value: string,
    onChange: (val: string) => void,
    variant: 'standard' | 'overlay' = 'standard'
) {
    const isOverlay = variant === 'overlay';

    // Overlay styles: slightly translucent bg, no border unless focused (or minimal border), minimal padding
    const overlayClasses = "bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white border border-transparent focus:border-blue-500 rounded text-xs px-1 py-0.5 leading-tight w-full h-full";
    const standardClasses = "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all";

    const baseClasses = isOverlay ? overlayClasses : standardClasses;

    switch (field.type) {
        case 'signature':
            return (
                <SignatureInput
                    value={value}
                    onChange={onChange}
                    label={field.label}
                    required={field.required}
                    useModal={isOverlay}
                />
            );
        case 'textarea':
            // For overlay textarea, we want it to fill the height
            return (
                <textarea
                    className={cn(baseClasses, isOverlay ? "resize-none p-1" : "h-24 resize-y leading-relaxed")}
                    placeholder={isOverlay ? '' : field.label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                />
            );
        case 'checkbox':
            // Checkbox in overlay needs to be center-aligned or just a simple check
            if (isOverlay) {
                return (
                    <div className="w-full h-full flex items-center justify-center cursor-pointer bg-blue-50/20 hover:bg-blue-50/40" onClick={() => onChange(value === 'true' ? '' : 'true')}>
                        {value === 'true' && <Check className="w-5 h-5 text-black" />}
                    </div>
                )
            }
            // Standard Checkbox
            return (
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id={`field-${field.id}`}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={value === 'true'}
                        onChange={(e) => onChange(e.target.checked ? 'true' : '')}
                    />
                    <label htmlFor={`field-${field.id}`} className="text-sm text-gray-700">
                        {field.label}
                    </label>
                </div>
            );
        case 'number':
            return (
                <input
                    type="number"
                    className={baseClasses}
                    placeholder={isOverlay ? '' : field.label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                />
            );
        default: // text, email, etc.
            return (
                <input
                    type="text"
                    className={baseClasses}
                    placeholder={isOverlay ? '' : field.label}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={field.required}
                />
            );
    }
}
