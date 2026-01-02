'use client'

import { useState, useEffect, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  getChildren,
  getParentReport,
  getChildWeaknesses,
  getDailyStats,
  getConceptMastery,
  getSubscriptionStatus,
  type Child,
  type ParentReportResponse,
  type WeaknessesResponse,
  type DailyStatsResponse,
  type ConceptMasteryItem,
  type SubscriptionStatus,
} from '@/lib/api'
import { isAuthenticatedSync } from '@/lib/auth'

function formatConceptName(concept: string): string {
  const names: Record<string, string> = {
    'place-value-identification': 'Place Value Identification',
    'place-value-naming': 'Place Value Position Names',
    'number-reading': 'Reading Large Numbers',
    'number-writing': 'Writing Numbers',
    'number-ordering': 'Ordering Numbers',
    'number-comparing': 'Comparing Numbers',
    'rounding': 'Rounding Numbers',
    'adding-subtracting-place-value': 'Adding/Subtracting by Place Value',
    'times-tables-recall': 'Times Tables',
    'division-facts': 'Division Facts',
    'multiplication-strategies': 'Multiplication Strategies',
    'division-with-remainders': 'Division with Remainders',
    'factors-multiples': 'Factors and Multiples',
    'fraction-identification': 'Identifying Fractions',
    'equivalent-fractions': 'Equivalent Fractions',
    'comparing-fractions': 'Comparing Fractions',
    'decimal-place-value': 'Decimal Place Value',
    'decimal-ordering': 'Ordering Decimals',
    'vcmna186': 'Reading and Writing Large Numbers',
    'vcmna181': 'Factors and Multiples',
    'vcmna182': 'Estimation and Rounding',
    'vcmna183': 'Multiplying Large Numbers',
    'vcmna184': 'Division with Remainders',
    'vcmna187': 'Comparing and Ordering Fractions',
    'vcmna190': 'Comparing and Ordering Decimals',
    'vcmmg195': 'Choosing Appropriate Units',
    'vcmmg196': 'Calculating Perimeter and Area',
    'vcmmg198': 'Converting Between Units',
    'vcmmg200': 'Shape Properties',
    'vcmmg202': 'Angles',
    'vcmsp205': 'Data Representation',
    'vcmsp206': 'Probability',
    'angle-types': 'Types of Angles',
    'angle-measurement': 'Measuring Angles',
    'shape-properties': 'Shape Properties',
  }

  const lowerConcept = concept.toLowerCase()
  return names[lowerConcept] || names[concept] || concept.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

function AnalyticsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const childId = searchParams.get('child')

  const [child, setChild] = useState<Child | null>(null)
  const [report, setReport] = useState<ParentReportResponse | null>(null)
  const [weaknesses, setWeaknesses] = useState<WeaknessesResponse | null>(null)
  const [dailyStats, setDailyStats] = useState<DailyStatsResponse | null>(null)
  const [concepts, setConcepts] = useState<ConceptMasteryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState<'week' | 'month'>('week')
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)

  useEffect(() => {
    if (!isAuthenticatedSync()) {
      router.push('/login')
      return
    }
    if (childId) {
      loadData()
    } else {
      setError('No child specified')
      setLoading(false)
    }
  }, [router, childId])

  useEffect(() => {
    if (childId && !loading) {
      loadReport()
    }
  }, [period])

  const loadData = async () => {
    if (!childId) return
    try {
      const [childrenRes, subscriptionRes, reportRes, weaknessesRes, dailyRes, conceptsRes] = await Promise.all([
        getChildren(),
        getSubscriptionStatus().catch((err) => {
          console.error('Subscription status error:', err)
          return null
        }),
        getParentReport(childId, period).catch(() => null),
        getChildWeaknesses(childId).catch(() => null),
        getDailyStats(childId, period === 'month' ? 30 : 7).catch(() => null),
        getConceptMastery(childId).catch(() => null),
      ])

      if (subscriptionRes) setSubscription(subscriptionRes)

      const found = childrenRes.children.find(c => c.id === childId)
      if (found) {
        setChild(found)
      } else {
        setError('Child not found')
      }

      if (reportRes) setReport(reportRes)
      if (weaknessesRes) setWeaknesses(weaknessesRes)
      if (dailyRes) setDailyStats(dailyRes)
      if (conceptsRes?.concepts) setConcepts(conceptsRes.concepts)
    } catch (err) {
      console.error('Failed to load analytics:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const loadReport = async () => {
    if (!childId) return
    try {
      const [reportRes, dailyRes] = await Promise.all([
        getParentReport(childId, period),
        getDailyStats(childId, period === 'month' ? 30 : 7),
      ])
      if (reportRes) setReport(reportRes)
      if (dailyRes) setDailyStats(dailyRes)
    } catch (err) {
      console.error('Failed to load report:', err)
    }
  }

  if (loading) {
    return <div className="text-center py-12 text-neutral-400">Loading...</div>
  }

  const hasPremium = subscription && (subscription.tier === 'scholar' || subscription.tier === 'achiever')

  // Premium gate - clean minimalist design
  if (!hasPremium) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <h1 className="text-2xl font-medium mb-2">Learning Analytics</h1>
        <p className="text-neutral-500 mb-10">
          Detailed insights into your child&apos;s learning journey.
        </p>

        <div className="text-left mb-10">
          <p className="text-xs uppercase tracking-wide text-neutral-400 mb-4">Premium Features</p>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-neutral-400">+</span>
              <span>Concept mastery tracking</span>
            </div>
            <div className="flex gap-3">
              <span className="text-neutral-400">+</span>
              <span>Error pattern detection</span>
            </div>
            <div className="flex gap-3">
              <span className="text-neutral-400">+</span>
              <span>AI-powered insights</span>
            </div>
            <div className="flex gap-3">
              <span className="text-neutral-400">+</span>
              <span>Daily activity tracking</span>
            </div>
          </div>
        </div>

        <Link href="/pricing">
          <Button className="bg-black text-white hover:bg-neutral-800 rounded-full px-8">
            Upgrade to Scholar
          </Button>
        </Link>
        <p className="text-xs text-neutral-400 mt-3">$5/month</p>
      </div>
    )
  }

  if (!child) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 mb-6">{error || 'Child not found'}</p>
        <Link href="/dashboard">
          <Button variant="outline" className="rounded-full px-6">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-medium">{child.name}</h1>
          <p className="text-sm text-neutral-400">Year {child.yearLevel}</p>
        </div>
        <div className="flex gap-1 text-sm">
          <button
            className={`px-4 py-1.5 rounded-full transition-colors ${
              period === 'week' ? 'bg-black text-white' : 'text-neutral-400 hover:text-black'
            }`}
            onClick={() => setPeriod('week')}
          >
            Week
          </button>
          <button
            className={`px-4 py-1.5 rounded-full transition-colors ${
              period === 'month' ? 'bg-black text-white' : 'text-neutral-400 hover:text-black'
            }`}
            onClick={() => setPeriod('month')}
          >
            Month
          </button>
        </div>
      </div>

      {/* Summary */}
      {report && (
        <section className="mb-12">
          <p className="text-lg mb-4">{report.summary.headline}</p>
          <div className="flex flex-wrap gap-2">
            {report.summary.keyInsights.slice(0, 4).map((insight, idx) => (
              <span key={idx} className="text-sm text-neutral-500">
                {insight}{idx < Math.min(report.summary.keyInsights.length, 4) - 1 ? ' · ' : ''}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Stats Grid */}
      {dailyStats && (
        <section className="mb-12">
          <div className="grid grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-3xl font-light">{dailyStats.totals.totalQuestions}</div>
              <div className="text-xs text-neutral-400 mt-1">Questions</div>
            </div>
            <div>
              <div className="text-3xl font-light">{dailyStats.totals.overallAccuracy}%</div>
              <div className="text-xs text-neutral-400 mt-1">Accuracy</div>
            </div>
            <div>
              <div className="text-3xl font-light">{dailyStats.totals.totalMinutes}</div>
              <div className="text-xs text-neutral-400 mt-1">Minutes</div>
            </div>
            <div>
              <div className="text-3xl font-light">{dailyStats.totals.daysActive}/{period === 'week' ? 7 : 30}</div>
              <div className="text-xs text-neutral-400 mt-1">Active Days</div>
            </div>
          </div>

          {/* Minimal bar chart */}
          <div className="flex items-end gap-0.5 h-16">
            {dailyStats.stats.map((day, idx) => {
              const maxQuestions = Math.max(...dailyStats.stats.map(d => d.questionsAttempted), 1)
              const height = day.questionsAttempted > 0
                ? Math.max((day.questionsAttempted / maxQuestions) * 100, 4)
                : 1
              return (
                <div
                  key={idx}
                  className={`flex-1 transition-all ${
                    day.questionsAttempted === 0 ? 'bg-neutral-100' : 'bg-black'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${day.date}: ${day.questionsAttempted} questions`}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* AI Insights */}
      {weaknesses?.aiInsights && weaknesses.aiInsights.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-wide text-neutral-400 mb-4">Insights</h2>
          <div className="space-y-4">
            {weaknesses.aiInsights.map((insight, idx) => (
              <div key={idx} className="border-l-2 border-neutral-200 pl-4">
                <p className="text-sm">{insight.insight}</p>
                {insight.suggestedAction && (
                  <p className="text-xs text-neutral-400 mt-1">{insight.suggestedAction}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Concept Mastery */}
      {concepts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-wide text-neutral-400 mb-4">Concept Mastery</h2>
          <div className="space-y-3">
            {concepts.map((concept, idx) => (
              <div key={idx} className="flex items-center">
                <span className="text-sm flex-1">{formatConceptName(concept.concept)}</span>
                <div className="w-24 h-1 bg-neutral-100 mx-4">
                  <div
                    className="h-full bg-black"
                    style={{ width: `${concept.masteryScore}%` }}
                  />
                </div>
                <span className="text-sm text-neutral-400 w-12 text-right">{concept.masteryScore}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Areas to Focus */}
      {weaknesses && weaknesses.weakConcepts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-wide text-neutral-400 mb-4">Areas to Focus</h2>
          <div className="space-y-2">
            {weaknesses.weakConcepts.map((concept, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <span className="text-sm">{formatConceptName(concept.concept)}</span>
                <span className="text-sm text-neutral-400">{concept.masteryScore}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error Patterns */}
      {weaknesses && weaknesses.errorPatterns.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-wide text-neutral-400 mb-4">Recurring Patterns</h2>
          <div className="space-y-2">
            {weaknesses.errorPatterns.map((pattern, idx) => (
              <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <span className="text-sm text-neutral-600">{pattern.description}</span>
                <span className="text-xs text-neutral-400">{pattern.occurrences}x</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recommendations */}
      {report && report.recommendations.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-wide text-neutral-400 mb-4">Recommendations</h2>
          <div className="space-y-3">
            {report.recommendations.map((rec, idx) => (
              <div key={idx} className="border-l-2 border-neutral-200 pl-4 py-1">
                <p className="text-sm font-medium">{rec.area}</p>
                <p className="text-sm text-neutral-500">{rec.suggestion}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Achievements */}
      {report && report.achievements.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-wide text-neutral-400 mb-4">Achievements</h2>
          <div className="flex flex-wrap gap-2">
            {report.achievements.map((achievement, idx) => (
              <span key={idx} className="text-sm px-3 py-1 border border-neutral-200 rounded-full">
                {achievement.title}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* No data */}
      {!report && !weaknesses && concepts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-400 mb-6">
            No analytics data yet.
          </p>
          <Link href="/learn">
            <Button variant="outline" className="rounded-full px-6">Start Learning</Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-6 h-14 flex justify-between items-center">
          <Link href="/" className="text-lg font-medium tracking-tight">
            StudyMate
          </Link>
          <Link href="/dashboard" className="text-sm text-neutral-400 hover:text-black transition-colors">
            Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <Suspense fallback={<div className="text-center text-neutral-300">Loading...</div>}>
          <AnalyticsContent />
        </Suspense>
      </div>
    </main>
  )
}
