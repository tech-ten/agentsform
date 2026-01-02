# LinkedIn Profile & Post Updates

## The Problem with Most LinkedIn Posts

Cringy posts:
- "I'm humbled to announce..."
- "After years of hard work, I finally..."
- Lists of buzzwords without substance
- Humble-bragging about achievements

What actually works (Silicon Valley style):
- Show the problem, show the solution
- Numbers that matter
- Technical specifics that prove you built it
- Honesty about trade-offs

---

## Recommended LinkedIn Post

**Simple. Direct. Technical. No cringe.**

---

I was paying $160/month for Kumon. Two kids, $80 each.

The problem: worksheets at a fixed pace. No AI. No personalisation. My younger son couldn't keep up.

So I built an alternative.

**tutor.agentsform.ai** - live, accepting payments.

The stack:
- Next.js 14 static export on CloudFront
- Lambda (Node 20, ARM64) behind API Gateway
- DynamoDB single-table design
- Cognito for parent auth, PIN-based for kids
- Stripe subscriptions with webhook lifecycle
- Groq LLaMA 3.3 70B for AI tutoring

Infrastructure cost: $0.04/user/month.
Subscription: $5-12/month.
Margin: 125x.

Victorian curriculum aligned. Years 3-6 Maths. Cambridge-style exams.

Time to build: ~30 days evenings/weekends.

The interesting architectural decision: two-tier auth. Parents get full Cognito OAuth. Kids just enter username + PIN—no email, no password reset flow. Different users, different needs.

Code is at github.com/tech-ten/studymate if you want to see the CDK stacks.

---

**Why this works:**
1. Opens with a relatable problem (everyone knows tutoring is expensive)
2. Shows you actually shipped something (live URL)
3. Technical specifics prove you built it (not vaporware)
4. Business metrics show you understand unit economics
5. Interesting architectural callout shows depth
6. No self-congratulation, just facts
7. Open source link = credibility

---

## Profile Updates

### Current Headline
```
Data & Analytics Engineer | Building Automated Solutions That Save Millions | Python | SQL | AWS | Spatial Intelligence | Consulting
```

### Recommended Headline
```
Data & Analytics Lead | AWS Solutions Architect | Building AI-Powered SaaS | Python, Serverless, LLMs | MBA Candidate
```

**Why:**
- "Lead" matches your current role (Network Planning Manager)
- "AWS Solutions Architect" reflects your NBN experience + StudyMate
- "Building AI-Powered SaaS" is current and differentiating
- "LLMs" signals you're not just doing traditional data work
- "MBA Candidate" adds business credibility for CDAO/CAIO path

---

### Current About Section

Your current About is good but could be stronger. Here's a revision:

### Recommended About Section

```
I build things that work.

Currently: Data & Analytics Lead at Metcash, building spatial intelligence for retail network planning. Previously: Solutions Architect at NBN, where I led a 5G prediction platform from requirements through production.

Side project: tutor.agentsform.ai — a production SaaS platform I built for my kids after getting tired of paying $160/month for Kumon. AWS serverless, LLaMA 3.3 AI tutor, Stripe subscriptions. Live and accepting payments.

14 years across Telstra, Ericsson, Huawei, NBN — mostly telecommunications, network optimization, and spatial analytics. $14M+ in documented savings from automation and process improvement.

What I do well:
→ Take messy data problems and ship working solutions
→ AWS architecture (Lambda, DynamoDB, Cognito, CDK)
→ Python automation that replaces manual processes
→ Spatial analytics and location intelligence

Currently building cloud and AI capabilities. Interested in Solutions Architect, AI Engineering, or Data leadership roles.

Tools: Python, SQL, AWS, TypeScript, Next.js, Serverless

Melbourne Business School MBA (2024-2026)
```

**Changes:**
1. Opens with confidence, not a sales pitch
2. Leads with current role + side project (shows you ship)
3. "Live and accepting payments" = not vaporware
4. Specific about AWS services (proves depth)
5. Clear about career direction
6. MBA adds business credibility

---

### Skills to Add

Add these to your LinkedIn skills:
- AWS Lambda
- AWS CDK
- DynamoDB
- API Gateway
- Serverless Architecture
- TypeScript
- Next.js
- LLMs / AI Integration
- Stripe Integration
- SaaS Architecture

---

### Featured Section

Add to your Featured section:
1. **StudyMate** - Link to tutor.agentsform.ai with description: "Production AI tutoring platform. AWS serverless, LLaMA 3.3, Stripe subscriptions."
2. **GitHub** - Link to github.com/tech-ten/studymate with description: "Full codebase with CDK infrastructure, Next.js frontend, Lambda handlers."

---

## Alternative Post (Shorter, More Casual)

---

Shipped a thing.

tutor.agentsform.ai

AI tutor for my kids. Victorian curriculum, Years 3-6 Maths.

Stack: Next.js, Lambda, DynamoDB, Cognito, Stripe, Groq.

Cost to run: $0.04/user/month.
Charges: $5-12/month.

Built it because Kumon was $160/month and my son couldn't keep up with the pace.

Now he learns at his speed. I can see his progress. And I cancelled the Kumon subscription.

---

**Why this works:**
- Ultra-concise
- Personal story without being emotional
- Technical enough to be credible
- Business outcome (cancelled the expensive thing)

---

## Post for Maximum Recruiter Visibility

If you specifically want to attract Solutions Architect recruiters:

---

Just deployed a production SaaS on AWS. Sharing the architecture in case it's useful.

**The app:** AI tutoring platform for primary school kids
**Live at:** tutor.agentsform.ai

**Architecture decisions:**

1. **Static export over SSR** — Next.js 14 builds to S3. No server to fail. Sub-100ms TTFB globally.

2. **HTTP API over REST API** — 71% cheaper. We don't need request validation or caching at the gateway level.

3. **Single-table DynamoDB** — Composite keys (USER#id, CHILD#id) handle all access patterns. No joins, no N+1.

4. **ARM64 Lambda** — 20% cheaper, measurably faster cold starts than x86.

5. **Two-tier auth** — Parents get Cognito JWT. Kids get PIN-only (they don't have emails). Same backend, different auth flows.

6. **Webhook-driven subscriptions** — Stripe webhooks handle the entire lifecycle. No polling.

**Result:** $0.04/user/month infrastructure. At $5/month subscription, that's 125x margin before AI costs.

Full CDK stacks are on GitHub: github.com/tech-ten/studymate

Happy to discuss trade-offs if anyone's building similar.

---

**Why this works for recruiters:**
- Demonstrates you can make architecture decisions (not just follow tutorials)
- Shows cost awareness (critical for enterprise roles)
- Explains trade-offs (shows senior thinking)
- "Happy to discuss" = approachable, not arrogant
- GitHub link = proof

---

## What NOT to Post

Avoid:
- "Excited to announce..."
- "After months of hard work..."
- "I'm proud to share..."
- Long lists of technologies without context
- Screenshots of ChatGPT conversations
- Asking for engagement ("What do you think?")
- Humble-bragging about working weekends

The Silicon Valley founders you admire (Stripe, Linear, Vercel) let the product speak. They post technical content, not emotional content.

---

## Timing

Best times to post on LinkedIn (Sydney time):
- Tuesday-Thursday, 8-9am (people checking before work)
- Tuesday-Thursday, 12-1pm (lunch break scrolling)

Avoid: Friday afternoon, weekends, Monday morning

---

*Save this file for reference. Update as your profile evolves.*
