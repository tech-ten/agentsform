import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLE_NAME } from '../lib/db';
import { success, badRequest, notFound, serverError } from '../lib/response';
import {
  analyticsKeys,
  detectQuestionConcepts,
  detectErrorPattern,
  type DetailedAttempt,
  type ConceptMastery,
  type ChildQuestionHistory,
  type ErrorPattern,
  type DailyStats,
  type WeeklySummary,
  type ParentReport,
} from '../lib/analytics-schema';

// ============ HANDLER ============

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const path = event.rawPath;
    const method = event.requestContext.http.method;

    // POST /analytics/attempt - Record detailed attempt
    if (path === '/analytics/attempt' && method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      return await recordDetailedAttempt(body);
    }

    // GET /analytics/child/:childId/concepts - Get concept mastery breakdown
    if (path.match(/^\/analytics\/child\/[\w-]+\/concepts$/) && method === 'GET') {
      const childId = path.split('/')[3];
      return await getConceptMastery(childId);
    }

    // GET /analytics/child/:childId/weaknesses - Get specific weaknesses
    if (path.match(/^\/analytics\/child\/[\w-]+\/weaknesses$/) && method === 'GET') {
      const childId = path.split('/')[3];
      return await getWeaknesses(childId);
    }

    // GET /analytics/child/:childId/patterns - Get error patterns
    if (path.match(/^\/analytics\/child\/[\w-]+\/patterns$/) && method === 'GET') {
      const childId = path.split('/')[3];
      return await getErrorPatterns(childId);
    }

    // GET /analytics/child/:childId/report - Full parent report
    if (path.match(/^\/analytics\/child\/[\w-]+\/report$/) && method === 'GET') {
      const childId = path.split('/')[3];
      const period = event.queryStringParameters?.period || 'week';
      return await generateParentReport(childId, period);
    }

    // GET /analytics/child/:childId/daily - Get daily stats
    if (path.match(/^\/analytics\/child\/[\w-]+\/daily$/) && method === 'GET') {
      const childId = path.split('/')[3];
      const days = parseInt(event.queryStringParameters?.days || '7');
      return await getDailyStats(childId, days);
    }

    // GET /analytics/child/:childId/question/:questionId - Question history for child
    if (path.match(/^\/analytics\/child\/[\w-]+\/question\/[\w-]+$/) && method === 'GET') {
      const parts = path.split('/');
      const childId = parts[3];
      const questionId = parts[5];
      return await getQuestionHistory(childId, questionId);
    }

    // GET /analytics/question/:questionId - Global question analytics
    if (path.match(/^\/analytics\/question\/[\w-]+$/) && method === 'GET') {
      const questionId = path.split('/')[3];
      return await getQuestionAnalytics(questionId);
    }

    // GET /analytics/child/:childId/tokens - Get knowledge token mastery
    if (path.match(/^\/analytics\/child\/[\w-]+\/tokens$/) && method === 'GET') {
      const childId = path.split('/')[3];
      return await getKnowledgeTokenMastery(childId);
    }

    // GET /analytics/child/:childId/insights - Get AI-generated insights
    if (path.match(/^\/analytics\/child\/[\w-]+\/insights$/) && method === 'GET') {
      const childId = path.split('/')[3];
      return await getAIInsights(childId);
    }

    return badRequest('Invalid analytics endpoint');
  } catch (error) {
    console.error('Analytics handler error:', error);
    return serverError();
  }
}

// ============ RECORD ATTEMPT WITH FULL ANALYTICS ============

/**
 * Knowledge tokens for a question - passed from frontend with curriculum data
 */
interface QuestionKnowledge {
  questionTokens: string[];
  correctToken: string;
  incorrectTokens: (string | null)[];
}

async function recordDetailedAttempt(body: {
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
  knowledge?: QuestionKnowledge;  // NEW: Knowledge token data from curriculum
}): Promise<APIGatewayProxyResultV2> {
  const {
    childId, questionId, sectionId, selectedAnswer, correctAnswer,
    timeSpentSeconds, difficulty, questionText, options, explanation,
    sessionType = 'quiz', aiExplanationRequested = false, knowledge
  } = body;

  if (!childId || !questionId || !sectionId || selectedAnswer === undefined) {
    return badRequest('Missing required fields');
  }

  const isCorrect = selectedAnswer === correctAnswer;
  const timestamp = new Date().toISOString();
  const dateKey = timestamp.split('T')[0];

  // Detect concepts for this question (fallback if no knowledge tokens)
  const concepts = detectQuestionConcepts({ id: questionId, question: questionText, options, sectionId });

  // Detect error pattern if wrong
  let errorPatternType: string | null = null;
  if (!isCorrect) {
    errorPatternType = detectErrorPattern(questionText, options, selectedAnswer, correctAnswer);
  }

  // Get attempt number for this question
  const historyResult = await db.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: analyticsKeys.childQuestionHistory(childId, questionId),
  }));
  const attemptNumber = (historyResult.Item?.totalAttempts || 0) + 1;

  // Extract knowledge token info
  let knowledgeTokenUsed: string | null = null;
  let confusionToken: string | null = null;

  if (knowledge) {
    if (isCorrect) {
      knowledgeTokenUsed = knowledge.correctToken;
    } else {
      // Track what misconception was indicated by the wrong answer
      confusionToken = knowledge.incorrectTokens[selectedAnswer] || null;
      // Still track against the correct token for mastery purposes
      knowledgeTokenUsed = knowledge.correctToken;
    }
  }

  // 1. Record detailed attempt (with knowledge token data)
  const attempt: DetailedAttempt = {
    ...analyticsKeys.attempt(childId, timestamp),
    type: 'ATTEMPT',
    childId,
    questionId,
    sectionId,
    selectedAnswer,
    correctAnswer,
    isCorrect,
    questionText,
    options,
    explanation,
    difficulty: difficulty as 1 | 2 | 3,
    concepts,
    timeSpentSeconds,
    attemptNumber,
    sessionType,
    aiExplanationRequested,
    createdAt: timestamp,
  };

  // Add knowledge token info to attempt if available
  if (knowledge) {
    (attempt as any).knowledgeToken = knowledgeTokenUsed;
    (attempt as any).confusionToken = confusionToken;
    (attempt as any).questionTokens = knowledge.questionTokens;
  }

  await db.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: attempt,
  }));

  // 2. Update question history for this child
  await updateQuestionHistory(childId, questionId, selectedAnswer, isCorrect, timeSpentSeconds, timestamp);

  // 3. Update concept mastery for each concept
  for (const concept of concepts) {
    await updateConceptMastery(childId, concept, isCorrect, timeSpentSeconds, timestamp);
  }

  // 4. Update daily stats
  await updateDailyStats(childId, dateKey, sectionId, concepts, isCorrect, timeSpentSeconds, aiExplanationRequested);

  // 5. Record error pattern if detected
  if (errorPatternType && !isCorrect) {
    await recordErrorPattern(childId, errorPatternType, questionId, questionText, options[selectedAnswer], options[correctAnswer], timestamp);
  }

  // 6. Update global question analytics
  await updateQuestionAnalytics(questionId, sectionId, selectedAnswer, correctAnswer, isCorrect, timeSpentSeconds, difficulty);

  // 7. NEW: Update knowledge token mastery if knowledge data provided
  if (knowledge && knowledgeTokenUsed) {
    await updateKnowledgeTokenMastery(
      childId,
      sectionId,
      knowledgeTokenUsed,
      isCorrect,
      confusionToken,
      timeSpentSeconds,
      timestamp
    );
  }

  return success({
    recorded: true,
    isCorrect,
    concepts,
    errorPattern: errorPatternType,
    attemptNumber,
    knowledgeToken: knowledgeTokenUsed,
    confusionToken,
  });
}

