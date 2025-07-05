import User from "@/models/user.model";
import connectDB from "../../../../../lib/db";
import { NextResponse } from "next/server";


interface DeleteMessageParams {
    params: { messageId: string }
}

export async function POST(
  req: Request,
  { params }: { params: { messageId: string } }
): Promise<NextResponse> {
  await connectDB();

  const { messageId } = params;

  try {
    const result = await User.updateOne(
      { "messages._id": messageId },
      { $pull: { messages: { _id: messageId } } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Message not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete message", error },
      { status: 500 }
    );
  }
}
