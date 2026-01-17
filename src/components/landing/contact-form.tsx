"use client";

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    subject: z.string().min(5, "Subject must be at least 5 characters"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        const recaptchaToken = recaptchaRef.current?.getValue();

        if (!recaptchaToken) {
            toast.error("Please complete the verify you are human check");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, recaptchaToken }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            toast.success("Message sent successfully! We'll get back to you shortly.");
            reset();
            recaptchaRef.current?.reset();
        } catch (error) {
            console.error(error);
            toast.error("Detailed error: Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-8 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="mt-2.5">
                        <Input
                            id="name"
                            {...register('name')}
                            placeholder="Your name"
                        />
                        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="mt-2.5">
                        <Input
                            id="email"
                            type="email"
                            {...register('email')}
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <Label htmlFor="subject">Subject</Label>
                    <div className="mt-2.5">
                        <Input
                            id="subject"
                            {...register('subject')}
                            placeholder="How can we help?"
                        />
                        {errors.subject && <p className="text-sm text-red-500 mt-1">{errors.subject.message}</p>}
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <Label htmlFor="message">Message</Label>
                    <div className="mt-2.5">
                        <Textarea
                            id="message"
                            {...register('message')}
                            rows={4}
                            placeholder="Tell us more about your inquiry..."
                        />
                        {errors.message && <p className="text-sm text-red-500 mt-1">{errors.message.message}</p>}
                    </div>
                </div>

                <div className="sm:col-span-2">
                    <ReCAPTCHA
                        ref={recaptchaRef}
                        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "YOUR_SITE_KEY_PLACEHOLDER"}
                    />
                </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
        </form>
    );
}
