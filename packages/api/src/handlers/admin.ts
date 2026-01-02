import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { QueryCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLE_NAME } from '../lib/db';
import { success, badRequest, forbidden, serverError } from '../lib/response';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Admin API key - set via environment variable
// This decouples admin access from parent Cognito accounts
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'studymate-admin-2024';

function validateAdminAccess(event: APIGatewayProxyEventV2): boolean {
  // Check for X-Admin-Key header
  const adminKey = event.headers['x-admin-key'] || event.headers['X-Admin-Key'];
  return adminKey === ADMIN_API_KEY;
}

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    if (!validateAdminAccess(event)) {
      return forbidden('Admin access required');
    }

    const path = event.rawPath;

    // GET /admin/stats - Overview statistics
    if (path === '/admin/stats') {
      const today = new Date().toISOString().split('T')[0];

      // Count users
      const usersResult = await db.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
        ExpressionAttributeValues: {
          ':pk': 'USER#',
          ':sk': 'PROFILE',
        },
        Select: 'COUNT',
      }));

      // Count children
      const childrenResult = await db.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
        ExpressionAttributeValues: {
          ':pk': 'CHILD#',
          ':sk': 'PROFILE',
        },
        Select: 'COUNT',
      }));

      // Count AI interactions today
      const aiLogsResult = await db.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(SK, :sk) AND begins_with(requestTimestamp, :today)',
        ExpressionAttributeValues: {
          ':sk': 'AILOG#',
          ':today': today,
        },
        Select: 'COUNT',
      }));

      // Count total AI interactions
      const totalAiLogsResult = await db.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':sk': 'AILOG#',
        },
        Select: 'COUNT',
      }));

      // Count quizzes completed
      const quizzesResult = await db.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':sk': 'QUIZ#',
        },
        Select: 'COUNT',
      }));

      return success({
        totalUsers: usersResult.Count || 0,
        totalChildren: childrenResult.Count || 0,
        aiCallsToday: aiLogsResult.Count || 0,
        totalAiCalls: totalAiLogsResult.Count || 0,
        quizzesCompleted: quizzesResult.Count || 0,
        timestamp: new Date().toISOString(),
      });
    }

    // GET /admin/users - List all users with usage
    if (path === '/admin/users') {
      const today = new Date().toISOString().split('T')[0];
      const dailyKey = `aiCalls_${today}`;

      const usersResult = await db.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
        ExpressionAttributeValues: {
          ':pk': 'USER#',
          ':sk': 'PROFILE',
        },
      }));

      const users = (usersResult.Items || []).map(item => ({
        id: item.PK.replace('USER#', ''),
        email: item.email,
        tier: item.tier || 'free',
        aiCallsToday: item[dailyKey] || 0,
        createdAt: item.createdAt,
      }));

      return success({ users });
    }

    // GET /admin/children - List all children with progress
    if (path === '/admin/children') {
      const childrenResult = await db.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(PK, :pk) AND SK = :sk',
        ExpressionAttributeValues: {
          ':pk': 'CHILD#',
          ':sk': 'PROFILE',
        },
      }));

      const children = (childrenResult.Items || []).map(item => ({
        id: item.PK.replace('CHILD#', ''),
        name: item.name,
        username: item.username,
        yearLevel: item.yearLevel,
        parentId: item.parentId,
        createdAt: item.createdAt,
      }));

      return success({ children });
    }

    // GET /admin/ai-logs - Recent AI interactions
    if (path === '/admin/ai-logs') {
      const limit = parseInt(event.queryStringParameters?.limit || '50');

      const logsResult = await db.send(new ScanCommand({
        TableName: TABLE_NAME,
        FilterExpression: 'begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':sk': 'AILOG#',
        },
        Limit: limit,
      }));

      const logs = (logsResult.Items || [])
        .map(item => ({
          id: item.id,
          childId: item.childId,
          requestType: item.requestType,
          requestTimestamp: item.requestTimestamp,
          latencyMs: item.latencyMs,
          tokensUsed: item.tokensUsed,
          subject: item.subject,
          yearLevel: item.yearLevel,
        }))
        .sort((a, b) => new Date(b.requestTimestamp).getTime() - new Date(a.requestTimestamp).getTime());

      return success({ logs });
    }

    // GET /admin/usage-by-day - AI usage by day (last 7 days)
    if (path === '/admin/usage-by-day') {
      const days: { date: string; count: number }[] = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const result = await db.send(new ScanCommand({
          TableName: TABLE_NAME,
          FilterExpression: 'begins_with(SK, :sk) AND begins_with(requestTimestamp, :date)',
          ExpressionAttributeValues: {
            ':sk': 'AILOG#',
            ':date': dateStr,
          },
          Select: 'COUNT',
        }));

        days.push({ date: dateStr, count: result.Count || 0 });
      }

      return success({ days: days.reverse() });
    }

    // GET /admin/payments - List all payments and subscriptions from Stripe
    if (path === '/admin/payments') {
      try {
        // Fetch recent payments (charges)
        const charges = await stripe.charges.list({
          limit: 100,
        });

        // Fetch all subscriptions
        const subscriptions = await stripe.subscriptions.list({
          limit: 100,
          status: 'all',
        });

        // Fetch all customers
        const customers = await stripe.customers.list({
          limit: 100,
        });

        // Map customers by ID for quick lookup
        const customerMap = new Map(
          customers.data.map(c => [c.id, c])
        );

        // Format payments
        const payments = charges.data.map(charge => ({
          id: charge.id,
          amount: charge.amount / 100,
          currency: charge.currency.toUpperCase(),
          status: charge.status,
          customerId: charge.customer as string,
          customerEmail: customerMap.get(charge.customer as string)?.email || null,
          description: charge.description,
          created: new Date(charge.created * 1000).toISOString(),
          invoiceId: (charge as unknown as { invoice: string | null }).invoice,
          receiptUrl: charge.receipt_url,
        }));

        // Format subscriptions
        const subs = subscriptions.data.map(sub => {
          const subAny = sub as unknown as {
            current_period_start: number;
            current_period_end: number;
          };
          return {
            id: sub.id,
            status: sub.status,
            customerId: sub.customer as string,
            customerEmail: customerMap.get(sub.customer as string)?.email || null,
            plan: sub.items.data[0]?.price.nickname || sub.items.data[0]?.price.id,
            amount: (sub.items.data[0]?.price.unit_amount || 0) / 100,
            currency: sub.items.data[0]?.price.currency?.toUpperCase() || 'AUD',
            interval: sub.items.data[0]?.price.recurring?.interval || 'month',
            currentPeriodStart: new Date(subAny.current_period_start * 1000).toISOString(),
            currentPeriodEnd: new Date(subAny.current_period_end * 1000).toISOString(),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            created: new Date(sub.created * 1000).toISOString(),
          };
        });

        // Summary stats
        const totalRevenue = payments
          .filter(p => p.status === 'succeeded')
          .reduce((sum, p) => sum + p.amount, 0);

        const activeSubscriptions = subs.filter(s => s.status === 'active').length;
        const canceledSubscriptions = subs.filter(s => s.status === 'canceled').length;

        return success({
          payments,
          subscriptions: subs,
          summary: {
            totalRevenue,
            totalPayments: payments.length,
            successfulPayments: payments.filter(p => p.status === 'succeeded').length,
            activeSubscriptions,
            canceledSubscriptions,
            totalCustomers: customers.data.length,
          },
        });
      } catch (err) {
        console.error('Failed to fetch Stripe data:', err);
        return success({
          payments: [],
          subscriptions: [],
          summary: {
            totalRevenue: 0,
            totalPayments: 0,
            successfulPayments: 0,
            activeSubscriptions: 0,
            canceledSubscriptions: 0,
            totalCustomers: 0,
          },
          error: 'Failed to fetch payment data from Stripe',
        });
      }
    }

    return badRequest('Invalid endpoint');
  } catch (error) {
    console.error('Admin handler error:', error);
    return serverError();
  }
}
