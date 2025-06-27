"use client"

import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { SignUpSchema } from '../../../../schemas/signUpSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import axios, { AxiosError } from 'axios'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const spinner = (
    <svg className="animate-spin h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="4"></circle>
        <path className="opacity-75" fill="#f97316" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
)

const SignUP = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState('')
    const [usernameStatus, setUsernameStatus] = useState("idle")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const debounced = useDebounceCallback(setUsername, 300)

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })

    useEffect(() => {
        const checkUsername = async () => {
            if (!username || username.length < 3) {
                setUsernameMessage('');
                setUsernameStatus("idle");
                return;
            }
            setUsernameStatus("checking");
            setUsernameMessage('');
            try {
                const response = await axios.get(`/api/uniqueusername?username=${username}`)
                if (response.data.success) {
                    setUsernameMessage('Username is available!');
                    setUsernameStatus("available");
                } else {
                    setUsernameMessage('Username is already taken');
                    setUsernameStatus("taken");
                }
            } catch (error) {
                setUsernameMessage('An error occurred while checking the username.');
                setUsernameStatus("error");
            }
        };
        checkUsername();
    }, [username])

    const onSubmit = async (data: z.infer<typeof SignUpSchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/signup', data);
            if (!response.data.success) {
                toast.error(response.data.message || "Signup failed. Please try again.");
                setIsSubmitting(false);
                return;
            }
            toast.success("Signup Successful. redirecting to the verify page", response.data.message);
            router.replace(`/verify/${username}`)
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error during signup:", axiosError);
            toast.error("An error occurred during signup. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen  relative overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'url("https://res.cloudinary.com/dooekcvv0/image/upload/v1751043259/wgzpmoegba4kb6pyirf9.jpg")',
                }}
            ></div>

            <div className="relative z-10 w-full max-w-md p-8 rounded-2xl shadow-xl border border-white backdrop-blur-xs ">
                <h2 className="text-3xl font-bold text-center mb-7 tracking-wider text-orange-400">
                    Create Your Fiery Identity
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-orange-300 font-semibold">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                            placeholder="Enter your username"
                                            className="bg-black/30 border border-orange-500 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <div className="min-h-[1.5em] mt-1">
                                        {usernameStatus === "checking" && (
                                            <span className="flex items-center gap-2 text-orange-300">{spinner} Checking...</span>
                                        )}
                                        {usernameStatus === "available" && (
                                            <span className="text-green-400">🎉 {usernameMessage}</span>
                                        )}
                                        {usernameStatus === "taken" && (
                                            <span className="text-red-400">😕 {usernameMessage}</span>
                                        )}
                                        {usernameStatus === "error" && (
                                            <span className="text-yellow-400">⚠️ {usernameMessage}</span>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-orange-300 font-semibold">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            {...field}
                                            placeholder="Enter your email"
                                            className="bg-black/30 border border-orange-500 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-orange-300 font-semibold">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            placeholder="Enter your password"
                                            className="bg-black/30 border border-orange-500 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 text-white font-semibold bg-gradient-to-r from-orange-600 to-red-600 py-3 rounded-xl shadow-md hover:from-red-600 hover:to-orange-600 transition-all duration-300"
                        >
                            {isSubmitting && spinner}
                            {isSubmitting ? "Creating..." : "Create Account"}
                        </Button>
                    </form>
                </Form>
                <div>
                    <p className="mt-4 text-center text-sm text-white">
                        Already have an account?
                        <a href="/signin" className="text-orange-400 hover:underline ml-1">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default SignUP
