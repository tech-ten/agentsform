import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { PutCommand, QueryCommand, GetCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { db, TABLE_NAME, keys, getUserIdFromEvent, verifyChildOwnership } from '../lib/db';
import { success, created, badRequest, forbidden, notFound, serverError } from '../lib/response';
import { randomUUID } from 'crypto';

export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  try {
    const userId = getUserIdFromEvent(event);
    const method = event.requestContext.http.method;
    const childId = event.pathParameters?.childId;
    const path = event.rawPath;

    // POST /children/login - Child PIN login (no auth required for this specific endpoint)
    // Requires parentEmail + childName + PIN to scope children to their family
    if (method === 'POST' && path === '/children/login') {
      const body = JSON.parse(event.body || '{}');
      const { childId: loginChildId, parentEmail, childName, pin } = body;

      if (!pin) {
        return badRequest('PIN is required');
      }

      let childProfile: any = null;
      let parentId: string;

      // Login by parentEmail + childName (primary method)
      if (parentEmail && childName) {
        // First, find the parent by email using Cognito sub stored in USER record
        // We need to query by email - check if parent exists
        const emailResult = await db.send(new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: 'email-index',
          KeyConditionExpression: 'email = :email',
          ExpressionAttributeValues: {
            ':email': parentEmail.toLowerCase().trim(),
          },
        }));

        if (!emailResult.Items || emailResult.Items.length === 0) {
          return notFound('Parent email not found. Check the email address.');
        }

        // Get the parent's userId from the USER record
        const userRecord = emailResult.Items[0];
        parentId = userRecord.PK.replace('USER#', '');

        // Now find the child by name under this parent
        const childrenResult = await db.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
          ExpressionAttributeValues: {
            ':pk': `USER#${parentId}`,
            ':sk': 'CHILD#',
          },
        }));

        // Find child with matching name (case-insensitive)
        const normalizedChildName = childName.toLowerCase().trim();
        childProfile = childrenResult.Items?.find(
          item => item.name.toLowerCase() === normalizedChildName
        );

        if (!childProfile) {
          return notFound('Child not found. Check the name spelling.');
        }
      } else if (loginChildId) {
        // Login by childId (QR code / direct link flow)
        const profileResult = await db.send(new GetCommand({
          TableName: TABLE_NAME,
          Key: keys.childProfile(loginChildId),
        }));

        if (!profileResult.Item) {
          return notFound('Child not found');
        }

        childProfile = profileResult.Item;
        parentId = profileResult.Item.parentId;
      } else {
        return badRequest('Parent email and child name are required');
      }

      // Get full child record with PIN
      const childResult = await db.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: keys.child(parentId, childProfile.childId),
      }));

      if (!childResult.Item) {
        return notFound('Child not found');
      }

      if (childResult.Item.pin !== pin) {
        return forbidden('Wrong PIN. Try again!');
      }

      // Return child info (no token - child sessions use parent's auth)
      return success({
        id: childResult.Item.childId,
        name: childResult.Item.name,
        yearLevel: childResult.Item.yearLevel,
        avatar: childResult.Item.avatar,
        username: childResult.Item.username,
        parentId: parentId,
      });
    }

    // GET /children - List all children for user
    if (method === 'GET' && !childId) {
      const result = await db.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `USER#${userId}`,
          ':sk': 'CHILD#',
        },
      }));

      const children = result.Items?.map(item => ({
        id: item.childId,
        name: item.name,
        username: item.username,
        yearLevel: item.yearLevel,
        avatar: item.avatar,
        createdAt: item.createdAt,
      })) || [];

      return success({ children });
    }

    // POST /children - Create new child
    if (method === 'POST' && !childId) {
      const body = JSON.parse(event.body || '{}');
      const { name, yearLevel, pin, avatar, username: providedUsername } = body;

      if (!name || !yearLevel) {
        return badRequest('Name and yearLevel are required');
      }

      if (yearLevel < 0 || yearLevel > 12) {
        return badRequest('yearLevel must be between 0 (Prep) and 12');
      }

      // Generate username from name if not provided (e.g., "Josh M" -> "joshm")
      const baseUsername = (providedUsername || name).toLowerCase().replace(/[^a-z0-9]/g, '');
      let username = baseUsername;

      // Check if username exists and add number if needed
      let usernameExists = true;
      let attempt = 0;
      while (usernameExists && attempt < 100) {
        const checkResult = await db.send(new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: 'username-index',
          KeyConditionExpression: 'username = :username',
          ExpressionAttributeValues: {
            ':username': username,
          },
        }));

        if (!checkResult.Items || checkResult.Items.length === 0) {
          usernameExists = false;
        } else {
          attempt++;
          username = `${baseUsername}${attempt}`;
        }
      }

      const newChildId = randomUUID();
      const now = new Date().toISOString();

      // Ensure parent user PROFILE exists in DynamoDB (creates if not exists)
      // This handles users who signed up via Cognito but never had a profile created
      try {
        await db.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            ...keys.user(userId),
            tier: 'free',
            createdAt: now,
            updatedAt: now,
          },
          ConditionExpression: 'attribute_not_exists(PK)', // Only create if doesn't exist
        }));
        console.log(`Created new user profile for ${userId}`);
      } catch (err: unknown) {
        // Ignore ConditionalCheckFailedException - means profile already exists
        if ((err as { name?: string }).name !== 'ConditionalCheckFailedException') {
          throw err;
        }
      }

      // Create child record under user
      await db.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          ...keys.child(userId, newChildId),
          childId: newChildId,
          name,
          username,
          yearLevel,
          pin: pin || '0000',
          avatar: avatar || 'default',
          createdAt: now,
          updatedAt: now,
        },
      }));

      // Create child profile for direct lookups (also indexed by username)
      await db.send(new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          ...keys.childProfile(newChildId),
          childId: newChildId,
          parentId: userId,
          name,
          username,
          yearLevel,
          avatar: avatar || 'default',
          createdAt: now,
        },
      }));

      // Initialize progress for each subject
      for (const subject of ['maths', 'english']) {
        await db.send(new PutCommand({
          TableName: TABLE_NAME,
          Item: {
            ...keys.progress(newChildId, subject),
            childId: newChildId,
            subject,
            level: 5, // Start at Year 5 equivalent (benchmark will adjust)
            xp: 0,
            streak: 0,
            lastActive: now,
            consecutiveCorrect: 0,
            consecutiveWrong: 0,
            questionsAnswered: 0,
            correctAnswers: 0,
            weakTopics: [],
            topicLevels: {},
          },
        }));
      }

      return created({
        id: newChildId,
        name,
        username,
        yearLevel,
        avatar: avatar || 'default',
      });
    }

    // GET /children/{childId} - Get specific child
    if (method === 'GET' && childId) {
      if (!await verifyChildOwnership(userId, childId)) {
        return forbidden('Not authorized to access this child');
      }

      const result = await db.send(new GetCommand({
        TableName: TABLE_NAME,
        Key: keys.child(userId, childId),
      }));

      if (!result.Item) {
        return notFound('Child not found');
      }

      return success({
        id: result.Item.childId,
        name: result.Item.name,
        username: result.Item.username,
        yearLevel: result.Item.yearLevel,
        avatar: result.Item.avatar,
        createdAt: result.Item.createdAt,
      });
    }

    // PUT /children/{childId} - Update child
    if (method === 'PUT' && childId) {
      if (!await verifyChildOwnership(userId, childId)) {
        return forbidden('Not authorized to update this child');
      }

      const body = JSON.parse(event.body || '{}');
      const { name, yearLevel, pin, avatar } = body;
      const now = new Date().toISOString();

      const updateExpressions: string[] = ['#updatedAt = :updatedAt'];
      const expressionAttributeNames: Record<string, string> = { '#updatedAt': 'updatedAt' };
      const expressionAttributeValues: Record<string, any> = { ':updatedAt': now };

      if (name) {
        updateExpressions.push('#name = :name');
        expressionAttributeNames['#name'] = 'name';
        expressionAttributeValues[':name'] = name;
      }
      if (yearLevel !== undefined) {
        updateExpressions.push('yearLevel = :yearLevel');
        expressionAttributeValues[':yearLevel'] = yearLevel;
      }
      if (pin) {
        updateExpressions.push('pin = :pin');
        expressionAttributeValues[':pin'] = pin;
      }
      if (avatar) {
        updateExpressions.push('avatar = :avatar');
        expressionAttributeValues[':avatar'] = avatar;
      }

      await db.send(new UpdateCommand({
        TableName: TABLE_NAME,
        Key: keys.child(userId, childId),
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      }));

      return success({ message: 'Child updated successfully' });
    }

    // DELETE /children/{childId} - Delete child
    if (method === 'DELETE' && childId) {
      if (!await verifyChildOwnership(userId, childId)) {
        return forbidden('Not authorized to delete this child');
      }

      await db.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: keys.child(userId, childId),
      }));

      await db.send(new DeleteCommand({
        TableName: TABLE_NAME,
        Key: keys.childProfile(childId),
      }));

      return success({ message: 'Child deleted successfully' });
    }

    return badRequest('Invalid request');
  } catch (error) {
    console.error('Child handler error:', error);
    return serverError();
  }
}