// ============ UPDATE HELPERS ============

async function updateQuestionHistory(
  childId: string,
  questionId: string,
  selectedAnswer: number,
  isCorrect: boolean,
  timeSeconds: number,
  timestamp: string
): Promise<void> {
  const key = analyticsKeys.childQuestionHistory(childId, questionId);
  const result = await db.send(new GetCommand({ TableName: TABLE_NAME, Key: key }));

  const existing = result.Item as ChildQuestionHistory | undefined;
  const attempts = existing?.attempts || [];

  // Add new attempt
  attempts.push({ timestamp, selectedAnswer, isCorrect, timeSeconds });

  // Check if mastered (2+ consecutive correct)
  const recentAttempts = attempts.slice(-3);
  const consecutiveCorrect = recentAttempts.filter(a => a.isCorrect).length;
  const mastered = consecutiveCorrect >= 2 && recentAttempts[recentAttempts.length - 1]?.isCorrect;

  await db.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      ...key,
      type: 'QUESTION_HISTORY',
      childId,
      questionId,
      attempts: attempts.slice(-10), // Keep last 10 attempts
      totalAttempts: (existing?.totalAttempts || 0) + 1,
      correctAttempts: (existing?.correctAttempts || 0) + (isCorrect ? 1 : 0),
      lastAttemptAt: timestamp,
      mastered,
    },
  }));
}

async function updateConceptMastery(
  childId: string,
  concept: string,
  isCorrect: boolean,
  timeSeconds: number,
  timestamp: string
): Promise<void> {
  const key = analyticsKeys.conceptMastery(childId, concept);
  const result = await db.send(new GetCommand({ TableName: TABLE_NAME, Key: key }));

  const existing = result.Item as ConceptMastery | undefined;
  const totalAttempts = (existing?.totalAttempts || 0) + 1;
  const correctAttempts = (existing?.correctAttempts || 0) + (isCorrect ? 1 : 0);
  const masteryScore = Math.round((correctAttempts / totalAttempts) * 100);

  // Track recent performance for trend
  const recentAttempts = Math.min((existing?.recentAttempts || 0) + 1, 10);
  let recentCorrect = existing?.recentCorrect || 0;
  if (recentAttempts <= 10) {
    recentCorrect += isCorrect ? 1 : 0;
  } else {
    // Rolling window - approximate
    recentCorrect = Math.round((recentCorrect * 9 + (isCorrect ? 1 : 0)) / 10 * 10);
  }

  // Calculate trend
  const previousScore = existing?.masteryScore || 50;
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (masteryScore > previousScore + 5) trend = 'improving';
  if (masteryScore < previousScore - 5) trend = 'declining';

  // Calculate average time
  const avgTime = existing?.avgTimeSeconds
    ? Math.round((existing.avgTimeSeconds * (totalAttempts - 1) + timeSeconds) / totalAttempts)
    : timeSeconds;

  await db.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      ...key,
      type: 'CONCEPT_MASTERY',
      childId,
      concept,
      totalAttempts,
      correctAttempts,
      masteryScore,
      recentAttempts,
      recentCorrect,
      trend,
      avgTimeSeconds: avgTime,
      lastAttemptAt: timestamp,
      firstAttemptAt: existing?.firstAttemptAt || timestamp,
    },
  }));
}

/**
 * Update knowledge token mastery - tracks granular skill performance
 * e.g., "acute-angle-identification" within the "Angles" section
 */
async function updateKnowledgeTokenMastery(
  childId: string,
  sectionId: string,
  tokenId: string,
  isCorrect: boolean,
  confusionToken: string | null,
  timeSeconds: number,
  timestamp: string
): Promise<void> {
  const key = analyticsKeys.knowledgeToken(childId, tokenId);
  const result = await db.send(new GetCommand({ TableName: TABLE_NAME, Key: key }));

  const existing = result.Item as any;
  const totalAttempts = (existing?.totalAttempts || 0) + 1;
  const correctAttempts = (existing?.correctAttempts || 0) + (isCorrect ? 1 : 0);
  const masteryScore = Math.round((correctAttempts / totalAttempts) * 100);

  // Track confusion patterns (what misconceptions are shown)
  const confusionPatterns = existing?.confusionPatterns || {};
  if (confusionToken && !isCorrect) {
    confusionPatterns[confusionToken] = (confusionPatterns[confusionToken] || 0) + 1;
  }

  // Track recent performance for trend (last 5 attempts)
  const recentAttempts = Math.min((existing?.recentAttempts || 0) + 1, 5);
  let recentCorrect = existing?.recentCorrect || 0;
  if (totalAttempts <= 5) {
    recentCorrect += isCorrect ? 1 : 0;
  } else {
    // Rolling window approximation
    recentCorrect = Math.round((recentCorrect * 4 + (isCorrect ? 1 : 0)) / 5 * 5);
  }

  // Calculate trend
  const previousScore = existing?.masteryScore || 50;
  let trend: 'improving' | 'stable' | 'declining' = 'stable';
  if (masteryScore > previousScore + 10) trend = 'improving';
  if (masteryScore < previousScore - 10) trend = 'declining';

  // Calculate average time
  const avgTime = existing?.avgTimeSeconds
    ? Math.round((existing.avgTimeSeconds * (totalAttempts - 1) + timeSeconds) / totalAttempts)
    : timeSeconds;

  await db.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      ...key,
      type: 'TOKEN_MASTERY',
      childId,
      tokenId,
      sectionId,
      totalAttempts,
      correctAttempts,
      masteryScore,
      confusionPatterns,
      recentAttempts,
      recentCorrect,
      trend,
      avgTimeSeconds: avgTime,
      lastAttemptAt: timestamp,
      firstAttemptAt: existing?.firstAttemptAt || timestamp,
    },
  }));
}

