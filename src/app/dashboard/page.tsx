import axios, { AxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { acceptMessageSchema } from '../../../schemas/acceptMessageSchema'
import { IMessage } from '../../models/message.model'


const Dashboard = () => {

    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState<IMessage[]>([])


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

    const fetchAcceptMessage = useCallback(async()=>{
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

            // Handle the parsed data as needed
            console.log(parsedData.data)
        } catch (error) {
            
        }
    },[])

    return (
        <div>

        </div>
    )
}

export default Dashboard