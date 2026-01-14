"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function incrementFormView(formId: string) {
    if (!formId) return;

    try {
        await prisma.form.update({
            where: { id: formId },
            data: {
                views: {
                    increment: 1,
                },
            },
        });

        // We generally don't need to revalidate the public form page for a view count
        // effectively, but we might want to revalidate the dashboard
        revalidatePath("/dashboard/pdfs");
    } catch (error) {
        console.error("Failed to increment form view:", error);
        // Silent failure is acceptable for analytics
    }
}
