import { getToken } from './auth';

const API_BASE = 'https://yhn9tli08d.execute-api.ap-southeast-2.amazonaws.com';

/**
 * AUTHENTICATION MODEL - READ BEFORE MODIFYING
 *
 * This app has TWO session types:
 *
 * 1. PARENT SESSIONS (Cognito auth)
 *    - Use apiFetch() which adds Bearer token
 *    - For: getChildren, createChild, updateChild, deleteChild, getProgress, getBadges, getStreak
 *
 * 2. CHILD SESSIONS (No auth - localStorage only)
 *    - Use direct fetch() WITHOUT auth headers
 *    - For: childLogin, startBenchmark, submitBenchmarkAnswer, saveSectionQuiz,
 *           getSectionQuizzes, getAIExplanation, chatWithAI
 *
 * CRITICAL: Never use apiFetch() for child endpoints - children don't have Cognito tokens!
 */

// API fetch wrapper - ONLY for parent-authenticated endpoints
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============ CHILDREN API ============

export interface Child {
  id: string;
  name: string;
  yearLevel: number;
  avatar: string;
  parentId: string;
  createdAt?: string;
}

export async function getChildren(): Promise<{ children: Child[] }> {
  return apiFetch('/children');
}

export async function createChild(data: {
  name: string;
  yearLevel: number;
  pin: string;
  avatar?: string;
}): Promise<Child> {
  return apiFetch('/children', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateChild(
  childId: string,
  data: Partial<{ name: string; yearLevel: number; pin: string; avatar: string }>
): Promise<{ message: string }> {
  return apiFetch(`/children/${childId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteChild(childId: string): Promise<{ message: string }> {
  return apiFetch(`/children/${childId}`, {
    method: 'DELETE',
  });
}

// ============ QUESTIONS API ============

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic?: string;
  difficulty?: number;
}

export interface NextQuestionResponse {
  question: Question;
  currentLevel: number;
}

export async function getNextQuestion(
  childId: string,
  subject: string
): Promise<NextQuestionResponse> {
  return apiFetch(`/questions/next?childId=${childId}&subject=${subject}`);
}

export interface AnswerResponse {
  correct: boolean;
  correctAnswer: number;
  explanation: string;
  xpEarned: number;
  newLevel: number;
  levelChanged: boolean;
}

export async function submitAnswer(
  questionId: string,
  data: {
    childId: string;
    subject: string;
    answer: number;
    timeTaken?: number;
    questionData?: {
      question: string;
      options: string[];
      correctAnswer: number;
      explanation: string;
      topic?: string;
      curriculumArea?: string;
      difficulty?: number;
    };
  }
): Promise<AnswerResponse> {
  return apiFetch(`/questions/${questionId}/answer`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============ BENCHMARK API ============

export interface BenchmarkQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: number;
}

export interface BenchmarkStartResponse {
  benchmarkId: string;
  totalQuestions: number;
  currentQuestion: number;
  question: BenchmarkQuestion;
}

export async function startBenchmark(
  childId: string,
  subject: string
): Promise<BenchmarkStartResponse> {
  return apiFetch('/benchmark/start', {
    method: 'POST',
    body: JSON.stringify({ childId, subject }),
  });
}

export interface BenchmarkNextResponse {
  currentQuestion: number;
  totalQuestions: number;
  question?: BenchmarkQuestion;
  completed?: boolean;
  finalLevel?: number;
}

export async function getBenchmarkQuestion(
  sessionId: string
): Promise<BenchmarkNextResponse> {
  return apiFetch(`/benchmark/${sessionId}/next`);
}

export interface BenchmarkAnswerResponse {
  correct: boolean;
  correctAnswer: number;
  explanation: string;
  currentQuestion: number;
  totalQuestions: number;
  completed: boolean;
  finalLevel?: number;
  nextQuestion?: BenchmarkQuestion;
}

export async function submitBenchmarkAnswer(
  sessionId: string,
  data: { answer: number; questionId?: string }
): Promise<BenchmarkAnswerResponse> {
  return apiFetch(`/benchmark/${sessionId}/answer`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// ============ PROGRESS API ============

export interface SubjectProgress {
  subject: string;
  level: number;
  xp: number;
  streak: number;
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  weakTopics: string[];
  lastActive: string;
  benchmarkCompleted: boolean;
}

export async function getProgress(
  childId: string
): Promise<{ progress: SubjectProgress[] }> {
  return apiFetch(`/progress/${childId}`);
}

export interface DetailedStats {
  totalXp: number;
  totalQuestions: number;
  overallAccuracy: number;
  currentStreak: number;
  weeklyActivity: number;
  badgesEarned: number;
  subjectStats: Array<{
    subject: string;
    level: number;
    xp: number;
    accuracy: number;
    questionsThisWeek: number;
    improvement: number;
  }>;
  recentSessions: Array<{
    date: string;
    subject: string;
    questionsAnswered: number;
    correctAnswers: number;
    xpEarned: number;
  }>;
}

export async function getDetailedStats(childId: string): Promise<DetailedStats> {
  return apiFetch(`/progress/${childId}/stats`);
}

// ============ SECTION QUIZ API ============

export interface QuizAnswer {
  questionIndex: number;
  questionText: string;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  options: string[];
}

export interface SectionQuizResult {
  sectionId: string;
  sectionTitle: string;
  chapterTitle: string;
  strandName: string;
  completed: boolean;
  score: number;
  totalQuestions: number;
  lastAttempt: string;
  answers: QuizAnswer[];
}

export async function saveSectionQuiz(
  childId: string,
  data: SectionQuizResult
): Promise<{ message: string }> {
  // No auth token needed for child sessions
  const response = await fetch(`${API_BASE}/progress/${childId}/quiz`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to save quiz' }));
    throw new Error(error.error || error.message || 'Failed to save quiz');
  }

  return response.json();
}

export async function getSectionQuizzes(
  childId: string
): Promise<{ quizzes: Record<string, SectionQuizResult> }> {
  // No auth token needed for child sessions
  const response = await fetch(`${API_BASE}/progress/${childId}/quizzes`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Failed to load quizzes' }));
    throw new Error(error.error || error.message || 'Failed to load quizzes');
  }

  return response.json();
}

// ============ AI API ============

export async function getAIExplanation(data: {
  childId: string;
  questionId: string;
  question: string;
  options?: string[];
  userAnswer: number;
  correctAnswer: number;
  subject?: string;
  yearLevel?: number;
  topic?: string;
}): Promise<{ explanation: string }> {
  // No auth token needed for child sessions
  const response = await fetch(`${API_BASE}/ai/explain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Explanation failed' }));
    throw new Error(error.error || error.message || 'Failed to get explanation');
  }

  return response.json();
}

export async function chatWithAI(data: {
  childId: string;
  message: string;
  subject?: string;
  yearLevel?: number;
  context?: string;
}): Promise<{ response: string }> {
  // No auth token needed for child sessions
  const response = await fetch(`${API_BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Chat failed' }));
    throw new Error(error.error || error.message || 'Chat failed');
  }

  return response.json();
}

// ============ GAMIFICATION API ============

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  xpBonus: number;
  earned: boolean;
  earnedAt?: string;
}

export async function getBadges(
  childId: string
): Promise<{ earned: number; total: number; badges: Badge[] }> {
  return apiFetch(`/gamification/${childId}/badges`);
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActive: string | null;
  streakActive: boolean;
  daysUntilBadge: { badge: string; daysNeeded: number } | null;
}

export async function getStreak(childId: string): Promise<StreakInfo> {
  return apiFetch(`/gamification/${childId}/streak`);
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  xp: number;
  level: number;
  badges: number;
}

export async function getLeaderboard(): Promise<{ leaderboard: LeaderboardEntry[] }> {
  return apiFetch('/gamification/leaderboard');
}

// ============ CHILD LOGIN API ============

export interface ChildLoginResponse {
  id: string;
  name: string;
  username?: string;
  yearLevel: number;
  avatar: string;
  parentId: string;
}

export interface ChildLoginRequest {
  childId?: string;
  username?: string;
  pin: string;
}

export async function childLogin(data: ChildLoginRequest): Promise<ChildLoginResponse> {
  // This endpoint doesn't require auth token
  const response = await fetch(`${API_BASE}/children/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Login failed' }));
    throw new Error(error.error || error.message || 'Invalid PIN');
  }

  return response.json();
}

// ============ ADMIN API ============

export interface AdminStats {
  totalUsers: number;
  totalChildren: number;
  aiCallsToday: number;
  totalAiCalls: number;
  quizzesCompleted: number;
  timestamp: string;
}

export interface AdminUser {
  id: string;
  email?: string;
  tier: string;
  aiCallsToday: number;
  createdAt?: string;
}

export interface AdminChild {
  id: string;
  name: string;
  username?: string;
  yearLevel: number;
  parentId: string;
  createdAt?: string;
}

export interface AILog {
  id: string;
  childId: string;
  requestType: string;
  requestTimestamp: string;
  latencyMs: number;
  tokensUsed?: number;
  subject?: string;
  yearLevel?: number;
}

export interface UsageByDay {
  date: string;
  count: number;
}

// Admin fetch wrapper - uses X-Admin-Key header (decoupled from parent auth)
async function adminFetch<T>(path: string): Promise<T> {
  const adminKey = typeof window !== 'undefined' ? localStorage.getItem('adminKey') : null;

  if (!adminKey) {
    throw new Error('Admin authentication required');
  }

  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': adminKey,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('Invalid admin key');
    }
    throw new Error(`Admin API error: ${response.status}`);
  }

  return response.json();
}

