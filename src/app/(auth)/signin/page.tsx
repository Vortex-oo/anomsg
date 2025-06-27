"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import SignInSchema from '../../../../schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Mail, Lock } from 'lucide-react'

const SignInPage = () => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (data: z.infer<typeof SignInSchema>) => {
    try {
      setIsLoading(true)

      const response = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (response?.ok) {
        toast.success("Login successful! Redirecting to dashboard...")
        router.push('/dashboard')
      } else {
        toast.error(response?.error || "Invalid credentials. Please try again.")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">

      {/* 🔥 Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url("https://res.cloudinary.com/dooekcvv0/image/upload/v1751043259/wgzpmoegba4kb6pyirf9.jpg")',
        }}
      ></div>

      {/* 🔥 Glassy form container */}
      <div
        className="relative z-10 w-full max-w-md mx-4 p-8 rounded-2xl border shadow-lg backdrop-blur-xs"
      >
        <h2 className="text-orange-400 text-4xl font-black mb-8 text-center" style={{ fontFamily: 'monospace' }}>
          Welcome Back, Stranger.
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" size={20} />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                        className="w-full pl-10 pr-4 py-3 text-white placeholder-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '9999px',
                          fontSize: '16px',
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300 ml-4 text-sm" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400" size={20} />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                        className="w-full pl-10 pr-4 py-3 text-white placeholder-orange-300 focus:outline-none focus:ring-1 focus:ring-orange-500"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '9999px',
                          fontSize: '16px',
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300 ml-4 text-sm" />
                </FormItem>
              )}
            />

            {/* 🔥 Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 text-white font-semibold bg-gradient-to-r from-orange-600 to-red-600 py-3 rounded-xl shadow-md hover:from-red-600 hover:to-orange-600 transition-all duration-300"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>
        </Form>
        <div>
          <p className="mt-4 text-center text-sm text-white">
            Wanna create an account?
            <a href="/signup" className="text-orange-400 hover:underline ml-1">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
