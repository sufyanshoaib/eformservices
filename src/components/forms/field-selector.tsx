'use client';

import {
    Type,
    Hash,
    List,
    AlignLeft,
    CheckSquare,
    PenTool
} from 'lucide-react';

export type FieldType = 'text' | 'number' | 'dropdown' | 'textarea' | 'checkbox' | 'signature';

interface DraggableFieldProps {
    type: FieldType;
    label: string;
    icon: React.ReactNode;
}

const DraggableField = ({ type, label, icon }: DraggableFieldProps) => {
    const handleDragStart = (e: React.DragEvent) => {
        e.dataTransfer.setData('field-type', type);
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div
            draggable
            onDragStart={handleDragStart}
            className="flex items-center space-x-3 p-3 bg-white border border-slate-200 rounded-md cursor-grab hover:border-primary hover:shadow-sm transition-all active:cursor-grabbing text-sm font-medium text-slate-700"
        >
            {icon}
            <span>{label}</span>
            <span className="ml-auto text-xs text-slate-400">Drag me</span>
        </div>
    );
};

export default function FieldSelector() {
    return (
        <div className="p-4 bg-slate-50 border-r border-slate-200 h-full overflow-y-auto w-64 flex-shrink-0">
            <h3 className="font-semibold text-slate-900 mb-4">Form Fields</h3>
            <p className="text-xs text-slate-500 mb-6">
                Drag fields onto the PDF to add them.
            </p>

            <div className="space-y-3">
                <DraggableField
                    type="text"
                    label="Text Input"
                    icon={<Type className="w-4 h-4 text-blue-500" />}
                />
                <DraggableField
                    type="number"
                    label="Number Input"
                    icon={<Hash className="w-4 h-4 text-green-500" />}
                />
                <DraggableField
                    type="textarea"
                    label="Long Text"
                    icon={<AlignLeft className="w-4 h-4 text-orange-500" />}
                />
                <DraggableField
                    type="dropdown"
                    label="Dropdown"
                    icon={<List className="w-4 h-4 text-purple-500" />}
                />
                <DraggableField
                    type="checkbox"
                    label="Checkbox"
                    icon={<CheckSquare className="w-4 h-4 text-indigo-500" />}
                />
                <DraggableField
                    type="signature"
                    label="Signature"
                    icon={<PenTool className="w-4 h-4 text-red-500" />}
                />
            </div>

            <div className="mt-8 border-t border-slate-200 pt-6">
                <h4 className="text-sm font-medium text-slate-900 mb-3">Tips</h4>
                <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
                    <li>Drag fields to map them to the PDF.</li>
                    <li>Click a mapped field to edit its properties.</li>
                    <li>Resize fields to match the PDF lines.</li>
                </ul>
            </div>
        </div>
    );
}
