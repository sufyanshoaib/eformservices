import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    iconOnly?: boolean;
    dark?: boolean;
    onClick?: () => void;
}

export function Logo({ className, iconOnly = false, dark = false, onClick }: LogoProps) {
    return (
        <Link
            href="/"
            onClick={onClick}
            className={cn("flex items-center gap-2 transition-opacity hover:opacity-90", className)}
        >
            <div className="relative h-8 w-8 overflow-hidden rounded-lg">
                <Image
                    src="/images/brand/icon.svg"
                    alt="eformly Icon"
                    fill
                    className="object-contain"
                    priority
                />
            </div>
            {!iconOnly && (
                <span className={cn(
                    "text-xl font-bold tracking-tight",
                    dark ? "text-white" : "text-slate-900"
                )}>
                    eformly
                </span>
            )}
        </Link>
    );
}
