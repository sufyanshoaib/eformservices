'use client';

import { useState } from 'react';
import { Sparkles, Loader2, AlertCircle, CheckCircle, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FormField } from './form-canvas';

interface AIMappingButtonProps {
    pdfId: string;
    onSuggestionsReceived: (suggestions: Omit<FormField, 'id'>[]) => void;
    disabled?: boolean;
}

export function AIMappingButton({ pdfId, onSuggestionsReceived, disabled }: AIMappingButtonProps) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [upgradeRequired, setUpgradeRequired] = useState(false);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setError(null);
        setUpgradeRequired(false);

        try {
            const response = await fetch(`/api/pdfs/${pdfId}/analyze`, {
                method: 'POST',
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('AI analysis failed:', { status: response.status, data });
                if (data.upgradeRequired) {
                    setUpgradeRequired(true);
                    setError(data.message || 'Upgrade required to use AI mapping.');
                } else {
                    const errorMsg = data.message || data.error || 'Failed to analyze PDF.';
                    setError(errorMsg);
                }
                return;
            }

            if (data.success && data.suggestions.length > 0) {
                // Convert suggestions to FormField format
                const suggestions = data.suggestions.map((s: any) => ({
                    type: s.type,
                    label: s.label,
                    x: s.x,
                    y: s.y,
                    width: s.width,
                    height: s.height,
                    page: s.page,
                    required: false,
                    isAISuggestion: true,
                    confidence: s.confidence,
                }));

                onSuggestionsReceived(suggestions);
            } else {
                setError(data.message || 'No fields detected in the PDF.');
            }
        } catch (err: any) {
            console.error('AI analysis error:', err);
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <Button
                onClick={handleAnalyze}
                disabled={disabled || isAnalyzing}
                variant="default"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
                {isAnalyzing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating Fields...
                    </>
                ) : (
                    <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        AI Generate Fields
                    </>
                )}
            </Button>
            
            <p className="text-xs text-slate-600 italic">
                Generates common form fields as a starting point. Drag fields to match your PDF layout.
            </p>

            {error && (
                <div className={`text-sm p-3 rounded-lg ${upgradeRequired ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-start gap-2">
                        {upgradeRequired ? (
                            <Crown className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                            <p className={upgradeRequired ? 'text-amber-900 font-medium' : 'text-red-900'}>{error}</p>
                            {upgradeRequired && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-2 border-amber-300 text-amber-700 hover:bg-amber-100"
                                >
                                    <Crown className="mr-1 h-3 w-3" />
                                    Upgrade to Pro
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

interface AISuggestionsActionsProps {
    suggestionCount: number;
    onConfirmAll: () => void;
    onClearAll: () => void;
}

export function AISuggestionsActions({
    suggestionCount,
    onConfirmAll,
    onClearAll,
}: AISuggestionsActionsProps) {
    if (suggestionCount === 0) return null;

    return (
        <div className="bg-purple-50 border-2 border-purple-300 border-dashed rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-purple-600" />
                <div>
                    <h3 className="text-sm font-semibold text-purple-900">
                        {suggestionCount} AI-Suggested Field{suggestionCount !== 1 ? 's' : ''}
                    </h3>
                    <p className="text-xs text-purple-700">
                        Review and confirm the AI-detected fields below
                    </p>
                </div>
            </div>

            <div className="flex gap-2">
                <Button
                    onClick={onConfirmAll}
                    size="sm"
                    variant="default"
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Confirm All
                </Button>
                <Button
                    onClick={onClearAll}
                    size="sm"
                    variant="outline"
                    className="border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                    Clear All
                </Button>
            </div>

            <p className="text-xs text-purple-600 italic">
                Tip: Click individual fields to remove or edit them before confirming
            </p>
        </div>
    );
}
