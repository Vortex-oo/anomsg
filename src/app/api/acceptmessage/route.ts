import User from "@/models/user.model";
import { auth } from "../../../../auth";
import connectDB from "../../../../lib/db";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    //DB Connection

    await connectDB()

    const session = await auth()
    const user = session?.user

    if (!session || !user) {

        return NextResponse.json({
            message: "Not authenticated",
            success: false
        },
            { status: 401 })
    }

    try {
        const userId = user.id
        const { acceptMessage } = await req.json()

        const updatedUser = await User.findById(
            userId,
            { isAcceptingMessages: acceptMessage },
            { new: true }
        )

        if (!updatedUser) {
            return NextResponse.json({
                message: "User not found",
                success: false
            }, {
                status: 404
            })
        }

        return NextResponse.json({
            message: "Message acceptance updated",
            isAcceptingMessages: updatedUser.isAcceptingMessages,
            success: true
        }, {
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "Error updating message acceptance status",
            Error: error,
            success: false
        }, {
            status: 500
        })
    }

}

export async function GET() {

    //DB Connection
    await connectDB()

    const session = await auth()
    const user = session?.user

    if (!session || !user) {

        return NextResponse.json({
            message: "Unauthorized User",
            success: false
        }, {
            status: 401
        })
    }

    try {
        const userId = user.id

        const foundUser = await User.findById(userId)


        if (!foundUser) {
            // User not found
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessages,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error retrieving message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error retrieving message acceptance status' },
            { status: 500 }
        );
    }
}