import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { PostHogProvider } from "@/lib/analytics/posthog-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "eformly - PDF Form Builder",
    description: "Create fillable web forms from PDF templates",
    icons: {
        icon: "/images/brand/icon.svg",
    },
    verification: {
        google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;

}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className} suppressHydrationWarning>
                <PostHogProvider>
                    {children}
                    <Toaster />
                </PostHogProvider>
            </body>
        </html>
    );
}
