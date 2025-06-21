// Update the import path if the db file is not in src/lib/db.ts
import connectDB from "../../../../lib/db";
import User from "../../../models/user.model";
import { sendVerificationEmail } from "../../../../helpers/sendverficationemail";
import { NextResponse } from "next/server";
import { SignUpSchema } from "../../../../schemas/signUpSchema"


export async function POST(request: Request) {

    await connectDB();

    try {

        const body = await request.json();

        const parsed = await SignUpSchema.safeParseAsync(body);

        if (!parsed.success) {
            return NextResponse.json({
                message: "Invalid input",
                success: false,
                errors: parsed.error.flatten().fieldErrors
            }, { status: 400 });
        }

        const { email, username, password } = parsed.data;

        const existingVerifiedUserByUsername = await User.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUserByUsername) {
            return NextResponse.json({
                message: "User already exists",
                success: false
            }, { status: 400 });
        }

        const existingUserByEmail = await User.findOne({
            email: email,
        })
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();


        if (existingUserByEmail) {

            if (existingUserByEmail.isVerified) {
                return NextResponse.json({
                    message: "User already exists with this email",
                    success: false
                },
                    {
                        status: 400
                    })
            } else {
                existingUserByEmail.password = password
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpires = new Date(Date.now() + 3600000)
                existingUserByEmail.isVerified = false;

                await existingUserByEmail.save()

                const sendEmail = await sendVerificationEmail(existingUserByEmail.email.toString(), existingUserByEmail.username.toString(), verifyCode.toString())

                if (!sendEmail || !sendEmail.success) {
                    console.log(sendEmail);

                    return NextResponse.json({
                        message: "Failed to send verification email",
                        success: false
                    }, {
                        status: 500
                    });
                }

                return NextResponse.json({
                    message: "Verification code re-sent to existing user",
                    success: true,
                });
            }

        } else {
            const expirationDate = new Date();

            expirationDate.setHours(expirationDate.getHours() + 2);


            const newUser = new User({
                email: email,
                username: username,
                password: password,
                isVerified: false,
                verifyCode: verifyCode,
                verifyCodeExpires: expirationDate,
                isAcceptingMessages: true,
                messages: []
            })

            await newUser.save();

            const emailResponse = await sendVerificationEmail(email.toString(), newUser.username.toString(), verifyCode.toString());

            if (!emailResponse || !emailResponse.success) {
                console.log(emailResponse);

                return NextResponse.json({
                    message: "Failed to send verification email",
                    success: false
                }, {
                    status: 500
                });
            }

            return NextResponse.json({
                message: "User created successfully, verification email sent",
                success: true,
                Email: emailResponse
            }, {
                status: 201
            });
        }



    } catch (error) {
        console.error("Error! verifying the user", error);
        return NextResponse.json({
            message: "Error! verifying the user",
            success: false
        },
            {
                status: 500
            });
    }
}