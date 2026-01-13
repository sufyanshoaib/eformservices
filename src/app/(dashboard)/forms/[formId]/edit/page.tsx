'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { ArrowLeft, Save, Loader2, Share2, Globe, Copy, Check } from 'lucide-react';
import Link from 'next/link';

import FieldSelector from '@/components/forms/field-selector';
import PdfViewer from '@/components/pdf/pdf-viewer';
import FormCanvas, { FormField } from '@/components/forms/form-canvas';
import FieldProperties from '@/components/forms/field-properties';

interface FormBuilderPageProps {
    params: Promise<{
        formId: string;
    }>;
}

export default function FormBuilderPage(props: FormBuilderPageProps) {
    const params = use(props.params); // Unwrap params with use() for client components
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // State
    const [form, setForm] = useState<any>(null);
    const [fields, setFields] = useState<FormField[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [scale, setScale] = useState(1.0);
    const [currentPage, setCurrentPage] = useState(1);

    // Publish State
    const [isPublished, setIsPublished] = useState(false);
    const [shareableLink, setShareableLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    // Load form data
    useEffect(() => {
        async function loadForm() {
            try {
                const res = await fetch(`/api/forms/${params.formId}`);
                if (!res.ok) throw new Error('Failed to load form');

                const data = await res.json();
                setForm(data);
                setIsPublished(data.isPublished); // Set initial publish state
                setShareableLink(data.shareableLink); // Set initial link

                // Parse fields from JSON if exists
                if (data.fieldMappings && Array.isArray(data.fieldMappings)) {
                    setFields(data.fieldMappings);
                }
            } catch (error) {
                console.error('Error loading form:', error);
            } finally {
                setLoading(false);
            }
        }

        loadForm();
    }, [params.formId]);

    // Actions
    const handleAddField = (fieldData: Omit<FormField, 'id'>) => {
        const newField: FormField = {
            ...fieldData,
            id: nanoid(),
        };
        setFields([...fields, newField]);
        setSelectedFieldId(newField.id);
    };

    const handleUpdateField = (id: string, updates: Partial<FormField>) => {
        setFields(fields.map(field =>
            field.id === id ? { ...field, ...updates } : field
        ));
    };

    const handleRemoveField = (id: string) => {
        setFields(fields.filter(field => field.id !== id));
        if (selectedFieldId === id) {
            setSelectedFieldId(null);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch(`/api/forms/${params.formId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fieldMappings: fields,
                }),
            });

            if (!res.ok) throw new Error('Failed to save');

            // Show success toast (simulated)
            console.log('Saved successfully');
        } catch (error) {
            console.error('Error saving form:', error);
        } finally {
            setSaving(false);
        }
    };

    const handlePublishToggle = async () => {
        setSaving(true);
        try {
            const newPublishState = !isPublished;
            const res = await fetch(`/api/forms/${params.formId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    isPublished: newPublishState,
                }),
            });

            if (!res.ok) throw new Error('Failed to update publish status');

            const updatedForm = await res.json();
            setIsPublished(updatedForm.isPublished);
            setShareableLink(updatedForm.shareableLink);

            console.log(newPublishState ? 'Form published' : 'Form unpublished');
        } catch (error) {
            console.error('Error toggling publish:', error);
        } finally {
            setSaving(false);
        }
    };

    const copyLink = () => {
        if (!shareableLink) return;
        const url = `${window.location.origin}/s/${shareableLink}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!form) {
        return <div>Form not found</div>;
    }

    const selectedField = fields.find(f => f.id === selectedFieldId) || null;

    return (
        <div className="flex flex-col h-screen bg-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between z-20">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/dashboard/forms"
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-sm font-semibold text-slate-900">{form.name}</h1>
                            {isPublished ? (
                                <span className="px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-medium border border-green-200">
                                    Published
                                </span>
                            ) : (
                                <span className="px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-medium border border-slate-200">
                                    Draft
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500">{form.pdf?.fileName}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {isPublished && shareableLink && (
                        <div className="hidden md:flex items-center mr-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5">
                            <Globe className="w-3.5 h-3.5 text-slate-400 mr-2" />
                            <span className="text-xs text-slate-600 mr-3 truncate max-w-[150px]">
                                {typeof window !== 'undefined' ? window.location.origin : ''}/s/{shareableLink}
                            </span>
                            <button
                                onClick={copyLink}
                                className="text-slate-400 hover:text-slate-700 focus:outline-none"
                                title="Copy link"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    )}

                    <button
                        onClick={handlePublishToggle}
                        disabled={saving}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isPublished
                                ? 'bg-white border border-slate-300 text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200'
                                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                            }`}
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Share2 className="w-4 h-4 mr-2" />
                        )}
                        {isPublished ? 'Unpublish' : 'Publish'}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {saving && !isPublished ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                    </button>
                </div>
            </header>

            {/* Builder Workspace */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Pane: Field Selector */}
                <FieldSelector />

                {/* Center Pane: PDF Canvas */}
                <main className="flex-1 overflow-hidden relative">
                    <PdfViewer
                        url={form.pdf?.fileUrl}
                        onPageChange={setCurrentPage}
                        scale={scale}
                        onScaleChange={setScale}
                    >
                        <FormCanvas
                            fields={fields}
                            onAddField={handleAddField}
                            onUpdateField={handleUpdateField}
                            onRemoveField={handleRemoveField}
                            onSelectField={setSelectedFieldId}
                            selectedFieldId={selectedFieldId}
                            currentPage={currentPage}
                            scale={scale}
                        />
                    </PdfViewer>
                </main>

                {/* Right Pane: Properties */}
                <FieldProperties
                    field={selectedField}
                    onUpdate={handleUpdateField}
                    onDelete={handleRemoveField}
                />
            </div>
        </div>
    );
}
