# LinkedIn Content - Ready to Post

## Post 1: Technical Achievement (For Recruiters)

---

**I built a production SaaS platform in 30 days. Here's the architecture:**

Last month, I was paying $160/month for Kumon tutoring for my two kids. The content was okay, but it wasn't personalised—just worksheets at a fixed pace.

So I built my own AI tutor.

**StudyMate** is now live at tutor.agentsform.ai

**The Stack:**
- Frontend: Next.js 14 (static export)
- Backend: AWS Lambda (Node.js 20, ARM64)
- Database: DynamoDB (single-table design)
- Auth: AWS Cognito (OAuth 2.0)
- AI: Groq LLaMA 3.3 70B
- Payments: Stripe (subscriptions + webhooks)
- CDN: CloudFront + S3
- IaC: AWS CDK (100% code-defined)

**The Numbers:**
- Infrastructure cost: $0.04/user/month
- Subscription price: $5-12/month
- Gross margin: 125x
- Cold start: <500ms
- API latency: <100ms

**Key Patterns:**
- Multi-tenant data isolation at partition level
- Two-tier auth (parents: Cognito JWT, children: PIN-only)
- Webhook-driven subscription lifecycle
- Single-table DynamoDB with composite keys

This isn't a side project. It's production infrastructure accepting real payments, serving real users, with proper security, monitoring, and compliance.

If you're looking for a Solutions Architect who ships, not just draws diagrams—let's talk.

#AWS #SolutionsArchitect #Serverless #AI #SaaS #FinTech #EdTech

---

## Post 2: Founder Story (For Network Growth)

---

**I cancelled my $160/month Kumon subscription. Here's why:**

My two kids were going to Kumon. $80 each. $160/month total.

The problem? It was just worksheets. Same pace for everyone. No AI. No personalisation.

Then I tried James An College. Better content, but my younger son couldn't keep up. His English was behind, and the group pace left him struggling.

He needed to learn at his own speed while still covering the curriculum.

So I built **StudyMate**.

**What it does:**
- AI tutor powered by LLaMA 3.3 (same quality as ChatGPT)
- Victorian curriculum alignment (VCAA codes, not generic content)
- Self-paced learning (kids who are behind can catch up)
- Parent dashboard (see exactly what your child is learning)
- $5-12/month (not $160-400)

**Is it just a ChatGPT wrapper?**

No. ChatGPT is a tool. StudyMate is a learning system.

- Structured curriculum: Strands → Chapters → Sections → Quizzes
- Progress tracking: Per-child, per-section, over time
- Cambridge-style exams: Timed tests for NAPLAN/selective prep
- Safety guardrails: No inappropriate content, Australian data residency

It's live now at tutor.agentsform.ai

I built this to solve my own problem. But if it helps other parents avoid the $2,000+/year tutoring trap, even better.

#EdTech #AI #Parenting #StartupLife #Australia

---

## Post 3: Architecture Deep Dive (For Technical Credibility)

---

**How I designed a multi-tenant SaaS on AWS Serverless (with diagrams)**

Building StudyMate taught me patterns that apply to any multi-tenant platform—EdTech, FinTech, WealthTech.

**The Challenge:**
- Multiple parents, each with multiple children
- Strict data isolation (parent can only see their kids)
- Subscription tiers (free, paid)
- AI calls with rate limiting
- Payments with webhook-driven lifecycle

**The Solution:**

**1. Single-Table DynamoDB**
```
PK: USER#userId
SK: PROFILE | CHILD#childId | PROGRESS#date
```
Composite keys ensure parents only access their partition.

**2. Two-Tier Authentication**
- Parents: Cognito JWT (full OAuth flow)
- Children: PIN-based (no tokens, localStorage only)

Why? Kids don't have emails. They need simple login (username + 4-digit PIN) without the complexity of OAuth.

**3. Stripe Webhook Lifecycle**
```
checkout.session.completed → Save customerId, set tier
customer.subscription.updated → Handle trial end
customer.subscription.deleted → Downgrade to free
```
The webhook handler extracts `session.customer` and persists it for billing portal access.

**4. Cost Optimization**
- Lambda ARM64: 20% cheaper, 10% faster
- API Gateway HTTP (v2): 71% cheaper than REST
- DynamoDB on-demand: Pay per request, not provisioned capacity
- CloudFront + S3: Static export, no server costs

