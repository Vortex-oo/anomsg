import User from "@/models/user.model";
import { auth } from "../../../../auth";
import connectDB from "../../../../lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await connectDB();

    const session = await auth();
    const user = session?.user;

    if (!session || !user) {
        return NextResponse.json(
            { message: "Not authenticated", success: false },
            { status: 401 }
        );
    }

    try {
        const userId = user.id;

        const userResult = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $unwind: "$messages" },
            { $sort: { "messages.createdAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ]);

        if (!userResult || userResult.length === 0) {
            return NextResponse.json(
                { message: "No Message Found", success: false },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { messages: userResult[0].messages, success: true },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "Error in getting messages",
                error: (error as Error).message,
                success: false,
            },
            { status: 500 }
        );
    }
}