async function updateDailyStats(
  childId: string,
  date: string,
  sectionId: string,
  concepts: string[],
  isCorrect: boolean,
  timeSeconds: number,
  aiRequested: boolean
): Promise<void> {
  const key = analyticsKeys.dailyStats(childId, date);
  const result = await db.send(new GetCommand({ TableName: TABLE_NAME, Key: key }));

  const existing = result.Item as DailyStats | undefined;

  const sectionBreakdown = existing?.sectionBreakdown || {};
  if (!sectionBreakdown[sectionId]) {
    sectionBreakdown[sectionId] = { attempted: 0, correct: 0 };
  }
  sectionBreakdown[sectionId].attempted++;
  if (isCorrect) sectionBreakdown[sectionId].correct++;

  const conceptBreakdown = existing?.conceptBreakdown || {};
  for (const concept of concepts) {
    if (!conceptBreakdown[concept]) {
      conceptBreakdown[concept] = { attempted: 0, correct: 0 };
    }
    conceptBreakdown[concept].attempted++;
    if (isCorrect) conceptBreakdown[concept].correct++;
  }

  // Calculate streak
  let correctStreak = existing?.correctStreak || 0;
  if (isCorrect) {
    correctStreak++;
  } else {
    correctStreak = 0;
  }
  const longestStreak = Math.max(existing?.longestStreak || 0, correctStreak);

  await db.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      ...key,
      type: 'DAILY_STATS',
      childId,
      date,
      questionsAttempted: (existing?.questionsAttempted || 0) + 1,
      questionsCorrect: (existing?.questionsCorrect || 0) + (isCorrect ? 1 : 0),
      timeSpentMinutes: Math.round(((existing?.timeSpentMinutes || 0) * 60 + timeSeconds) / 60),
      sectionBreakdown,
      conceptBreakdown,
      correctStreak,
      longestStreak,
      aiExplanationsRequested: (existing?.aiExplanationsRequested || 0) + (aiRequested ? 1 : 0),
    },
  }));
}

async function recordErrorPattern(
  childId: string,
  patternType: string,
  questionId: string,
  questionText: string,
  wrongAnswer: string,
  correctAnswer: string,
  timestamp: string
): Promise<void> {
  const key = analyticsKeys.errorPattern(childId, patternType);
  const result = await db.send(new GetCommand({ TableName: TABLE_NAME, Key: key }));

  const existing = result.Item as ErrorPattern | undefined;
  const examples = existing?.examples || [];

  // Add new example (keep last 5)
  examples.push({ questionId, questionText, wrongAnswer, correctAnswer, timestamp });
  if (examples.length > 5) examples.shift();

  // Generate description based on pattern type
  const descriptions: Record<string, string> = {
    'place-value-magnitude-confusion': 'Confusing the magnitude of place values (e.g., mixing up tens and hundreds)',
    'rounding-up-when-should-round-down': 'Rounding up when the digit is less than 5',
    'rounding-down-when-should-round-up': 'Rounding down when the digit is 5 or greater',
    'number-ordering-confusion': 'Difficulty ordering numbers from smallest to largest',
    'arithmetic-computation-error': 'Making calculation errors when adding or subtracting',
  };

  const suggestedFocus: Record<string, string> = {
    'place-value-magnitude-confusion': 'Practice identifying place values using a place value chart',
    'rounding-up-when-should-round-down': 'Review the rounding rule: round up if digit is 5 or more',
    'rounding-down-when-should-round-up': 'Review the rounding rule: round up if digit is 5 or more',
    'number-ordering-confusion': 'Practice comparing numbers digit by digit from left to right',
    'arithmetic-computation-error': 'Practice mental math strategies and double-check calculations',
  };

  await db.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      ...key,
      type: 'ERROR_PATTERN',
      childId,
      patternType,
      description: descriptions[patternType] || `Error pattern: ${patternType}`,
      occurrences: (existing?.occurrences || 0) + 1,
      examples,
      suggestedFocus: suggestedFocus[patternType] || 'Review this concept',
      lastOccurrence: timestamp,
      firstOccurrence: existing?.firstOccurrence || timestamp,
    },
  }));
}

async function updateQuestionAnalytics(
  questionId: string,
  sectionId: string,
  selectedAnswer: number,
  correctAnswer: number,
  isCorrect: boolean,
  timeSeconds: number,
  difficulty: number
): Promise<void> {
  const key = analyticsKeys.questionAnalytics(questionId);
  const result = await db.send(new GetCommand({ TableName: TABLE_NAME, Key: key }));

  const existing = result.Item;
  const totalAttempts = (existing?.totalAttempts || 0) + 1;
  const totalCorrect = (existing?.totalCorrect || 0) + (isCorrect ? 1 : 0);
  const successRate = Math.round((totalCorrect / totalAttempts) * 100);

  // Update answer distribution
  const answerDistribution = existing?.answerDistribution || [0, 0, 0, 0];
  if (selectedAnswer >= 0 && selectedAnswer < 4) {
    answerDistribution[selectedAnswer]++;
  }

  // Find most common wrong answer
  let mostCommonWrongAnswer = 0;
  let maxWrongCount = 0;
  for (let i = 0; i < answerDistribution.length; i++) {
    if (i !== correctAnswer && answerDistribution[i] > maxWrongCount) {
      maxWrongCount = answerDistribution[i];
      mostCommonWrongAnswer = i;
    }
  }

  // Calculate actual difficulty from success rate
  let actualDifficulty = 2;
  if (successRate >= 80) actualDifficulty = 1;
  else if (successRate <= 40) actualDifficulty = 3;

  // Calculate average time
  const avgTime = existing?.avgTimeSeconds
    ? Math.round((existing.avgTimeSeconds * (totalAttempts - 1) + timeSeconds) / totalAttempts)
    : timeSeconds;

  await db.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      ...key,
      type: 'QUESTION_ANALYTICS',
      questionId,
      sectionId,
      totalAttempts,
      totalCorrect,
      successRate,
      avgTimeSeconds: avgTime,
      answerDistribution,
      mostCommonWrongAnswer,
      actualDifficulty,
      designedDifficulty: difficulty,
      lastUpdated: new Date().toISOString(),
    },
  }));
}

