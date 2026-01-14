import { Users, FileSignature, ClipboardList } from "lucide-react";

const useCases = [
    {
        name: "HR & Onboarding Forms",
        description:
            "Streamline employee onboarding with digital forms for personal information, tax documents, and company policies. Collect signatures and generate completed PDFs instantly.",
        icon: Users,
    },
    {
        name: "Contract Signing",
        description:
            "Send contracts and agreements for digital signature. Recipients can review, sign, and submit without printing. Perfect for NDAs, service agreements, and more.",
        icon: FileSignature,
    },
    {
        name: "Application Forms",
        description:
            "Create application forms for schools, programs, or services. Collect structured data from applicants and automatically generate filled application PDFs.",
        icon: ClipboardList,
    },
];

export function UseCases() {
    return (
        <section id="use-cases" className="bg-slate-50 py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">
                        Use cases
                    </h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        Built for your workflow
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600">
                        From HR to legal, eFormServices adapts to your needs.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                        {useCases.map((useCase) => (
                            <div key={useCase.name} className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-slate-900">
                                    <useCase.icon
                                        className="h-5 w-5 flex-none text-blue-600"
                                        aria-hidden="true"
                                    />
                                    {useCase.name}
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                                    <p className="flex-auto">{useCase.description}</p>
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </section>
    );
}
