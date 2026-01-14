
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Mail, MessageCircle, Twitter, Linkedin, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ShareFormButtonProps {
    shareableLink: string;
    formName: string;
}

export function ShareFormButton({ shareableLink, formName }: ShareFormButtonProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const fullUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/s/${shareableLink}`
        : '';

    const shareOptions = [
        {
            name: 'Copy Link',
            icon: copied ? Check : Copy,
            onClick: () => {
                navigator.clipboard.writeText(fullUrl);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            },
            color: 'text-slate-600'
        },
        {
            name: 'Email',
            icon: Mail,
            href: `mailto:?subject=${encodeURIComponent(`Please fill out: ${formName}`)}&body=${encodeURIComponent(`You have been invited to fill out a form: ${fullUrl}`)}`,
            color: 'text-blue-600'
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            href: `https://wa.me/?text=${encodeURIComponent(`Please fill out this form: ${fullUrl}`)}`,
            color: 'text-green-600'
        },
        {
            name: 'Twitter',
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(`Please fill out this form: ${formName}`)}`,
            color: 'text-sky-500'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
            color: 'text-blue-700'
        }
    ];

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: formName,
                    text: `Please fill out this form: ${formName}`,
                    url: fullUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            setIsOpen(!isOpen);
        }
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleNativeShare}
                title="Share form"
            >
                <Share2 className="h-4 w-4" />
                <span className="sr-only">Share link</span>
            </Button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-40 overflow-hidden">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                            {shareOptions.map((option) => (
                                option.href ? (
                                    <a
                                        key={option.name}
                                        href={option.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        role="menuitem"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <option.icon className={cn("mr-3 h-4 w-4", option.color)} />
                                        {option.name}
                                    </a>
                                ) : (
                                    <button
                                        key={option.name}
                                        onClick={() => {
                                            option.onClick?.();
                                            // Don't close immediately if it's copy (to show checkmark)
                                            if (option.name !== 'Copy Link') setIsOpen(false);
                                        }}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                                        role="menuitem"
                                    >
                                        <option.icon className={cn("mr-3 h-4 w-4", option.color)} />
                                        {option.name}
                                    </button>
                                )
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
