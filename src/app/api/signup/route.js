import connectDB from "@/lib/db";
import User from "@/models/user.ts";
import sendVerificationEmail from "@/lib/sendverificationemail.ts";
import { NextResponse } from "next/server";

export async function POST(request) {

    connectDB();

    try {

        const {email,username, password} = await request.json()

        const existingVerifiedUserByUsername  = await User.find({
            username: username, 
            isVerified: true
        })

        if (existingVerifiedUserByUsername ) {
            return new NextResponse.json({
                message: "User already exists",
                success: false
            }, { 
                status: 400 
            });
        }

        const existingUserByEmail = await User.find({
            email: email,
        })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                return new NextResponse.json({
                    message: "User already exists with this email",
                    success: false
                },
                {
                    status: 400
                })
            } else {
                existingUserByEmail.password=password
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpires= new Date(Date.now()+3600000)

                await existingUserByEmail.save()
            }
            
        } else {
            const expirationDate = new Date();

            expirationDate.setHours(expirationDate.getHours() + 2);
            
            
            const newUser = new User({
                email:email,
                username:username,
                password:password,
                isVerified: false,
                verifyCodeExpires: expirationDate,
                isVerified:false,
                isAcceptingMessages: true,
                messages:[]
            })

            await newUser.save();

            const emailResponse = await sendVerificationEmail(email, verifyCode);

            if (!emailResponse.success) {
                return new NextResponse.json({
                    message: "Failed to send verification email",
                    success: false
                }, { 
                    status: 500 
                });
            }

            return new NextResponse.json({
                message: "User created successfully, verification email sent",
                success: true
            }, {
                status: 201 
            });
        }


        
    } catch (error) {
        console.error("Error! verifying the user", error);
        return new NextResponse.json({
            message:"Error! verifying the user", 
            success:false
            },
            { 
                status: 500 
            });
    }
}