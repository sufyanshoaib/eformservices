"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/actions/auth";

const navigation = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
];

export function Header({ isLoggedIn }: { isLoggedIn?: boolean }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed inset-x-0 top-0 z-50 transition-all duration-300",
                scrolled ? "bg-white/80 backdrop-blur-md border-b border-slate-200 py-3" : "bg-transparent py-5"
            )}
        >
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Logo />
                </div>

                {/* Mobile menu button */}
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-700"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                {/* Desktop navigation */}
                <div className="hidden lg:flex lg:gap-x-12 items-center">
                    <Link
                        href="/quick-fill"
                        className="text-sm font-bold leading-6 text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                        </span>
                        Quick Form Fill & Sign
                    </Link>
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4 items-center">
                    {isLoggedIn ? (
                        <>
                            <Link href="/dashboard/pdfs">
                                <Button size="sm" variant="ghost">Dashboard</Button>
                            </Link>
                            <form action={signOutAction}>
                                <Button size="sm" variant="outline">Sign out</Button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/signin" className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors">
                                Sign in
                            </Link>
                            <Link href="/auth/signup">
                                <Button size="sm">Get started</Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile menu, show/hide based on menu state */}
            {mobileMenuOpen && (
                <div className="lg:hidden">
                    <div className="fixed inset-0 z-50" />
                    <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-slate-900/10">
                        <div className="flex items-center justify-between">
                            <Logo onClick={() => setMobileMenuOpen(false)} />
                            <button
                                type="button"
                                className="-m-2.5 rounded-md p-2.5 text-slate-700"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <span className="sr-only">Close menu</span>
                                <X className="h-6 w-6" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="mt-6 flow-root">
                            <div className="-my-6 divide-y divide-slate-500/10">
                                <div className="space-y-2 py-6">
                                    {navigation.map((item) => (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </div>
                                <div className="py-6 flex flex-col gap-4">
                                    {isLoggedIn ? (
                                        <div className="flex flex-col gap-4">
                                            <Link href="/dashboard/pdfs" onClick={() => setMobileMenuOpen(false)}>
                                                <Button className="w-full" variant="ghost">Dashboard</Button>
                                            </Link>
                                            <form action={signOutAction}>
                                                <Button className="w-full" variant="outline">Sign out</Button>
                                            </form>
                                        </div>
                                    ) : (
                                        <>
                                            <Link
                                                href="/auth/signin"
                                                className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-slate-900 hover:bg-slate-50"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Sign in
                                            </Link>
                                            <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                                                <Button className="w-full">Get started</Button>
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
