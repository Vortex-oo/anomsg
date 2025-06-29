'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
    const { data: session } = useSession()
    const user = session?.user

    return (
        <header className="fixed top-0 left-0 right-0 z-50  backdrop-brightness-100  py-4 px-6 ">
            <nav className="flex items-center justify-between max-w-6xl mx-auto text-white">
                <Link href="/" className="text-2xl font-bold tracking-wide text-[#A3C9A8] hover:text-[#F5E8C7] transition duration-200">
                    ANOMSG 🚀
                </Link>

                <div className="flex items-center space-x-4">
                    {session ? (
                        <>
                            <span className="text-sm md:text-base text-[#F7F7F7] font-medium">
                                Welcome, <span className="text-[#A3C9A8] font-semibold">{user?.username || 'User'}</span>
                            </span>

                            <Button
                                onClick={() => signOut()}
                                className="bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-2 rounded-lg hover:from-red-500 hover:to-red-700 transition-all hover:cursor-pointer "
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/signin">
                                <Button className="bg-gradient-to-r from-[#635985] to-[#A3C9A8] text-[#18122B] px-4 py-2 rounded-lg hover:from-[#A3C9A8] hover:to-[#635985] transition-all hover:cursor-pointer">
                                    Login
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button className="bg-gradient-to-r from-[#635985] to-[#A3C9A8] text-[#18122B] px-4 py-2 rounded-lg hover:from-[#A3C9A8] hover:to-[#635985] transition-all hover:cursor-pointer">
                                    Signup
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
