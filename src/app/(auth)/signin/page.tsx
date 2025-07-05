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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-xl border border-white rounded-2xl p-8 space-y-8">
        <h2 className="text-2xl font-mono text-white border-b border-white pb-3 text-center">
          Welcome Back, <span className="font-bold">Stranger</span>
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email"
                        className="w-full bg-black text-white border border-white font-mono rounded-lg pl-10 pr-4 py-3 text-base"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" size={20} />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password"
                        className="w-full bg-black text-white border border-white font-mono rounded-lg pl-10 pr-4 py-3 text-base"
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div>
              <p className="text-sm text-white">
                <a href="/sendemail" className="text-orange-400 hover:underline ml-1">
                  Forget Password?
                </a>
              </p>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full border border-white text-white font-mono text-lg hover:bg-white hover:text-black transition duration-200 rounded-lg py-3 hover:cursor-pointer"
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
