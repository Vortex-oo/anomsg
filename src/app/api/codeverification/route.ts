import connectDB from "../../../../lib/db";
import User from "@/models/user.model";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    await connectDB();

    try {
        const { username, verifyCode } = await req.json();

        const decodedUsername = decodeURIComponent(username);

        if (!decodedUsername) {
            return NextResponse.json({ message: "Username not received", success: false }, { status: 400 });
        }

        if (!verifyCode) {
            return NextResponse.json({ message: "Verification code not provided", success: false }, { status: 400 });
        }

        const user = await User.findOne({ username: decodedUsername });

        if (!user) {
            return NextResponse.json({ message: "User not found", success: false }, { status: 400 });
        }

        if (user.verifyCode !== verifyCode) {
            return NextResponse.json({ message: "Invalid verification code", success: false }, { status: 400 });
        }

        const isCodeExpired = Date.now() > new Date(user.verifyCodeExpires).getTime();

        if (isCodeExpired) {
            return NextResponse.json({ message: "Verification code has expired", success: false }, { status: 400 });
        }

        return NextResponse.json({ message: "Verification successful", success: true }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: "Verification failed", success: false }, { status: 500 });
    }
}
