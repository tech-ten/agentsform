# StudyMate User Management Developer Guide

## Overview

This document provides a comprehensive guide to the user management system in StudyMate, including authentication flows, subscription management, and user journeys. Use this as the definitive reference when modifying user-related functionality.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [User Types](#user-types)
3. [Authentication Flow](#authentication-flow)
4. [Subscription Tiers](#subscription-tiers)
5. [Complete User Journeys](#complete-user-journeys)
6. [File Reference](#file-reference)
7. [Common Pitfalls](#common-pitfalls)
8. [Future Enhancements](#future-enhancements)

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

## User Types

### Parent (Primary User)
- Creates account via Cognito
- Manages subscription payments
- Creates and manages child profiles
- Views progress reports and analytics

### Child (Sub-User)
- Created by parent
- Logs in with 4-digit PIN
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
```typescript
// Child login uses PIN stored in DynamoDB
POST /children/verify-pin
Body: { childId: string, pin: string }
Response: { valid: boolean, child: Child }
```

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

### Journey 1: New User Registration → First Learning Session

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 1: Landing Page                                                        │
│ Page: /                                                                      │
│ Action: Click "Get Started" or "Start free trial"                           │
│ Destination: /pricing?plan=scholar                                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Pricing Page (Unauthenticated)                                      │
│ Page: /pricing?plan=scholar                                                  │
│ Check: isAuthenticatedSync() → FALSE                                        │
│ Action: Redirect to login with preserved plan param                         │
│ Destination: /login?redirect=/pricing%3Fplan%3Dscholar                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Login Page                                                          │
│ Page: /login?redirect=/pricing%3Fplan%3Dscholar                             │
│ New user: Click "Create account"                                            │
│ Destination: /register                                                       │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Registration                                                        │
│ Page: /register                                                              │
│ Action: Enter name, email, password                                         │
│ API: signUp() → Cognito creates unverified user                             │
│ Destination: /verify?email=user@example.com                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Email Verification                                                  │
│ Page: /verify?email=user@example.com                                        │
│ Action: Enter 6-digit code from email                                       │
│ API: confirmSignUp() → Cognito verifies email                               │
│ Destination: /login?redirect=/pricing?plan=scholar                          │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 6: Login After Verification                                            │
│ Page: /login?redirect=/pricing?plan=scholar                                  │
│ Action: Enter email and password                                            │
│ API: signIn() → Get tokens, store in localStorage                           │
│ Destination: /pricing?plan=scholar (from redirect param)                    │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 7: Pricing Page (Authenticated, No Subscription)                       │
│ Page: /pricing?plan=scholar                                                  │
│ Check: getSubscriptionStatus() → tier: 'free', subscriptionId: null         │
│ Display: Scholar plan highlighted with "Recommended for you" badge          │
│ Action: Click "Start free trial" on Scholar plan                            │
│ API: createCheckoutSession('scholar') → Get Stripe Checkout URL             │
│ Destination: Stripe Checkout (new tab)                                      │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ STEP 8: Stripe Checkout                                                     │
│ Page: Stripe hosted checkout                                                │
│ Action: Enter payment details                                               │
│ Webhook: checkout.session.completed → Update DynamoDB tier                  │
│ Redirect: /dashboard?payment=success                                        │
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
│ STEP 2: Child PIN Entry                                                     │
│ Page: /child-login?child={childId}                                           │
│ Display: Child avatar and name, PIN entry pad                               │
│ Action: Enter 4-digit PIN                                                   │
│ API: verifyChildPin() → Validate PIN                                        │
│ Store: setSelectedChild(childId) in localStorage                            │
│ Destination: /curriculum                                                    │
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
| `apps/web/src/app/(auth)/login/page.tsx` | Parent login page |
| `apps/web/src/app/(auth)/register/page.tsx` | Parent registration |
| `apps/web/src/app/(auth)/verify/page.tsx` | Email verification |
| `apps/web/src/app/(parent)/dashboard/page.tsx` | Parent dashboard |
| `apps/web/src/app/(parent)/pricing/page.tsx` | Subscription plans |
| `apps/web/src/app/(parent)/children/add/page.tsx` | Add child profile |
| `apps/web/src/app/(student)/child-login/page.tsx` | Child PIN login |
| `apps/web/src/app/(student)/learn/page.tsx` | Learning session |
| `apps/web/src/app/(student)/benchmark/page.tsx` | Benchmark test |

### Backend Files

| File | Purpose |
|------|---------|
| `packages/api/src/handlers/auth.ts` | Cognito integration |
| `packages/api/src/handlers/payment.ts` | Stripe subscriptions, tier limits |
| `packages/api/src/handlers/children.ts` | Child CRUD, PIN verification |
| `packages/api/src/handlers/progress.ts` | Learning progress tracking |
| `packages/api/src/handlers/questions.ts` | Question generation |
| `packages/api/src/handlers/tutor.ts` | AI explanations |

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
| `/children/{id}` | PUT | Yes | Update child |
| `/children/{id}` | DELETE | Yes | Delete child |
| `/children/verify-pin` | POST | Yes | Verify child PIN |

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

*Last Updated: January 2026*
*Version: 1.0*
