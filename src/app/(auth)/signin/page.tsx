"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import SignInSchema from '../../../../schemas/signInSchema'
import { signIn } from 'next-auth/react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
        toast.success("Login successful!")
        router.push('/dashboard')
      } else {
        toast.error("Invalid credentials")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1e1e2e] text-white font-comic">
      <div className="w-full max-w-md bg-[#2e2e3e] border border-[#444] rounded-xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-[#ffcc00] mb-6">Sign In</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#ffcc00]">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="you@example.com"
                      className="w-full px-4 py-2 bg-[#1e1e2e] border border-[#555] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[#ffcc00]">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-4 py-2 bg-[#1e1e2e] border border-[#555] rounded-md focus:outline-none focus:ring-2 focus:ring-[#ffcc00]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#ffcc00] text-[#1e1e2e] hover:bg-yellow-400 font-bold py-2 px-4 rounded-md transition"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignInPage
