'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { ArrowLeft, Save, Loader2, Share2 } from 'lucide-react';
import Link from 'next/link';

import FieldSelector from '@/components/forms/field-selector';
import PdfViewer from '@/components/pdf/pdf-viewer';
import FormCanvas, { FormField } from '@/components/forms/form-canvas';
import FieldProperties from '@/components/forms/field-properties';

interface FormBuilderPageProps {
    params: {
        formId: string;
    };
}

export default function FormBuilderPage({ params }: FormBuilderPageProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // State
    const [form, setForm] = useState<any>(null);
    const [fields, setFields] = useState<FormField[]>([]);
    const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
    const [scale, setScale] = useState(1.0);
    const [currentPage, setCurrentPage] = useState(1);

    // Load form data
    useEffect(() => {
        async function loadForm() {
            try {
                const res = await fetch(`/api/forms/${params.formId}`);
                if (!res.ok) throw new Error('Failed to load form');

                const data = await res.json();
                setForm(data);

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
                        href="/dashboard/pdfs"
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-sm font-semibold text-slate-900">{form.name}</h1>
                        <p className="text-xs text-slate-500">{form.pdf?.fileName}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center px-4 py-2 bg-primary text-white text-sm font-medium rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Form
                    </button>

                    <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-md hover:bg-slate-50">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
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