export function setAdminKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminKey', key);
  }
}

export function getAdminKey(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('adminKey');
  }
  return null;
}

export function clearAdminKey(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminKey');
  }
}

export async function getAdminStats(): Promise<AdminStats> {
  return adminFetch('/admin/stats');
}

export async function getAdminUsers(): Promise<{ users: AdminUser[] }> {
  return adminFetch('/admin/users');
}

export async function getAdminChildren(): Promise<{ children: AdminChild[] }> {
  return adminFetch('/admin/children');
}

export async function getAdminAILogs(limit = 50): Promise<{ logs: AILog[] }> {
  return adminFetch(`/admin/ai-logs?limit=${limit}`);
}

export async function getAdminUsageByDay(): Promise<{ days: UsageByDay[] }> {
  return adminFetch('/admin/usage-by-day');
}

export interface AdminPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  customerId: string;
  customerEmail: string | null;
  description: string | null;
  created: string;
  invoiceId: string | null;
  receiptUrl: string | null;
}

export interface AdminSubscription {
  id: string;
  status: string;
  customerId: string;
  customerEmail: string | null;
  plan: string;
  amount: number;
  currency: string;
  interval: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  created: string;
}

export interface PaymentSummary {
  totalRevenue: number;
  totalPayments: number;
  successfulPayments: number;
  activeSubscriptions: number;
  canceledSubscriptions: number;
  totalCustomers: number;
}

