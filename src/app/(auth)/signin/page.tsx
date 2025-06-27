"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import SignInSchema from '../../../../schemas/signInSchema' // KEEPING YOUR ORIGINAL SCHEMA
import { signIn } from 'next-auth/react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

// Import icons from a common library like 'react-icons' or 'lucide-react'
// Make sure you have installed one of these, e.g., npm install lucide-react
import { Mail, Lock } from 'lucide-react'; // Using lucide-react for icons

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
        // More specific error handling based on response details if available
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
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      // Background styling to match the space theme
      style={{
        background: 'linear-gradient(to bottom, #05051a, #000000)', // Darker space-like background
      }}
    >
      {/* Background planet/sphere element - You need to place your image in /public/images/planet-bottom.png */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-full h-[50vh] bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://i.pinimg.com/736x/5d/4c/cf/5d4ccf1e420b6111429f7526ea2369ec.jpg)', // Adjust path if your image is elsewhere
          backgroundSize: 'fill',
          backgroundPosition: 'center bottom',
          zIndex: 0,
        }}
      ></div>

      <div
        className="relative z-10 w-full max-w-md mx-4 p-8 rounded-3xl backdrop-filter backdrop-blur-lg bg-blend-screen bg-opacity-10 border border-opacity-20 border-white shadow-lg"
        style={{
          boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
          maxWidth: '400px', 
          padding: '40px 30px', 
        }}
      >
        <h2 className="text-white text-4xl font-semibold mb-8 text-center" style={{ fontFamily: 'Arial, sans-serif' }}>
          Welcomes Back..
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email" 
                        className="w-full pl-10 pr-4 py-3 bg-transparent border border-white border-opacity-20 rounded-full text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slight background for inputs
                            borderColor: 'rgba(255, 255, 255, 0.2)', // Subtle border
                            borderRadius: '9999px', // Pill shape
                            // fontFamily: 'Arial, sans-serif', // Consistency
                            fontSize: '16px',
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300 ml-4 text-sm" />
                </FormItem>
              )}
            />

            {/* Password Field - Style updated */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Password" 
                        className="w-full pl-10 pr-4 py-3 bg-transparent border border-white border-opacity-20 rounded-full text-white placeholder-white focus:outline-none focus:ring-1 focus:ring-blue-400"
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)', // Slight background for inputs
                            borderColor: 'rgba(255, 255, 255, 0.2)', // Subtle border
                            borderRadius: '9999px', // Pill shape
                            // fontFamily: 'Arial, sans-serif', // Consistency
                            fontSize: '16px',
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage className="text-red-300 ml-4 text-sm" />
                </FormItem>
              )}
            />

            {/* Submit Button - Style updated */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full font-bold transition-all duration-300 text-white"
              style={{
                background: 'linear-gradient(to right, #fa8b6d, #7f1f21)', // Blue gradient from image
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', // More pronounced shadow for button
                borderRadius: '9999px', // Pill shape
                marginTop: '30px', // Extra space as per image
                fontSize: '18px',
                letterSpacing: '1px',
                textTransform: 'uppercase', // All caps
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #7f1f21, #fa8b6d)'; // Invert gradient on hover
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)'; // Deeper shadow on hover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'linear-gradient(to right, #fa8b6d, #7f1f21)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
              }}
            >
              {isLoading ? "SIGNING UP..." : "SIGN UP"} {/* Button text from image */}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SignInPage