// ============ READ ENDPOINTS ============

async function getConceptMastery(childId: string): Promise<APIGatewayProxyResultV2> {
  // Get both concept mastery and knowledge token data
  const [conceptResult, tokenResult] = await Promise.all([
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CHILD#${childId}`,
        ':sk': 'CONCEPT#',
      },
    })),
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CHILD#${childId}`,
        ':sk': 'TOKEN#',
      },
    })),
  ]);

  const concepts = (conceptResult.Items || []).map(item => ({
    concept: item.concept,
    conceptName: formatConceptName(item.concept),
    totalAttempts: item.totalAttempts,
    correctAttempts: item.correctAttempts,
    masteryScore: item.masteryScore,
    trend: item.trend,
    avgTimeSeconds: item.avgTimeSeconds,
    lastAttemptAt: item.lastAttemptAt,
  }));

  // Sort by mastery score (lowest first = needs most attention)
  concepts.sort((a, b) => a.masteryScore - b.masteryScore);

  // Process knowledge tokens for granular insights
  const tokenInsights = processKnowledgeTokens(tokenResult.Items || []);

  return success({
    childId,
    concepts,
    knowledgeTokens: tokenInsights,
  });
}

async function getWeaknesses(childId: string): Promise<APIGatewayProxyResultV2> {
  // Get concept mastery, error patterns, knowledge tokens, and recent attempts in parallel
  const [conceptResult, errorResult, tokenResult, attemptResult] = await Promise.all([
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CHILD#${childId}`,
        ':sk': 'CONCEPT#',
      },
    })),
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CHILD#${childId}`,
        ':sk': 'ERROR#',
      },
    })),
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CHILD#${childId}`,
        ':sk': 'TOKEN#',
      },
    })),
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CHILD#${childId}`,
        ':sk': 'ATTEMPT#',
      },
      ScanIndexForward: false,
      Limit: 50,
    })),
  ]);

  const tokens = tokenResult.Items || [];
  const errors = errorResult.Items || [];
  const attempts = attemptResult.Items || [];

  // Identify weak concepts (below 60% mastery)
  const weakConcepts = (conceptResult.Items || [])
    .filter(item => item.masteryScore < 60)
    .map(item => ({
      concept: item.concept,
      conceptName: formatConceptName(item.concept),
      masteryScore: item.masteryScore,
      totalAttempts: item.totalAttempts,
      trend: item.trend,
      severity: item.masteryScore < 40 ? 'critical' : 'moderate',
    }))
    .sort((a, b) => a.masteryScore - b.masteryScore);

  // Get recurring error patterns
  const errorPatterns = (errors)
    .filter(item => item.occurrences >= 2)
    .map(item => ({
      pattern: item.patternType,
      description: item.description,
      occurrences: item.occurrences,
      suggestedFocus: item.suggestedFocus,
      examples: item.examples?.slice(-2), // Last 2 examples
    }))
    .sort((a, b) => b.occurrences - a.occurrences);

  // Process knowledge tokens for granular skill-level insights
  const tokenInsights = processKnowledgeTokens(tokens);
  const strugglingTokens = tokenInsights.filter(t => t.status === 'struggling' || t.status === 'needs-practice');

  // Generate AI insights
  const aiInsights = generateAIInsights(attempts, tokens, errors);

  // Generate actionable insights (combine traditional + AI)
  const insights: string[] = [];
  if (weakConcepts.length > 0) {
    const worstConcept = weakConcepts[0];
    insights.push(`Struggling most with "${worstConcept.conceptName}" - only ${worstConcept.masteryScore}% correct`);
  }
  if (errorPatterns.length > 0) {
    insights.push(`Common mistake: ${errorPatterns[0].description}`);
  }
  // Add AI-generated insights
  for (const insight of aiInsights.filter(i => i.type === 'misconception').slice(0, 2)) {
    insights.push(insight.insight);
  }

  return success({
    childId,
    weakConcepts,
    errorPatterns,
    // NEW: Granular skill-level weaknesses from knowledge tokens
    strugglingSkills: strugglingTokens,
    // NEW: AI-generated insights
    aiInsights,
    insights,
    summary: generateWeaknessSummary(weakConcepts, errorPatterns),
  });
}

async function getErrorPatterns(childId: string): Promise<APIGatewayProxyResultV2> {
  const result = await db.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `CHILD#${childId}`,
      ':sk': 'ERROR#',
    },
  }));

  const patterns = (result.Items || []).map(item => ({
    pattern: item.patternType,
    description: item.description,
    occurrences: item.occurrences,
    suggestedFocus: item.suggestedFocus,
    examples: item.examples,
    lastOccurrence: item.lastOccurrence,
  }));

  return success({ childId, patterns });
}

async function getDailyStats(childId: string, days: number): Promise<APIGatewayProxyResultV2> {
  // Get last N days
  const stats: any[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];

    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: analyticsKeys.dailyStats(childId, dateKey),
    }));

    if (result.Item) {
      stats.push({
        date: dateKey,
        questionsAttempted: result.Item.questionsAttempted,
        questionsCorrect: result.Item.questionsCorrect,
        accuracy: result.Item.questionsAttempted > 0
          ? Math.round((result.Item.questionsCorrect / result.Item.questionsAttempted) * 100)
          : 0,
        timeSpentMinutes: result.Item.timeSpentMinutes,
        longestStreak: result.Item.longestStreak,
        sectionBreakdown: result.Item.sectionBreakdown,
        conceptBreakdown: result.Item.conceptBreakdown,
      });
    } else {
      stats.push({
        date: dateKey,
        questionsAttempted: 0,
        questionsCorrect: 0,
        accuracy: 0,
        timeSpentMinutes: 0,
        longestStreak: 0,
      });
    }
  }

  // Calculate totals
  const totals = stats.reduce((acc, day) => ({
    totalQuestions: acc.totalQuestions + day.questionsAttempted,
    totalCorrect: acc.totalCorrect + day.questionsCorrect,
    totalMinutes: acc.totalMinutes + day.timeSpentMinutes,
    daysActive: acc.daysActive + (day.questionsAttempted > 0 ? 1 : 0),
  }), { totalQuestions: 0, totalCorrect: 0, totalMinutes: 0, daysActive: 0 });

  return success({
    childId,
    period: `${days} days`,
    stats: stats.reverse(), // Oldest first
    totals: {
      ...totals,
      overallAccuracy: totals.totalQuestions > 0
        ? Math.round((totals.totalCorrect / totals.totalQuestions) * 100)
        : 0,
    },
  });
}

