# StudyMate - AI-Powered Learning Platform

[![Live](https://img.shields.io/badge/Live-tutor.agentsform.ai-blue)](https://tutor.agentsform.ai)
[![AWS](https://img.shields.io/badge/AWS-Serverless-orange)](https://aws.amazon.com)
[![AI](https://img.shields.io/badge/AI-LLaMA%203.3%2070B-green)](https://groq.com)

> **Production SaaS platform** helping Australian primary school students (Years 3-6) master the Victorian curriculum through AI-powered, personalised learning.

---

## Live Demo

**Website**: [tutor.agentsform.ai](https://tutor.agentsform.ai)

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLOUDFRONT CDN                          │
│                   tutor.agentsform.ai                        │
└─────────────────────────────────────────────────────────────┘
                            │
         ┌──────────────────┴──────────────────┐
         ▼                                      ▼
┌─────────────────┐                  ┌─────────────────────────┐
│       S3        │                  │      API GATEWAY        │
│  Next.js 14     │                  │   HTTP API (v2)         │
│  Static Export  │                  │   RESTful Endpoints     │
└─────────────────┘                  └─────────────────────────┘
                                                │
              ┌─────────────────────────────────┼─────────────────────────────────┐
              ▼                                 ▼                                 ▼
    ┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
    │     LAMBDA      │              │     LAMBDA      │              │     LAMBDA      │
    │   Core API      │              │   AI Tutor      │              │   Payments      │
    │   Node 20 ARM   │              │   Groq API      │              │   Stripe        │
    └─────────────────┘              └─────────────────┘              └─────────────────┘
              │                                 │                                 │
              └─────────────────────────────────┼─────────────────────────────────┘
                                                ▼
                              ┌─────────────────────────────────┐
                              │           DYNAMODB              │
                              │       Single-Table Design       │
                              │    Users, Children, Progress    │
                              └─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                        COGNITO                               │
│              OAuth 2.0 Authentication                        │
│              JWT Token Validation                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 14, React 18, TypeScript, Tailwind CSS |
| **Backend** | AWS Lambda (Node.js 20, ARM64), API Gateway HTTP |
| **Database** | DynamoDB (single-table design) |
| **Auth** | AWS Cognito (OAuth 2.0, JWT) |
| **AI** | Groq API (LLaMA 3.3 70B) |
| **Payments** | Stripe (subscriptions, webhooks, billing portal) |
| **CDN** | CloudFront + S3 |
| **IaC** | AWS CDK (TypeScript) |

---

## Features

### For Parents
- Add multiple children with PIN-based login
- Real-time progress dashboard
- Accuracy trends and weak area identification
- Subscription management via Stripe portal

### For Students
- Victorian curriculum-aligned content (Years 3-6 Maths)
- AI tutor that explains concepts at their level
- Gamification: XP, badges, streaks, levels
- Cambridge-style timed exams

### For Developers
- 100% Infrastructure as Code (AWS CDK)
- Single `cdk deploy` for entire stack
- Comprehensive API documentation
- Clean monorepo structure (pnpm workspaces)

---

## Project Structure

```
studymate/
├── apps/
│   └── web/                    # Next.js 14 frontend
│       └── src/
│           ├── app/            # App router pages
│           │   ├── (parent)/   # Parent dashboard, pricing
│           │   └── (student)/  # Learning, exams, curriculum
│           ├── components/     # UI components
│           └── lib/            # API client, auth utilities
├── packages/
│   ├── api/                    # Lambda handlers
│   │   └── src/handlers/       # ai.ts, payment.ts, etc.
│   └── curriculum/             # Curriculum data (future)
├── infrastructure/
│   └── cdk/                    # AWS CDK stacks
│       └── src/stacks/         # api-stack.ts, auth-stack.ts
└── docs/                       # Documentation
    ├── INVESTOR_DECK.md
    ├── DEVELOPER_GUIDE.md
    └── ...
```

---

## Key Technical Decisions

### Why Serverless?
- **Cost**: ~$0.04/user/month at scale
- **Scale**: True scale-to-zero for education traffic (evening/weekend peaks)
- **Speed**: Cold starts <500ms with ARM64 + ESBuild

### Why Single-Table DynamoDB?
- **Performance**: Single-digit millisecond reads
- **Cost**: Pay per request, no provisioned capacity
- **Flexibility**: Composite keys enable complex access patterns

### Why Static Export?
- **Speed**: Sub-100ms TTFB globally via CloudFront
- **Cost**: S3 hosting costs pennies
- **Reliability**: No server to fail

### Why Groq over OpenAI?
- **Cost**: Free tier (30 req/min)
- **Speed**: 10x faster than GPT-4
- **Quality**: LLaMA 3.3 70B comparable to GPT-4

---

## Deployment

```bash
# 1. Install dependencies
pnpm install

# 2. Source environment variables
source .env

# 3. Deploy infrastructure
cd infrastructure/cdk && npx cdk deploy --all

# 4. Build and deploy frontend
pnpm --filter @studymate/web build
aws s3 sync apps/web/out s3://<bucket> --delete
aws cloudfront create-invalidation --distribution-id <id> --paths "/*"
```

---

## Cost Analysis

| Service | Monthly Cost (per user) |
|---------|------------------------|
| Lambda | $0.005 |
| API Gateway | $0.003 |
| DynamoDB | $0.008 |
| CloudFront | $0.004 |
| Groq AI | $0.015 |
| **Total** | **~$0.04** |

At $5/month subscription = **125x gross margin**

---

## Documentation

| Document | Purpose |
|----------|---------|
| [PRODUCT.md](PRODUCT.md) | Feature overview, user journeys |
| [CLAUDE.md](CLAUDE.md) | AI assistant context, deployment guide |
| [docs/INVESTOR_DECK.md](docs/INVESTOR_DECK.md) | Business overview, competitive analysis |
| [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) | API reference, architecture details |
| [PHASE2_PLAN.md](PHASE2_PLAN.md) | AWS resources, implementation status |

---

## About the Builder

**Tendai Mudavanhu** - AWS Solutions Architect, AI Engineer

This project demonstrates production-grade skills in:
- **AWS Architecture**: Serverless, multi-tenant SaaS design
- **AI Integration**: LLM-powered applications with safety guardrails
- **Payment Systems**: Stripe subscriptions, webhooks, billing portals
- **Security**: OAuth, JWT, child data protection, Privacy Act compliance
- **DevOps**: Infrastructure as Code, CDK, CI/CD-ready architecture

Built to solve a personal problem (expensive tutoring for my kids) while showcasing enterprise-ready architectural patterns applicable to FinTech, WealthTech, and EdTech domains.

---

## License

Proprietary - All rights reserved

---

*Built with AWS, Next.js, and LLaMA 3.3 | Live at [tutor.agentsform.ai](https://tutor.agentsform.ai)*
