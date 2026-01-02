'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getChildren, getProgress, getSubscriptionStatus, type Child, type SubscriptionStatus } from '@/lib/api'
import { isAuthenticatedSync, setSelectedChild, signOut } from '@/lib/auth'

interface ChildProgress {
  subject: string
  level: number
  xp: number
  accuracy: number
  questionsThisWeek: number
  streak: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [selectedChild, setSelectedChildState] = useState<string>('')
  const [progressData, setProgressData] = useState<Record<string, ChildProgress[]>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null)

  useEffect(() => {
    if (!isAuthenticatedSync()) {
      router.push('/login')
      return
    }
    loadChildren()
    loadSubscription()
  }, [router])

  const loadSubscription = async () => {
    try {
      const status = await getSubscriptionStatus()
      setSubscription(status)
    } catch (err) {
      console.error('Failed to load subscription:', err)
    }
  }

  const loadChildren = async () => {
    try {
      const response = await getChildren()
      setChildren(response.children || [])
      if (response.children && response.children.length > 0) {
        const firstChild = response.children[0]
        setSelectedChildState(firstChild.id)
        setSelectedChild(firstChild.id)
        await loadProgress(firstChild.id)
      }
    } catch (err) {
      console.error('Failed to load children:', err)
      setError(err instanceof Error ? err.message : 'Failed to load children. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadProgress = async (childId: string) => {
    try {
      const response = await getProgress(childId)
      const subjects: ChildProgress[] = response.progress.map(p => ({
        subject: p.subject.charAt(0).toUpperCase() + p.subject.slice(1),
        level: p.level,
        xp: p.xp,
        accuracy: p.accuracy,
        questionsThisWeek: p.questionsAnswered,
        streak: p.streak,
      }))
      setProgressData(prev => ({ ...prev, [childId]: subjects }))
    } catch (err) {
      console.error('Failed to load progress:', err)
    }
  }

  const handleSelectChild = async (id: string) => {
    setSelectedChildState(id)
    setSelectedChild(id)
    if (!progressData[id]) {
      await loadProgress(id)
    }
  }

  const handleLogout = () => {
    signOut()
  }

  const selectedProgress = progressData[selectedChild] || []
  const selectedChildData = children.find(c => c.id === selectedChild)

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
          <Link href="/" className="text-lg font-semibold">
            StudyMate
          </Link>
          <div className="flex items-center gap-4">
            {subscription && subscription.tier === 'free' && (
              <Link href="/pricing">
                <Button size="sm" variant="outline" className="rounded-full border-amber-400 text-amber-600 hover:bg-amber-50">
                  Upgrade
                </Button>
              </Link>
            )}
            {subscription && subscription.tier !== 'free' && (
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full capitalize">
                {subscription.tier}
              </span>
            )}
            <Link href="/children/add">
              <Button size="sm" className="rounded-full">Add Child</Button>
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

      <div className="max-w-6xl mx-auto px-6 py-12">
        {error && (
          <div className="mb-8 p-4 border border-red-200 rounded-xl bg-red-50 text-red-700 text-sm">
            {error}
            <button
              className="ml-2 underline"
              onClick={() => { setError(null); loadChildren(); }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-neutral-400">Loading...</div>
          </div>
        ) : children.length === 0 && !error ? (
          <div className="text-center py-24">
            <h2 className="text-2xl font-semibold mb-2">No children added yet</h2>
            <p className="text-neutral-500 mb-8">Add your first child to get started with learning.</p>
            <Link href="/children/add">
              <Button className="rounded-full px-6">Add Your First Child</Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Child Selector */}
            <div className="mb-12">
              <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {children.map(child => (
                  <button
                    key={child.id}
                    onClick={() => handleSelectChild(child.id)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-full border transition-all ${
                      selectedChild === child.id
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <span className="text-xl">{child.avatar}</span>
                    <span className="font-medium">{child.name}</span>
                    <span className={`text-sm ${selectedChild === child.id ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      Y{child.yearLevel}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {selectedChildData && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                  <div className="p-6 border border-neutral-200 rounded-2xl">
                    <div className="text-sm text-neutral-500 mb-1">Streak</div>
                    <div className="text-3xl font-semibold">
                      {selectedProgress[0]?.streak || 0}
                      <span className="text-lg font-normal text-neutral-400 ml-1">days</span>
                    </div>
                  </div>
                  <div className="p-6 border border-neutral-200 rounded-2xl">
                    <div className="text-sm text-neutral-500 mb-1">Total XP</div>
                    <div className="text-3xl font-semibold">
                      {selectedProgress.reduce((sum, p) => sum + p.xp, 0).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6 border border-neutral-200 rounded-2xl">
                    <div className="text-sm text-neutral-500 mb-1">Accuracy</div>
                    <div className="text-3xl font-semibold">
                      {Math.round(selectedProgress.reduce((sum, p) => sum + p.accuracy, 0) / selectedProgress.length || 0)}%
                    </div>
                  </div>
                  <div className="p-6 border border-neutral-200 rounded-2xl">
                    <div className="text-sm text-neutral-500 mb-1">This Week</div>
                    <div className="text-3xl font-semibold">
                      {selectedProgress.reduce((sum, p) => sum + p.questionsThisWeek, 0)}
                      <span className="text-lg font-normal text-neutral-400 ml-1">questions</span>
                    </div>
                  </div>
                </div>

                {/* Subject Progress */}
                <div className="mb-12">
                  <h2 className="text-xl font-semibold mb-6">Subjects</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {selectedProgress.map(progress => (
                      <div key={progress.subject} className="p-6 border border-neutral-200 rounded-2xl">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h3 className="text-lg font-semibold">{progress.subject}</h3>
                            <p className="text-sm text-neutral-500">Level {progress.level}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-semibold">{progress.accuracy}%</div>
                            <p className="text-sm text-neutral-500">accuracy</p>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-neutral-500">Progress to next level</span>
                            <span>{progress.xp % 500} / 500 XP</span>
                          </div>
                          <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-black rounded-full transition-all"
                              style={{ width: `${(progress.xp % 500) / 5}%` }}
                            />
                          </div>
                        </div>
                        <p className="text-sm text-neutral-500">
                          {progress.questionsThisWeek} questions answered this week
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Start Learning CTA */}
                <div className="bg-black text-white rounded-2xl p-8 mb-12">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Ready to learn?</h3>
                      <p className="text-neutral-400">
                        Start a learning session for {selectedChildData.name}
                      </p>
                    </div>
                    <Link href={`/child-login?child=${selectedChild}`}>
                      <Button variant="secondary" className="rounded-full px-8">
                        Start Learning
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <h2 className="text-xl font-semibold mb-6">Actions</h2>
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/benchmark?subject=maths&child=${selectedChild}`}>
                      <Button variant="outline" className="rounded-full">
                        Retake Maths Benchmark
                      </Button>
                    </Link>
                    <Link href={`/benchmark?subject=english&child=${selectedChild}`}>
                      <Button variant="outline" className="rounded-full">
                        Retake English Benchmark
                      </Button>
                    </Link>
                    <Link href={`/children/edit?id=${selectedChild}`}>
                      <Button variant="outline" className="rounded-full">
                        Edit Profile
                      </Button>
                    </Link>
                    <Link href={`/progress?child=${selectedChild}`}>
                      <Button variant="outline" className="rounded-full">
                        Detailed Progress
                      </Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  )
}