async function getQuestionHistory(childId: string, questionId: string): Promise<APIGatewayProxyResultV2> {
  const result = await db.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: analyticsKeys.childQuestionHistory(childId, questionId),
  }));

  if (!result.Item) {
    return success({ childId, questionId, attempts: [], totalAttempts: 0, mastered: false });
  }

  return success({
    childId,
    questionId,
    attempts: result.Item.attempts,
    totalAttempts: result.Item.totalAttempts,
    correctAttempts: result.Item.correctAttempts,
    mastered: result.Item.mastered,
    lastAttemptAt: result.Item.lastAttemptAt,
  });
}

async function getQuestionAnalytics(questionId: string): Promise<APIGatewayProxyResultV2> {
  const result = await db.send(new GetCommand({
    TableName: TABLE_NAME,
    Key: analyticsKeys.questionAnalytics(questionId),
  }));

  if (!result.Item) {
    return notFound('No analytics for this question');
  }

  return success({
    questionId,
    totalAttempts: result.Item.totalAttempts,
    successRate: result.Item.successRate,
    avgTimeSeconds: result.Item.avgTimeSeconds,
    answerDistribution: result.Item.answerDistribution,
    mostCommonWrongAnswer: result.Item.mostCommonWrongAnswer,
    actualDifficulty: result.Item.actualDifficulty,
    designedDifficulty: result.Item.designedDifficulty,
  });
}

/**
 * Get knowledge token mastery data for a child
 * Returns granular skill-level performance and confusion patterns
 */
async function getKnowledgeTokenMastery(childId: string): Promise<APIGatewayProxyResultV2> {
  const result = await db.send(new QueryCommand({
    TableName: TABLE_NAME,
    KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
    ExpressionAttributeValues: {
      ':pk': `CHILD#${childId}`,
      ':sk': 'TOKEN#',
    },
  }));

  const tokens = processKnowledgeTokens(result.Items || []);

  // Group by section for easier display
  const bySection: Record<string, typeof tokens> = {};
  for (const token of tokens) {
    const section = token.sectionId || 'unknown';
    if (!bySection[section]) {
      bySection[section] = [];
    }
    bySection[section].push(token);
  }

  // Calculate overall stats
  const totalTokens = tokens.length;
  const masteredTokens = tokens.filter(t => t.status === 'mastered').length;
  const strugglingTokens = tokens.filter(t => t.status === 'struggling').length;

  return success({
    childId,
    tokens,
    bySection,
    summary: {
      totalTokens,
      masteredTokens,
      strugglingTokens,
      overallMastery: totalTokens > 0
        ? Math.round((masteredTokens / totalTokens) * 100)
        : 0,
    },
  });
}

/**
 * Get AI-generated insights for a child
 * Analyzes all available data to produce actionable insights
 */
async function getAIInsights(childId: string): Promise<APIGatewayProxyResultV2> {
  // Get all relevant data for analysis
  const [tokenResult, errorResult, attemptResult] = await Promise.all([
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CHILD#${childId}`,
        ':sk': 'TOKEN#',
      },
    })),
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CHILD#${childId}`,
        ':sk': 'ERROR#',
      },
    })),
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `CHILD#${childId}`,
        ':sk': 'ATTEMPT#',
      },
      ScanIndexForward: false,
      Limit: 100, // More attempts for better analysis
    })),
  ]);

  const tokens = tokenResult.Items || [];
  const errors = errorResult.Items || [];
  const attempts = attemptResult.Items || [];

  // Generate comprehensive AI insights
  const insights = generateAIInsights(attempts, tokens, errors);

  // Categorise insights
  const misconceptions = insights.filter(i => i.type === 'misconception');
  const strengths = insights.filter(i => i.type === 'strength');
  const patterns = insights.filter(i => i.type === 'pattern');

  return success({
    childId,
    insights,
    categorised: {
      misconceptions,
      strengths,
      patterns,
    },
    summary: {
      totalInsights: insights.length,
      highConfidence: insights.filter(i => i.confidence === 'high').length,
      actionableItems: insights.filter(i => i.suggestedAction).length,
    },
  });
}

