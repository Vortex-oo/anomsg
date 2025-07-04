"use client"

import { useParams } from 'next/navigation'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '../../../../schemas/messageSchema'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'

const User = () => {
    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    })

    const rawUsername = useParams()?.username
    const decodedUsername = typeof rawUsername === "string" ? decodeURIComponent(rawUsername) : ""

    const onSubmit = async (data: { content: string }) => {
        try {
            const response = await axios.post('/api/sendmessage', {
                content: data.content,
                username: decodedUsername
            })

            if (response.status === 200) {
                toast.success(response.data.message)
                form.reset()
            }
        } catch (error) {
            const axiosError = error as AxiosError
            const errorMessage = (axiosError.response?.data as { message?: string })?.message ?? axiosError.message ?? "An error occurred. Please try again."
            toast.error(errorMessage)
        }
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
            <div className="w-full max-w-xl border border-white rounded-2xl p-8 space-y-8">
                <h2 className="text-2xl font-mono text-white border-b border-white pb-3 text-center">
                    Send message to <span className="font-bold">{decodedUsername.toUpperCase()}</span>
                </h2>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-white font-mono text-lg">Message content...</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Type your message..."
                                            {...field}
                                            className="w-full  bg-black text-white border border-white font-mono rounded-lg px-4 py-3 text-base"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            className="w-full border border-white text-white font-mono text-lg hover:bg-white/90 hover:text-black transition duration-200 rounded-lg py-3 hover:cursor-pointer "
                        >
                            Send
                        </Button>
                    </form>
                </Form>

                <div className="mt-10 space-y-4">
                    {
                        Array.from({ length: 2 }).map((_, index) => (
                            <div key={index} className="w-full border border-white p-5 rounded-lg font-mono text-blue-400 text-center text-lg">
                                AI generated message  <br />
                                // Not available...some money problem 
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default User
