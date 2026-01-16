"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/db";
import { loginSchema, registerSchema, LoginInput, RegisterInput } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { AuthError } from "next-auth";

export async function signInWithCredentials(data: LoginInput) {
    const result = loginSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid fields" };
    }

    const { email, password } = result.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirect: false,
        });
        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            if (error.type === "CredentialsSignin") {
                return { error: "Invalid credentials!" };
            }
            return { error: "Something went wrong!" };
        }
        throw error;
    }
}

export async function signUpWithCredentials(data: RegisterInput) {
    const result = registerSchema.safeParse(data);

    if (!result.success) {
        return { error: "Invalid fields" };
    }

    const { email, password, name } = result.data;

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Email already in use!" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return { success: true };
}

export async function signInWithGoogle() {
    await signIn("google", { redirectTo: "/dashboard/pdfs" });
}

export async function signInWithFacebook() {
    await signIn("facebook", { redirectTo: "/dashboard/pdfs" });
}

export async function signOutAction() {
    const { signOut } = await import("@/auth");
    await signOut({ redirectTo: "/" });
}
