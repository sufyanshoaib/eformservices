import Link from "next/link";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
    {
        name: "Free",
        id: "tier-free",
        href: "/auth/signup",
        priceMonthly: "$0",
        description: "Perfect for trying out eFormServices and small projects.",
        features: [
            { name: "3 PDF templates", included: true },
            { name: "10 forms total", included: true },
            { name: "100 submissions per month", included: true },
            { name: "All field types", included: true },
            { name: "Shareable links", included: true },
            { name: "eFormServices branding", included: true },
            { name: "Community support", included: true },
            { name: "Remove branding", included: false },
            { name: "Unlimited PDFs", included: false },
            { name: "Unlimited forms", included: false },
            { name: "Unlimited submissions", included: false },
            { name: "Priority support", included: false },
            { name: "Advanced analytics", included: false },
            { name: "API access", included: false },
        ],
        featured: false,
    },
    {
        name: "Pro",
        id: "tier-pro",
        href: "/auth/signup",
        priceMonthly: "Coming Soon",
        description: "For professionals and teams who need unlimited access.",
        features: [
            { name: "Unlimited PDF templates", included: true },
            { name: "Unlimited forms", included: true },
            { name: "Unlimited submissions", included: true },
            { name: "All field types", included: true },
            { name: "Shareable links", included: true },
            { name: "Remove branding / white-label", included: true },
            { name: "Priority email support", included: true },
            { name: "Advanced analytics", included: true },
            { name: "Custom domain support", included: true },
            { name: "API access", included: true },
            { name: "Team collaboration", included: true },
            { name: "Webhook integrations", included: true },
        ],
        featured: true,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="bg-white py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-4xl text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">
                        Pricing
                    </h2>
                    <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
                        Choose the right plan for you
                    </p>
                </div>
                <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600">
                    Start with our free tier and upgrade when you need more. No credit card required to get started.
                </p>
                <div className="isolate mx-auto mt-16 grid max-w-md grid-cols-1 gap-y-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:gap-x-8 xl:gap-x-12">
                    {tiers.map((tier) => (
                        <div
                            key={tier.id}
                            className={`rounded-3xl p-8 ring-1 ${tier.featured
                                    ? "bg-slate-900 ring-slate-900"
                                    : "ring-slate-200"
                                }`}
                        >
                            <h3
                                className={`text-lg font-semibold leading-8 ${tier.featured ? "text-white" : "text-slate-900"
                                    }`}
                            >
                                {tier.name}
                            </h3>
                            <p
                                className={`mt-4 text-sm leading-6 ${tier.featured ? "text-slate-300" : "text-slate-600"
                                    }`}
                            >
                                {tier.description}
                            </p>
                            <p className="mt-6 flex items-baseline gap-x-1">
                                <span
                                    className={`text-4xl font-bold tracking-tight ${tier.featured ? "text-white" : "text-slate-900"
                                        }`}
                                >
                                    {tier.priceMonthly}
                                </span>
                                {tier.priceMonthly !== "Coming Soon" && (
                                    <span
                                        className={`text-sm font-semibold leading-6 ${tier.featured ? "text-slate-300" : "text-slate-600"
                                            }`}
                                    >
                                        /month
                                    </span>
                                )}
                            </p>
                            <Link href={tier.href}>
                                <Button
                                    variant={tier.featured ? "default" : "outline"}
                                    className={`mt-6 w-full ${tier.featured
                                            ? "bg-white text-slate-900 hover:bg-slate-100"
                                            : ""
                                        }`}
                                >
                                    {tier.name === "Pro" ? "Join Waitlist" : "Get started"}
                                </Button>
                            </Link>
                            <ul
                                role="list"
                                className={`mt-8 space-y-3 text-sm leading-6 ${tier.featured ? "text-slate-300" : "text-slate-600"
                                    }`}
                            >
                                {tier.features.map((feature) => (
                                    <li key={feature.name} className="flex gap-x-3">
                                        {feature.included ? (
                                            <Check
                                                className={`h-6 w-5 flex-none ${tier.featured ? "text-white" : "text-blue-600"
                                                    }`}
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <X
                                                className="h-6 w-5 flex-none text-slate-400"
                                                aria-hidden="true"
                                            />
                                        )}
                                        {feature.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
