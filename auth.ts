import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import connectDB from "./lib/db";
import User from "@/models/user.model";
import { SignUpSchema } from "./schemas/signUpSchema";

// Define your auth options
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                await connectDB();

                try {
                    const { email, password } = await SignUpSchema.parseAsync(credentials);
                    const user = await User.findOne({ email });

                    if (!user) throw new Error("User not found");
                    if (!user.isVerified) throw new Error("Please verify your email");

                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (!isPasswordValid) throw new Error("Invalid password");

                    return user; // Will be stored in JWT
                } catch (error: any) {
                    throw new Error(error.message || "Sign in error");
                }
            }
        })
    ],

    pages: {
        signIn: "/signin",
        error: "/auth/error",
        verifyRequest: "/auth/verify"
    },

    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.id = user._id;
                token.username = user.username;
                token.isVerified = user.isVerified;
            }
            return token;
        },

        async session({ session, token }: { session: any; token: any }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string;
                session.user.isVerified = token.isVerified as boolean;
            }
            return session;
        }
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 // 30 days
    },

    secret: process.env.AUTH_SECRET,
    debug: process.env.NODE_ENV === "development"
};

// Export handlers and helper functions for Next.js App Router
const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

export { handlers, signIn, signOut, auth };
