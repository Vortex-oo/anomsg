"use client"
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import VerifySchema from '../../../../../schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'


const VerifyCode = () => {

    const params = useParams<{ username: string }>()
    const form = useForm<z.infer<typeof VerifySchema>>({
        resolver: zodResolver(VerifySchema)
    })
    const router = useRouter()
    const searchParams = useSearchParams()


    const from = searchParams.get("flow")

    const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
        try {
            console.log("Sending to /api/codeverification", { username: params.username, code: data.code }) //have to remove it
            const response = await axios.post('/api/codeverification', {
                username: params.username,
                verifyCode: data.code
            })

            if (response.data.success) {

                if (from == "reset") {
                    toast.success("Verification successful, Redirecting to Reset Password Page")
                    router.push(`/resetpassword/${params.username}`) // Redirect to reset password page
                }
                else {
                    toast.success("Verification successful! You can now log in.");
                    router.push('/signin');
                }
            }

        } catch (error) {
            const axiosError = error as AxiosError;
            if (axiosError.response) {
                const errorMessage =
                    typeof axiosError.response.data === 'object' &&
                        axiosError.response.data !== null &&
                        'message' in axiosError.response.data
                        ? (axiosError.response.data as { message?: string }).message
                        : undefined;
                toast.error(errorMessage || "Verification failed. Please try again.");
            } else if (axiosError.request) {
                toast.error("No response from server. Please check your network connection.");
            } else {
                toast.error("An error occurred while verifying the code.");
            }
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-950 p-4"> {/* Very dark background */}
            <div className="w-full max-w-md bg-gray-800 p-8 rounded-lg shadow-xl border border-purple-700"> {/* Dark card with purple border */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl text-white mb-2"> {/* White text for heading */}
                        Verify Your Account
                    </h1>
                    <p className="text-gray-400"> {/* Lighter gray for description */}
                        Enter the verification code sent to your email.
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200">Verification Code</FormLabel> {/* Light gray for label */}
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., 123456"
                                            {...field}
                                            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-700 text-white placeholder-gray-400" // Dark input, purple focus ring
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" /> {/* Slightly softer red for dark theme */}
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out shadow-lg" // Purple button
                        >
                            Verify Code
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default VerifyCode   