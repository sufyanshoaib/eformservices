import type { Metadata } from "next";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { UseCases } from "@/components/landing/use-cases";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export const metadata: Metadata = {
    title: "eformly - Transform PDFs into Fillable Web Forms",
    description:
        "Create shareable web forms from PDF templates in minutes. No coding required. Free tier available with 3 PDFs, 10 forms, and 100 submissions per month.",
    keywords: [
        "PDF forms",
        "fillable forms",
        "web forms",
        "form builder",
        "PDF to form",
        "online forms",
        "form creator",
    ],
    openGraph: {
        title: "eformly - PDF to Web Form Converter",
        description: "Transform your PDF templates into interactive web forms",
        type: "website",
        url: "https://eformservices.com",
    },
    twitter: {
        card: "summary_large_image",
        title: "eFormServices - Transform PDFs into Fillable Web Forms",
        description: "Create shareable web forms from PDF templates in minutes",
    },
};

import { auth } from "@/auth";
import { Header } from "@/components/landing/header";

export default async function Home() {
    const session = await auth();
    const isLoggedIn = !!session?.user;

    return (
        <main className="min-h-screen pt-16">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "SoftwareApplication",
                        "name": "eFormServices",
                        "applicationCategory": "BusinessApplication",
                        "operatingSystem": "Web",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "description": "Transform your PDF templates into interactive web forms."
                    })
                }}
            />
            <Header isLoggedIn={isLoggedIn} />
            <Hero isLoggedIn={isLoggedIn} />
            <Features />
            <HowItWorks />
            <Pricing />
            <UseCases />
            <FAQ />
            <Footer />
        </main>
    );
}
