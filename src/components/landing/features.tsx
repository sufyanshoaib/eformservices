import {
    Upload,
    Wand2,
    Share2,
    FileCheck,
    FormInput,
    Shield
} from "lucide-react";

const features = [
    {
        name: "Upload PDF Templates",
        description: "Simply upload your existing PDF documents with blank fields. Supports PDFs up to 10MB.",
        icon: Upload,
    },
    {
        name: "Visual Form Builder",
        description: "Drag and drop to map PDF fields to form inputs. See your PDF preview in real-time.",
        icon: Wand2,
    },
    {
        name: "Share with Anyone",
        description: "Generate unique shareable links. Recipients can fill forms without creating an account.",
        icon: Share2,
    },
    {
        name: "Auto-Generate Filled PDFs",
        description: "Submitted forms automatically generate filled PDFs ready for download.",
        icon: FileCheck,
    },
    {
        name: "Multiple Field Types",
        description: "Support for text, numbers, dropdowns, checkboxes, textareas, and signature fields.",
        icon: FormInput,
    },
    {
        name: "Secure & Private",
        description: "Your data is encrypted and stored securely. Forms are only accessible via unique links.",
        icon: Shield,
    },
];

export function Features() {
    return (
        <section id="features" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">
                        Everything you need
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Powerful features for effortless form creation
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        Transform your PDF workflow with our intuitive platform designed for simplicity and efficiency.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {features.map((feature) => (
                            <div key={feature.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                    <feature.icon
                                        className="h-5 w-5 flex-none text-blue-600"
                                        aria-hidden="true"
                                    />
                                    {feature.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                    <p className="flex-auto">{feature.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
