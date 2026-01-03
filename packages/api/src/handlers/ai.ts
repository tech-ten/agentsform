import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { db, TABLE_NAME, keys, getUserIdFromEvent, verifyChildOwnership } from '../lib/db';
import { success, badRequest, forbidden, serverError } from '../lib/response';
import Groq from 'groq-sdk';
import { createHash } from 'crypto';
import { v4 as uuid } from 'uuid';

const cloudwatch = new CloudWatchClient({ region: 'ap-southeast-2' });

// CloudWatch metrics helper
async function publishMetric(
  metricName: string,
  value: number,
  unit: 'Count' | 'Milliseconds' | 'None' = 'Count',
  dimensions: { Name: string; Value: string }[] = []
): Promise<void> {
  try {
    await cloudwatch.send(new PutMetricDataCommand({
      Namespace: 'StudyMate/AI',
      MetricData: [{
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Dimensions: dimensions,
        Timestamp: new Date(),
      }],
    }));
  } catch (err) {
    console.error('Failed to publish metric:', err);
  }
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// AI Interaction Log structure for future RAG enhancement
interface AIInteractionLog {
  id: string;
  childId: string;
  questionAttemptId?: string;
  requestType: 'explain' | 'hint' | 'chat';
  requestTimestamp: string;
  responseTimestamp: string;

  // Full prompts for RAG analysis
  systemPrompt: string;
  userPrompt: string;

  // Context
  questionContext?: {
    question: string;
    options: string[];
    correctAnswer: number;
    childAnswer: number;
    yearLevel: number;
    subject: string;
    topic?: string;
  };

  // Response
  response: string;
  tokensUsed?: number;
  latencyMs: number;

  // Model info
  model: string;
  temperature: number;

  // Curriculum tags for future RAG
  curriculumArea?: string;
  yearLevel?: number;
  subject?: string;
}

// Rate limits per tier
const RATE_LIMITS: Record<string, number> = {
  free: 10,
  essential: 1000,
  premium: 1000,
};

// Get approximate age from Australian year level for safety prompts
function getAgeFromYearLevel(yearLevel: number): number {
  // Prep = 5, Year 1 = 6, Year 2 = 7, etc.
  return yearLevel + 5;
}

// Log AI interaction
async function logAIInteraction(log: AIInteractionLog): Promise<void> {
  await db.send(new PutCommand({
    TableName: TABLE_NAME,
    Item: {
      ...keys.aiLog(log.childId, log.requestTimestamp),
      ...log,
      type: 'AI_INTERACTION',
    },
  }));
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const userId = getUserIdFromEvent(event);
    const path = event.rawPath;
    const body = JSON.parse(event.body || '{}');
    const { childId } = body;

    if (!childId) {
      return badRequest('childId is required');
    }

    // For child-only sessions (no parent JWT), verify child exists
    let parentId = userId;
    if (!userId) {
      // Child is logged in directly - verify child exists and get parent ID
      const childResult = await db.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: keys.childProfile(childId),
      }));

      if (!childResult.Item) {
        return forbidden('Child not found');
      }
      parentId = childResult.Item.parentId;
    } else {
      // Parent is logged in - verify ownership
      if (!await verifyChildOwnership(userId, childId)) {
        return forbidden('Not authorized');
      }
    }

    // Check rate limits using parent ID
    const userResult = await db.send(new GetCommand({
      TableName: TABLE_NAME,
      Key: keys.user(parentId),
    }));

    const tier = userResult.Item?.tier || 'free';
    const today = new Date().toISOString().split('T')[0];
    const dailyKey = `aiCalls_${today}`;
    const currentCalls = userResult.Item?.[dailyKey] || 0;

    if (currentCalls >= RATE_LIMITS[tier]) {
      // Track rate limit hits
      await publishMetric('RateLimitHits', 1, 'Count', [{ Name: 'Tier', Value: tier }]);
      return {
        statusCode: 429,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'Daily AI chat limit reached',
          limit: RATE_LIMITS[tier],
          tier,
          upgradeUrl: '/pricing',
        }),
      };
    }

    const requestTimestamp = new Date().toISOString();
    const startTime = Date.now();

    // POST /ai/explain - Explain why an answer is wrong
    if (path === '/ai/explain') {
      const { questionId, question, options, userAnswer, correctAnswer, subject, yearLevel, topic, attemptId } = body;

      if (!question || userAnswer === undefined || correctAnswer === undefined) {
        return badRequest('question, userAnswer, and correctAnswer are required');
      }

      // Build context-aware system prompt with age-appropriate safety
      const age = getAgeFromYearLevel(yearLevel || 5);
      const systemPrompt = `Safe for ${age}yo. You are a friendly, encouraging tutor for Australian Year ${yearLevel || 5} students.
Your role is to help students understand their mistakes without being condescending.
Use Australian English spelling (e.g., colour, favourite, maths).
Keep explanations clear and age-appropriate.`;

      const userPrompt = `A student answered this ${subject || 'maths'} question incorrectly.

Question: ${question}
Options: ${(options || []).map((o: string, i: number) => `${i}: ${o}`).join(', ')}
Student's answer: ${userAnswer} (${options?.[userAnswer] || userAnswer})
Correct answer: ${correctAnswer} (${options?.[correctAnswer] || correctAnswer})
${topic ? `Topic: ${topic}` : ''}

Please explain:
1. Why their answer is incorrect
2. The correct approach to solve this
3. A helpful tip to remember

Keep it to 2-3 short paragraphs. Be encouraging!`;

      // Check cache first
      const cacheKey = createHash('md5')
        .update(`${questionId}:${userAnswer}:${correctAnswer}`)
        .digest('hex');

      const cachedResult = await db.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: keys.cache('explain', cacheKey),
      }));

      let explanation: string;
      let tokensUsed: number | undefined;
      const model = 'llama-3.3-70b-versatile';
      const temperature = 0.7;

      if (cachedResult.Item) {
        explanation = cachedResult.Item.response;
      } else {
        // Generate explanation using Groq
        const completion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          model,
          temperature,
          max_tokens: 300,
        });

        explanation = completion.choices[0]?.message?.content || 'Let me help you understand this better.';
        tokensUsed = completion.usage?.total_tokens;

        // Cache the response
        await db.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            ...keys.cache('explain', cacheKey),
            response: explanation,
            createdAt: new Date().toISOString(),
            ttl: Math.floor(Date.now() / 1000) + 86400 * 30,
          },
        }));
      }

      const responseTimestamp = new Date().toISOString();
      const latencyMs = Date.now() - startTime;

      // Log the AI interaction with full context
      const aiLog: AIInteractionLog = {
        id: uuid(),
        childId,
        questionAttemptId: attemptId,
        requestType: 'explain',
        requestTimestamp,
        responseTimestamp,
        systemPrompt,
        userPrompt,
        questionContext: {
          question,
          options: options || [],
          correctAnswer,
          childAnswer: userAnswer,
          yearLevel: yearLevel || 5,
          subject: subject || 'maths',
          topic,
        },
        response: explanation,
        tokensUsed,
        latencyMs,
        model,
        temperature,
        curriculumArea: topic,
        yearLevel: yearLevel || 5,
        subject: subject || 'maths',
      };

      await logAIInteraction(aiLog);

      // Increment usage counter using parentId for rate limiting
      await incrementAiUsage(parentId, dailyKey);

      // Publish CloudWatch metrics
      await Promise.all([
        publishMetric('AIRequests', 1, 'Count', [{ Name: 'Type', Value: 'explain' }]),
        publishMetric('AILatency', latencyMs, 'Milliseconds', [{ Name: 'Type', Value: 'explain' }]),
        publishMetric('TokensUsed', tokensUsed || 0, 'Count', [{ Name: 'Type', Value: 'explain' }]),
      ]);

      return success({
        explanation,
        logId: aiLog.id,
      });
    }

    // POST /ai/chat - Free-form chat with AI tutor
    if (path === '/ai/chat') {
      const { message, subject, yearLevel, context, topic } = body;

      if (!message) {
        return badRequest('message is required');
      }

      const chatAge = getAgeFromYearLevel(yearLevel || 5);
      const systemPrompt = `Safe for ${chatAge}yo. You are a friendly, patient AI tutor for Australian students.
You're currently helping a Year ${yearLevel || 5} student with ${subject || 'their studies'}.

Guidelines:
- Be encouraging and supportive
- Use Australian English spelling (colour, favourite, maths)
- Keep explanations clear and age-appropriate for Year ${yearLevel || 5}
- If they ask something off-topic, gently redirect to learning
- Never provide answers directly - guide them to discover answers
- Use examples relevant to Australian students
- If discussing curriculum topics, align with Australian curriculum standards

${context ? `Current context: ${context}` : ''}
${topic ? `Current topic: ${topic}` : ''}`;

      const model = 'llama-3.3-70b-versatile';
      const temperature = 0.8;

      const completion = await groq.chat.completions.create({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message },
        ],
        model,
        temperature,
        max_tokens: 400,
      });

      const response = completion.choices[0]?.message?.content || "I'm here to help! What would you like to learn about?";
      const tokensUsed = completion.usage?.total_tokens;
      const responseTimestamp = new Date().toISOString();
      const latencyMs = Date.now() - startTime;

      // Log the AI interaction
      const aiLog: AIInteractionLog = {
        id: uuid(),
        childId,
        requestType: 'chat',
        requestTimestamp,
        responseTimestamp,
        systemPrompt,
        userPrompt: message,
        response,
        tokensUsed,
        latencyMs,
        model,
        temperature,
        curriculumArea: topic,
        yearLevel: yearLevel || 5,
        subject: subject || 'general',
      };

      await logAIInteraction(aiLog);

      // Increment usage counter using parentId for rate limiting
      await incrementAiUsage(parentId, dailyKey);

      // Publish CloudWatch metrics
      await Promise.all([
        publishMetric('AIRequests', 1, 'Count', [{ Name: 'Type', Value: 'chat' }]),
        publishMetric('AILatency', latencyMs, 'Milliseconds', [{ Name: 'Type', Value: 'chat' }]),
        publishMetric('TokensUsed', tokensUsed || 0, 'Count', [{ Name: 'Type', Value: 'chat' }]),
      ]);

      return success({
        response,
        logId: aiLog.id,
      });
    }

    return badRequest('Invalid request');
  } catch (error) {
    console.error('AI handler error:', error);
    // Publish error metric
    await publishMetric('AIErrors', 1, 'Count');
    return serverError();
  }
}

async function incrementAiUsage(userId: string, dailyKey: string): Promise<void> {
  await db.send(new UpdateCommand({
    TableName: TABLE_NAME,
    Key: keys.user(userId),
    UpdateExpression: `SET #dailyKey = if_not_exists(#dailyKey, :zero) + :one`,
    ExpressionAttributeNames: { '#dailyKey': dailyKey },
    ExpressionAttributeValues: { ':zero': 0, ':one': 1 },
  }));
}
