import VerificationEmail from "../components/email";
import { resend } from "../lib/resend";


export const sendVerificationEmail = async (email: string, username: string, verificationCode: string) => {

    try {

        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code For ANOMSG',
            react: VerificationEmail({username, otp: verificationCode}),
        });

    } catch (error) {
        console.log("Error sending verification email:", error);
        return {
            success: false,
            message: "Failed to send verification email."
        };
    }
}