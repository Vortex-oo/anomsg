"use client"
import React from 'react'
import { signIn } from "next-auth/react";
import { useState } from "react";
import { SignInSchema } from "../../../../schemas/signInSchema";
import { useRouter } from 'next/navigation';


const Form = () => {

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const router = useRouter()



  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    setError('')
    setFieldErrors({})


    const result = SignInSchema.safeParse(form)

    if (!result.success) {
      const errors: Partial<Record<keyof typeof form, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof typeof form;
        errors[field] = err.message;
      });
      setFieldErrors(errors);
      return;
    }

    const res = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false
    })

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/');
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {fieldErrors.email && <p className="text-red-500 text-sm">{fieldErrors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        {fieldErrors.password && <p className="text-red-500 text-sm">{fieldErrors.password}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </main>
  );
}

export default Form