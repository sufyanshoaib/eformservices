import * as React from 'react';

interface SubmissionReceiptEmailProps {
    formTitle: string;
    respondentEmail?: string; // Optional if we sent it to the respondent
}

export const SubmissionReceiptEmail: React.FC<SubmissionReceiptEmailProps> = ({ formTitle, respondentEmail }) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
        <h1>New Submission: {formTitle}</h1>
        <p>
            You have received a new submission for your form <strong>{formTitle}</strong>.
        </p>
        <p>
            The completed PDF document is attached to this email.
        </p>
        <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />
        <p style={{ fontSize: '14px', color: '#666' }}>
            This email was sent automatically by eformly.
        </p>
    </div>
);
