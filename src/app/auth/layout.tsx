import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-muted/40 p-6 md:p-10">
            <div className="w-full max-w-sm sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
