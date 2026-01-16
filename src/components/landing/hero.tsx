import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
    isLoggedIn?: boolean;
}

export function Hero({ isLoggedIn }: HeroProps) {
    return (
        <section className="relative overflow-hidden bg-white py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <div className="mb-8 inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                        <Sparkles className="mr-2 h-4 w-4" />
                        Free tier available
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl">
                        Transform PDFs into Fillable Web Forms
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Create shareable web forms from your PDF templates in minutes. No coding required.
                        Collect responses and generate filled PDFs automatically.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        {isLoggedIn ? (
                            <Link href="/dashboard/pdfs">
                                <Button size="lg" className="gap-2">
                                    Go to Dashboard
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth/signup">
                                <Button size="lg" className="gap-2">
                                    Get Started Free
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                        )}
                        <a
                            href="#how-it-works"
                            className="text-sm font-semibold leading-6 text-slate-900 hover:text-blue-600 transition-colors"
                        >
                            See how it works <span aria-hidden="true">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
