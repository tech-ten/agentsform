# StudyMate User Management Developer Guide

## Overview

This document provides a comprehensive guide to the user management system in StudyMate, including authentication flows, subscription management, and user journeys. Use this as the definitive reference when modifying user-related functionality.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Models](#data-models)
3. [User Types](#user-types)
4. [Authentication Flow](#authentication-flow)
5. [Subscription Tiers](#subscription-tiers)
6. [Complete User Journeys](#complete-user-journeys)
7. [File Reference](#file-reference)
8. [Common Pitfalls](#common-pitfalls)
9. [Future Enhancements](#future-enhancements)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND (Next.js)                              │
│  apps/web/src/                                                               │
│  ├── app/(auth)/        # Auth pages: login, register, verify               │
│  ├── app/(parent)/      # Parent pages: dashboard, pricing, children        │
│  ├── app/(student)/     # Student pages: learn, benchmark, curriculum       │
│  └── lib/               # Auth helpers, API client                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (AWS Lambda)                               │
│  packages/api/src/handlers/                                                  │
│  ├── auth.ts            # Cognito integration                               │
│  ├── payment.ts         # Stripe subscriptions                              │
│  ├── children.ts        # Child profile management                          │
│  └── progress.ts        # Learning progress tracking                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              AWS SERVICES                                    │
│  ├── Cognito User Pool  # User authentication                               │
│  ├── DynamoDB           # User data, subscriptions, progress                │
│  └── Stripe             # Payment processing                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### Cognito User Attributes (Authentication)

Cognito is the **authentication** layer. It stores:

| Attribute | Type | Description | Set By |
|-----------|------|-------------|--------|
| `sub` | string | Unique user ID (UUID) | Cognito (auto) |
| `email` | string | User's email address | User (signup) |
| `email_verified` | boolean | Whether email is verified | Cognito (auto) |
| `name` | string | User's display name | User (signup) |
| `custom:tier` | string | Subscription tier (legacy, not used) | - |

### DynamoDB User Profile (Application Data)

DynamoDB is the **application data** layer. It stores the complete user profile:

```typescript
// PK: USER#<userId>  SK: PROFILE
interface UserProfile {
  PK: string;                    // "USER#<cognito-sub>"
  SK: "PROFILE";

  // Identity
  email: string;                 // User's email
  name: string | null;           // Display name from Cognito

  // Subscription Status
  tier: "free" | "explorer" | "scholar" | "achiever";
  status: "unverified" | "verified" | "active" | "cancelled";

  // Timestamps
  createdAt: string;             // When profile was created (ISO 8601)
  updatedAt: string;             // Last modification (ISO 8601)
  verifiedAt: string | null;     // When email was verified
  subscribedAt: string | null;   // When first subscription started

  // Stripe Integration
  stripeCustomerId: string | null;     // Stripe customer ID
  stripeSubscriptionId: string | null; // Active subscription ID

  // Rate Limiting (dynamic keys)
  [aiCalls_YYYY-MM-DD: string]: number; // Daily AI call count
}
```

### User Status Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ unverified  │────▶│  verified   │────▶│   active    │────▶│  cancelled  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
      │                   │                   │                    │
      │                   │                   │                    │
  (Future:            Cognito            Stripe              Stripe
  Pre-signup          Post-              Webhook:            Webhook:
  trigger)            Confirmation       checkout.           subscription.
                      Trigger            completed           deleted
```

| Status | Meaning | Set By | When |
|--------|---------|--------|------|
| `unverified` | Account created, email not verified | Future: Pre-signup Lambda | On signup (future) |
| `verified` | Email verified, no subscription | Cognito Post-Confirmation Lambda | After email verification |
| `active` | Has active subscription (trial or paid) | Stripe Webhook | On `checkout.session.completed` |
| `cancelled` | Subscription cancelled/expired | Stripe Webhook | On `customer.subscription.deleted` |

### Field Update Matrix

| Field | Created By | Updated By | Notes |
|-------|------------|------------|-------|
| `PK`, `SK` | Cognito trigger | Never | Immutable primary key |
| `email` | Cognito trigger | Never | From Cognito attributes |
| `name` | Cognito trigger | Never | From Cognito attributes |
| `tier` | Cognito trigger (as `free`) | Stripe webhook | Changes with subscription |
| `status` | Cognito trigger (as `verified`) | Stripe webhook | Tracks subscription state |
| `createdAt` | Cognito trigger | Never | Immutable |
| `updatedAt` | Cognito trigger | Any update | Auto-updated on changes |
| `verifiedAt` | Cognito trigger | Never | When email confirmed |
| `subscribedAt` | Stripe webhook | Never (if_not_exists) | First subscription only |
| `stripeCustomerId` | Stripe webhook | Never | Stripe's customer ID |
| `stripeSubscriptionId` | Stripe webhook | Stripe webhook | Current subscription |
| `aiCalls_YYYY-MM-DD` | AI handler | AI handler | Incremented per call |

### Cognito ↔ DynamoDB Relationship

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            COGNITO USER POOL                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Username: b9de54c8-c041-70e4-83dd-1cc7d242c690                      │    │
│  │ Email: user@example.com                                              │    │
│  │ Name: John Smith                                                     │    │
│  │ Status: CONFIRMED                                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ PostConfirmation Lambda
                                      │ Creates/Updates DynamoDB record
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DYNAMODB TABLE                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ PK: USER#b9de54c8-c041-70e4-83dd-1cc7d242c690                       │    │
│  │ SK: PROFILE                                                          │    │
│  │ email: user@example.com                                              │    │
│  │ name: John Smith                                                     │    │
│  │ tier: scholar                                                        │    │
│  │ status: active                                                       │    │
│  │ stripeCustomerId: cus_TiUtc8bVezPOBF                                │    │
│  │ stripeSubscriptionId: sub_1Sl3tLFqL65Zilf9Tr3cKl2v                  │    │
│  │ createdAt: 2026-01-03T07:15:24.296Z                                 │    │
│  │ verifiedAt: 2026-01-03T07:15:24.296Z                                │    │
│  │ subscribedAt: 2026-01-03T08:39:29.412Z                              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Files for Data Model

| File | Responsibility |
|------|----------------|
| `packages/api/src/handlers/cognito-trigger.ts` | Creates user profile on email verification |
| `packages/api/src/handlers/payment.ts` | Updates tier, status, Stripe IDs on subscription changes |
| `packages/api/src/handlers/ai.ts` | Increments `aiCalls_YYYY-MM-DD` counter |
| `packages/api/src/scripts/backfill-user-profiles.ts` | Migration script for existing users |

---

## User Types

### Parent (Primary User)
- Creates account via Cognito
- Manages subscription payments
- Creates and manages child profiles
- Views progress reports and analytics

### Child (Sub-User)
- Created by parent
- Logs in with parent email + child name + PIN (family-scoped login)
- Uses learning features
- No direct account management

---

## Authentication Flow

### Token Storage
```typescript
// apps/web/src/lib/auth.ts
const TOKEN_KEY = 'studymate_token'
const REFRESH_KEY = 'studymate_refresh'
const CHILD_KEY = 'studymate_child'
```

### Key Functions

| Function | Description | Location |
|----------|-------------|----------|
| `signIn(email, password)` | Parent login via Cognito | `lib/auth.ts` |
| `signUp(email, password, name)` | Parent registration | `lib/auth.ts` |
| `confirmSignUp(email, code)` | Email verification | `lib/auth.ts` |
| `signOut()` | Clear tokens, redirect to home | `lib/auth.ts` |
| `isAuthenticatedSync()` | Check if tokens exist (sync) | `lib/auth.ts` |
| `getAuthToken()` | Get current access token | `lib/auth.ts` |

### Child Authentication

Child login is family-scoped using parent email + child name + PIN to prevent username collisions across families:

```typescript
// Child login uses parent email to scope to family
POST /children/login
Body: {
  parentEmail: string,  // Parent's email address
  childName: string,    // Child's name (case-insensitive)
  pin: string           // 4-6 digit PIN
}
Response: {
  id: string,
  name: string,
  yearLevel: number,
  avatar: string,
  username: string,
  parentId: string
}

// Alternative: Direct login via QR code / deep link
POST /children/login
Body: { childId: string, pin: string }
```

**Login Flow (3 steps):**
1. Enter parent's email address
2. Enter child's name (as registered by parent)
3. Enter PIN

This prevents the scenario where two children named "Thomas" from different families could log in as each other.

---

## Subscription Tiers

### Tier Configuration

| Tier | Price | Trial | Max Children | Daily Questions | Daily AI Calls | Duration Limit |
|------|-------|-------|--------------|-----------------|----------------|----------------|
| Free | $0 | - | 2 | 20 | 10 | - |
| Explorer | $0.99/mo | 21 days | 2 | 20 | 10 | 60 days max |
| Scholar | $5/mo | 14 days | 5 | Unlimited | Unlimited | - |
| Achiever | $12/mo | 14 days | 10 | Unlimited | Unlimited | - |

### Explorer → Scholar Upgrade Funnel

```
Day 0-21:     Free trial (no charge)
Day 21-51:    First $0.99 payment
Day 51-60:    Second $0.99 period begins
Day 60+:      MUST upgrade to Scholar/Achiever or lose access
```

**Backend Implementation:** `packages/api/src/handlers/payment.ts`
```typescript
const EXPLORER_UPGRADE_DAYS = 60;

// In /payments/status endpoint:
if (tier === 'explorer' && subscription.created) {
  const daysSinceStart = Math.floor((now - subscriptionStart) / (1000 * 60 * 60 * 24));
  explorerDaysLeft = Math.max(0, EXPLORER_UPGRADE_DAYS - daysSinceStart);
  if (daysSinceStart >= EXPLORER_UPGRADE_DAYS) {
    requiresUpgrade = true;
  }
}
```

**Frontend Implementation:** `apps/web/src/app/(parent)/dashboard/page.tsx`
- Shows countdown banner when `explorerDaysLeft <= 14`
- Shows blocking modal when `requiresUpgrade === true`

---

## Complete User Journeys

### Journey 1: New User Registration → First Learning Session (Netflix-Style Funnel)

This is the optimized conversion funnel that captures email first, then guides users through plan selection before account creation.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Landing Page                                                        │
│ Page: /                                                                      │
│ Action: Click "Get Started" or "Start free trial"                           │
│ Destination: /get-started                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Email Capture (Netflix-style)                                       │
│ Page: /get-started                                                          │
│ Display: Simple email input form                                            │
│ Action: Enter email address                                                 │
│ Storage: sessionStorage.setItem('signup_email', email)                      │
│ Destination: /choose-plan                                                   │
│                                                                             │
│ DB Update: NONE (email only stored in browser)                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Plan Selection (Public, No Auth Required)                           │
│ Page: /choose-plan                                                          │
│ Check: Retrieves email from sessionStorage                                  │
│ Display: Three plan cards (Explorer, Scholar, Achiever)                     │
│         Scholar highlighted as "Most popular"                               │
│ Action: Click "Select [Plan]"                                               │
│ Storage: sessionStorage.setItem('signup_plan', plan)                        │
│ Destination: /register?plan={plan}&email={email}                            │
│                                                                             │
│ DB Update: NONE (plan stored in browser session)                            │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Registration (Locked Plan)                                          │
│ Page: /register?plan=scholar&email=user@example.com                         │
│ Display: Shows "Selected plan: Scholar - $5/month" (locked)                 │
│          Email pre-filled, name and password inputs                         │
│ Action: Enter name, password, confirm password                              │
│ API: signUp(email, password, name, plan) → Cognito creates user             │
│ Storage: sessionStorage.setItem('signup_plan', plan)                        │
│ Destination: /verify?email={email}&plan={plan}                              │
│                                                                             │
│ Cognito Update: Creates user with status UNCONFIRMED                        │
│ DB Update: NONE (profile created after verification)                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Email Verification                                                  │
│ Page: /verify?email=user@example.com&plan=scholar                           │
│ Display: 6-digit code input, shows selected plan                            │
│ Action: Enter verification code from email                                  │
│ API: confirmSignUp(email, code)                                             │
│      → Cognito confirms user                                                │
│      → PostConfirmation Lambda fires                                        │
│ Destination: /login?checkout=scholar&email=user@example.com                 │
│                                                                             │
│ Cognito Update: User status → CONFIRMED                                     │
│ DB Update (via Lambda):                                                     │
│   - Creates USER#<id> PROFILE record                                        │
│   - Sets: email, name, tier='free', status='verified'                       │
│   - Sets: verifiedAt, createdAt, updatedAt                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 6: Login with Checkout Flow                                            │
│ Page: /login?checkout=scholar&email=user@example.com                        │
│ Display: Email pre-filled, password input, "Continue to payment" button    │
│ Action: Enter password, click submit                                        │
│ API: signIn(email, password) → Get tokens                                   │
│      IF checkout param exists:                                              │
│        createCheckoutSession(plan) → Get Stripe URL                         │
│        window.location.href = stripeUrl (same tab)                          │
│ Destination: Stripe Checkout (same tab for better conversion)               │
│                                                                             │
│ DB Update: NONE (just authentication)                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 7: Stripe Checkout                                                     │
│ Page: Stripe hosted checkout                                                │
│ Display: Plan details, trial info, payment form                             │
│ Action: Enter payment details, click "Start trial"                          │
│ Webhook: checkout.session.completed fires                                   │
│ Redirect: /dashboard?payment=success                                        │
│                                                                             │
│ DB Update (via Stripe webhook):                                             │
│   - Updates USER#<id> PROFILE                                               │
│   - Sets: tier='scholar', status='active'                                   │
│   - Sets: stripeCustomerId, stripeSubscriptionId, subscribedAt              │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 9: Dashboard (No Children)                                             │
│ Page: /dashboard                                                             │
│ Check: getSubscriptionStatus() → tier: 'scholar', subscriptionId: exists    │
│ Check: getChildren() → empty array                                          │
│ Display: "No children added yet" prompt                                     │
│ Action: Click "Add Your First Child"                                        │
│ Destination: /children/add                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 10: Add Child                                                          │
│ Page: /children/add                                                          │
│ Action: Enter child name, year level, avatar, 4-digit PIN                   │
│ API: createChild() → Store in DynamoDB                                      │
│ Destination: /benchmark?child={childId}                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 11: Benchmark Test                                                     │
│ Page: /benchmark?child={childId}                                             │
│ Action: Complete adaptive assessment (10 questions)                         │
│ API: submitBenchmark() → Calculate starting level                           │
│ Destination: /dashboard (with child selected)                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 12: Ready to Learn                                                     │
│ Page: /dashboard                                                             │
│ Display: Child progress, stats, "Start Learning" CTA                        │
│ Action: Click "Start Learning"                                              │
│ Destination: /child-login?child={childId}                                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Journey 2: Returning User Login

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Landing Page                                                        │
│ Page: /                                                                      │
│ Action: Click "Sign in"                                                     │
│ Destination: /login                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Login                                                               │
│ Page: /login                                                                 │
│ Action: Enter email and password                                            │
│ API: signIn() → Get tokens                                                  │
│ Destination: /dashboard (default, no redirect param)                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Dashboard                                                           │
│ Page: /dashboard                                                             │
│ Check: getSubscriptionStatus() → Verify active subscription                 │
│ Check: getChildren() → Load child profiles                                  │
│ Display: Child selector, progress stats, learning CTAs                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Journey 3: Child Learning Session

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Parent Dashboard                                                    │
│ Page: /dashboard                                                             │
│ Action: Click "Start Learning" for selected child                           │
│ Destination: /child-login?child={childId}                                   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Child Login (3-Step Flow)                                           │
│ Page: /child-login                                                           │
│ Display: 3-step login form:                                                  │
│   Step 1: Enter parent's email address                                      │
│   Step 2: Enter child's name                                                │
│   Step 3: Enter PIN using number pad                                        │
│ API: childLogin({ parentEmail, childName, pin }) → Get child profile        │
│ Store: setChildProfile(child) in localStorage                               │
│ Destination: /learn                                                         │
│                                                                             │
│ Note: If accessed via /child-login?child={childId}, skips to PIN step      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Curriculum Browser                                                  │
│ Page: /curriculum                                                            │
│ Display: Subject cards (Maths, English), year level content                 │
│ Action: Select topic to practice                                            │
│ Destination: /learn?topic={topicId}                                         │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Learning Session                                                    │
│ Page: /learn?topic={topicId}                                                 │
│ Display: Adaptive questions, AI tutor help                                  │
│ APIs: getQuestion(), submitAnswer(), getExplanation()                       │
│ Limits: Check daily question/AI limits based on tier                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Journey 4: Explorer Upgrade Prompt

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Dashboard (Explorer user, day 50)                                   │
│ Page: /dashboard                                                             │
│ Check: explorerDaysLeft = 10, requiresUpgrade = false                       │
│ Display: Warning banner "10 days left on Explorer"                          │
│ Action: Click "Upgrade Now"                                                 │
│ Destination: /pricing                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Pricing Page                                                        │
│ Page: /pricing                                                               │
│ Display: Current plan badge on Explorer, Scholar/Achiever upgrade options   │
│ Action: Click "Upgrade Now" on Scholar                                      │
│ API: createCheckoutSession('scholar')                                       │
│ Destination: Stripe Checkout                                                │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Journey 5: Forced Upgrade (Explorer after 60 days)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Dashboard (Explorer user, day 61+)                                  │
│ Page: /dashboard                                                             │
│ Check: requiresUpgrade = true                                               │
│ Display: BLOCKING MODAL - "Time to Upgrade!"                                │
│ User cannot access dashboard features until upgraded                        │
│ Action: Click "Upgrade to Scholar - $5/month"                               │
│ Destination: /pricing                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Reference

### Frontend Files

| File | Purpose |
|------|---------|
| `apps/web/src/lib/auth.ts` | Authentication functions, token management |
| `apps/web/src/lib/api.ts` | API client, type definitions |
| `apps/web/src/app/(auth)/get-started/page.tsx` | **Email capture (Step 1 of funnel)** |
| `apps/web/src/app/(auth)/choose-plan/page.tsx` | **Plan selection (Step 2, no auth)** |
| `apps/web/src/app/(auth)/register/page.tsx` | Account creation with locked plan |
| `apps/web/src/app/(auth)/verify/page.tsx` | Email verification |
| `apps/web/src/app/(auth)/login/page.tsx` | Login with checkout flow support |
| `apps/web/src/app/(parent)/dashboard/page.tsx` | Parent dashboard |
| `apps/web/src/app/(parent)/pricing/page.tsx` | Subscription management (authenticated) |
| `apps/web/src/app/(parent)/children/add/page.tsx` | Add child profile |
| `apps/web/src/app/(student)/child-login/page.tsx` | Child PIN login |
| `apps/web/src/app/(student)/learn/page.tsx` | Learning session |
| `apps/web/src/app/(student)/benchmark/page.tsx` | Benchmark test |

### Backend Files

| File | Purpose |
|------|---------|
| `packages/api/src/handlers/cognito-trigger.ts` | **Creates user profile on email verification** |
| `packages/api/src/handlers/payment.ts` | **Stripe webhooks, tier/status updates** |
| `packages/api/src/handlers/child.ts` | Child CRUD, PIN verification |
| `packages/api/src/handlers/progress.ts` | Learning progress tracking |
| `packages/api/src/handlers/curriculum.ts` | Question generation |
| `packages/api/src/handlers/ai.ts` | AI explanations, rate limiting |
| `packages/api/src/scripts/backfill-user-profiles.ts` | **Migration script for existing users** |

### Infrastructure

| File | Purpose |
|------|---------|
| `infrastructure/cdk/src/stacks/api-stack.ts` | Lambda, API Gateway, env vars |
| `infrastructure/cdk/src/stacks/auth-stack.ts` | Cognito User Pool |
| `infrastructure/cdk/src/stacks/data-stack.ts` | DynamoDB tables |

---

## Common Pitfalls

### 1. Query Parameter Preservation in Redirects

**Problem:** When redirecting unauthenticated users to login, query parameters get lost.

**Example:** User goes to `/pricing?plan=scholar` → redirected to `/login?redirect=/pricing` → logs in → lands on `/pricing` without `?plan=scholar`

**Solution:** URL-encode the full path including query params:
```typescript
// WRONG
router.push('/login?redirect=/pricing')

// CORRECT
const planParam = selectedPlan ? `?plan=${selectedPlan}` : ''
router.push(`/login?redirect=/pricing${encodeURIComponent(planParam)}`)
```

### 2. Checking Authentication State

**Problem:** Using async auth check causes flash of unauthenticated content.

**Solution:** Use `isAuthenticatedSync()` for immediate redirect decisions:
```typescript
useEffect(() => {
  if (!isAuthenticatedSync()) {
    router.push('/login')
    return
  }
  // Load data only if authenticated
  loadData()
}, [])
```

### 3. Subscription Status Before Dashboard Access

**Problem:** Users with no subscription can access dashboard.

**Solution:** Always check subscription status:
```typescript
const checkSubscriptionAndLoad = async () => {
  const status = await getSubscriptionStatus()

  // Free tier with no subscription = new user, needs to pick plan
  if (status.tier === 'free' && !status.subscriptionId) {
    router.push('/pricing')
    return
  }

  // Continue loading dashboard...
}
```

### 4. Stripe Webhook Signature Verification

**Problem:** Webhook processing fails silently.

**Solution:** Always verify webhook signature:
```typescript
const sig = event.headers['stripe-signature']
const stripeEvent = stripe.webhooks.constructEvent(
  event.body || '',
  sig,
  STRIPE_WEBHOOK_SECRET
)
```

### 5. Explorer Tier Expiration

**Problem:** Explorer users continue using service after 60 days.

**Solution:** Check `requiresUpgrade` flag on every dashboard load:
```typescript
if (subscription?.requiresUpgrade) {
  // Show blocking modal, prevent dashboard access
}
```

### 6. Child Session Persistence

**Problem:** Child ID lost when navigating between pages.

**Solution:** Use localStorage with helper functions:
```typescript
export const setSelectedChild = (childId: string) => {
  localStorage.setItem(CHILD_KEY, childId)
}

export const getSelectedChild = (): string | null => {
  return localStorage.getItem(CHILD_KEY)
}
```

### 7. Suspense for useSearchParams

**Problem:** Next.js error when using `useSearchParams` without Suspense.

**Solution:** Wrap components using `useSearchParams` in Suspense:
```typescript
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}
```

### 8. CloudFront Cache After Deployment

**Problem:** Users see old content after S3 deployment.

**Solution:** Always invalidate CloudFront cache:
```bash
aws s3 sync out/ s3://bucket-name --delete
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

---

## Environment Variables

### Required in `.env` (gitignored)

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PRICE_EXPLORER=price_xxx
STRIPE_PRICE_SCHOLAR=price_xxx
STRIPE_PRICE_ACHIEVER=price_xxx

# AI
GROQ_API_KEY=gsk_xxx

# Admin
ADMIN_API_KEY=xxx
```

### Loading for CDK Deploy

```bash
source .env
npx cdk deploy AgentsFormApiStack
```

---

## API Endpoints

### Authentication

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | No | Create new user |
| `/auth/confirm` | POST | No | Verify email with code |
| `/auth/login` | POST | No | Get tokens |
| `/auth/refresh` | POST | No | Refresh access token |

### Payments

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/payments/create-checkout` | POST | Yes | Create Stripe session |
| `/payments/status` | GET | Yes | Get subscription status |
| `/payments/portal` | GET | Yes | Get billing portal URL |
| `/payments/webhook` | POST | No | Stripe webhook handler |

### Children

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/children` | GET | Yes | List all children |
| `/children` | POST | Yes | Create child |
| `/children/{id}` | GET | Yes | Get child details |
| `/children/{id}` | PUT | Yes | Update child |
| `/children/{id}` | DELETE | Yes | Delete child |
| `/children/login` | POST | No | Child login (parentEmail + childName + PIN or childId + PIN) |

---

## Future Enhancements

### TODO: Multi-User Login on Same Browser

**Status:** Not implemented

**Requirement:** Allow multiple parent accounts to be logged in simultaneously on the same browser/device.

**Current Limitation:** Single set of tokens in localStorage means only one parent can be logged in at a time.

**Proposed Solution:**
1. Use account-specific localStorage keys: `studymate_token_{userId}`
2. Add account switcher UI in header
3. Maintain list of logged-in accounts
4. Allow quick switching without re-entering password

**Implementation Notes:**
- Would require refactoring `lib/auth.ts` token storage
- Need account picker component
- Consider session timeout per account
- Handle edge case: child logged in under parent A, parent B switches

**Files to Modify:**
- `apps/web/src/lib/auth.ts` - Token storage with user ID
- `apps/web/src/components/AccountSwitcher.tsx` - New component
- All pages with auth checks - Update to use current account context

---

## Deployment Infrastructure

### Domain Architecture

```
agentsform.ai (Parent Landing)
├── Corporate landing page with "Try StudyMate" button
├── Source: apps/corporate/index.html
└── Links to: tutor.agentsform.ai

tutor.agentsform.ai (StudyMate App)
├── Full StudyMate application (Next.js)
├── Source: apps/web/
└── Pricing, Dashboard, Learning, etc.
```

### S3 Buckets & CloudFront Distributions

| Domain | CloudFront ID | S3 Bucket | Content |
|--------|---------------|-----------|---------|
| `agentsform.ai` | `E1QP7Q4V8GZBLK` | `www.agentsform.ai` | **Corporate landing page** |
| `tutor.agentsform.ai` | `E1WZZKB5A9CWD6` | `onceoffresourcesstack-techxbucket00f18e48-h7seokhaha6q` | **StudyMate app** |
| `agentsform.com` | `E1WX2ZJZ8F0CW5` | `onceoffresourcesstack-techxbucket00f18e48-h7seokhaha6q` | StudyMate app (legacy) |
| `agentsformation.com` | `E24HVBUAJPT5V0` | `onceoffresourcesstack-techxbucket00f18e48-h7seokhaha6q` | StudyMate app (legacy) |

### Deployment Commands

```bash
# ============================================
# STUDYMATE APP (tutor.agentsform.ai)
# ============================================
cd apps/web
pnpm build

# Deploy to tutor.agentsform.ai (and legacy domains sharing TechX bucket)
aws s3 sync out/ s3://onceoffresourcesstack-techxbucket00f18e48-h7seokhaha6q --delete
aws cloudfront create-invalidation --distribution-id E1WZZKB5A9CWD6 --paths "/*"  # tutor.agentsform.ai
aws cloudfront create-invalidation --distribution-id E1WX2ZJZ8F0CW5 --paths "/*"  # agentsform.com (legacy)

# ============================================
# CORPORATE LANDING (agentsform.ai)
# ============================================
# Only deploy when updating the parent landing page
aws s3 cp apps/corporate/index.html s3://www.agentsform.ai/index.html
aws cloudfront create-invalidation --distribution-id E1QP7Q4V8GZBLK --paths "/*"
```

### Common Deployment Mistakes

1. **Deploying StudyMate to www.agentsform.ai bucket**: This overwrites the corporate landing page! StudyMate goes to TechX bucket only.
2. **Forgetting CloudFront invalidation**: S3 changes won't show immediately without cache invalidation
3. **Confusing agentsform.ai with tutor.agentsform.ai**: Parent landing vs app - they use DIFFERENT buckets

---

## Deployment Checklist

When modifying user management features:

- [ ] Test full registration flow (new browser/incognito)
- [ ] Test login with redirect preservation
- [ ] Test subscription upgrade flow
- [ ] Test child creation and PIN login
- [ ] Verify Stripe webhook receives events
- [ ] Check CloudFront cache invalidated
- [ ] Test on mobile viewport
- [ ] Verify error states show correctly

---

## Support Contacts

- **Technical Issues:** tendai@agentsform.ai
- **Billing Issues:** Stripe Dashboard
- **AWS Issues:** AWS Console

---

## Changelog

### Version 1.2 (January 4, 2026)
- **Family-Scoped Child Login**: Changed child authentication from username-only to parent email + child name + PIN
  - Prevents username collisions across families (e.g., two "Thomas" children from different families)
  - Added `email-index` GSI to DynamoDB for efficient parent email lookups
  - Updated `/children/login` endpoint to accept `parentEmail` + `childName` + `pin`
  - QR code / deep link flow (`childId` + `pin`) still works for direct links
  - Updated child-login page with 3-step flow: Email → Name → PIN
- **Year 5 Curriculum Fallback**: Curriculum API now falls back to Year 5 content when requested year level has no data
  - Ensures all year levels have learning content while curriculum is being developed
  - Returns `effectiveYearLevel` and `requestedYearLevel` in response

### Version 1.1 (January 3, 2026)
- **Netflix-Style Signup Funnel**: Implemented email-first capture flow
  - New `/get-started` page for email capture
  - New `/choose-plan` page for plan selection (no auth required)
  - Updated `/register` to show locked plan with email pre-filled
  - Updated `/login` to support `?checkout=plan` parameter for auto-redirect to Stripe
- **User Status Tracking**: Added `status` field to DynamoDB user profile
  - `unverified` → `verified` → `active` → `cancelled`
  - Set by Cognito trigger and Stripe webhooks
- **Enhanced User Profile Schema**: Added new fields
  - `name`: Display name from Cognito
  - `status`: Subscription status
  - `verifiedAt`: Email verification timestamp
  - `subscribedAt`: First subscription timestamp
- **Backfill Script**: Updated to set correct status for existing users
- **Documentation**: Added Data Models section with field update matrix

### Version 1.0 (January 2026)
- Initial documentation covering user management flows
- Authentication with Cognito
- Subscription tiers (Explorer, Scholar, Achiever)
- Child profile management

---

*Last Updated: January 4, 2026*
*Version: 1.2*
