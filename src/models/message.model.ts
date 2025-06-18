import mongoose from "mongoose";
import Document, { Schema } from "mongoose";

export interface IMessage extends Document {
    content: string;
    createdAt: Date;
}

const messageSchema = new Schema<IMessage>({
    content:{
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export default messageSchema;