export interface AdminPaymentsData {
  payments: AdminPayment[];
  subscriptions: AdminSubscription[];
  summary: PaymentSummary;
  error?: string;
}

export async function getAdminPayments(): Promise<AdminPaymentsData> {
  return adminFetch('/admin/payments');
}

// ============ PAYMENT API ============

export interface TierLimits {
  maxChildren: number;
  dailyQuestions: number;
  dailyAiCalls: number;
}

export interface SubscriptionStatus {
  tier: 'free' | 'scholar' | 'achiever';
  subscriptionId: string | null;
  limits: TierLimits;
}

export async function createCheckoutSession(plan: 'scholar' | 'achiever'): Promise<{ sessionId: string; url: string }> {
  return apiFetch('/payments/create-checkout', {
    method: 'POST',
    body: JSON.stringify({ plan }),
  });
}

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  return apiFetch('/payments/status');
}

export async function getCustomerPortalUrl(): Promise<{ url: string }> {
  return apiFetch('/payments/portal');
}

// ============ CURRICULUM API ============

export interface CurriculumSectionSummary {
  id: string;
  code: string;
  strandId: string;
  chapterId: string;
  title: string;
  description: string;
  questionCount: number;
}

export interface CurriculumSectionFull extends CurriculumSectionSummary {
  content: string;
  keyPoints: string[];
  examples: Array<{
    problem: string;
    solution: string;
    explanation: string;
  }>;
}

export interface CurriculumQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 1 | 2 | 3;
  topic?: string;
}

export interface ChildMastery {
  sectionId: string;
  questionsAttempted: number;
  questionsCorrect: number;
  currentLevel: 1 | 2 | 3;
  masteryScore: number;
  lastAttemptAt?: string;
}

export interface AdaptiveQuestionResponse {
  question?: CurriculumQuestion;
  selectedDifficulty: number;
  reason: 'mastery_based' | 'default' | 'random';
  exhausted?: boolean;
  message?: string;
  totalQuestions?: number;
}

// Get all sections for a year level
export async function getCurriculumSections(
  yearLevel: number
): Promise<{ yearLevel: number; sections: CurriculumSectionSummary[] }> {
  const response = await fetch(`${API_BASE}/curriculum/${yearLevel}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load curriculum');
  }

  return response.json();
}

// Get section content (full details including content, keyPoints, examples)
export async function getCurriculumSection(
  yearLevel: number,
  sectionId: string
): Promise<{ section: CurriculumSectionFull }> {
  const response = await fetch(`${API_BASE}/curriculum/${yearLevel}/${sectionId}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load section');
  }

  return response.json();
}

// Get questions for a section
export async function getCurriculumQuestions(
  yearLevel: number,
  sectionId: string,
  childId?: string
): Promise<{ sectionId: string; questions: CurriculumQuestion[]; mastery: ChildMastery | null }> {
  const url = childId
    ? `${API_BASE}/curriculum/${yearLevel}/${sectionId}/questions?childId=${childId}`
    : `${API_BASE}/curriculum/${yearLevel}/${sectionId}/questions`;

  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load questions');
  }

  return response.json();
}

// Get adaptive question based on child's ability
export async function getAdaptiveQuestion(
  yearLevel: number,
  sectionId: string,
  childId: string,
  excludeIds: string[] = []
): Promise<AdaptiveQuestionResponse> {
  const excludeParam = excludeIds.length > 0 ? `&exclude=${excludeIds.join(',')}` : '';
  const response = await fetch(
    `${API_BASE}/curriculum/${yearLevel}/${sectionId}/adaptive?childId=${childId}${excludeParam}`,
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to get question');
  }

  return response.json();
}

// Record question attempt
export async function recordCurriculumAttempt(data: {
  childId: string;
  questionId: string;
  sectionId: string;
  selectedAnswer: number;
  correctAnswer: number;
  timeSpentSeconds: number;
  difficulty: number;
}): Promise<{ recorded: boolean; isCorrect: boolean }> {
  const response = await fetch(`${API_BASE}/curriculum/attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to record attempt');
  }

  return response.json();
}

// Get child's mastery across all sections
export async function getChildMastery(
  childId: string
): Promise<{ childId: string; mastery: ChildMastery[] }> {
  const response = await fetch(`${API_BASE}/curriculum/mastery/${childId}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load mastery data');
  }

  return response.json();
}

// ============ ANALYTICS API ============

export interface DetailedAttemptData {
  childId: string;
  questionId: string;
  sectionId: string;
  selectedAnswer: number;
  correctAnswer: number;
  timeSpentSeconds: number;
  difficulty: number;
  questionText: string;
  options: string[];
  explanation: string;
  sessionType?: 'quiz' | 'practice' | 'exam' | 'adaptive';
  aiExplanationRequested?: boolean;
}

export interface DetailedAttemptResponse {
  recorded: boolean;
  isCorrect: boolean;
  concepts: string[];
  errorPattern: string | null;
  attemptNumber: number;
}