**Result:** $0.04/user/month infrastructure cost.

At $5/month subscription, that's a 125x margin before AI costs.

The full architecture is documented in my GitHub. Link in comments.

#AWS #Architecture #Serverless #DynamoDB #SaaS #MultiTenant

---

## Post 4: Call to Action (For Recruiters)

---

**I'm looking for my next Senior Solutions Architect role. Here's what I bring:**

Just shipped a production SaaS platform (tutor.agentsform.ai) demonstrating:

**AWS Expertise:**
- Serverless (Lambda, API Gateway, DynamoDB)
- Auth (Cognito, JWT, OAuth 2.0)
- CDN (CloudFront, S3)
- IaC (CDK, 100% code-defined infrastructure)

**SaaS Patterns:**
- Multi-tenant data isolation
- Subscription billing (Stripe webhooks)
- Usage-based rate limiting
- Billing portal integration

**AI Integration:**
- LLM-powered features (Groq/LLaMA)
- Safety guardrails for child users
- Context-aware prompting

**Security:**
- Australian Privacy Act compliance
- Child data protection
- Two-tier authentication model

**DevOps:**
- Single-command deployment
- Environment management
- CloudFront cache invalidation

I'm targeting roles in:
- FinTech / WealthTech / Super platforms
- AI/ML engineering leadership
- Cloud architecture (AWS focus)

Open to: Sydney CBD (hybrid), $200k+ packages, permanent or long-term contract.

If this matches what you're looking for, let's connect.

#OpenToWork #SolutionsArchitect #AWS #Sydney #FinTech

---

## Post 5: The "Why Not ChatGPT" Objection (Thought Leadership)

---

**"Why would anyone pay for your AI tutor when ChatGPT is free?"**

I get this question a lot. Here's my answer:

ChatGPT is a tool. StudyMate is a learning system.

**The Difference:**

| Feature | ChatGPT | StudyMate |
|---------|---------|-----------|
| Curriculum | Generic | Victorian VCAA codes |
| Progress | None | Per-child, per-section |
| Structure | Random Q&A | Strands → Chapters → Quizzes |
| Parent View | None | Dashboard, accuracy, streaks |
| Assessment | None | Cambridge-style exams |
| Safety | Minimal | Child-safe, guardrailed |

**What parents actually pay for:**

1. **Structure** — "Learn this curriculum" not "ask anything"
2. **Accountability** — Progress tracking, streaks, reports
3. **Safety** — No inappropriate content, Australian data
4. **Peace of mind** — Covers exactly what school covers

My kids could use ChatGPT for free. But I built StudyMate because I wanted:
- To know what topics they're struggling with
- To see their progress over time
- To ensure they're covering the curriculum, not random trivia

The AI is the engine. The system is the product.

This applies to any AI product you're building. Don't compete on the model—compete on the experience, the data, the workflow.

#AI #ProductStrategy #EdTech #Startups

---

## Recruiter DM Template

---

Hi [Name],

I saw your posting for the Senior Solution Architect role at [Company]. The AWS/SaaS/API focus caught my attention.

I recently built a production SaaS platform (tutor.agentsform.ai) that demonstrates the exact skills you're looking for:

- **AWS**: Lambda, API Gateway, DynamoDB, Cognito, CloudFront, CDK
- **SaaS**: Multi-tenant architecture, subscription billing, usage metering
- **APIs**: RESTful design, Stripe webhooks, AI integration
- **Security**: OAuth, JWT, child data protection

The platform is live, accepting payments, and serving real users. Happy to walk through the architecture.

Would you be open to a quick call this week?

Best,
Tendai

---

## GitHub Profile README Snippet

---

### Featured Project: StudyMate

**Production SaaS platform** for AI-powered education

[![Live Demo](https://img.shields.io/badge/Live-tutor.agentsform.ai-blue)](https://tutor.agentsform.ai)

- **Stack**: Next.js 14, AWS Lambda, DynamoDB, Cognito, Stripe, Groq AI
- **Pattern**: Multi-tenant serverless SaaS with subscription billing
- **Cost**: $0.04/user/month infrastructure (125x margin)

[View Repository](https://github.com/tech-ten/studymate) | [Architecture Docs](https://github.com/tech-ten/studymate/blob/main/CLAUDE.md)

---

*All posts ready for copy-paste to LinkedIn. Adjust dates and specific numbers as needed.*
