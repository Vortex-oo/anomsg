import bcrypt from "bcryptjs";
import mongoose,{Document, Schema} from "mongoose";
import messageSchema, {IMessage} from "./message.model";


export interface IUser extends Document {
    username: string;
    password: string;
    email: string;
    verifyCode: String;
    verifyCodeExpires: Date;
    isVerified: boolean;
    isAcceptingMessages: boolean;
    messages:IMessage[]
}

const userSchema = new Schema<IUser>({
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type:String,
        required: true,
    },
    email:{
        type:String,
        required: true,
        unique: true,
        match:[ /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}/, "Please enter a valid email address" ],
    },
    verifyCode:{
        type:String,
        required:[true, "Verification code is required"],
    },
    verifyCodeExpires:{
        type:Date,
        required:[true, "Verification code expiration date is required"],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[messageSchema]
})

// Hash password before saving user

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password= await bcrypt.hash(this.password, 10);
    }
} )

const User = mongoose.models?.User || mongoose.model<IUser>("User", userSchema);

export default User;