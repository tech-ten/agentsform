'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { signUp } from '@/lib/auth'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'scholar'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError(null)

    try {
      await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        plan,
      })
      router.push(`/verify?email=${encodeURIComponent(formData.email)}`)
    } catch (err) {
      console.error('Registration failed:', err)
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const planNames: Record<string, string> = {
    explorer: 'Explorer',
    scholar: 'Scholar',
    achiever: 'Achiever',
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <Link href="/" className="text-lg font-semibold">
          StudyMate
        </Link>
        <div className="mt-8 mb-6">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">
            Parent / Guardian Account
          </span>
        </div>
        <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
        <p className="text-neutral-500">
          Start with the {planNames[plan] || 'Explorer'} plan
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Your name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="John Smith"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="At least 8 characters"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
            className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
            placeholder="Confirm your password"
          />
        </div>

        {error && (
          <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 rounded-xl text-base"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-xs text-neutral-400 text-center">
        By creating an account, you agree to our Terms and Privacy Policy.
      </p>

      <p className="mt-8 text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <Link href="/login" className="text-black font-medium hover:underline">
          Sign in
        </Link>
      </p>

      <div className="mt-10 pt-8 border-t border-neutral-100 text-center">
        <p className="text-sm text-neutral-500 mb-3">Is your child logging in?</p>
        <Link href="/child-login">
          <Button variant="outline" className="rounded-full px-6">
            Child Login (PIN)
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
      <Suspense fallback={<div className="text-neutral-400">Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  )
}
