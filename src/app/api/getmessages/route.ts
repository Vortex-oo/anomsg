import User from "@/models/user.model";
import { auth } from "../../../../auth";
import connectDB from "../../../../lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function GET(req: Request) {

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
        const userId = user.id;

        const userResult = await User.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" },
            { $sort: { "message.createdAt": -1 } },
            { $group:{_id:"$_id", messages:{$push:"$messages"}}}
        ])

        if (!userResult) {
            return NextResponse.json({
                message: "User Not Found",
                success: false
            },
                { status: 400 })
        }

        if ( userResult.length<=0) {
            return NextResponse.json({
                message:"No Message Found",
                success:false
            },{
                status:400
            })
        }

        return NextResponse.json({
            messages:userResult[0].messages,
            success:true
        },{status:200})

    } catch (error) {
        return NextResponse.json({
            message: "Error in getting messages",
            Errors:error,
            success: false
        },
            { status: 401 })
    }
}