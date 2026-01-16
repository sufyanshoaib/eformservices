import { ReactNode } from "react";
import { Logo } from "@/components/ui/logo";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#f8fafc] p-6 md:p-10 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-50 rounded-full blur-3xl opacity-60" />
                <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-indigo-50 rounded-full blur-3xl opacity-60" />
            </div>

            <div className="w-full max-w-sm sm:max-w-md relative z-10 transition-all">
                <div className="flex justify-center mb-10">
                    <Logo className="scale-150" />
                </div>
                {children}
            </div>
        </div>
    );
}
