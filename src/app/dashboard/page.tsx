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
  console.log('session', session);
  

  const handleDelete = async (messageId: string) => {
    setMessage(prevMsg => prevMsg.filter((msg) => msg._id !== messageId))
  }

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    setIsSwitchLoading(false)
    try {
      const response = await axios.get('/api/getmessages')
      if (response.status !== 200) {
        toast.error(response.data.message ?? 'Failed to fetch messages')
        return
      }
      setMessage(response.data.messages || [])
      toast.success('Messages fetched successfully')
    } catch (error) {
      const axiosError = error as AxiosError
      const errorMessage = (axiosError.response?.data as { message?: string })?.message ?? 'Failed to fetch messages'
      toast.error(errorMessage)
    } finally {
      setLoading(false)
      setIsSwitchLoading(false)
    }
  }, [setMessage])

  const fetchAcceptMessage = useCallback(async () => {
    try {
      const response = await axios.get('/api/acceptmessage')
      if (response.status !== 200) {
        toast.error(response.data.message ?? 'Failed to fetch message acceptance status')
        return
      }
      const parsedData = acceptMessageSchema.safeParse({ acceptMessage: response.data.isAcceptingMessages })
      if (!parsedData.success) return
      setValue('acceptMessage', parsedData.data.acceptMessage)
    } catch (error) {
      const axiosError = error as AxiosError
      const errorMessage = (axiosError.response?.data as { message?: string })?.message ?? 'Failed to fetch message acceptance status'
      toast.error(errorMessage)
    }
  }, [setValue])

  useEffect(() => {
    if (session && session.user) {
      fetchMessages()
      fetchAcceptMessage()
    }
  }, [session, fetchMessages, fetchAcceptMessage])

  const handleSwitch = async () => {
    try {
      const response = await axios.post('/api/acceptmessage', {
        acceptMessage: !acceptMessage
      })
      setValue("acceptMessage", !acceptMessage)
      toast.success(response.data.message)
    } catch (error) {
      const axiosError = error as AxiosError
      const errorMessage = (axiosError.response?.data as { message?: string })?.message ?? 'Failed to update message acceptance status'
      toast.error(errorMessage)
    }
  }

  const username = session?.user?.username
  const baseUrl = typeof window !== "undefined" ? `${window.location.protocol}//${window.location.host}` : ''
  const profileUrl = `${baseUrl}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL has been copied to clipboard.")
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("https://res.cloudinary.com/dooekcvv0/image/upload/v1751043259/wgzpmoegba4kb6pyirf9.jpg")' }}
      ></div>

      <div className="relative z-10 w-full max-w-5xl mx-4 p-8 rounded-2xl border shadow-lg backdrop-blur-xs">
        <h2 className="text-3xl font-bold text-center mb-6 tracking-wider text-orange-400">
          Your Anonymous Inbox
        </h2>

        <div className="mb-6">
          <label className="text-orange-300 font-semibold block mb-1">Your Profile Link</label>
          <div className="flex flex-col md:flex-row items-center gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full flex-1 bg-black/30 border border-orange-500 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <Button
              onClick={copyToClipboard}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-2 rounded-xl shadow-md hover:from-red-600 hover:to-orange-600"
            >
              Copy Link
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Switch
            {...register("acceptMessage")}
            checked={acceptMessage}
            onCheckedChange={handleSwitch}
            disabled={isSwitchLoading}
            className="data-[state=checked]:bg-orange-600 data-[state=unchecked]:bg-orange-300 border-2 border-orange-400 w-16 h-8"
          />
          <span className="text-base text-orange-200">
            Accept Messages: {" "}
            <span className={acceptMessage ? "text-green-400" : "text-red-400"}>{acceptMessage ? 'On' : 'Off'}</span>
          </span>
        </div>

        <Separator className="bg-orange-500 mb-6" />

        <div className="flex justify-end mb-6">
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault()
              fetchMessages()
            }}
            className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition"
          >
            {loading ? (
              <Loader className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {message.length > 0 ? (
            message.map((msg) => (
              <CustomCard key={msg._id} message={msg} callBack={handleDelete} />
            ))
          ) : (
            <p className="col-span-2 text-center text-orange-100 opacity-70">No messages to display.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
