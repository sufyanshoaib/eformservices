import * as React from 'react';

interface WelcomeEmailProps {
    name: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
    <div style={{ fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
        <h1>Welcome to eformly, {name}!</h1>
        <p>
            We're thrilled to have you on board. eformly makes it effortless to turn your static
            PDFs into dynamic, fillable online forms.
        </p>
        <p>
            Here are a few things you can do to get started:
        </p>
        <ul>
            <li>Upload your first PDF template.</li>
            <li>Customize the form fields using AI mapping.</li>
            <li>Share the link and start collecting responses.</li>
        </ul>
        <p>
            If you have any questions, feel free to reply to this email.
        </p>
        <br />
        <p>
            <a
                href="https://eformly.com/dashboard"
                style={{
                    backgroundColor: '#2563eb',
                    color: '#fff',
                    padding: '10px 20px',
                    textDecoration: 'none',
                    borderRadius: '5px'
                }}
            >
                Go to Dashboard
            </a>
        </p>
        <p>Best regards,<br />The eformly Team</p>
    </div>
);
