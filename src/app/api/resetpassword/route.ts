import EmailTemplate from "@/components/emailTemplateReset";
import connectDB from "../../../../lib/db";
import { NextResponse } from "next/server";
import { resend } from "../../../../lib/resend";
import User from "@/models/user.model";
import { emailValidation } from "../../../../schemas/signInSchema";


export async function POST(request: Request) {

    await connectDB();

    try {
        const body = await request.json();

        if (!body.email) {
            return NextResponse.json({
                message: "Invalid input",
                success: false
            }, { status: 400 });

        }

        const email = emailValidation.parse(body.email);
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        console.log("Reset password requested for:", email);

        const user = await User.findOne({ email: email });
        console.log("User found:", !!user);

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 });
        }

        try {
            console.log("Sending reset email to:", email);
            await resend.emails.send({
                from: 'onboarding@resend.dev',
                to: email,
                subject: 'Letter From ANOMSG',
                react: EmailTemplate({ firstName: user.username, resetCode: verificationCode }),
            });
            console.log("Email sent!");

            // Update user with verification code and expiration
            user.verifyCode = verificationCode;
            user.verifyCodeExpires = new Date(Date.now() + 3600000)

            await user.save();

        } catch (error) {
            console.error("Error sending email:", error);
            return NextResponse.json({
                message: "Failed to send verification email",
                success: false,
                error: error,
                username: user.username
            }, { status: 500 });
        }

        return NextResponse.json({
            message: "Verification email sent",
            success: true,
        }
            , { status: 200 });
    } catch (error) {
        console.error("Error in POST /api/test:", error);
        return NextResponse.json({
            message: "Internal server error",
            success: false,
            error: error
        }, { status: 500 });

    }

}