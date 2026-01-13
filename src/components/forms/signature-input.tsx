import { useRef, useEffect, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SignatureInputProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    required?: boolean;
    useModal?: boolean;
}

export default function SignatureInput({ value, onChange, label, required, useModal = false }: SignatureInputProps) {
    const padRef = useRef<SignatureCanvas>(null);
    const [isEmpty, setIsEmpty] = useState(!value);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Initialize with existing value if present (e.g. if we support Drafts later)
    useEffect(() => {
        if (value && padRef.current && isEmpty && !useModal) {
            padRef.current.fromDataURL(value);
            setIsEmpty(false);
        }
    }, [value, useModal, isEmpty]);

    const handleEnd = () => {
        if (padRef.current) {
            if (padRef.current.isEmpty()) {
                if (!useModal) onChange('');
                setIsEmpty(true);
            } else {
                // Trim the whitespace for better fitting
                const dataUrl = padRef.current.getTrimmedCanvas().toDataURL('image/png');
                if (!useModal) onChange(dataUrl);
                setIsEmpty(false);
            }
        }
    };

    const handleClear = () => {
        if (padRef.current) {
            padRef.current.clear();
            if (!useModal) onChange('');
            setIsEmpty(true);
        }
    };

    const handleSaveModal = () => {
        if (padRef.current && !padRef.current.isEmpty()) {
            const dataUrl = padRef.current.getTrimmedCanvas().toDataURL('image/png');
            onChange(dataUrl);
            setIsModalOpen(false);
        } else {
            // If empty, maybe clear it?
            onChange('');
            setIsModalOpen(false);
        }
    };

    if (useModal) {
        return (
            <>
                <div
                    onClick={() => setIsModalOpen(true)}
                    className={cn(
                        "w-full h-full border border-transparent hover:bg-blue-50/50 cursor-pointer flex items-center justify-center relative group",
                        !value && "bg-blue-50/20"
                    )}
                    title="Click to sign"
                >
                    {value ? (
                        <img src={value} alt="Signature" className="max-h-full max-w-full object-contain" />
                    ) : (
                        <span className="text-[10px] text-slate-400 font-medium bg-white/50 px-1 rounded">Sign</span>
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                                <h3 className="font-semibold text-slate-900">Draw Signature</h3>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-slate-500 hover:text-slate-700 p-1 rounded-md hover:bg-slate-200"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-4 bg-slate-100 flex justify-center">
                                <div className="border border-slate-300 bg-white rounded-md shadow-sm overflow-hidden w-full h-64 touch-none">
                                    <SignatureCanvas
                                        ref={padRef}
                                        penColor="black"
                                        canvasProps={{
                                            className: 'w-full h-full bg-white cursor-crosshair block',
                                        }}
                                        onEnd={() => setIsEmpty(false)}
                                    />
                                </div>
                            </div>

                            <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="flex items-center text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1.5 rounded-md hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors"
                                >
                                    <Eraser className="w-4 h-4 mr-1.5" />
                                    Clear
                                </button>

                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 shadow-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSaveModal}
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 shadow-sm flex items-center"
                                    >
                                        <Check className="w-4 h-4 mr-1.5" />
                                        Save Signature
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </>
        )
    }

    return (
        <div className="space-y-2">
            <div className="border border-slate-300 rounded-md bg-white overflow-hidden relative group">
                <SignatureCanvas
                    ref={padRef}
                    penColor="black"
                    canvasProps={{
                        className: 'w-full h-32 bg-slate-50 cursor-crosshair block',
                    }}
                    onEnd={handleEnd}
                />

                {isEmpty && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-sm">
                        Sign here
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm border border-slate-200 text-slate-500 hover:text-red-500 transition-colors"
                    title="Clear Signature"
                >
                    <Eraser className="w-4 h-4" />
                </button>
            </div>
            {required && isEmpty && (
                <p className="text-xs text-red-500">Signature is required</p>
            )}
        </div>
    );
}
