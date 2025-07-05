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
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
            { message: 'Password must contain uppercase, lowercase, number & special character' }
        ),
})

const ResetPasswordPage = () => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const router = useRouter()
    const params = useParams()

    const form = useForm<z.infer<typeof passwordSchema>>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            password: '',
        }
    })

    const onsubmit = async (data: z.infer<typeof passwordSchema>) => {
        try {
            setIsSubmitting(true)
            const response = await axios.post('/api/resetpassword', {
                password: data.password,
                username: params.username
            })

            if (response.data.success) {
                toast.success("Password reset successful. Redirecting to login.")
                router.push('/signin')
            } else {
                toast.error(response.data.message || "Reset failed.")
            }
        } catch (error) {
            const axiosError = error as AxiosError
            const message =
                typeof axiosError.response?.data === 'object' &&
                    axiosError.response?.data !== null &&
                    'message' in axiosError.response?.data
                    ? (axiosError.response?.data as { message?: string }).message
                    : "An unexpected error occurred."
            toast.error(message)
        } finally {
            setIsSubmitting(false)
            form.reset()
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
            <div className="w-full max-w-xl border border-white rounded-2xl p-8 space-y-8">
                <h2 className="text-2xl font-mono text-white border-b border-white pb-3 text-center">
                    Remember your password, not your ex
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onsubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white font-mono text-lg">New Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Enter your new password"
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
                            {isSubmitting && <Loader className="h-4 w-4 animate-spin mr-2" />}
                            {isSubmitting ? "Processing..." : "Reset Password"}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default ResetPasswordPage
