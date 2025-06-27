import VerificationEmail from "../src/components/email";
import { resend } from "../lib/resend";


export const sendVerificationEmail = async (email: string, username: string, verificationCode: string) => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code For ANOMSG',
            react: VerificationEmail({username, otp: verificationCode}),
        });
        // Always return a success object
        return {
            success: true,
            message: "Verification email sent.",
            Email:email
        };
    } catch (error) {
        console.log("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email."
        };
    }
}