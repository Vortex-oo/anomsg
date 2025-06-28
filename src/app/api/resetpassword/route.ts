import User from "@/models/user.model";
import { NextResponse } from "next/server";
import connectDB from "../../../../lib/db";
import { passwordSchema } from "@/app/(auth)/(password reset)/resetpassword/[username]/page";
import { z } from "zod";

export async function POST(request: Request) {
    
    await connectDB();

    const body = await request.json();
    const { password, username } = body;
    try {
        await passwordSchema.parseAsync({ password });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.errors?.[0]?.message || "Invalid password"
        }, { status: 400 });
    }

    // Proceed with password reset logic

    try {
        const user = await User.findOneAndUpdate(
            { username },
            { $set: { password: password } },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Password reset successfully"
        }, { status: 200 });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({
            success: false,
            message: "Error resetting password"
        }, { status: 500 });
    }

}