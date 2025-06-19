import "next-auth"

declare module "next-auth" {
    interface Session {
        user: {
            id: string
            username: string
            email: string
            isVerified: boolean
        }
    }

    interface User {
        _id: string
        username: string
        email: string
        isVerified: boolean
    }
}