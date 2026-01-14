"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
    {
        question: "How does eFormServices work?",
        answer:
            "eFormServices allows you to upload PDF templates, map their fields to web form inputs using our visual editor, and then share a unique link with anyone. When someone fills out the form, we automatically generate a filled PDF with their responses.",
    },
    {
        question: "What file formats are supported?",
        answer:
            "We support standard PDF files (PDF 1.4 - 1.7) up to 10MB in size. Your PDFs should contain blank fields where you want form data to be filled in.",
    },
    {
        question: "Is my data secure?",
        answer:
            "Yes! All data is encrypted in transit and at rest. Forms are only accessible via unique, non-guessable links. We follow industry best practices for data security and privacy.",
    },
    {
        question: "Can I customize the forms?",
        answer:
            "Absolutely! You can add various field types including text inputs, numbers, dropdowns, checkboxes, textareas, and signature fields. You have full control over field placement and validation.",
    },
    {
        question: "What's the difference between Free and Pro?",
        answer:
            "The Free tier allows 3 PDF templates, 10 forms, and 100 submissions per month with eFormServices branding. Pro offers unlimited PDFs, forms, and submissions, removes branding, includes priority support, advanced analytics, and API access.",
    },
    {
        question: "How do I upgrade to Pro?",
        answer:
            "Pro tier is coming soon! Join our waitlist to be notified when it launches. You'll be able to upgrade directly from your dashboard with a simple click.",
    },
    {
        question: "Can I cancel anytime?",
        answer:
            "Yes! The Free tier is always free with no commitment. When Pro launches, you'll be able to cancel your subscription at any time with no penalties or fees.",
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section id="faq" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl divide-y divide-slate-900/10">
                    <h2 className="text-2xl font-bold leading-10 tracking-tight text-slate-900">
                        Frequently asked questions
                    </h2>
                    <dl className="mt-10 space-y-6 divide-y divide-slate-900/10">
                        {faqs.map((faq, index) => (
                            <div key={faq.question} className="pt-6">
                                <dt>
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="flex w-full items-start justify-between text-left text-slate-900"
                                    >
                                        <span className="text-base font-semibold leading-7">
                                            {faq.question}
                                        </span>
                                        <span className="ml-6 flex h-7 items-center">
                                            <ChevronDown
                                                className={`h-6 w-6 transform transition-transform ${openIndex === index ? "rotate-180" : ""
                                                    }`}
                                                aria-hidden="true"
                                            />
                                        </span>
                                    </button>
                                </dt>
                                {openIndex === index && (
                                    <dd className="mt-2 pr-12">
                                        <p className="text-base leading-7 text-slate-600">
                                            {faq.answer}
                                        </p>
                                    </dd>
                                )}
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
