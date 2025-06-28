"use client"

import React, { useState } from 'react'
import { emailValidation } from "../../../../../schemas/signInSchema"
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'


const EmailSend = () => {

    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<{ email: string }>({
        resolver: zodResolver(z.object({ email: emailValidation })),
        defaultValues: {
            email: ''
        }
    })
    
    const onSubmit = async (data: { email: string }) => {
        setIsSubmitting(true); // <-- Add this line
        try {
            const response = await axios.post('/api/resetpassword', {
                email: data.email
            });

            console.log(response);

            if (response.data.success) {
                toast.success("Reset password email sent successfully, Redirecting to verify page");
                router.push(`/verify/${response.data.username}`)
            } else {
                toast.error(response.data.message || "Failed to send reset password email.");
            }

        } catch (error) {
            const axiosError = error as AxiosError;
            console.error("Error during signup:", axiosError);
            toast.error("An error occurred during signup. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }


    const spinner = (
    <svg className="animate-spin h-5 w-5 text-orange-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="4"></circle>
        <path className="opacity-75" fill="#f97316" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
)


 return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
            <div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{
                    backgroundImage: 'url("https://res.cloudinary.com/dooekcvv0/image/upload/v1751043259/wgzpmoegba4kb6pyirf9.jpg")',
                }}
            ></div>

            <div
                className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl border shadow-lg backdrop-blur-xs"
            >
                <h2 className="text-3xl font-bold text-center mb-7 tracking-wider text-orange-400">
                    Try to forget your ex, not your password
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full flex items-center justify-center gap-2 text-white font-semibold bg-gradient-to-r from-orange-600 to-red-600 py-3 rounded-xl shadow-md hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:cursor-pointer"
                        >
                            {isSubmitting && spinner}
                            {isSubmitting ? "Sending..." : "Send Verification Code"}
                        </Button>
                    </form>
                </Form>
                <div>
                    <p className="mt-4 text-center text-sm text-white">
                        Mone porlo password? then...
                        <a href="/signin" className="text-orange-400 hover:underline ml-1">
                            Sign In
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmailSend