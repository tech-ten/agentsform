'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  getAdminStats,
  getAdminUsers,
  getAdminChildren,
  getAdminAILogs,
  getAdminUsageByDay,
  getAdminPayments,
  getAdminKey,
  setAdminKey,
  clearAdminKey,
  type AdminStats,
  type AdminUser,
  type AdminChild,
  type AILog,
  type UsageByDay,
  type AdminPayment,
  type AdminSubscription,
  type PaymentSummary,
} from '@/lib/api'

type Tab = 'overview' | 'users' | 'children' | 'ai-logs' | 'payments'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKeyInput, setAdminKeyInput] = useState('')

  // Data states
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<AdminUser[]>([])
  const [children, setChildren] = useState<AdminChild[]>([])
  const [aiLogs, setAILogs] = useState<AILog[]>([])
  const [usageByDay, setUsageByDay] = useState<UsageByDay[]>([])
  const [payments, setPayments] = useState<AdminPayment[]>([])
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([])
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary | null>(null)

  useEffect(() => {
    // Check if we have an admin key stored
    const storedKey = getAdminKey()
    if (storedKey) {
      setIsAuthenticated(true)
      loadData()
    } else {
      setLoading(false)
    }
  }, [])

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [statsRes, usersRes, childrenRes, logsRes, usageRes, paymentsRes] = await Promise.all([
        getAdminStats(),
        getAdminUsers(),
        getAdminChildren(),
        getAdminAILogs(100),
        getAdminUsageByDay(),
        getAdminPayments(),
      ])

      setStats(statsRes)
      setUsers(usersRes.users)
      setChildren(childrenRes.children)
      setAILogs(logsRes.logs)
      setUsageByDay(usageRes.days)
      setPayments(paymentsRes.payments)
      setSubscriptions(paymentsRes.subscriptions)
      setPaymentSummary(paymentsRes.summary)
    } catch (err) {
      console.error('Failed to load admin data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load data. You may not have admin access.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setAdminKey(adminKeyInput)

    try {
      // Try to load data with the provided key
      await getAdminStats()
      setIsAuthenticated(true)
      loadData()
    } catch (err) {
      clearAdminKey()
      setError('Invalid admin key')
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearAdminKey()
    setIsAuthenticated(false)
    setStats(null)
    setUsers([])
    setChildren([])
    setAILogs([])
    setUsageByDay([])
    setPayments([])
    setSubscriptions([])
    setPaymentSummary(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-AU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const maxUsage = Math.max(...usageByDay.map(d => d.count), 1)

  // Admin login form
  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-md p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold mb-2">AgentsForm Admin</h1>
            <p className="text-neutral-500">Enter your admin key to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-4 border border-red-200 rounded-xl bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="adminKey" className="block text-sm font-medium mb-2">
                Admin Key
              </label>
              <input
                id="adminKey"
                type="password"
                value={adminKeyInput}
                onChange={(e) => setAdminKeyInput(e.target.value)}
                className="w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Enter admin key..."
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-full"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm text-neutral-500 hover:text-black">
              ← Back to StudyMate
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-14 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">AgentsForm</span>
            <span className="text-sm text-neutral-400">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="text-sm text-neutral-500 hover:text-black transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-8 p-4 border border-red-200 rounded-xl bg-red-50 text-red-700 text-sm">
            {error}
            <button
              className="ml-2 underline"
              onClick={() => { setError(null); loadData(); }}
            >
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="text-neutral-400">Loading admin data...</div>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-2 mb-8 border-b border-neutral-200 pb-4 overflow-x-auto">
              {(['overview', 'users', 'children', 'ai-logs', 'payments'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'bg-black text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'users' && `Users (${users.length})`}
                  {tab === 'children' && `Children (${children.length})`}
                  {tab === 'ai-logs' && `AI Logs (${aiLogs.length})`}
                  {tab === 'payments' && `Payments (${payments.length})`}
                </button>
              ))}
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-6 border border-neutral-200 rounded-2xl">
                    <div className="text-sm text-neutral-500 mb-1">Total Users</div>
                    <div className="text-3xl font-semibold">{stats.totalUsers}</div>
                  </div>
                  <div className="p-6 border border-neutral-200 rounded-2xl">
                    <div className="text-sm text-neutral-500 mb-1">Total Children</div>
                    <div className="text-3xl font-semibold">{stats.totalChildren}</div>
                  </div>
                  <div className="p-6 border border-neutral-200 rounded-2xl">
                    <div className="text-sm text-neutral-500 mb-1">AI Calls Today</div>
                    <div className="text-3xl font-semibold">{stats.aiCallsToday}</div>
                  </div>
                  <div className="p-6 border border-neutral-200 rounded-2xl">
                    <div className="text-sm text-neutral-500 mb-1">Total AI Calls</div>
                    <div className="text-3xl font-semibold">{stats.totalAiCalls}</div>
                  </div>
                  <div className="p-6 border border-neutral-200 rounded-2xl">
                    <div className="text-sm text-neutral-500 mb-1">Quizzes Done</div>
                    <div className="text-3xl font-semibold">{stats.quizzesCompleted}</div>
                  </div>
                </div>

                {/* Usage Chart */}
                <div className="p-6 border border-neutral-200 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-6">AI Usage (Last 7 Days)</h3>
                  <div className="flex items-end gap-2 h-40">
                    {usageByDay.map((day) => (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                        <div className="text-xs text-neutral-500">{day.count}</div>
                        <div
                          className="w-full bg-black rounded-t"
                          style={{
                            height: `${(day.count / maxUsage) * 100}%`,
                            minHeight: day.count > 0 ? '4px' : '0',
                          }}
                        />
                        <div className="text-xs text-neutral-400">
                          {new Date(day.date).toLocaleDateString('en-AU', { weekday: 'short' })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="p-6 border border-neutral-200 rounded-2xl">
                  <h3 className="text-lg font-semibold mb-4">Recent AI Activity</h3>
                  <div className="space-y-2">
                    {aiLogs.slice(0, 10).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            log.requestType === 'chat'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {log.requestType}
                          </span>
                          <span className="text-sm text-neutral-600">
                            Year {log.yearLevel} {log.subject}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-400">
                          <span>{log.latencyMs}ms</span>
                          <span>{formatDate(log.requestTimestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">User ID</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Email</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Tier</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">AI Today</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-t border-neutral-100">
                        <td className="px-4 py-3 text-sm font-mono text-neutral-600">
                          {user.id.substring(0, 8)}...
                        </td>
                        <td className="px-4 py-3 text-sm">{user.email || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            user.tier === 'premium'
                              ? 'bg-purple-100 text-purple-700'
                              : user.tier === 'essential'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-neutral-100 text-neutral-600'
                          }`}>
                            {user.tier}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{user.aiCallsToday}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Children Tab */}
            {activeTab === 'children' && (
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Name</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Username</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Year</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Parent ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {children.map((child) => (
                      <tr key={child.id} className="border-t border-neutral-100">
                        <td className="px-4 py-3 text-sm font-medium">{child.name}</td>
                        <td className="px-4 py-3 text-sm text-neutral-600">{child.username || '-'}</td>
                        <td className="px-4 py-3 text-sm">Year {child.yearLevel}</td>
                        <td className="px-4 py-3 text-sm font-mono text-neutral-400">
                          {child.parentId.substring(0, 8)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* AI Logs Tab */}
            {activeTab === 'ai-logs' && (
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Type</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Subject</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Year</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Latency</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Tokens</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {aiLogs.map((log) => (
                      <tr key={log.id} className="border-t border-neutral-100">
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            log.requestType === 'chat'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {log.requestType}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{log.subject || '-'}</td>
                        <td className="px-4 py-3 text-sm">{log.yearLevel || '-'}</td>
                        <td className="px-4 py-3 text-sm text-neutral-600">{log.latencyMs}ms</td>
                        <td className="px-4 py-3 text-sm text-neutral-600">{log.tokensUsed || '-'}</td>
                        <td className="px-4 py-3 text-sm text-neutral-400">
                          {formatDate(log.requestTimestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-8">
                {/* Payment Summary */}
                {paymentSummary && (
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <div className="p-6 border border-neutral-200 rounded-2xl">
                      <div className="text-sm text-neutral-500 mb-1">Total Revenue</div>
                      <div className="text-2xl font-semibold text-green-600">
                        ${paymentSummary.totalRevenue.toFixed(2)}
                      </div>
                    </div>
                    <div className="p-6 border border-neutral-200 rounded-2xl">
                      <div className="text-sm text-neutral-500 mb-1">Payments</div>
                      <div className="text-2xl font-semibold">{paymentSummary.successfulPayments}</div>
                    </div>
                    <div className="p-6 border border-neutral-200 rounded-2xl">
                      <div className="text-sm text-neutral-500 mb-1">Active Subs</div>
                      <div className="text-2xl font-semibold text-blue-600">{paymentSummary.activeSubscriptions}</div>
                    </div>
                    <div className="p-6 border border-neutral-200 rounded-2xl">
                      <div className="text-sm text-neutral-500 mb-1">Canceled</div>
                      <div className="text-2xl font-semibold text-neutral-400">{paymentSummary.canceledSubscriptions}</div>
                    </div>
                    <div className="p-6 border border-neutral-200 rounded-2xl">
                      <div className="text-sm text-neutral-500 mb-1">Customers</div>
                      <div className="text-2xl font-semibold">{paymentSummary.totalCustomers}</div>
                    </div>
                    <div className="p-6 border border-neutral-200 rounded-2xl">
                      <div className="text-sm text-neutral-500 mb-1">Stripe Dashboard</div>
                      <a
                        href="https://dashboard.stripe.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Open Stripe →
                      </a>
                    </div>
                  </div>
                )}

                {/* Subscriptions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Active Subscriptions</h3>
                  <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Customer</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Plan</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Amount</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Status</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Period End</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                              No subscriptions yet
                            </td>
                          </tr>
                        ) : (
                          subscriptions.map((sub) => (
                            <tr key={sub.id} className="border-t border-neutral-100">
                              <td className="px-4 py-3 text-sm">
                                {sub.customerEmail || sub.customerId.substring(0, 12)}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">{sub.plan}</td>
                              <td className="px-4 py-3 text-sm">
                                ${sub.amount}/{sub.interval}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  sub.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : sub.status === 'canceled'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {sub.status}
                                  {sub.cancelAtPeriodEnd && ' (canceling)'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-neutral-400">
                                {formatDate(sub.currentPeriodEnd)}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Payments */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                  <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Customer</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Amount</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Status</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Date</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Receipt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-neutral-400">
                              No payments yet
                            </td>
                          </tr>
                        ) : (
                          payments.map((payment) => (
                            <tr key={payment.id} className="border-t border-neutral-100">
                              <td className="px-4 py-3 text-sm">
                                {payment.customerEmail || payment.customerId?.substring(0, 12) || '-'}
                              </td>
                              <td className="px-4 py-3 text-sm font-medium">
                                ${payment.amount.toFixed(2)} {payment.currency}
                              </td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-0.5 text-xs rounded-full ${
                                  payment.status === 'succeeded'
                                    ? 'bg-green-100 text-green-700'
                                    : payment.status === 'failed'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {payment.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-neutral-400">
                                {formatDate(payment.created)}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {payment.receiptUrl ? (
                                  <a
                                    href={payment.receiptUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                  >
                                    View
                                  </a>
                                ) : (
                                  '-'
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Free Users Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">All Users by Tier</h3>
                  <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Email</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Tier</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">AI Calls Today</th>
                          <th className="text-left px-4 py-3 text-sm font-medium text-neutral-600">Billing</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-t border-neutral-100">
                            <td className="px-4 py-3 text-sm">{user.email || '-'}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${
                                user.tier === 'achiever'
                                  ? 'bg-purple-100 text-purple-700'
                                  : user.tier === 'scholar'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}>
                                {user.tier || 'free'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">{user.aiCallsToday}</td>
                            <td className="px-4 py-3 text-sm text-neutral-400">
                              {user.tier === 'free' || !user.tier ? '$0.00' : 'See subscription'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Refresh Button */}
            <div className="mt-8 flex justify-center">
              <Button
                onClick={loadData}
                variant="outline"
                className="rounded-full"
              >
                Refresh Data
              </Button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
