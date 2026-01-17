import { Metadata } from 'next';
import { ContactForm } from '@/components/landing/contact-form';

export const metadata: Metadata = {
    title: 'Contact Us - eFormServices',
    description: 'Get in touch with the eFormServices team.',
};

export default function ContactPage() {
    return (
        <div className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Contact Us</h2>
                    <p className="mt-2 text-lg leading-8 text-slate-600">
                        Have questions about eFormServices? We&apos;re here to help. Fill out the form below and we&apos;ll get back to you as soon as possible.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-xl sm:mt-20">
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
