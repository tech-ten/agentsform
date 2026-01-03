'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { childLogin } from '@/lib/api'
import { setChildProfile } from '@/lib/auth'

function ChildLoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childIdFromUrl = searchParams.get('child')

  const [parentEmail, setParentEmail] = useState('')
  const [childName, setChildName] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'email' | 'name' | 'pin'>(childIdFromUrl ? 'pin' : 'email')

  const handlePinInput = (digit: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit)
      setError(null)
    }
  }

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1))
    setError(null)
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!parentEmail.trim() || !parentEmail.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    setError(null)
    setStep('name')
  }

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (childName.trim().length < 1) {
      setError('Please enter your name')
      return
    }
    setError(null)
    setStep('pin')
  }

  const handlePinSubmit = async () => {
    if (pin.length < 4) {
      setError('Please enter your PIN')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Use childId from URL if available, otherwise use parentEmail + childName
      const loginData = childIdFromUrl
        ? { childId: childIdFromUrl, pin }
        : { parentEmail: parentEmail.trim(), childName: childName.trim(), pin }

      const child = await childLogin(loginData)
      setChildProfile({
        id: child.id,
        name: child.name,
        avatar: child.avatar,
        yearLevel: child.yearLevel,
        username: child.username,
        parentId: child.parentId,
      })
      router.push('/learn')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wrong PIN. Try again!')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  // Parent email entry step
  if (step === 'email') {
    return (
      <div className="w-full max-w-xs px-6">
        <div className="text-center mb-10">
          <Link href="/" className="text-lg font-semibold">
            StudyMate
          </Link>
          <div className="mt-6 mb-6">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">
              Student Login
            </span>
          </div>
          <h1 className="text-3xl font-semibold mb-2">Hi there!</h1>
          <p className="text-neutral-500">Enter your parent's email</p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            value={parentEmail}
            onChange={(e) => setParentEmail(e.target.value)}
            placeholder="parent@email.com"
            autoFocus
            autoComplete="email"
            autoCapitalize="off"
            className="w-full px-4 py-4 text-lg border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-black transition-all text-center"
          />
          <Button
            type="submit"
            className="w-full h-14 mt-4 rounded-xl text-lg"
          >
            Next
          </Button>
        </form>

        <div className="text-center pt-8 mt-8 border-t border-neutral-100">
          <p className="text-sm text-neutral-500 mb-2">Are you a parent?</p>
          <Link href="/login" className="text-sm text-black font-medium hover:underline">
            Parent / Guardian Login
          </Link>
        </div>
      </div>
    )
  }

  // Child name entry step
  if (step === 'name') {
    return (
      <div className="w-full max-w-xs px-6">
        <div className="text-center mb-10">
          <Link href="/" className="text-lg font-semibold">
            StudyMate
          </Link>
          <div className="mt-6 mb-6">
            <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">
              Student Login
            </span>
          </div>
          <h1 className="text-3xl font-semibold mb-2">What's your name?</h1>
          <p className="text-neutral-500">Enter the name your parent used</p>
        </div>

        {error && (
          <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleNameSubmit}>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            placeholder="Your name"
            autoFocus
            autoComplete="off"
            autoCapitalize="words"
            className="w-full px-4 py-4 text-lg border-2 border-neutral-200 rounded-xl focus:outline-none focus:border-black transition-all text-center"
          />
          <Button
            type="submit"
            className="w-full h-14 mt-4 rounded-xl text-lg"
          >
            Next
          </Button>
        </form>

        <button
          onClick={() => { setStep('email'); setError(null); }}
          className="w-full text-sm text-neutral-500 hover:text-black transition-colors mt-4"
        >
          ← Change email
        </button>

        <div className="text-center pt-8 mt-8 border-t border-neutral-100">
          <p className="text-sm text-neutral-500 mb-2">Are you a parent?</p>
          <Link href="/login" className="text-sm text-black font-medium hover:underline">
            Parent / Guardian Login
          </Link>
        </div>
      </div>
    )
  }

  // PIN entry step
  return (
    <div className="w-full max-w-xs px-6">
      <div className="text-center mb-10">
        <Link href="/" className="text-lg font-semibold">
          StudyMate
        </Link>
        <div className="mt-6 mb-6">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full">
            Student Login
          </span>
        </div>
        <h1 className="text-3xl font-semibold mb-2">Enter your PIN</h1>
        <p className="text-neutral-500">
          {childIdFromUrl ? 'Type your secret PIN to start learning' : (
            <>
              Hi <span className="font-medium text-black">{childName}</span>! Enter your PIN
            </>
          )}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl text-center">
          {error}
        </div>
      )}

      {/* PIN Display */}
      <div className="flex justify-center gap-2 mb-8">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            className={`w-10 h-12 rounded-lg border-2 flex items-center justify-center text-xl font-bold transition-all ${
              i < pin.length
                ? 'border-black bg-black text-white'
                : 'border-neutral-200'
            }`}
          >
            {i < pin.length ? '•' : ''}
          </div>
        ))}
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
          <button
            key={digit}
            onClick={() => handlePinInput(digit.toString())}
            disabled={loading}
            className="h-14 text-xl font-semibold rounded-xl border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 transition-all disabled:opacity-50"
          >
            {digit}
          </button>
        ))}
        <button
          onClick={handleBackspace}
          disabled={loading || pin.length === 0}
          className="h-14 text-lg font-semibold rounded-xl border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 transition-all disabled:opacity-50"
        >
          ←
        </button>
        <button
          onClick={() => handlePinInput('0')}
          disabled={loading}
          className="h-14 text-xl font-semibold rounded-xl border border-neutral-200 hover:bg-neutral-50 active:bg-neutral-100 transition-all disabled:opacity-50"
        >
          0
        </button>
        <button
          onClick={handlePinSubmit}
          disabled={loading || pin.length < 4}
          className="h-14 text-lg font-semibold rounded-xl bg-black text-white hover:bg-neutral-800 active:bg-neutral-900 transition-all disabled:opacity-50"
        >
          {loading ? '...' : 'Go'}
        </button>
      </div>

      {/* Back to name */}
      {!childIdFromUrl && (
        <button
          onClick={() => { setStep('name'); setPin(''); setError(null); }}
          className="w-full text-sm text-neutral-500 hover:text-black transition-colors mb-4"
        >
          ← Change name
        </button>
      )}

      <div className="text-center pt-6 border-t border-neutral-100">
        <p className="text-sm text-neutral-500 mb-2">Are you a parent?</p>
        <Link href="/login" className="text-sm text-black font-medium hover:underline">
          Parent / Guardian Login
        </Link>
      </div>
    </div>
  )
}

export default function ChildLoginPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <Suspense fallback={<div className="text-neutral-400">Loading...</div>}>
        <ChildLoginContent />
      </Suspense>
    </main>
  )
}
