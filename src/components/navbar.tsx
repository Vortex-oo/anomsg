'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
    const { data: session } = useSession()
    const user = session?.user

    return (
        <header className="fixed top-0 left-0 right-0 z-50   py-4 px-6 bg-black ">
            <nav className="flex items-center justify-between max-w-6xl mx-auto text-white">
                <Link href="/" className="text-2xl font-bold tracking-wide text-[#ffff] hover:text-[#F5E8C7] transition duration-200">
                    {session ? (
                        <>
                            <>
                                <span>Welcome {user?.username.toUpperCase()}</span>
                            </>

                        </>
                    ) : (<span>Welcome To ANOMSG</span>)}
                </Link>

                <div className="flex items-center space-x-4">
                    {session ? (
                        <>
                            <Button
                                onClick={() => signOut()}
                                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black  px-4 py-2 rounded-lgl hover:cursor-pointer font-mono "
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
