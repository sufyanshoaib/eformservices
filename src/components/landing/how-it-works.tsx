import { Upload, Edit3, Send } from "lucide-react";

const steps = [
    {
        name: "Upload Your PDF Template",
        description:
            "Start by uploading your PDF document with blank fields. Our platform supports standard PDF formats up to 10MB.",
        icon: Upload,
    },
    {
        name: "Map Fields & Create Form",
        description:
            "Use our visual editor to map PDF fields to web form inputs. Add text fields, dropdowns, checkboxes, signatures, and more.",
        icon: Edit3,
    },
    {
        name: "Share Link & Collect Responses",
        description:
            "Generate a unique shareable link and send it to your recipients. Collect responses and download filled PDFs automatically.",
        icon: Send,
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" className="bg-slate-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">
                        Simple process
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        How it works
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Get started in three easy steps. No technical knowledge required.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
                        {steps.map((step, index) => (
                            <div key={step.name} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-slate-900">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                        <step.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    <span className="text-blue-600 font-bold mr-2">{index + 1}.</span>
                                    {step.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-slate-600">
                                    {step.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
