"use client"

import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import VerifySchema from '../../../../../schemas/verifySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import axios, { AxiosError } from 'axios'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const VerifyCode = () => {
    const params = useParams<{ username: string }>()
    const searchParams = useSearchParams()
    const router = useRouter()

    const from = searchParams.get("flow")

    const form = useForm<z.infer<typeof VerifySchema>>({
        resolver: zodResolver(VerifySchema),
    })

    const onSubmit = async (data: z.infer<typeof VerifySchema>) => {
        try {
            const response = await axios.post('/api/codeverification', {
                username: params.username,
                verifyCode: data.code
            })

            if (response.data.success) {
                if (from === "reset") {
                    toast.success("Verification successful. Redirecting to Reset Password page.")
                    router.push(`/resetpassword/${params.username}`)
                } else {
                    toast.success("Verification successful! You can now log in.")
                    router.push('/signin')
                }
            }
        } catch (error) {
            const axiosError = error as AxiosError
            const errorMessage =
                axiosError.response && typeof axiosError.response.data === 'object' && axiosError.response.data !== null && 'message' in axiosError.response.data
                    ? (axiosError.response.data as { message?: string }).message
                    : undefined

            toast.error(errorMessage || "Verification failed. Please try again.")
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
            <div className="w-full max-w-xl border border-white rounded-2xl p-8 space-y-8">
                <h2 className="text-2xl font-mono text-white border-b border-white pb-3 text-center">
                    Verify Your Account
                </h2>
                <p className="text-center text-white text-sm font-mono">
                    Enter the 6-digit code sent to your email.
                </p>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white font-mono text-lg">Verification Code</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="e.g., 123456"
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
                            className="w-full border border-white text-white font-mono text-lg hover:bg-white hover:text-black transition duration-200 rounded-lg py-3 hover:cursor-pointer"
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
