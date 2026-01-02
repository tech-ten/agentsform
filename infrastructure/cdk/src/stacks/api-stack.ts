import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigatewayv2 from 'aws-cdk-lib/aws-apigatewayv2';
import * as apigatewayv2Integrations from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import * as apigatewayv2Authorizers from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

interface ApiStackProps extends cdk.StackProps {
  table: dynamodb.Table;
  userPool: cognito.UserPool;
  userPoolClient: cognito.UserPoolClient;
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigatewayv2.HttpApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    const { table, userPool, userPoolClient } = props;

    // JWT Authorizer for Cognito
    const authorizer = new apigatewayv2Authorizers.HttpJwtAuthorizer(
      'CognitoAuthorizer',
      `https://cognito-idp.${this.region}.amazonaws.com/${userPool.userPoolId}`,
      {
        jwtAudience: [userPoolClient.userPoolClientId],
      }
    );

    // HTTP API (v2 - 71% cheaper than REST)
    this.api = new apigatewayv2.HttpApi(this, 'AgentsFormApi', {
      apiName: 'agentsform-api',
      corsPreflight: {
        allowOrigins: ['http://localhost:3000', 'https://agentsform.ai', 'https://agentsform.com', 'https://tutor.agentsform.ai'],
        allowMethods: [
          apigatewayv2.CorsHttpMethod.GET,
          apigatewayv2.CorsHttpMethod.POST,
          apigatewayv2.CorsHttpMethod.PUT,
          apigatewayv2.CorsHttpMethod.DELETE,
          apigatewayv2.CorsHttpMethod.OPTIONS,
        ],
        allowHeaders: ['Content-Type', 'Authorization'],
        allowCredentials: true,
      },
    });

    // Shared Lambda layer for common code
    const commonEnv = {
      TABLE_NAME: table.tableName,
      USER_POOL_ID: userPool.userPoolId,
      GROQ_API_KEY: process.env.GROQ_API_KEY || '',
      STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
      STRIPE_PRICE_SCHOLAR: process.env.STRIPE_PRICE_SCHOLAR || '',
      STRIPE_PRICE_ACHIEVER: process.env.STRIPE_PRICE_ACHIEVER || '',
      FRONTEND_URL: 'https://tutor.agentsform.ai',
    };

    // Lambda function factory
    const createLambda = (name: string, handler: string) => {
      const fn = new lambda.Function(this, name, {
        functionName: `agentsform-${name.toLowerCase()}`,
        runtime: lambda.Runtime.NODEJS_20_X,
        architecture: lambda.Architecture.ARM_64, // 20% cheaper
        handler: handler,
        code: lambda.Code.fromAsset('../../packages/api/dist'),
        memorySize: 128,
        timeout: cdk.Duration.seconds(10),
        environment: commonEnv,
      });

      // Grant DynamoDB access
      table.grantReadWriteData(fn);

      return fn;
    };

    // === CHILD PROFILE ROUTES ===
    const childHandler = createLambda('ChildHandler', 'handlers/child.handler');

