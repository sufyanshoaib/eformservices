import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().min(5),
    message: z.string().min(10),
    recaptchaToken: z.string().min(1),
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, subject, message, recaptchaToken } = contactSchema.parse(body);

        // Verify Recaptcha
        const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
        const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecret}&response=${recaptchaToken}`;

        const recaptchaRes = await fetch(recaptchaVerifyUrl, { method: "POST" });
        const recaptchaJson = await recaptchaRes.json();

        if (!recaptchaJson.success) {
            return NextResponse.json(
                { error: "Captcha verification failed" },
                { status: 400 }
            );
        }

        // Send Email
        const EMAIL_TO = "hello@eformly.app";
        const EMAIL_FROM = process.env.EMAIL_FROM || "onboarding@resend.dev";

        if (process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY) {
            console.log(`[Dev] Contact Form Submission from ${email}: ${message}`);
            return NextResponse.json({ success: true });
        }

        await resend.emails.send({
            from: EMAIL_FROM,
            to: EMAIL_TO,
            replyTo: email,
            subject: `[eFormServices Contact] ${subject}`,
            html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
