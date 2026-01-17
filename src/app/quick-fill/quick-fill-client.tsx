'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FileUp, Loader2, MousePointer2, Type, PenTool, Download, Trash2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { cn } from '@/lib/utils';
import AdhocPdfViewer from '@/components/pdf/adhoc-viewer';
import { nanoid } from 'nanoid';
import { AdhocElement } from './page';

export default function QuickFillClient() {
    const [file, setFile] = useState<File | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [elements, setElements] = useState<AdhocElement[]>([]);
    const [activeTool, setActiveTool] = useState<'text' | 'signature' | 'checkmark'>('text');
    const [activeColor, setActiveColor] = useState<string>('black');
    const [isBold, setIsBold] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [scale, setScale] = useState(1.5);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            setPdfUrl(URL.createObjectURL(selectedFile));
            setElements([]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        multiple: false
    });

    const handleAddElement = (page: number, x: number, y: number) => {
        y = y - 12;
        const newElement: AdhocElement = {
            id: nanoid(),
            type: activeTool,
            page,
            x,
            y,
            width: activeTool === 'signature' ? 150 : (activeTool === 'checkmark' ? 24 : 150),
            height: activeTool === 'signature' ? 60 : (activeTool === 'checkmark' ? 24 : 24),
            value: activeTool === 'checkmark' ? 'true' : '',
            color: activeColor,
            fontWeight: isBold ? 'bold' : 'normal'
        };
        setElements([...elements, newElement]);
    };

    const handleUpdateElement = (id: string, updates: Partial<AdhocElement>) => {
        setElements(elements.map(el => el.id === id ? { ...el, ...updates } : el));
    };

    const handleRemoveElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
    };

    const handleDownload = async () => {
        if (!file || elements.length === 0) return;
        setIsGenerating(true);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('elements', JSON.stringify(elements));

            const res = await fetch('/api/pdfs/adhoc-fill', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error('Failed to generate PDF');

            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${file.name.replace('.pdf', '')}_signed.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            console.error('Download error:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    if (!pdfUrl) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
                    <Logo />
                    <Link href="/">
                        <Button variant="ghost" size="sm">
                            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
                        </Button>
                    </Link>
                </header>
                <main className="flex-1 flex items-center justify-center p-6">
                    <div className="max-w-2xl w-full text-center space-y-8">
                        <div className="space-y-3">
                            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                                Quick Fill & Sign
                            </h1>
                            <p className="text-lg text-slate-600">
                                Upload any PDF and start typing or signing immediately. Professional formatting at your fingertips.
                            </p>
                        </div>

                        <div
                            {...getRootProps()}
                            className={cn(
                                "border-2 border-dashed rounded-2xl p-12 transition-all cursor-pointer bg-white shadow-sm",
                                isDragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400"
                            )}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-blue-100 rounded-full mb-4">
                                    <FileUp className="w-8 h-8 text-blue-600" />
                                </div>
                                <p className="text-lg font-medium text-slate-900">
                                    {isDragActive ? "Drop the PDF here" : "Click to upload or drag and drop"}
                                </p>
                                <p className="text-sm text-slate-500 mt-1">PDF files up to 10MB</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                            <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                <div className="p-2 bg-indigo-50 rounded-lg mb-2">
                                    <Type className="w-5 h-5 text-indigo-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900">Add Text</h3>
                                <p className="text-xs text-slate-500">Full color and weight control</p>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                <div className="p-2 bg-emerald-50 rounded-lg mb-2">
                                    <PenTool className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900">Add Signature</h3>
                                <p className="text-xs text-slate-500">Authenticated & Secure</p>
                            </div>
                            <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                                <div className="p-2 bg-orange-50 rounded-lg mb-2">
                                    <Download className="w-5 h-5 text-orange-600" />
                                </div>
                                <h3 className="font-semibold text-slate-900">Instant Download</h3>
                                <p className="text-xs text-slate-500">Get your signed PDF in seconds</p>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="h-screen bg-slate-100 flex flex-col overflow-hidden relative">
            {/* Tool Header */}
            <header className="bg-white border-b h-16 px-6 flex items-center justify-between z-30 shadow-sm shrink-0">
                <div className="flex items-center gap-4">
                    <Logo />
                    <div className="h-6 w-px bg-slate-200 hidden sm:block" />
                    <div className="hidden sm:flex flex-col">
                        <span className="text-sm font-semibold text-slate-900 truncate max-w-[200px]">{file?.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Quick Fill & Sign</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { setPdfUrl(null); setFile(null); setElements([]); }}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Reset
                    </Button>
                    <div className="h-4 w-px bg-slate-200 mx-1" />
                    <Button
                        onClick={handleDownload}
                        disabled={isGenerating || elements.length === 0}
                        className="rounded-full px-6 shadow-md hover:shadow-lg transition-all"
                    >
                        {isGenerating ? (
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4 mr-2" />
                        )}
                        Finish & Download
                    </Button>
                </div>
            </header>

            {/* Main Editor */}
            <main className="flex-1 relative overflow-hidden">
                <AdhocPdfViewer
                    url={pdfUrl}
                    onPageClick={handleAddElement}
                    elements={elements}
                    onUpdateElement={handleUpdateElement}
                    onRemoveElement={handleRemoveElement}
                    scale={scale}
                    onScaleChange={setScale}
                    activeTool={activeTool}
                    onToolChange={setActiveTool}
                    activeColor={activeColor}
                    onColorChange={setActiveColor}
                    isBold={isBold}
                    onBoldChange={setIsBold}
                />
            </main>
        </div>
    );
}
