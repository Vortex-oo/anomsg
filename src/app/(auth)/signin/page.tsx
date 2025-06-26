"use client"

import React from 'react'
import { z } from "zod"
import { SignInSchema } from '../../../../schemas/signInSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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

const page = () => {
    
    const form = useForm<z.infer<typeof SignInSchema>>({
      resolver: zodResolver(SignInSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    })


    function onSubmit(values: z.infer<typeof SignInSchema>) {
      //have to use the api to signin
      console.log(values)
    }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="enter your email" {...field} />
              </FormControl>
              <FormDescription>
                Email for SignIN.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>password</FormLabel>
              <FormControl>
                <Input placeholder="enter the password " {...field} />
              </FormControl>
              <FormDescription>
                Password for SignIN.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

export default page