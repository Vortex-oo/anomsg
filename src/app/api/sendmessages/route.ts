import User from "@/models/user.model";
import connectDB from "../../../../lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    await connectDB()

    try {
        const { username, content } = await req.json()

        const user = await User.findOne({ username })

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, { status: 404 })
        }

        if (!user.isAcceptingMessages) {
            return NextResponse.json({
                message: "User not accepting messages",
                success: false
            }, { status: 401 })
        }

        const newMessage = { content, createdAt: new Date() };

        user.messages.push(newMessage);
        await user.save();

        return NextResponse.json({
            message: "Message sent successfully",
            success: true
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            message: "Internal server Error, Message not sent",
            Error:error,
            success: false
        }, { status: 500 });
    }
}