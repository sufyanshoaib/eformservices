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
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

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
                width: 150, // Default width
                height: 40, // Default height
                page: currentPage,
                required: false
            });
        }
    };

    const handleMouseDown = (e: React.MouseEvent, field: FormField) => {
        e.stopPropagation();
        onSelectField(field.id);
        setIsDragging(true);
        setDraggedFieldId(field.id);

        // Calculate offset from top-left of the field element
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && draggedFieldId && canvasRef.current) {
            const canvasRect = canvasRef.current.getBoundingClientRect();

            // Calculate new position relative to canvas, accounting for scale
            const x = (e.clientX - canvasRect.left - dragOffset.x) / scale;
            const y = (e.clientY - canvasRect.top - dragOffset.y) / scale;

            onUpdateField(draggedFieldId, { x, y });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        setDraggedFieldId(null);
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
                            "bg-blue-100/80 border-2 border-blue-500 rounded flex items-center px-2 shadow-sm transition-shadow group hover:shadow-md hover:bg-blue-100",
                            selectedFieldId === field.id && "ring-2 ring-blue-600 ring-offset-1 z-50 bg-blue-200"
                        )}
                        onMouseDown={(e) => handleMouseDown(e, field)}
                        onClick={(e) => e.stopPropagation()} // Prevent deselection
                    >
                        <GripVertical className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0 cursor-grab active:cursor-grabbing" />
                        <span className="text-xs font-medium text-blue-900 truncate select-none pointer-events-none w-full">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
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

                        {/* Resize Handle (basic implementation) */}
                        {selectedFieldId === field.id && (
                            <div
                                className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize rounded-tl"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    // Implement resize logic here (omitted for brevity)
                                }}
                            />
                        )}
                    </div>
                ))}
        </div>
    );
}
