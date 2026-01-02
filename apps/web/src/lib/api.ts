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

export async function getAdminStats(): Promise<AdminStats> {
  return apiFetch('/admin/stats');
}

export async function getAdminUsers(): Promise<{ users: AdminUser[] }> {
  return apiFetch('/admin/users');
}

export async function getAdminChildren(): Promise<{ children: AdminChild[] }> {
  return apiFetch('/admin/children');
}

export async function getAdminAILogs(limit = 50): Promise<{ logs: AILog[] }> {
  return apiFetch(`/admin/ai-logs?limit=${limit}`);
}

export async function getAdminUsageByDay(): Promise<{ days: UsageByDay[] }> {
  return apiFetch('/admin/usage-by-day');
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