async function generateParentReport(childId: string, period: string): Promise<APIGatewayProxyResultV2> {
  // Get all relevant data including knowledge token mastery
  const [conceptResult, errorResult, dailyResult, tokenResult, attemptResult] = await Promise.all([
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `CHILD#${childId}`, ':sk': 'CONCEPT#' },
    })),
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `CHILD#${childId}`, ':sk': 'ERROR#' },
    })),
    getDailyStatsForReport(childId, period === 'month' ? 30 : 7),
    // Get knowledge token mastery data
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `CHILD#${childId}`, ':sk': 'TOKEN#' },
    })),
    // Get recent attempts for AI analysis
    db.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: { ':pk': `CHILD#${childId}`, ':sk': 'ATTEMPT#' },
      ScanIndexForward: false, // Most recent first
      Limit: 50,
    })),
  ]);

  const concepts = conceptResult.Items || [];
  const errors = errorResult.Items || [];
  const tokens = tokenResult.Items || [];
  const recentAttempts = attemptResult.Items || [];

  // Process knowledge token data for granular insights
  const tokenInsights = processKnowledgeTokens(tokens);

  // Generate AI insights from recent attempts
  const aiInsights = generateAIInsights(recentAttempts, tokens, errors);

  // Calculate overall metrics
  const totalAttempts = concepts.reduce((sum, c) => sum + (c.totalAttempts || 0), 0);
  const totalCorrect = concepts.reduce((sum, c) => sum + (c.correctAttempts || 0), 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  // Determine overall progress status
  let overallProgress: 'excellent' | 'good' | 'needs-attention' | 'struggling' = 'good';
  if (overallAccuracy >= 85) overallProgress = 'excellent';
  else if (overallAccuracy >= 70) overallProgress = 'good';
  else if (overallAccuracy >= 50) overallProgress = 'needs-attention';
  else overallProgress = 'struggling';

  // Identify strong and weak concepts
  const sortedConcepts = concepts
    .map(c => ({
      concept: c.concept,
      conceptName: formatConceptName(c.concept),
      masteryScore: c.masteryScore,
      trend: c.trend,
      totalAttempts: c.totalAttempts,
    }))
    .sort((a, b) => b.masteryScore - a.masteryScore);

  const strongConcepts = sortedConcepts.filter(c => c.masteryScore >= 70);
  const weakConcepts = sortedConcepts.filter(c => c.masteryScore < 60);

  // Generate concept analysis
  const conceptAnalysis = sortedConcepts.map(c => {
    let status: 'mastered' | 'progressing' | 'needs-practice' | 'struggling' = 'progressing';
    if (c.masteryScore >= 85) status = 'mastered';
    else if (c.masteryScore >= 70) status = 'progressing';
    else if (c.masteryScore >= 50) status = 'needs-practice';
    else status = 'struggling';

    return {
      concept: c.concept,
      conceptName: c.conceptName,
      status,
      accuracy: c.masteryScore,
      trend: c.trend,
      suggestedActivities: status === 'struggling' || status === 'needs-practice'
        ? getSuggestedActivities(c.concept)
        : undefined,
    };
  });

  // Generate recommendations
  const recommendations = generateRecommendations(weakConcepts, errors);

  // Generate parent-friendly headline
  let headline = '';
  if (strongConcepts.length > 0 && weakConcepts.length > 0) {
    headline = `Doing well with ${strongConcepts[0].conceptName} but needs support with ${weakConcepts[0].conceptName}`;
  } else if (strongConcepts.length > 0) {
    headline = `Excellent progress! Strong understanding across all concepts`;
  } else if (weakConcepts.length > 0) {
    headline = `Some areas need attention - focused practice recommended`;
  } else {
    headline = `Making steady progress in their learning journey`;
  }

  // Build AI-generated insights for the key insights array
  const keyInsights: string[] = [
    `Attempted ${totalAttempts} questions with ${overallAccuracy}% accuracy`,
  ];

  // Add strong concepts insight
  if (strongConcepts.length > 0) {
    keyInsights.push(`Strongest in: ${strongConcepts.slice(0, 2).map(c => c.conceptName).join(', ')}`);
  }

  // Add weak concepts insight
  if (weakConcepts.length > 0) {
    keyInsights.push(`Needs practice: ${weakConcepts.slice(0, 2).map(c => c.conceptName).join(', ')}`);
  }

  // Add AI-generated insights
  for (const insight of aiInsights.slice(0, 3)) {
    keyInsights.push(insight.insight);
  }

  // Build report
  const report = {
    childId,
    childName: '', // Would be populated from child profile
    reportPeriod: {
      start: new Date(Date.now() - (period === 'month' ? 30 : 7) * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    },
    summary: {
      overallProgress,
      headline,
      keyInsights: keyInsights.filter(Boolean),
    },
    conceptAnalysis,
    // NEW: Knowledge token breakdown for granular skill insights
    knowledgeTokenAnalysis: tokenInsights,
    // NEW: AI-generated insights based on pattern analysis
    aiInsights,
    learningPatterns: {
      averageSessionLength: dailyResult.avgSessionMinutes || 0,
      preferredDifficulty: 2,
      respondsWellToAI: true,
    },
    recommendations,
    achievements: generateAchievements(concepts, dailyResult),
  } as ParentReport & {
    knowledgeTokenAnalysis: typeof tokenInsights;
    aiInsights: typeof aiInsights;
  };

  return success(report);
}

// ============ HELPER FUNCTIONS ============

function formatConceptName(concept: string): string {
  const names: Record<string, string> = {
    // Detected concepts from question analysis
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
    // Victorian Curriculum section codes (Year 5)
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
    // Year 4 codes
    'vcmna153': 'Place Value to Ten Thousands',
    'vcmna155': 'Addition and Subtraction Strategies',
    'vcmna156': 'Multiplication Facts',
    // Year 6 codes
    'vcmna209': 'Integers and the Number Line',
    'vcmna210': 'Prime and Composite Numbers',
    // Geometry concepts
    'angle-types': 'Types of Angles',
    'angle-measurement': 'Measuring Angles',
    'shape-properties': 'Shape Properties',
    'symmetry': 'Symmetry',
    '2d-shapes': '2D Shapes',
    '3d-shapes': '3D Shapes',
  };

  // Try lowercase match first (for case-insensitive lookup)
  const lowerConcept = concept.toLowerCase();
  if (names[lowerConcept]) {
    return names[lowerConcept];
  }

  // Then try exact match
  if (names[concept]) {
    return names[concept];
  }

  // Fallback: convert kebab-case or code to title case
  return concept.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function generateWeaknessSummary(weakConcepts: any[], errorPatterns: any[]): string {
  if (weakConcepts.length === 0 && errorPatterns.length === 0) {
    return 'No significant weaknesses detected. Keep up the great work!';
  }

  const parts: string[] = [];
  if (weakConcepts.length > 0) {
    parts.push(`Focus needed on ${weakConcepts.length} concept(s), especially "${formatConceptName(weakConcepts[0].concept)}"`);
  }
  if (errorPatterns.length > 0) {
    parts.push(`Recurring error pattern: ${errorPatterns[0].description}`);
  }

  return parts.join('. ');
}

function getSuggestedActivities(concept: string): string[] {
  const activities: Record<string, string[]> = {
    'place-value-identification': [
      'Use a place value chart to practice identifying digit values',
      'Play "What\'s My Value?" game with number cards',
    ],
    'rounding': [
      'Practice the "5 or more, round up" rule with number lines',
      'Use estimation in real-life shopping scenarios',
    ],
    'number-ordering': [
      'Sort number cards from smallest to largest',
      'Compare digits from left to right systematically',
    ],
  };
  return activities[concept] || ['Practice with additional questions in this area'];
}

function generateRecommendations(weakConcepts: any[], errors: any[]): ParentReport['recommendations'] {
  const recommendations: ParentReport['recommendations'] = [];

  // Add recommendations for weak concepts
  for (const concept of weakConcepts.slice(0, 3)) {
    recommendations.push({
      priority: concept.masteryScore < 40 ? 'high' : 'medium',
      area: formatConceptName(concept.concept),
      issue: `Currently at ${concept.masteryScore}% accuracy`,
      suggestion: `Spend 10-15 minutes daily practicing ${formatConceptName(concept.concept).toLowerCase()} questions`,
      estimatedTimeMinutes: 15,
    });
  }

  // Add recommendations for error patterns
  for (const error of errors.slice(0, 2)) {
    recommendations.push({
      priority: error.occurrences >= 5 ? 'high' : 'medium',
      area: 'Error Pattern',
      issue: error.description,
      suggestion: error.suggestedFocus,
      estimatedTimeMinutes: 10,
    });
  }

  return recommendations;
}

function generateAchievements(concepts: any[], dailyResult: any): ParentReport['achievements'] {
  const achievements: ParentReport['achievements'] = [];

  // Check for mastered concepts
  const mastered = concepts.filter(c => c.masteryScore >= 90);
  if (mastered.length > 0) {
    achievements.push({
      title: 'Concept Master',
      description: `Mastered ${mastered.length} concept(s) with 90%+ accuracy`,
      date: new Date().toISOString(),
    });
  }

  // Check for improving trends
  const improving = concepts.filter(c => c.trend === 'improving');
  if (improving.length > 0) {
    achievements.push({
      title: 'On the Rise',
      description: `Showing improvement in ${improving.length} area(s)`,
      date: new Date().toISOString(),
    });
  }

  return achievements;
}

async function getDailyStatsForReport(childId: string, days: number): Promise<any> {
  let totalMinutes = 0;
  let daysActive = 0;

  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateKey = date.toISOString().split('T')[0];

    const result = await db.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: analyticsKeys.dailyStats(childId, dateKey),
    }));

    if (result.Item && result.Item.questionsAttempted > 0) {
      totalMinutes += result.Item.timeSpentMinutes || 0;
      daysActive++;
    }
  }

  return {
    avgSessionMinutes: daysActive > 0 ? Math.round(totalMinutes / daysActive) : 0,
    daysActive,
  };
}

