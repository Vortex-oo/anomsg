"use client"
import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader } from 'lucide-react'


export const passwordSchema = z.object({
    password: z.string()
        .min(8, { message: 'Password must be at least 8 characters long' })
        .max(50, { message: 'Password must be at most 50 characters long' })
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }),
})

const page = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const params= useParams()


    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
        }
    })

    const onsubmit = async (data: z.infer<typeof passwordSchema>)=>{
        try {
            setIsSubmitting(true);
            const response = await axios.post('/api/resetpassword', {
                password: data.password,
                username: params.username // Assuming you have the username in the URL params
            });

            if (response.data.success) {
                toast.success("Password reset successfully, Redirecting to login page");
                router.push('/signin');
            } else {
                toast.error(response.data.message || "Failed to reset password.");
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
                toast.error(errorMessage || "An error occurred. Please try again.");
            } else if (axiosError.request) {
                toast.error("No response from server. Please check your network connection.");
            } else {
                toast.error("An error occurred while processing your request.");
            }
            
        }
        finally{
            setIsSubmitting(false);
            form.reset();
        }
    }

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
                    Remember your password, not your ex
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white">New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your new password"
                                            {...field}
                                            className="bg-gray-800 text-white border border-purple-700 focus:border-orange-400 focus:ring-orange-400"
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
                            {isSubmitting && Loader({ className: "animate-spin h-4 w-4" })}
                            {isSubmitting ? "Processing..." : "Reset Password"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default page