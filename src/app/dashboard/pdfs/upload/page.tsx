'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { validatePdfFile, formatFileSize } from '@/lib/pdf/validation';

function UploadForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const folderId = searchParams.get('folderId');
    const [isDragOver, setIsDragOver] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [pdfName, setPdfName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            validateAndSetFile(e.target.files[0]);
        }
    };

    const validateAndSetFile = (file: File) => {
        setError(null);
        const validation = validatePdfFile(file);

        if (!validation.valid) {
            setError(validation.error || 'Invalid file');
            return;
        }

        setSelectedFile(file);
        // Set default name from file name (without extension)
        setPdfName(file.name.replace(/\.pdf$/i, ''));
    };

    const handleUpload = async () => {
        if (!selectedFile) return;
        if (!pdfName.trim()) {
            setError('Please enter a name for the PDF');
            return;
        }

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('name', pdfName.trim());
        if (folderId) {
            formData.append('folderId', folderId);
        }

        try {
            const response = await fetch('/api/pdfs', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Upload failed');
            }

            const data = await response.json();
            const redirectUrl = folderId ? `/dashboard/pdfs?folderId=${folderId}` : '/dashboard/pdfs';
            router.push(redirectUrl); // Redirect to library (specific folder if applicable)
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Something went wrong during upload');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <>
            <div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer bg-white ${isDragOver ? 'border-primary bg-blue-50' : 'border-gray-300'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {!selectedFile ? (
                    <div className="space-y-4">
                        <div className="bg-blue-100 p-4 rounded-full inline-block">
                            <Upload className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-lg font-medium">Click to upload or drag and drop</p>
                            <p className="text-sm text-gray-500 mt-1">PDF items only, max 10MB</p>
                        </div>
                        <input
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            id="file-upload"
                            onChange={handleFileSelect}
                        />
                        <label
                            htmlFor="file-upload"
                            className="inline-block bg-white border border-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 cursor-pointer"
                        >
                            Select File
                        </label>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="flex items-center justify-center space-x-4 bg-gray-50 p-4 rounded-lg">
                            <FileText className="w-10 h-10 text-red-500" />
                            <div className="text-left">
                                <p className="font-medium text-gray-900">{selectedFile.name}</p>
                                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                            </div>
                        </div>

                        <div className="text-left">
                            <label htmlFor="pdfName" className="block text-sm font-medium text-gray-700 mb-1">
                                PDF Name
                            </label>
                            <input
                                type="text"
                                id="pdfName"
                                value={pdfName}
                                onChange={(e) => setPdfName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                placeholder="Enter a name for this PDF"
                                disabled={isUploading}
                            />
                        </div>

                        <div className="flex space-x-3 justify-center">
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPdfName('');
                                }}
                                className="px-4 py-2 border rounded-md text-sm font-medium hover:bg-gray-50"
                                disabled={isUploading}
                            >
                                Change File
                            </button>
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-blue-600 disabled:opacity-50 flex items-center"
                            >
                                {isUploading ? 'Uploading...' : 'Upload PDF'}
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    {error}
                </div>
            )}
        </>
    );
}

export default function PdfsUploadPage() {
    return (
        <div className="max-w-2xl mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">Upload PDF Template</h1>
            <Suspense fallback={<div>Loading...</div>}>
                <UploadForm />
            </Suspense>
        </div>
    );
}
