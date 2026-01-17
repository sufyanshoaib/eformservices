import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'About Us - eFormServices',
    description: 'Learn about our mission to simplify document workflows.',
};

export default function AboutPage() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-indigo-600">Our Mission</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Uncomplicating the world of PDF forms
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        We believe that collecting data securely shouldn&apos;t require a developer, a printer, or a fax machine. eFormServices is built for businesses that need to move fast.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                Simplicity First
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                <p className="flex-auto">
                                    Our tools are designed to be intuitive. If you can upload a file, you can build a powerful online form in seconds.
                                </p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                Secure by Design
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                <p className="flex-auto">
                                    We treat your data with the highest respect. From encryption to privacy controls, security is baked into every feature.
                                </p>
                            </dd>
                        </div>
                        <div className="flex flex-col">
                            <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                Built for Growth
                            </dt>
                            <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                <p className="flex-auto">
                                    Whether you handle 10 forms or 10,000, our infrastructure scales with you. No more lost paperwork.
                                </p>
                            </dd>
                        </div>
                    </dl>
                </div>
                <div className="mt-16 text-center">
                    <Button asChild>
                        <Link href="/auth/signup">Get Started for Free</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
