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
        setIsSubmitting(true)
        try {
            const response = await axios.post('/api/sendemails', {
                email: data.email
            })

            if (response.data.success) {
                toast.success("Verification email sent. Redirecting...")
                router.push(`/verify/${response.data.username}?flow=reset`)
            } else {
                toast.error(response.data.message || "Failed to send reset email.")
            }

        } catch (error) {
            const axiosError = error as AxiosError
            console.error("Error sending email:", axiosError)
            toast.error("An error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
            <div className="w-full max-w-xl border border-white rounded-2xl p-8 space-y-8">
                <h2 className="text-2xl font-mono text-white border-b border-white pb-3 text-center">
                    Try to forget your ex, not your password
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white font-mono text-lg">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="Enter your email"
                                            {...field}
                                            className="w-full bg-black text-white border border-white font-mono rounded-lg px-4 py-3 text-base"
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
                            {isSubmitting && (
                                <svg className="animate-spin h-4 w-4 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                            )}
                            {isSubmitting ? "Sending..." : "Send Verification Code"}
                        </Button>
                    </form>
                </Form>

                <div>
                    <p className="mt-4 text-center text-sm text-white font-mono">
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