// ============ KNOWLEDGE TOKEN PROCESSING ============

interface TokenInsight {
  tokenId: string;
  tokenName: string;
  sectionId: string;
  masteryScore: number;
  totalAttempts: number;
  trend: 'improving' | 'stable' | 'declining';
  confusionPatterns: { pattern: string; count: number; description: string }[];
  status: 'mastered' | 'progressing' | 'needs-practice' | 'struggling';
}

/**
 * Process knowledge token mastery data into structured insights
 */
function processKnowledgeTokens(tokens: any[]): TokenInsight[] {
  return tokens.map(token => {
    const masteryScore = token.masteryScore || 0;
    let status: TokenInsight['status'] = 'progressing';
    if (masteryScore >= 85) status = 'mastered';
    else if (masteryScore >= 70) status = 'progressing';
    else if (masteryScore >= 50) status = 'needs-practice';
    else status = 'struggling';

    // Process confusion patterns into readable format
    const confusionPatterns = Object.entries(token.confusionPatterns || {})
      .map(([pattern, count]) => ({
        pattern,
        count: count as number,
        description: formatConfusionPattern(pattern),
      }))
      .sort((a, b) => b.count - a.count);

    return {
      tokenId: token.tokenId,
      tokenName: formatTokenName(token.tokenId),
      sectionId: token.sectionId || '',
      masteryScore,
      totalAttempts: token.totalAttempts || 0,
      trend: token.trend || 'stable',
      confusionPatterns,
      status,
    };
  }).sort((a, b) => a.masteryScore - b.masteryScore); // Worst performing first
}

/**
 * Format a knowledge token ID into a human-readable name
 */