    this.api.addRoutes({
      path: '/children',
      methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('ChildrenIntegration', childHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/children/{childId}',
      methods: [apigatewayv2.HttpMethod.GET, apigatewayv2.HttpMethod.PUT, apigatewayv2.HttpMethod.DELETE],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('ChildIntegration', childHandler),
      authorizer,
    });

    // Child PIN login - no auth required (kids login with PIN)
    this.api.addRoutes({
      path: '/children/login',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('ChildLoginIntegration', childHandler),
    });

    // === QUESTION ROUTES ===
    const questionHandler = createLambda('QuestionHandler', 'handlers/question.handler');

    this.api.addRoutes({
      path: '/questions/next',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('NextQuestionIntegration', questionHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/questions/{questionId}/answer',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('AnswerIntegration', questionHandler),
      authorizer,
    });

    // === BENCHMARKING TEST ROUTES ===
    const benchmarkHandler = createLambda('BenchmarkHandler', 'handlers/benchmark.handler');

    this.api.addRoutes({
      path: '/benchmark/start',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('BenchmarkStartIntegration', benchmarkHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/benchmark/{sessionId}/next',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('BenchmarkNextIntegration', benchmarkHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/benchmark/{sessionId}/answer',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('BenchmarkAnswerIntegration', benchmarkHandler),
      authorizer,
    });

    // === AI TUTOR ROUTES ===
    // AI handler uses pre-bundled code (includes groq-sdk)
    const aiHandler = new lambda.Function(this, 'AIHandler', {
      functionName: 'agentsform-aihandler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'ai.handler',
      code: lambda.Code.fromAsset('../../packages/api/dist-bundled'),
      memorySize: 256, // More memory for AI calls
      timeout: cdk.Duration.seconds(30), // Longer timeout for AI responses
      environment: commonEnv,
    });
    table.grantReadWriteData(aiHandler);

    // AI routes - no authorizer needed (handles both parent and child sessions)
    this.api.addRoutes({
      path: '/ai/explain',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('AIExplainIntegration', aiHandler),
    });

    this.api.addRoutes({
      path: '/ai/chat',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('AIChatIntegration', aiHandler),
    });

    // === PROGRESS ROUTES ===
    const progressHandler = createLambda('ProgressHandler', 'handlers/progress.handler');

    this.api.addRoutes({
      path: '/progress/{childId}',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('ProgressIntegration', progressHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/progress/{childId}/stats',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('StatsIntegration', progressHandler),
      authorizer,
    });

    // Section quiz routes - no auth required (child sessions use these)
    this.api.addRoutes({
      path: '/progress/{childId}/quiz',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('QuizSaveIntegration', progressHandler),
    });

    this.api.addRoutes({
      path: '/progress/{childId}/quizzes',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('QuizzesGetIntegration', progressHandler),
    });

    // === GAMIFICATION ROUTES ===
    const gamificationHandler = createLambda('GamificationHandler', 'handlers/gamification.handler');

    this.api.addRoutes({
      path: '/gamification/{childId}/badges',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('BadgesIntegration', gamificationHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/gamification/{childId}/streak',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('StreakIntegration', gamificationHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/gamification/leaderboard',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('LeaderboardIntegration', gamificationHandler),
      authorizer,
    });

    // === ADMIN ROUTES ===
    const adminHandler = createLambda('AdminHandler', 'handlers/admin.handler');

    this.api.addRoutes({
      path: '/admin/stats',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('AdminStatsIntegration', adminHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/admin/users',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('AdminUsersIntegration', adminHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/admin/children',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('AdminChildrenIntegration', adminHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/admin/ai-logs',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('AdminAILogsIntegration', adminHandler),
      authorizer,
    });

    this.api.addRoutes({
      path: '/admin/usage-by-day',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('AdminUsageIntegration', adminHandler),
      authorizer,
    });

    // === PAYMENT ROUTES ===
    // Payment handler uses pre-bundled code (includes stripe)
    const paymentHandler = new lambda.Function(this, 'PaymentHandler', {
      functionName: 'studymate-paymenthandler',
      runtime: lambda.Runtime.NODEJS_20_X,
      architecture: lambda.Architecture.ARM_64,
      handler: 'payment.handler',
      code: lambda.Code.fromAsset('../../packages/api/dist-bundled'),
      memorySize: 256,
      timeout: cdk.Duration.seconds(30),
      environment: commonEnv,
    });
    table.grantReadWriteData(paymentHandler);

    // Create checkout session - requires auth
    this.api.addRoutes({
      path: '/payments/create-checkout',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('PaymentCheckoutIntegration', paymentHandler),
      authorizer,
    });

    // Customer portal - requires auth
    this.api.addRoutes({
      path: '/payments/portal',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('PaymentPortalIntegration', paymentHandler),
      authorizer,
    });

    // Subscription status - requires auth
    this.api.addRoutes({
      path: '/payments/status',
      methods: [apigatewayv2.HttpMethod.GET],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('PaymentStatusIntegration', paymentHandler),
      authorizer,
    });

    // Stripe webhook - no auth (Stripe signature verification instead)
    this.api.addRoutes({
      path: '/payments/webhook',
      methods: [apigatewayv2.HttpMethod.POST],
      integration: new apigatewayv2Integrations.HttpLambdaIntegration('PaymentWebhookIntegration', paymentHandler),
    });

    // Outputs
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.apiEndpoint,
      exportName: 'AgentsFormApiUrl',
    });
  }
}