export async function recordDetailedAttempt(
  data: DetailedAttemptData
): Promise<DetailedAttemptResponse> {
  const response = await fetch(`${API_BASE}/analytics/attempt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to record attempt');
  }

  return response.json();
}

export interface ConceptMasteryItem {
  concept: string;
  totalAttempts: number;
  correctAttempts: number;
  masteryScore: number;
  trend: 'improving' | 'stable' | 'declining';
  avgTimeSeconds: number;
  lastAttemptAt: string;
}

export async function getConceptMastery(
  childId: string
): Promise<{ childId: string; concepts: ConceptMasteryItem[] }> {
  const response = await fetch(`${API_BASE}/analytics/child/${childId}/concepts`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load concept mastery');
  }

  return response.json();
}

export interface WeaknessItem {
  concept: string;
  masteryScore: number;
  totalAttempts: number;
  trend: string;
  severity: 'critical' | 'moderate';
}

export interface ErrorPatternItem {
  pattern: string;
  description: string;
  occurrences: number;
  suggestedFocus: string;
  examples?: Array<{
    questionId: string;
    questionText: string;
    wrongAnswer: string;
    correctAnswer: string;
    timestamp: string;
  }>;
}

export interface AIInsight {
  type: 'misconception' | 'strength' | 'pattern' | 'recommendation';
  insight: string;
  confidence: 'high' | 'medium' | 'low';
  suggestedAction?: string;
}

export interface WeaknessesResponse {
  childId: string;
  weakConcepts: WeaknessItem[];
  errorPatterns: ErrorPatternItem[];
  insights: string[];
  aiInsights?: AIInsight[];
  summary: string;
}

export async function getChildWeaknesses(childId: string): Promise<WeaknessesResponse> {
  const response = await fetch(`${API_BASE}/analytics/child/${childId}/weaknesses`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load weaknesses');
  }

  return response.json();
}

export async function getChildErrorPatterns(
  childId: string
): Promise<{ childId: string; patterns: ErrorPatternItem[] }> {
  const response = await fetch(`${API_BASE}/analytics/child/${childId}/patterns`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load error patterns');
  }

  return response.json();
}

export interface DailyStatItem {
  date: string;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracy: number;
  timeSpentMinutes: number;
  longestStreak: number;
  sectionBreakdown?: Record<string, { attempted: number; correct: number }>;
  conceptBreakdown?: Record<string, { attempted: number; correct: number }>;
}

export interface DailyStatsResponse {
  childId: string;
  period: string;
  stats: DailyStatItem[];
  totals: {
    totalQuestions: number;
    totalCorrect: number;
    totalMinutes: number;
    daysActive: number;
    overallAccuracy: number;
  };
}

export async function getDailyStats(
  childId: string,
  days: number = 7
): Promise<DailyStatsResponse> {
  const response = await fetch(`${API_BASE}/analytics/child/${childId}/daily?days=${days}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load daily stats');
  }

  return response.json();
}

export interface ConceptAnalysis {
  concept: string;
  conceptName: string;
  status: 'mastered' | 'progressing' | 'needs-practice' | 'struggling';
  accuracy: number;
  trend: string;
  suggestedActivities?: string[];
}

export interface ParentReportResponse {
  childId: string;
  childName: string;
  reportPeriod: {
    start: string;
    end: string;
  };
  summary: {
    overallProgress: 'excellent' | 'good' | 'needs-attention' | 'struggling';
    headline: string;
    keyInsights: string[];
  };
  conceptAnalysis: ConceptAnalysis[];
  learningPatterns: {
    averageSessionLength: number;
    preferredDifficulty: number;
    respondsWellToAI: boolean;
  };
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    area: string;
    issue: string;
    suggestion: string;
    estimatedTimeMinutes: number;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;
}

export async function getParentReport(
  childId: string,
  period: 'week' | 'month' = 'week'
): Promise<ParentReportResponse> {
  const response = await fetch(`${API_BASE}/analytics/child/${childId}/report?period=${period}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Failed to load parent report');
  }

  return response.json();
}
