import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"



export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                    placeholder: "johndoe@gmail.com",
                },
                password: {
                    type: "password",
                    label: "Password",
                    placeholder: "*****",
                },
            },
            authorize: async (credentials) => {

                await connectDB()

                try {
                    const user = await User.findOne({ email: credentials.email })

                    if (!user) {
                        throw new Error("User not found")
                    }

                    if (!user.isVerified) {
                        throw new Error("Please verify your email")
                    }

                    const isValid = await bcrypt.compare(
                        String(credentials.password),
                        String(user.password)
                    )

                    if (isValid) {
                        return user
                    }
                    else {
                        throw new Error("Invalid password")
                    }

                } catch (error: any) {
                    throw new Error(error.message || "SignIn Error")
                }
            }
        })
    ],
})