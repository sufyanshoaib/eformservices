
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

interface CopyLinkButtonProps {
    shareableLink: string;
}

export function CopyLinkButton({ shareableLink }: CopyLinkButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const url = `${window.location.origin}/s/${shareableLink}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={handleCopy} title="Copy form link">
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            <span className="sr-only">Copy link</span>
        </Button>
    );
}
