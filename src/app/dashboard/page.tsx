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
import { Copy, Loader, RefreshCcw } from 'lucide-react'
import CustomCard from '@/components/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"

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
  const profileUrl = `${baseUrl}/sendmessage/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    toast.success("Profile URL has been copied to clipboard.")
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl border border-white rounded-2xl p-8 space-y-8">
        <h2 className="text-2xl font-mono text-white border-b border-white pb-3 text-center">
          Your Anonymous Inbox
        </h2>

        <div className="space-y-4">
          <label className="text-white inline-block  font-mono ">Your Profile Link</label>
          <div className="flex flex-col md:flex-row items-center gap-3 border border-white bg-black p-3 rounded-xl">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full text-white bg-black border border-white rounded-lg px-4 py-2 font-mono"
            />
            <Button
              onClick={copyToClipboard}
              className="border border-white text-white font-mono px-4 py-2 rounded-lg hover:bg-white hover:text-black transition"
            >
              <Copy />
            </Button>
          </div>

          <div className="flex justify-between items-center border-t border-white pt-4">
            {/* Left: Switch */}
            <div className="flex items-center gap-4">
              <Switch
                {...register("acceptMessage")}
                checked={acceptMessage}
                onCheckedChange={handleSwitch}
                disabled={isSwitchLoading}
                className="data-[state=unchecked]:bg-transparent data-[state=checked]:bg-slate-700 border border-white hover:cursor-pointer"
              />
              <span className="text-white font-mono">
                Accept Messages:{" "}
                <span className={acceptMessage ? "text-green-400" : "text-red-400"}>
                  {acceptMessage ? "On" : "Off"}
                </span>
              </span>
            </div>

            {/* Right: Refresh */}
            <div>
              <Button
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  fetchMessages();
                }}
                className="border border-white bg-transparent  text-white hover:bg-white hover:text-black transition font-mono hover:cursor-pointer"
              >
                {loading ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCcw className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

        </div>


        <Carousel
          className="w-full"
          plugins={[Autoplay({ delay: 2000 })]}
        >
          <CarouselContent className="flex gap-4">
            {
              message.length > 0 ? (
                message.map((msg) => (
                  <CarouselItem
                    key={msg._id}
                    className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                  >
                    <div className="p-2">
                      <CustomCard message={msg} callBack={handleDelete} />
                    </div>
                  </CarouselItem>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4  "
                  >
                    <div className="p-2">
                      <Card className="bg-black border border-white text-white min-h-[200px] flex items-center justify-center">
                        <CardContent className="text-lg font-mono text-center w-full h-full flex items-center justify-center">
                          No Message
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))
              )
            }
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  )
}

export default Dashboard
