'use client';

import { useState, useRef } from 'react';
import { X, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FieldType } from './field-selector';

export interface FormField {
    id: string;
    type: FieldType;
    label: string;
    x: number;
    y: number;
    width: number;
    height: number;
    page: number;
    required?: boolean;
    groupName?: string;
    value?: string;
    isAISuggestion?: boolean; // Flag to mark AI-suggested fields
    confidence?: number; // AI confidence score (0-1)
}

interface FormCanvasProps {
    fields: FormField[];
    onAddField: (field: Omit<FormField, 'id'>) => void;
    onUpdateField: (id: string, updates: Partial<FormField>) => void;
    onRemoveField: (id: string) => void;
    onSelectField: (id: string | null) => void;
    selectedFieldId: string | null;
    currentPage: number;
    scale: number;
}

export default function FormCanvas({
    fields,
    onAddField,
    onUpdateField,
    onRemoveField,
    onSelectField,
    selectedFieldId,
    currentPage,
    scale
}: FormCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [draggedFieldId, setDraggedFieldId] = useState<string | null>(null);
    const [isResizing, setIsResizing] = useState(false);
    const [resizedFieldId, setResizedFieldId] = useState<string | null>(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [initialResizeState, setInitialResizeState] = useState({ x: 0, y: 0, width: 0, height: 0 });

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('field-type') as FieldType;

        if (type && canvasRef.current) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;

            onAddField({
                type,
                label: `New ${type} field`,
                x,
                y,
                width: type === 'radio' || type === 'checkbox' ? 40 : 150, // Smaller default for options
                height: 40,
                page: currentPage,
                required: false,
                ...(type === 'radio' ? { groupName: 'group_1', value: 'option_1' } : {})
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent, field: FormField) => {
        e.stopPropagation();
        onSelectField(field.id);

        // Don't start dragging if we clicked a resize handle
        if ((e.target as HTMLElement).dataset.resizeHandle) {
            return;
        }

        setIsDragging(true);
        setDraggedFieldId(field.id);

        // Calculate offset from top-left of the field element
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleResizeStart = (e: React.MouseEvent, field: FormField) => {
        e.stopPropagation();
        e.preventDefault(); // Prevent text selection

        setIsResizing(true);
        setResizedFieldId(field.id);
        setInitialResizeState({
            x: e.clientX,
            y: e.clientY,
            width: field.width,
            height: field.height
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && draggedFieldId && canvasRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect();

            // Calculate new position relative to canvas, accounting for scale
            const x = (e.clientX - canvasRect.left - dragOffset.x) / scale;
            const y = (e.clientY - canvasRect.top - dragOffset.y) / scale;

            onUpdateField(draggedFieldId, { x, y });
        } else if (isResizing && resizedFieldId) {
            const dx = (e.clientX - initialResizeState.x) / scale;
            const dy = (e.clientY - initialResizeState.y) / scale;

            // Enforce minimum dimensions
            const newWidth = Math.max(20, initialResizeState.width + dx);
            const newHeight = Math.max(20, initialResizeState.height + dy);

            onUpdateField(resizedFieldId, { width: newWidth, height: newHeight });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedFieldId(null);
        setIsResizing(false);
        setResizedFieldId(null);
    };

    return (
        <div
            ref={canvasRef}
            className="absolute inset-0 z-50 overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={() => onSelectField(null)} // Deselect when clicking empty canvas
        >
            {fields
                .filter(field => field.page === currentPage)
                .map(field => (
                    <div
                        key={field.id}
                        style={{
                            position: 'absolute',
                            left: field.x * scale,
                            top: field.y * scale,
                            width: field.width * scale,
                            height: field.height * scale,
                            cursor: isDragging && draggedFieldId === field.id ? 'grabbing' : 'grab'
                        }}
                        className={cn(
                            field.isAISuggestion
                                ? "bg-purple-100/80 border-2 border-purple-500 border-dashed rounded flex items-center px-2 shadow-sm transition-shadow group hover:shadow-md hover:bg-purple-100"
                                : "bg-blue-100/80 border-2 border-blue-500 rounded flex items-center px-2 shadow-sm transition-shadow group hover:shadow-md hover:bg-blue-100",
                            selectedFieldId === field.id && (field.isAISuggestion ? "ring-2 ring-purple-600 ring-offset-1 z-50 bg-purple-200" : "ring-2 ring-blue-600 ring-offset-1 z-50 bg-blue-200")
                        )}
                        onMouseDown={(e) => handleMouseDown(e, field)}
                        onClick={(e) => e.stopPropagation()} // Prevent deselection
                    >
                        <GripVertical className={cn(
                            "h-4 w-4 mr-2 flex-shrink-0 cursor-grab active:cursor-grabbing",
                            field.isAISuggestion ? "text-purple-400" : "text-blue-400"
                        )} />
                        <span className={cn(
                            "text-[10px] font-medium leading-tight select-none pointer-events-none w-full flex flex-col",
                            field.isAISuggestion ? "text-purple-900" : "text-blue-900"
                        )}>
                            {field.type === 'radio' ? (
                                <>
                                    <span className="truncate">{field.label}</span>
                                    <span className="opacity-60 truncate">G: {field.groupName || 'none'}</span>
                                    <span className="opacity-60 truncate">V: {field.value || 'none'}</span>
                                </>
                            ) : (
                                <>
                                    <span className="truncate">
                                        {field.label}
                                        {field.isAISuggestion && field.confidence && (
                                            <span className="ml-1 opacity-60">({Math.round(field.confidence * 100)}%)</span>
                                        )}
                                    </span>
                                    {field.required && <span className="text-red-500 absolute top-1 right-1">*</span>}
                                </>
                            )}
                        </span>

                        {/* Delete Button */}
                        {selectedFieldId === field.id && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemoveField(field.id);
                                }}
                                className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
                                title="Remove field"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        )}

                        {/* Resize Handle */}
                        {selectedFieldId === field.id && (
                            <div
                                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 z-50"
                                data-resize-handle="true"
                                onMouseDown={(e) => handleResizeStart(e, field)}
                            >
                                <div className="w-2 h-2 bg-blue-500 rounded-sm" data-resize-handle="true" />
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}
