import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import connectDB from "./lib/db"
import User from "@/models/user.model"
import bcrypt from "bcryptjs"
import { SignUpSchema } from "./schemas/signUpSchema"



export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {
                    type: "email",
                    label: "Email",
                },
                password: {
                    type: "password",
                    label: "Password",
                },
            },
            authorize: async (credentials) => {

                await connectDB()

                try {

                    const { email, password } = await SignUpSchema.parseAsync(credentials)
                    const user = await User.findOne({ email: email })

                    if (!user) {
                        throw new Error("User not found")
                    }

                    // if (!user.isVerified) {
                    //     throw new Error("Please verify your email")
                    // }

                    const isValid = await bcrypt.compare(
                        String(password),
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

    pages: {
        signIn: '/signin',
        error: '/auth/error',
        verifyRequest: '/auth/verify',
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user) {
                session.user.id = String(token.id)
                session.user.username = String(token.username)
                session.user.isVerified = Boolean(token.isVerified)
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user._id
                token.username = user.username
                token.isVerified = user.isVerified
            }
            return token
        },
        
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
})