"use client"
import axios, { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { acceptMessageSchema } from '../../../schemas/acceptMessageSchema'
import { IMessage } from '../../models/message.model'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Loader, RefreshCcw } from 'lucide-react'
import CustomCard from '@/components/card'

const Dashboard = () => {
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState<IMessage[]>([])

    const from = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, setValue, watch } = from
    const acceptMessage = watch('acceptMessage')
    const { data: session } = useSession()

    const handleDelete = async (messageId: string) => {
        setMessage(prevMsg => prevMsg.filter((msg) => msg._id !== messageId))
    }

    const fetchMessages = useCallback(async () => {
        setLoading(true)
        setIsSwitchLoading(false)
        try {
            const response = await axios.get('/api/getmessages')
            if (response.status !== 200) {
                toast.error(response.data.message ?? 'Failed to fetch messages');
                return
            }
            setMessage(response.data.messages || [])
            toast.success('Messages fetched successfully');
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMessage =
                axiosError.response && typeof axiosError.response.data === 'object' && axiosError.response.data !== null && 'message' in axiosError.response.data
                    ? (axiosError.response.data as { message?: string }).message
                    : undefined;
            toast.error(errorMessage ?? 'Failed to fetch messages');
        }
        finally {
            setLoading(false)
            setIsSwitchLoading(false)
        }
    }, [setMessage, setLoading, setIsSwitchLoading])

    const fetchAcceptMessage = useCallback(async () => {
        try {
            const response = await axios.get('/api/acceptmessage')
            if (response.status !== 200) {
                toast.error(response.data.message ?? 'Failed to fetch message acceptance status');
                return
            }
            const isAcceptingMessages = response.data.isAcceptingMessages
            const parsedData = acceptMessageSchema.safeParse({ acceptMessage: isAcceptingMessages })
            if (!parsedData.success) {
                toast.error(parsedData.error.message)
                return
            }
            setValue('acceptMessage', parsedData.data.acceptMessage)
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMessage =
                axiosError.response && typeof axiosError.response.data === 'object' && axiosError.response.data !== null && 'message' in axiosError.response.data
                    ? (axiosError.response.data as { message?: string }).message
                    : undefined;
            toast.error(errorMessage ?? 'Failed to fetch message acceptance status');
        }
    }, [setValue])

    useEffect(() => {
        if (!session || !session.user) return
        fetchMessages()
        fetchAcceptMessage()
    }, [session, setValue, setMessage, fetchMessages, fetchAcceptMessage])

    const handleSwitch = async () => {
        try {
            const response = await axios.post('/api/acceptmessage', {
                acceptMessage: !acceptMessage
            })
            setValue("acceptMessage", !acceptMessage)
            toast.success(response.data.message)
        } catch (error) {
            const axiosError = error as AxiosError;
            const errorMessage =
                axiosError.response && typeof axiosError.response.data === 'object' && axiosError.response.data !== null && 'message' in axiosError.response.data
                    ? (axiosError.response.data as { message?: string }).message
                    : undefined;
            toast.error(errorMessage ?? 'Failed to update message acceptance status');
        }
    }

    const username = session?.user?.username
    const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : '';
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast.success("Profile URL has been copied to clipboard.")
    };

    return (
        <div className="min-h-screen bg-[#050d18] text-[#E0E0E0] py-8 px-4 md:px-8 flex flex-col items-center">
            <div className="w-full max-w-5xl bg-[#0a1832] rounded-xl shadow-lg p-6 md:p-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#E0E0E0]">User Dashboard</h1>

                {/* Profile Link */}
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                    <div className="flex flex-col md:flex-row items-center gap-2">
                        <input
                            type="text"
                            value={profileUrl}
                            disabled
                            className="w-full md:w-auto flex-1 bg-[#050d18] border border-[#23395d] rounded-lg px-3 py-2 text-[#E0E0E0] focus:outline-none"
                        />
                        <Button
                            onClick={copyToClipboard}
                            className="bg-[#23395d] text-[#E0E0E0] hover:bg-[#ec5990] hover:text-white transition"
                        >
                            Copy
                        </Button>
                    </div>
                </div>

                {/* Accept Messages Switch */}
                <div className="mb-6 flex items-center gap-3">
                    <Switch
                        {...register("acceptMessage")}
                        checked={acceptMessage}
                        onCheckedChange={handleSwitch}
                        disabled={isSwitchLoading}
                        className="data-[state=checked]:bg-[#ec5990] data-[state=unchecked]:bg-[#23395d] border-2 border-[#ec5990] transition-colors duration-300"
                    />
                    <span className="ml-2 text-base">
                        Accept Messages: <span className={acceptMessage ? "text-green-400" : "text-red-400"}>{acceptMessage ? 'On' : 'Off'}</span>
                    </span>
                </div>

                <Separator className="bg-[#23395d]" />

                {/* Refresh Button */}
                <div className="mt-6 flex justify-end">
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            e.preventDefault()
                            fetchMessages()
                        }}
                        className="border border-[#ec5990] text-[#ec5990] hover:bg-[#ec5990] hover:text-white transition"
                    >
                        {loading ? (
                            <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                            <RefreshCcw className="h-4 w-4" />
                        )}
                    </Button>
                </div>

                {/* Messages Grid */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {message.length > 0 ? (
                        message.map((msg, index) => (
                            <CustomCard key={msg._id} message={msg} callBack={handleDelete} />
                        ))
                    ) : (
                        <p className="col-span-2 text-center text-[#E0E0E0] opacity-70">No messages to display.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard