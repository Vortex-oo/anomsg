import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export {default} from "next-auth"

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request,secret: process.env.AUTH_SECRET });
    const url = request.nextUrl

    if (token && (
        url.pathname.startsWith("/signup")||
        url.pathname.startsWith("/signin") ||
        url.pathname.startsWith("/verify")
    )) {
        return  NextResponse.redirect(new URL("/dashboard", request.url));
    }
}
    export const config ={
        matcher:[
            '/',
            '/dashboard/:path*',
            '/signin',
            '/signup',
        ]
    }