function formatTokenName(tokenId: string): string {
  const names: Record<string, string> = {
    // Angle-related tokens
    'acute-angle-identification': 'Identifying Acute Angles',
    'right-angle-identification': 'Identifying Right Angles',
    'obtuse-angle-identification': 'Identifying Obtuse Angles',
    'reflex-angle-identification': 'Identifying Reflex Angles',
    'straight-angle-identification': 'Identifying Straight Angles',
    'angle-addition': 'Adding Angles',
    'triangle-angle-sum': 'Triangle Angle Sum (180°)',
    // Confusion patterns
    'acute-right-confusion': 'Confuses Acute with Right Angles',
    'acute-obtuse-confusion': 'Confuses Acute with Obtuse Angles',
    'obtuse-right-confusion': 'Confuses Obtuse with Right Angles',
    'obtuse-reflex-confusion': 'Confuses Obtuse with Reflex Angles',
    'reflex-misunderstanding': 'Misunderstands Reflex Angles',
    'straight-angle-confusion': 'Confuses Straight Angles',
    // Place value tokens
    'place-value-ones': 'Ones Place Value',
    'place-value-tens': 'Tens Place Value',
    'place-value-hundreds': 'Hundreds Place Value',
    'place-value-thousands': 'Thousands Place Value',
    // Rounding tokens
    'rounding-nearest-10': 'Rounding to Nearest 10',
    'rounding-nearest-100': 'Rounding to Nearest 100',
    'rounding-nearest-1000': 'Rounding to Nearest 1000',
    // Fraction tokens
    'fraction-identification': 'Identifying Fractions',
    'numerator-understanding': 'Understanding Numerators',
    'denominator-understanding': 'Understanding Denominators',
    'equivalent-fractions': 'Finding Equivalent Fractions',
  };

  return names[tokenId] || tokenId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Format a confusion pattern into a parent-friendly description
 */
function formatConfusionPattern(pattern: string): string {
  const descriptions: Record<string, string> = {
    'acute-right-confusion': 'Thinks acute angles (less than 90°) are right angles (exactly 90°)',
    'acute-obtuse-confusion': 'Thinks acute angles are obtuse angles (greater than 90°)',
    'obtuse-right-confusion': 'Confuses obtuse angles with right angles',
    'obtuse-reflex-confusion': 'Confuses obtuse angles (90-180°) with reflex angles (>180°)',
    'reflex-misunderstanding': 'Doesn\'t recognise that reflex angles are greater than 180°',
    'straight-angle-confusion': 'Struggles to identify straight angles (180°)',
    'rounding-direction-error': 'Rounds in the wrong direction',
    'place-value-magnitude-confusion': 'Confuses the value of digits in different positions',
  };

  return descriptions[pattern] || pattern.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// ============ AI INSIGHT GENERATION ============

interface AIInsight {
  type: 'misconception' | 'strength' | 'pattern' | 'recommendation';
  insight: string;
  confidence: 'high' | 'medium' | 'low';
  relatedTokens?: string[];
  suggestedAction?: string;
}

/**
 * Generate AI-powered insights from learning data
 * This analyzes patterns in attempts and knowledge tokens to produce actionable insights
 */
function generateAIInsights(attempts: any[], tokens: any[], errors: any[]): AIInsight[] {
  const insights: AIInsight[] = [];

  // 1. Analyze confusion patterns from knowledge tokens
  const confusionCounts: Record<string, number> = {};
  for (const token of tokens) {
    if (token.confusionPatterns) {
      for (const [pattern, count] of Object.entries(token.confusionPatterns)) {
        confusionCounts[pattern] = (confusionCounts[pattern] || 0) + (count as number);
      }
    }
  }

  // Generate insights for significant confusion patterns
  const sortedConfusions = Object.entries(confusionCounts)
    .sort((a, b) => b[1] - a[1]);

  for (const [pattern, count] of sortedConfusions.slice(0, 3)) {
    if (count >= 2) {
      insights.push({
        type: 'misconception',
        insight: generateMisconceptionInsight(pattern, count),
        confidence: count >= 5 ? 'high' : count >= 3 ? 'medium' : 'low',
        relatedTokens: [pattern],
        suggestedAction: generateMisconceptionAction(pattern),
      });
    }
  }

  // 2. Identify struggling tokens
  const strugglingTokens = tokens.filter(t => t.masteryScore < 50 && t.totalAttempts >= 3);
  for (const token of strugglingTokens.slice(0, 2)) {
    insights.push({
      type: 'pattern',
      insight: `Consistently struggling with ${formatTokenName(token.tokenId)} (${token.masteryScore}% accuracy after ${token.totalAttempts} attempts)`,
      confidence: 'high',
      relatedTokens: [token.tokenId],
      suggestedAction: `Focus practice specifically on ${formatTokenName(token.tokenId).toLowerCase()} questions`,
    });
  }

  // 3. Identify mastered areas (strengths)
  const masteredTokens = tokens.filter(t => t.masteryScore >= 85 && t.totalAttempts >= 3);
  if (masteredTokens.length > 0) {
    const masteredNames = masteredTokens.slice(0, 3).map(t => formatTokenName(t.tokenId));
    insights.push({
      type: 'strength',
      insight: `Shows strong understanding of ${masteredNames.join(', ')}`,
      confidence: 'high',
      relatedTokens: masteredTokens.slice(0, 3).map(t => t.tokenId),
    });
  }

  // 4. Analyze recent attempt patterns
  const recentWrong = attempts.filter(a => !a.isCorrect).slice(0, 20);
  if (recentWrong.length >= 5) {
    // Look for time-based patterns
    const avgTimeWrong = recentWrong.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0) / recentWrong.length;
    const recentCorrect = attempts.filter(a => a.isCorrect).slice(0, 20);
    const avgTimeCorrect = recentCorrect.length > 0
      ? recentCorrect.reduce((sum, a) => sum + (a.timeSpentSeconds || 0), 0) / recentCorrect.length
      : avgTimeWrong;

    if (avgTimeWrong < avgTimeCorrect * 0.5) {
      insights.push({
        type: 'pattern',
        insight: 'Tends to answer too quickly on questions they get wrong - encourage taking more time to read carefully',
        confidence: 'medium',
        suggestedAction: 'Remind them to read the question twice before answering',
      });
    } else if (avgTimeWrong > avgTimeCorrect * 2) {
      insights.push({
        type: 'pattern',
        insight: 'Spends a long time on questions they get wrong - may indicate confusion rather than carelessness',
        confidence: 'medium',
        suggestedAction: 'Focus on building foundational understanding rather than more practice',
      });
    }
  }

  // 5. Check for improving trends
  const improvingTokens = tokens.filter(t => t.trend === 'improving');
  if (improvingTokens.length > 0) {
    insights.push({
      type: 'strength',
      insight: `Showing improvement in ${improvingTokens.length} area(s) including ${formatTokenName(improvingTokens[0].tokenId)}`,
      confidence: 'high',
      relatedTokens: improvingTokens.slice(0, 3).map(t => t.tokenId),
    });
  }

  // 6. Check for declining trends
  const decliningTokens = tokens.filter(t => t.trend === 'declining');
  if (decliningTokens.length > 0) {
    insights.push({
      type: 'pattern',
      insight: `Performance declining in ${formatTokenName(decliningTokens[0].tokenId)} - may need revision`,
      confidence: 'medium',
      relatedTokens: decliningTokens.slice(0, 2).map(t => t.tokenId),
      suggestedAction: 'Review the basics of this concept before attempting more questions',
    });
  }

  return insights;
}

/**
 * Generate a parent-friendly insight about a specific misconception
 */
function generateMisconceptionInsight(pattern: string, count: number): string {
  const insights: Record<string, string> = {
    'acute-right-confusion': `Your child often confuses acute angles with right angles. They may think any "small" angle is 90°. This happened ${count} times.`,
    'acute-obtuse-confusion': `Your child sometimes mixes up acute and obtuse angles. They're not yet confident with the 90° boundary. This happened ${count} times.`,
    'obtuse-reflex-confusion': `Your child confuses obtuse angles (90-180°) with reflex angles (over 180°). They may need help visualising angles over 180°.`,
    'reflex-misunderstanding': `Your child struggles to recognise reflex angles - the ones that go the "long way round" (over 180°).`,
    'rounding-direction-error': `Your child often rounds in the wrong direction. They may need to practise the "5 or more, round up" rule.`,
    'place-value-magnitude-confusion': `Your child confuses which digit is worth more in large numbers. A place value chart would help.`,
  };

  return insights[pattern] || `Recurring difficulty with ${formatConfusionPattern(pattern).toLowerCase()} (${count} occurrences)`;
}

/**
 * Generate actionable advice for addressing a specific misconception
 */
function generateMisconceptionAction(pattern: string): string {
  const actions: Record<string, string> = {
    'acute-right-confusion': 'Use a set square to show exactly 90°, then compare smaller angles to it',
    'acute-obtuse-confusion': 'Draw a right angle as the "dividing line" - acute is smaller, obtuse is bigger',
    'obtuse-reflex-confusion': 'Practise with a full turn (360°) and show how reflex angles are "more than halfway round"',
    'reflex-misunderstanding': 'Use a clock face to show angles - reflex angles go past 6 o\'clock',
    'rounding-direction-error': 'Create a number line and practise finding "which ten is closer?"',
    'place-value-magnitude-confusion': 'Use base-10 blocks or draw place value columns to show digit values',
  };

  return actions[pattern] || 'Practise with simpler examples and build up gradually';
}
