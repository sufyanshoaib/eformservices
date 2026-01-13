'use client';

import { FormField } from './form-canvas';

interface FieldPropertiesProps {
    field: FormField | null;
    onUpdate: (id: string, updates: Partial<FormField>) => void;
    onDelete: (id: string) => void;
}

export default function FieldProperties({
    field,
    onUpdate,
    onDelete
}: FieldPropertiesProps) {
    if (!field) {
        return (
            <div className="p-4 bg-slate-50 border-l border-slate-200 h-full w-64 flex-shrink-0 flex items-center justify-center text-slate-500 text-sm text-center">
                <p>Select a field on the PDF to edit its properties.</p>
            </div>
        );
    }

    return (
        <div className="p-4 bg-white border-l border-slate-200 h-full overflow-y-auto w-72 flex-shrink-0">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-900">Edit Field</h3>
                <button
                    onClick={() => onDelete(field.id)}
                    className="text-xs text-red-600 hover:text-red-700 hover:underline"
                >
                    Delete
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Label
                    </label>
                    <input
                        type="text"
                        value={field.label}
                        onChange={(e) => onUpdate(field.id, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">
                        Type
                    </label>
                    <input
                        type="text"
                        value={field.type}
                        disabled
                        className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-md text-sm text-slate-500"
                    />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                    <input
                        type="checkbox"
                        id="field-required"
                        checked={field.required || false}
                        onChange={(e) => onUpdate(field.id, { required: e.target.checked })}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="field-required" className="text-sm text-slate-700">
                        Required field
                    </label>
                </div>

                {/* Dynamic properties based on type */}
                <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                        Dimensions
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Width</label>
                            <input
                                type="number"
                                value={Math.round(field.width)}
                                onChange={(e) => onUpdate(field.id, { width: parseInt(e.target.value) })}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Height</label>
                            <input
                                type="number"
                                value={Math.round(field.height)}
                                onChange={(e) => onUpdate(field.id, { height: parseInt(e.target.value) })}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">X</label>
                            <input
                                type="number"
                                value={Math.round(field.x)}
                                onChange={(e) => onUpdate(field.id, { x: parseInt(e.target.value) })}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-slate-500 mb-1">Y</label>
                            <input
                                type="number"
                                value={Math.round(field.y)}
                                onChange={(e) => onUpdate(field.id, { y: parseInt(e.target.value) })}
                                className="w-full px-2 py-1 border border-slate-300 rounded text-xs"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
