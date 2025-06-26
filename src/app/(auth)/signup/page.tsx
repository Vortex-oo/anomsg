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
    <svg className="animate-spin h-5 w-5 text-green-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#A3C9A8" strokeWidth="4"></circle>
        <path className="opacity-75" fill="#A3C9A8" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
)

const SignUP = () => {
    const router = useRouter()
    const [username, setUsername] = useState("")
    const [usernameMessage, setUsernameMessage] = useState('')
    const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "error">("idle")
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
                }
                else {
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
            toast.success("Signup Successful. You have successfully signed up!", response.data.message);
            router.replace(`/verify/${response.data.username}`)
        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error during signup:", axiosError);
            toast.error("An error occurred during signup. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#18122B] via-[#393053] to-[#635985] font-sans">
            <div className="w-full max-w-md p-8 rounded-3xl shadow-2xl border-4 border-dashed border-[#A3C9A8] bg-[#23203a]">
                <h2 className="text-3xl font-extrabold text-center mb-7 tracking-wider text-[#A3C9A8] drop-shadow-lg">
                    🚀 Create Your Quirky Account!
                </h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">
                        {/* Username Field */}
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#A3C9A8] font-bold tracking-wide">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                debounced(e.target.value);
                                            }}
                                            placeholder="Enter your quirky username"
                                            className="bg-[#18122B] border-2 border-[#635985] text-[#F7F7F7] rounded-xl px-4 py-2 focus:outline-none focus:border-[#A3C9A8] transition"
                                            autoComplete="off"
                                        />
                                    </FormControl>
                                    <div className="min-h-[1.5em] mt-1">
                                        {usernameStatus === "checking" && (
                                            <span className="flex items-center gap-2 text-[#A3C9A8]">{spinner} Checking...</span>
                                        )}
                                        {usernameStatus === "available" && (
                                            <span className="text-green-400 flex items-center gap-1">🎉 {usernameMessage}</span>
                                        )}
                                        {usernameStatus === "taken" && (
                                            <span className="text-red-400 flex items-center gap-1">😕 {usernameMessage}</span>
                                        )}
                                        {usernameStatus === "error" && (
                                            <span className="text-yellow-400 flex items-center gap-1">⚠️ {usernameMessage}</span>
                                        )}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Email Field */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#A3C9A8] font-bold tracking-wide">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            {...field}
                                            className="bg-[#18122B] border-2 border-[#635985] text-[#F7F7F7] rounded-xl px-4 py-2 focus:outline-none focus:border-[#A3C9A8] transition"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Password Field */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#A3C9A8] font-bold tracking-wide">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your password"
                                            {...field}
                                            className="bg-[#18122B] border-2 border-[#635985] text-[#F7F7F7] rounded-xl px-4 py-2 focus:outline-none focus:border-[#A3C9A8] transition"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="quirky-btn w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#635985] to-[#A3C9A8] text-[#18122B] font-bold py-3 rounded-xl shadow-lg hover:from-[#A3C9A8] hover:to-[#635985] transition"
                        >
                            {isSubmitting && spinner}
                            {isSubmitting ? "Creating..." : "Create Account"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default SignUP