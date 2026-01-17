import { Resend } from 'resend';

// Initialize Resend with the API key
// If key is missing, operations will fail gracefully or in dev mode could log
export const resend = new Resend(process.env.RESEND_API_KEY);

export const EMAIL_FROM = 'eformly <noreply@eformly.com>'; // Fallback/Default

/**
 * Helper to ensure we don't send real emails in dev unless specifically opted in
 * or if we are using a verified domain.
 */
export const shouldSendEmail = () => {
    return process.env.NODE_ENV === 'production' || process.env.ENABLE_EMAILS_IN_DEV === 'true';
};
