'use client';

import { useState, useRef, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Loader2, ZoomIn, ZoomOut, Search, Trash2, X, Type, PenTool, Check, GripVertical, Bold } from 'lucide-react';
import { AdhocElement } from '@/app/quick-fill/page';
import SignatureInput from '@/components/forms/signature-input';
import { cn } from '@/lib/utils';

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface AdhocPdfViewerProps {
    url: string;
    onPageClick: (page: number, x: number, y: number) => void;
    elements: AdhocElement[];
    onUpdateElement: (id: string, updates: Partial<AdhocElement>) => void;
    onRemoveElement: (id: string) => void;
    scale: number;
    onScaleChange: (scale: number) => void;
    activeTool: 'text' | 'signature' | 'checkmark';
    onToolChange: (tool: 'text' | 'signature' | 'checkmark') => void;
    activeColor: string;
    onColorChange: (color: string) => void;
    isBold: boolean;
    onBoldChange: (isBold: boolean) => void;
}

import { AD_HOC_COLORS } from '@/lib/pdf/config';

export default function AdhocPdfViewer({
    url,
    onPageClick,
    elements,
    onUpdateElement,
    onRemoveElement,
    scale,
    onScaleChange,
    activeTool,
    onToolChange,
    activeColor,
    onColorChange,
    isBold,
    onBoldChange
}: AdhocPdfViewerProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

    // Drag & Resize State
    const [isDragging, setIsDragging] = useState(false);
    const [draggedId, setDraggedId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const [isResizing, setIsResizing] = useState(false);
    const [resizedId, setResizedId] = useState<string | null>(null);
    const [initialResize, setInitialResize] = useState({ x: 0, y: 0, width: 0, height: 0 });

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
        setLoading(false);
    }

    const scrollToPage = (page: number) => {
        const pageElement = pageRefs.current[page - 1];
        const container = containerRef.current;
        if (pageElement && container) {
            const containerRect = container.getBoundingClientRect();
            const pageRect = pageElement.getBoundingClientRect();
            const scrollTop = container.scrollTop + (pageRect.top - containerRect.top) - 20;
            container.scrollTo({ top: scrollTop, behavior: 'smooth' });
        }
    };

    const handleZoom = (delta: number) => {
        onScaleChange(Math.max(0.5, Math.min(3.0, scale + delta)));
    };

    const handleCanvasClick = (e: React.MouseEvent, page: number) => {
        if ((e.target as HTMLElement).closest('.adhoc-element')) return;

        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / scale;
        const y = (e.clientY - rect.top) / scale;

        onPageClick(page, x, y);
    };

    // Drag Handlers
    const handleDragStart = (e: React.MouseEvent, element: AdhocElement) => {
        e.stopPropagation();
        // Only trigger drag if we clicked the grip handle or the element boundary
        if (!(e.target as HTMLElement).dataset.dragHandle) return;

        setIsDragging(true);
        setDraggedId(element.id);

        const rect = (e.currentTarget as HTMLElement).closest('.adhoc-element')!.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleResizeStart = (e: React.MouseEvent, element: AdhocElement) => {
        e.stopPropagation();
        e.preventDefault();
        setIsResizing(true);
        setResizedId(element.id);
        setInitialResize({
            x: e.clientX,
            y: e.clientY,
            width: element.width,
            height: element.height
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && draggedId) {
            const element = elements.find(el => el.id === draggedId);
            if (!element) return;

            const pageIdx = element.page - 1;
            const pageRef = pageRefs.current[pageIdx];
            if (!pageRef) return;

            const rect = pageRef.getBoundingClientRect();
            const x = (e.clientX - rect.left - dragOffset.x) / scale;
            const y = (e.clientY - rect.top - dragOffset.y) / scale;

            onUpdateElement(draggedId, { x, y });
        } else if (isResizing && resizedId) {
            const dx = (e.clientX - initialResize.x) / scale;
            const dy = (e.clientY - initialResize.y) / scale;

            onUpdateElement(resizedId, {
                width: Math.max(20, initialResize.width + dx),
                height: Math.max(20, initialResize.height + dy)
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedId(null);
        setIsResizing(false);
        setResizedId(null);
    };

    // Scroll detection to update current page number
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (numPages === 0) return;

            const containerRect = container.getBoundingClientRect();
            const containerCenter = containerRect.top + containerRect.height / 2;

            let currentVisiblePage = 1;
            let minDistance = Infinity;

            pageRefs.current.forEach((pageRef, index) => {
                if (!pageRef) return;
                const rect = pageRef.getBoundingClientRect();
                const pageCenter = rect.top + rect.height / 2;
                const distance = Math.abs(containerCenter - pageCenter);

                if (distance < minDistance) {
                    minDistance = distance;
                    currentVisiblePage = index + 1;
                }
            });

            if (currentVisiblePage !== pageNumber) {
                setPageNumber(currentVisiblePage);
            }
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [numPages, pageNumber]);

    return (
        <div
            className="flex flex-col h-full bg-slate-100 overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            {/* Toolbar */}
            <div className="bg-white border-b py-2 flex flex-col items-center gap-2 shadow-sm z-20 shrink-0 sticky top-0 px-4">
                <div className="w-full flex items-center justify-between">
                    {/* Pagination */}
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => scrollToPage(pageNumber - 1)}
                            disabled={pageNumber <= 1}
                            className="p-1 px-3 text-[11px] font-bold uppercase tracking-wider bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md disabled:opacity-30 transition-all"
                        >
                            Prev
                        </button>
                        <span className="text-[11px] font-black tracking-widest px-4 min-w-[100px] text-center text-slate-400">
                            PAGE {pageNumber} / {numPages || '--'}
                        </span>
                        <button
                            onClick={() => scrollToPage(pageNumber + 1)}
                            disabled={pageNumber >= numPages}
                            className="p-1 px-3 text-[11px] font-bold uppercase tracking-wider bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md disabled:opacity-30 transition-all"
                        >
                            Next
                        </button>
                    </div>

                    {/* Tool Selection (Center) */}
                    <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200 mx-4">
                        <button
                            onClick={() => onToolChange('text')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                                activeTool === 'text'
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                            )}
                            title="Text Tool"
                        >
                            <Type className={cn("w-4 h-4", activeTool === 'text' ? "text-blue-600" : "text-slate-400")} />
                            <span className="text-xs font-bold uppercase tracking-tight">Text</span>
                        </button>
                        <button
                            onClick={() => onToolChange('signature')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                                activeTool === 'signature'
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                            )}
                            title="Signature Tool"
                        >
                            <PenTool className={cn("w-4 h-4", activeTool === 'signature' ? "text-blue-600" : "text-slate-400")} />
                            <span className="text-xs font-bold uppercase tracking-tight">Sign</span>
                        </button>
                        <button
                            onClick={() => onToolChange('checkmark')}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                                activeTool === 'checkmark'
                                    ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                            )}
                            title="Checkmark Tool"
                        >
                            <Check className={cn("w-4 h-4", activeTool === 'checkmark' ? "text-blue-600" : "text-slate-400")} />
                            <span className="text-xs font-bold uppercase tracking-tight">Tick</span>
                        </button>
                    </div>

                    {/* Zoom */}
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => handleZoom(-0.2)}
                            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 border border-transparent hover:border-slate-200 transition-all"
                        >
                            <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-[11px] font-black w-14 text-center text-slate-900 tracking-tighter">{Math.round(scale * 100)}%</span>
                        <button
                            onClick={() => handleZoom(0.2)}
                            className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 border border-transparent hover:border-slate-200 transition-all"
                        >
                            <ZoomIn className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Sub-toolbar: Colors & Weights */}
                <div className="flex items-center gap-6 py-1 px-4 border-t w-full justify-center">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Color</span>
                        <div className="flex items-center gap-2">
                            {AD_HOC_COLORS.map((c) => (
                                <button
                                    key={c.name}
                                    onClick={() => onColorChange(c.name)}
                                    className={cn(
                                        "w-5 h-5 rounded-full border border-white shadow-sm transition-all hover:scale-125",
                                        c.class,
                                        activeColor === c.name && `ring-2 ring-offset-2 ${c.ring}`
                                    )}
                                    title={c.name}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="h-4 w-px bg-slate-200" />
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mr-1">Style</span>
                        <button
                            onClick={() => onBoldChange(!isBold)}
                            className={cn(
                                "p-1.5 rounded transition-all",
                                isBold ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
                            )}
                            title="Bold Text"
                        >
                            <Bold className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* PDF Container */}
            <div
                className="flex-1 overflow-auto p-8 flex flex-col items-center gap-12 relative scroll-smooth bg-slate-200/50"
                ref={containerRef}
            >
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex flex-col items-center justify-center p-32 space-y-4">
                            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                            <span className="text-slate-500 font-medium">Preparing document...</span>
                        </div>
                    }
                    className="flex flex-col gap-12"
                >
                    {Array.from(new Array(numPages), (el, index) => (
                        <div
                            key={`page_${index + 1}`}
                            ref={el => { pageRefs.current[index] = el }}
                            className="relative shadow-2xl border border-slate-300 bg-white group"
                            style={{ width: 'fit-content' }}
                        >
                            <Page
                                pageNumber={index + 1}
                                scale={scale}
                                className="bg-white"
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                            />

                            {/* Clickable Overlay Layer */}
                            <div
                                className="absolute inset-0 z-10 cursor-crosshair group-hover:bg-blue-50/5 transition-colors"
                                onClick={(e) => handleCanvasClick(e, index + 1)}
                            >
                                {elements
                                    .filter(el => el.page === index + 1)
                                    .map((element) => {
                                        const colorObj = AD_HOC_COLORS.find(c => c.name === (element.color || 'black')) || AD_HOC_COLORS[0];
                                        return (
                                            <div
                                                key={element.id}
                                                className={cn(
                                                    "absolute adhoc-element animate-in fade-in zoom-in duration-200 group/element border-2 border-dashed border-blue-400/50 hover:border-blue-500 rounded transition-colors",
                                                    (draggedId === element.id || resizedId === element.id) ? "z-50 ring-2 ring-blue-500 border-blue-600 bg-blue-50/20" : "z-20 hover:bg-blue-50/10"
                                                )}
                                                style={{
                                                    left: `${element.x * scale}px`,
                                                    top: `${element.y * scale}px`,
                                                    width: `${element.width * scale}px`,
                                                    height: `${element.height * scale}px`,
                                                }}
                                                onMouseDown={(e) => handleDragStart(e, element)}
                                            >
                                                <div className="relative w-full h-full flex flex-col">
                                                    {/* Grip Handle for Panning */}
                                                    <div
                                                        className="absolute -left-2.5 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-0.5 rounded cursor-grab active:cursor-grabbing opacity-0 group-hover/element:opacity-100 transition-opacity z-30"
                                                        data-drag-handle="true"
                                                    >
                                                        <GripVertical className="w-3 h-3" data-drag-handle="true" />
                                                    </div>

                                                    {element.type === 'text' ? (
                                                        <textarea
                                                            autoFocus
                                                            className={cn(
                                                                "w-full h-full bg-transparent text-sm p-1.5 resize-none outline-none italic leading-tight placeholder:text-blue-300",
                                                                element.fontWeight === 'bold' && "font-bold"
                                                            )}
                                                            style={{ color: colorObj.hex }}
                                                            value={element.value}
                                                            onChange={(e) => onUpdateElement(element.id, { value: e.target.value })}
                                                            placeholder="Type here..."
                                                        />
                                                    ) : element.type === 'signature' ? (
                                                        <div className="w-full h-full flex items-center justify-center overflow-hidden">
                                                            <SignatureInput
                                                                value={element.value}
                                                                onChange={(val) => onUpdateElement(element.id, { value: val })}
                                                                useModal={true}
                                                                label=""
                                                                penColor={colorObj.hex}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center p-1 pointer-events-none">
                                                            <Check
                                                                className="w-full h-full"
                                                                style={{
                                                                    color: colorObj.hex,
                                                                    strokeWidth: element.fontWeight === 'bold' ? 4 : 2
                                                                }}
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Controls Overlay */}
                                                    <div className="absolute -top-3 -right-3 flex items-center gap-1 opacity-0 group-hover/element:opacity-100 transition-opacity z-30">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onRemoveElement(element.id); }}
                                                            className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                                                        >
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>

                                                    {/* Resize Handle */}
                                                    <div
                                                        className="absolute bottom-[-6px] right-[-6px] w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-30 opacity-0 group-hover/element:opacity-100"
                                                        data-resize-handle="true"
                                                        onMouseDown={(e) => handleResizeStart(e, element)}
                                                    >
                                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-sm ring-1 ring-white shadow-sm" data-resize-handle="true" />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    ))}
                </Document>
            </div>
        </div>
    );
}
