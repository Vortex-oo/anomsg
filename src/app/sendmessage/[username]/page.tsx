import { useParams } from 'next/navigation'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { messageSchema } from '../../../../schemas/messageSchema'
import axios, { AxiosError } from 'axios'
import { toast } from 'sonner'
import { Textarea } from "@/components/ui/textarea"

const User = () => {

    const form = useForm({
        resolver: zodResolver(messageSchema),
        defaultValues: {
            content: ""
        }
    })

    const { register, setValue } = form

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
        <>
            <div>
                <h2>Sending Message to {decodedUsername}</h2>
            </div>

            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Type your message here."{...field}  />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default User