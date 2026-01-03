'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { isAuthenticatedSync, signOut } from '@/lib/auth'
import {
  createCheckoutSession,
  getSubscriptionStatus,
  getCustomerPortalUrl,
  type SubscriptionStatus,
} from '@/lib/api'

const plans = [
  {
    id: 'explorer',
    name: 'Explorer',
    price: 0.99,
    trialDays: 21,
    description: 'Perfect for getting started',
    features: [
      '21-day FREE trial',
      '2 child profiles',
      '20 questions per day',
      '10 AI explanations per day',
      'Basic progress tracking',
    ],
  },
  {
    id: 'scholar',
    name: 'Scholar',
    price: 5,
    trialDays: 14,
    description: 'For dedicated learners',
    popular: true,
    features: [
      '5 child profiles',
      'Unlimited questions',
      'Unlimited AI tutor help',
      'All subjects',
      'Weekly progress reports',
      'Concept mastery tracking',
      'Growth opportunity alerts',
      'Personalised recommendations',
    ],
  },
  {
    id: 'achiever',
    name: 'Achiever',
    price: 12,
    trialDays: 14,
    description: 'For serious students',
    features: [
      '10 child profiles',
      'Everything in Scholar',
      'Detailed PDF reports',
      'Curriculum alignment insights',
      'Priority support',
    ],
  },
]

function PricingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState<string | null>(null)
  const [status, setStatus] = useState<SubscriptionStatus | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [highlightedPlan, setHighlightedPlan] = useState<string | null>(null)

  useEffect(() => {
    // Check for pre-selected plan first (before auth check)
    const selectedPlan = searchParams.get('plan')
    if (selectedPlan && ['explorer', 'scholar', 'achiever'].includes(selectedPlan)) {
      setHighlightedPlan(selectedPlan)
    }

    if (!isAuthenticatedSync()) {
      // Preserve the plan parameter in the redirect
      const planParam = selectedPlan ? `?plan=${selectedPlan}` : ''
      router.push(`/login?redirect=/pricing${encodeURIComponent(planParam)}`)
      return
    }
    loadStatus()

    // Check for payment result
    const paymentResult = searchParams.get('payment')
    if (paymentResult === 'success') {
      setMessage('Payment successful! Your account has been upgraded.')
    } else if (paymentResult === 'cancelled') {
      setMessage('Payment was cancelled.')
    }

    // Scroll to highlighted plan after a short delay
    if (selectedPlan) {
      setTimeout(() => {
        document.getElementById(`plan-${selectedPlan}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 500)
    }
  }, [router, searchParams])

  const loadStatus = async () => {
    try {
      const result = await getSubscriptionStatus()
      setStatus(result)
    } catch (err) {
      console.error('Failed to load subscription status:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpgrade = async (planId: string) => {
    setUpgrading(planId)
    try {
      const result = await createCheckoutSession(planId as 'explorer' | 'scholar' | 'achiever')
      // Open Stripe checkout in new tab so user can return to app
      window.open(result.url, '_blank')
      setUpgrading(null)
      setMessage('Checkout opened in new tab. Complete payment there, then return here.')
    } catch (err) {
      console.error('Failed to create checkout session:', err)
      setMessage('Failed to start checkout. Please try again.')
      setUpgrading(null)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const result = await getCustomerPortalUrl()
      // Open portal in new tab
      window.open(result.url, '_blank')
    } catch (err) {
      console.error('Failed to open portal:', err)
      setMessage('Failed to open subscription management. Please try again.')
    }
  }

  const handleLogout = () => {
    signOut()
  }

  const currentTier = status?.tier || 'free'

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold">
            StudyMate
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="rounded-full">
                Dashboard
              </Button>
            </Link>
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-500 hover:text-black transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold mb-4">Choose your plan</h1>
          <p className="text-lg text-neutral-500">
            Upgrade anytime. Cancel anytime. No lock-in contracts.
          </p>
        </div>

        {/* Weekly Reports Value Proposition */}
        <div className="mb-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl font-semibold mb-3">
              Stay connected to your child's learning journey every week
            </h2>
            <p className="text-neutral-600 mb-4">
              Why wait until the end of term to see how your child is progressing?
              Our <strong>weekly progress reports</strong> keep you informed of every milestone,
              so you can celebrate wins and support growth as it happens.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Celebrate achievements in real time</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Support learning at the right moment</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Track progress week by week</span>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className={`mb-8 p-4 rounded-xl text-center ${
            message.includes('successful')
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {message}
            <button
              onClick={() => setMessage(null)}
              className="ml-3 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-neutral-400">Loading...</div>
          </div>
        ) : (
          <>
            {/* Current Plan Badge */}
            {currentTier !== 'free' && (
              <div className="mb-8 p-4 bg-neutral-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-sm text-neutral-500">Current plan:</span>
                  <span className="ml-2 font-semibold capitalize">{currentTier}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={handleManageSubscription}
                >
                  Manage Subscription
                </Button>
              </div>
            )}

            {/* Pricing Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => {
                // Only show as "current plan" if user has an ACTIVE subscription for this tier
                // Free tier means NO subscription - user must choose and pay
                const hasActiveSubscription = status?.subscriptionId !== null
                const isCurrentPlan = hasActiveSubscription && plan.id === currentTier
                const isDowngrade = hasActiveSubscription && (
                  (currentTier === 'achiever' && plan.id !== 'achiever') ||
                  (currentTier === 'scholar' && (plan.id === 'explorer'))
                )
                // Don't highlight Explorer - we want to funnel users to Scholar or higher
                const isHighlighted = highlightedPlan === plan.id && plan.id !== 'explorer'

                return (
                  <div
                    key={plan.id}
                    id={`plan-${plan.id}`}
                    className={`rounded-2xl p-8 relative transition-all ${
                      plan.popular || isHighlighted
                        ? 'border-2 border-black'
                        : 'border border-neutral-200'
                    } ${isCurrentPlan ? 'ring-2 ring-green-500 ring-offset-2' : ''} ${
                      isHighlighted ? 'ring-4 ring-blue-500 ring-offset-2 scale-105 shadow-xl' : ''
                    }`}
                  >
                    {plan.popular && !isHighlighted && (
                      <div className="absolute -top-3 left-6 bg-black text-white text-xs px-3 py-1 rounded-full">
                        Most popular
                      </div>
                    )}
                    {isHighlighted && (
                      <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs px-3 py-1 rounded-full animate-pulse">
                        Recommended for you
                      </div>
                    )}
                    {isCurrentPlan && (
                      <div className="absolute -top-3 right-6 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                        Current plan
                      </div>
                    )}

                    <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                    <p className="text-sm text-neutral-500 mb-6">
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      <span className="text-4xl font-semibold">${plan.price}</span>
                      <span className="text-neutral-500">/month</span>
                      {'trialDays' in plan && plan.trialDays && (
                        <span className="text-green-600 block text-sm mt-1 font-medium">
                          {plan.trialDays}-day free trial
                        </span>
                      )}
                    </div>

                    <ul className="space-y-3 mb-8 text-sm">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3">
                          <span className="w-1 h-1 bg-black rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {isCurrentPlan ? (
                      <Button
                        variant="outline"
                        className="w-full rounded-full"
                        disabled
                      >
                        Current Plan
                      </Button>
                    ) : isDowngrade ? (
                      <Button
                        variant="outline"
                        className="w-full rounded-full"
                        onClick={handleManageSubscription}
                      >
                        Manage Plan
                      </Button>
                    ) : (
                      <Button
                        className="w-full rounded-full"
                        variant={plan.popular || isHighlighted ? 'default' : 'outline'}
                        onClick={() => handleUpgrade(plan.id)}
                        disabled={upgrading !== null}
                      >
                        {upgrading === plan.id ? 'Processing...' : 'Start Free Trial'}
                      </Button>
                    )}

                    {/* Explorer 60-day limit fine print */}
                    {plan.id === 'explorer' && !isCurrentPlan && (
                      <p className="text-xs text-neutral-400 text-center mt-3">
                        Limited to 60 days after free trial ends.
                        <br />
                        Upgrade to Scholar required to continue.
                      </p>
                    )}
                  </div>
                )
              })}
            </div>

            {/* FAQ */}
            <div className="mt-16 text-center">
              <h2 className="text-2xl font-semibold mb-8">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                <div className="p-6 bg-neutral-50 rounded-xl">
                  <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
                  <p className="text-sm text-neutral-600">
                    Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                  </p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-xl">
                  <h3 className="font-semibold mb-2">Is my payment secure?</h3>
                  <p className="text-sm text-neutral-600">
                    Absolutely. We use Stripe, a PCI-compliant payment processor used by millions of businesses worldwide.
                  </p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-xl">
                  <h3 className="font-semibold mb-2">Can I change plans later?</h3>
                  <p className="text-sm text-neutral-600">
                    Yes! You can upgrade or downgrade at any time. Changes take effect immediately.
                  </p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-xl">
                  <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                  <p className="text-sm text-neutral-600">
                    We accept all major credit and debit cards including Visa, Mastercard, and American Express.
                  </p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-xl">
                  <h3 className="font-semibold mb-2">How do weekly reports help my child?</h3>
                  <p className="text-sm text-neutral-600">
                    Weekly reports show exactly which concepts your child is mastering and where they can grow next —
                    keeping you in the loop every step of the way so you can celebrate progress together.
                  </p>
                </div>
                <div className="p-6 bg-neutral-50 rounded-xl">
                  <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                  <p className="text-sm text-neutral-600">
                    Yes! All paid plans come with a 14-day free trial. You won't be charged until the trial ends,
                    and you can cancel anytime.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  )
}
