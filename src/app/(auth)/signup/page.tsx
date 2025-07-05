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
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
        <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
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
                setUsernameMessage('Username is already taken');
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
            router.replace(`/verify/${username}?flow=signup`)
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error during signup:", axiosError);
            toast.error("An error occurred during signup. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
            <div className="w-full max-w-xl border border-white rounded-2xl p-8 space-y-8">
                <h2 className="text-2xl font-mono text-white border-b border-white pb-3 text-center">
                    Create Your Identity
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Username */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white font-mono text-lg">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                            placeholder="Enter your username"
                                            className="bg-black text-white border border-white font-mono rounded-lg px-4 py-3 text-base"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <div className="min-h-[1.5em] mt-1 font-mono text-sm">
                                        {usernameStatus === "checking" && (
                                            <span className="flex items-center gap-2 text-white">{spinner} Checking...</span>
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
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Email */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white font-mono text-lg">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            {...field}
                                            placeholder="Enter your email"
                                            className="bg-black text-white border border-white font-mono rounded-lg px-4 py-3 text-base"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Password */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white font-mono text-lg">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            {...field}
                                            placeholder="Enter your password"
                                            className="bg-black text-white border border-white font-mono rounded-lg px-4 py-3 text-base"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full border border-white text-white font-mono text-lg hover:bg-white hover:text-black transition duration-200 rounded-lg py-3 hover:cursor-pointer"
                        >
                            {isSubmitting && spinner}
                            {isSubmitting ? "Creating..." : "Create Account"}
                        </Button>
                    </form>
                </Form>

                <p className="text-sm text-center text-white font-mono">
                    Already have an account?
                    <a href="/signin" className="text-orange-400 hover:underline ml-1">Sign In</a>
                </p>
            </div>
        </div>
    )
}

export default SignUP
