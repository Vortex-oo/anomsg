import * as React from 'react';

interface EmailTemplateProps {
    firstName: string;
    resetCode: string;
}

export function EmailTemplate({ firstName, resetCode }: EmailTemplateProps) {
    return (
        <div
            style={{
                backgroundColor: '#000000',
                color: '#FFFFFF',
                padding: '40px',
                fontFamily: 'Arial, sans-serif',
                textAlign: 'center',
                borderRadius: '10px',
                width: '100%',
                maxWidth: '600px',
                margin: '0 auto',
            }}
        >
            <h1 style={{ fontSize: '28px', marginBottom: '20px' }}>
                Hey {firstName}, reset your password
            </h1>

            <p style={{ fontSize: '16px', marginBottom: '30px' }}>
                We received a request to reset your password. Use the code below:
            </p>

            <div
                style={{
                    backgroundColor: '#1f1f1f',
                    padding: '15px 25px',
                    borderRadius: '8px',
                    display: 'inline-block',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    letterSpacing: '2px',
                    color: '#00FFAA',
                }}
            >
                {resetCode}
            </div>

            <p style={{ marginTop: '30px', fontSize: '14px', color: '#AAAAAA' }}>
                If you didn't request this, you can ignore this email.
            </p>
        </div>
    );
}
export default EmailTemplate;