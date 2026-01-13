'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewerProps {
    url: string;
    onPageChange?: (page: number) => void;
    children?: React.ReactNode; // For interactive overlay
    scale?: number;
    onScaleChange?: (scale: number) => void;
}

export default function PdfViewer({
    url,
    onPageChange,
    children,
    scale = 1.0,
    onScaleChange
}: PdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    const changePage = (offset: number) => {
        setPageNumber(prevPageNumber => {
            const newPage = prevPageNumber + offset;
            if (newPage >= 1 && newPage <= numPages) {
                onPageChange?.(newPage);
                return newPage;
            }
            return prevPageNumber;
        });
    };

    const handleZoom = (delta: number) => {
        const newScale = Math.max(0.5, Math.min(3.0, scale + delta));
        onScaleChange?.(newScale);
    };

    return (
        <div className="flex flex-col h-full bg-slate-100">
            {/* Toolbar */}
            <div className="bg-white border-b border-slate-200 p-2 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => changePage(-1)}
                        disabled={pageNumber <= 1}
                        className="px-2 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <span className="text-sm font-medium">
                        Page {pageNumber} of {numPages || '--'}
                    </span>
                    <button
                        onClick={() => changePage(1)}
                        disabled={pageNumber >= numPages}
                        className="px-2 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => handleZoom(-0.1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        title="Zoom Out"
                    >
                        <ZoomOut className="w-5 h-5" />
                    </button>
                    <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
                    <button
                        onClick={() => handleZoom(0.1)}
                        className="p-1 hover:bg-slate-100 rounded text-slate-600"
                        title="Zoom In"
                    >
                        <ZoomIn className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* PDF Container */}
            <div className="flex-1 overflow-auto p-8 flex justify-center relative" ref={containerRef}>
                <div className="relative shadow-lg border border-slate-200 bg-white" style={{ width: 'fit-content' }}>
                    <Document
                        file={url}
                        onLoadSuccess={onDocumentLoadSuccess}
                        loading={
                            <div className="flex items-center justify-center p-20 text-slate-400">
                                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                                <span>Loading PDF...</span>
                            </div>
                        }
                        error={
                            <div className="p-20 text-red-500 flex flex-col items-center">
                                <AlertCircle className="w-8 h-8 mb-2" />
                                <p>Failed to load PDF</p>
                            </div>
                        }
                    >
                        <Page
                            pageNumber={pageNumber}
                            scale={scale}
                            className="bg-white"
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />

                        {/* Overlay Layer for Form Fields */}
                        {!loading && (
                            <div
                                className="absolute inset-0 z-10"
                                style={{
                                    width: '100%',
                                    height: '100%'
                                }}
                            >
                                {children}
                            </div>
                        )}
                    </Document>
                </div>
            </div>
        </div>
    );
}

// Helper icon component for error state
function AlertCircle({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    );
}
