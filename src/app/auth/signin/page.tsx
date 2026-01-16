"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { signInWithCredentials } from "@/actions/auth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { SocialButtons } from "@/components/auth/social-buttons";

export default function SignInPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: LoginInput) => {
        startTransition(async () => {
            try {
                const result = await signInWithCredentials(data);
                if (result.error) {
                    setError("root", { message: result.error });
                } else {
                    router.push("/dashboard/pdfs");
                    router.refresh();
                }
            } catch (error) {
                setError("root", { message: "Something went wrong" });
            }
        });
    };

    return (
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-3 pb-8 text-center pt-8">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Sign in</CardTitle>
                <CardDescription className="text-slate-500 text-base">
                    Welcome back! Please enter your details.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <SocialButtons />
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-3 text-slate-400 font-medium">
                            Or continue with email
                        </span>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 font-semibold">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="m@example.com"
                            className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                            disabled={isPending}
                            {...register("email")}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-slate-700 font-semibold">Password</Label>
                            <Link href="#" className="text-xs text-blue-600 hover:text-blue-700 font-medium">Forgot password?</Link>
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className="h-11 border-slate-200 focus:border-blue-500 focus:ring-blue-500 transition-all"
                            disabled={isPending}
                            {...register("password")}
                        />
                        {errors.password && (
                            <p className="text-xs text-red-500 font-medium">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    {errors.root && (
                        <div className="p-3 rounded-lg bg-red-50 border border-red-100">
                            <p className="text-sm text-red-600 text-center font-medium">{errors.root.message}</p>
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-all"
                        disabled={isPending}
                    >
                        {isPending ? "Signing in..." : "Sign In"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col gap-4 border-t border-slate-100 px-8 py-6 bg-slate-50/50 rounded-b-xl">
                <p className="text-center text-sm text-slate-600">
                    Don&apos;t have an account?{" "}
                    <Link
                        href="/auth/signup"
                        className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                    >
                        Sign up for free
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
