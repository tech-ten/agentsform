# StudyMate Legal & Compliance Documentation

## Overview

StudyMate is committed to operating in full compliance with Australian law and protecting the privacy of our users, especially children. This document outlines our legal framework and compliance measures.

---

## 1. Australian Privacy Act 1988

### Compliance Status: ✅ Compliant

We comply with all 13 Australian Privacy Principles (APPs):

| Principle | Requirement | Our Implementation |
|-----------|-------------|-------------------|
| APP 1 | Open and transparent management | Privacy policy at /privacy |
| APP 2 | Anonymity and pseudonymity | Children use first name only |
| APP 3 | Collection of solicited personal information | Minimal data collection |
| APP 4 | Dealing with unsolicited personal information | N/A - we don't receive unsolicited data |
| APP 5 | Notification of collection | Consent obtained at registration |
| APP 6 | Use or disclosure | Data used only for education |
| APP 7 | Direct marketing | Opt-in only, never to children |
| APP 8 | Cross-border disclosure | All data stays in Australia |
| APP 9 | Adoption of government identifiers | We don't use government IDs |
| APP 10 | Quality of personal information | Users can update anytime |
| APP 11 | Security | Encryption at rest and in transit |
| APP 12 | Access to personal information | Available via dashboard |
| APP 13 | Correction of personal information | Self-service corrections |

---

## 2. Children's Data Protection

### Data Collected from Children

| Data | Collected | Purpose |
|------|-----------|---------|
| First name | ✅ | Personalise learning experience |
| Year level | ✅ | Age-appropriate content |
| Learning progress | ✅ | Track educational outcomes |
| Quiz answers | ✅ | Adaptive learning |
| AI chat logs | ✅ | Improve AI responses |
| Last name | ❌ | Not collected |
| Date of birth | ❌ | Not collected |
| Email address | ❌ | Not collected |
| School name | ❌ | Not collected |
| Photo/video | ❌ | Not collected |
| Location | ❌ | Not collected |

### Parental Consent

- All child accounts are created by verified parent accounts
- Parents must have verified email address
- Parents can view, edit, and delete child data
- Parents can revoke access at any time

### Child-Safe Design

- No advertising shown to children
- No social features (chat with other users)
- No external links in learning areas
- AI tutor has safety guardrails
- No gamification that encourages excessive use

---

## 3. Data Residency

### All Data Stored in Australia

| Service | Location | Provider |
|---------|----------|----------|
| Database | Sydney (ap-southeast-2) | AWS DynamoDB |
| User Auth | Sydney (ap-southeast-2) | AWS Cognito |
| Static Files | Sydney (ap-southeast-2) | AWS S3 |
| CDN Edge | Sydney primary | AWS CloudFront |
| Payments | Australia | Stripe |

### No Offshore Transfer

We do not transfer personal information outside Australia. Our AI provider (Groq) processes prompts but:
- We only send educational questions, not personal data
- Child's name is not included in AI requests
- Responses are not stored by Groq

---

## 4. Consumer Law (ACL) Compliance

### Australian Consumer Law Requirements

| Requirement | Our Implementation |
|-------------|-------------------|
| Clear pricing | Displayed on /pricing page |
| No hidden fees | Subscription price is all-inclusive |
| Easy cancellation | Self-service via Stripe portal |
| Refund policy | 14-day trial, pro-rata refunds |
| Fair terms | Plain English, no harsh clauses |

### Subscription Terms

- **Free trial**: 14 days, card required, not charged until trial ends
- **Billing**: Monthly, charged on subscription anniversary
- **Cancellation**: Effective immediately, access until period end
- **Refunds**: Pro-rata for annual plans, discretionary for monthly

---

## 5. Terms of Service Summary

Full terms available at: tutor.agentsform.ai/terms

### Key Terms

1. **Eligibility**: Parents must be 18+, children must have parental consent
2. **Account Security**: Users responsible for password/PIN security
3. **Acceptable Use**: Educational purposes only, no cheating/misuse
4. **Intellectual Property**: Content owned by StudyMate, licensed for personal use
5. **Liability**: Limited to subscription fees paid
6. **Disputes**: Governed by Victorian law, Melbourne jurisdiction

---

## 6. Privacy Policy Summary

Full policy available at: tutor.agentsform.ai/privacy

### What We Collect

**From Parents:**
- Email address
- Password (hashed, never stored in plain text)
- Payment information (processed by Stripe, we don't store card numbers)
- Subscription status

**From Children:**
- First name
- Year level
- Learning progress and quiz results
- AI tutor conversation logs

### How We Use Data

- Provide personalised learning experiences
- Track progress and generate reports for parents
- Improve our AI tutor and content
- Communicate with parents about their account

### What We Don't Do

- Sell data to third parties
- Show advertising to children
- Share data with schools (without consent)
- Use data for non-educational purposes

### Data Retention

- Active accounts: Data retained while account active
- Deleted accounts: Data deleted within 30 days
- AI logs: Anonymised after 90 days

---

## 7. Refund Policy Summary

Full policy available at: tutor.agentsform.ai/refund

### Free Trial
- 14-day trial included with paid plans
- Cancel before trial ends = no charge
- Trial starts when checkout completed

### Monthly Subscriptions
- Cancel anytime, effective immediately
- Access continues until billing period ends
- No refunds for partial months

### Annual Subscriptions (if offered)
- Cancel anytime, effective at period end
- Pro-rata refund available within first 30 days
- After 30 days, no refund but access continues

### Disputes
- Contact support first
- We aim to resolve within 5 business days
- Chargeback protection via Stripe

---

## 8. Security Measures

### Technical Security

| Measure | Implementation |
|---------|----------------|
| Encryption in transit | TLS 1.3 |
| Encryption at rest | AES-256 (DynamoDB) |
| Password storage | bcrypt hashing (Cognito) |
| API authentication | JWT tokens |
| Admin access | API key authentication |

### Operational Security

- AWS IAM least-privilege access
- CloudWatch monitoring and alerts
- No direct database access in production
- Secure credential management

### Incident Response

1. Detect via monitoring
2. Contain and assess impact
3. Notify affected users within 72 hours (if required)
4. Report to OAIC if notifiable breach
5. Remediate and document

---

## 9. Accessibility

### WCAG 2.1 Compliance Goals

- **Level A**: Currently compliant
- **Level AA**: Targeting by Q2 2026

### Current Features

- Keyboard navigation
- Screen reader compatible
- Sufficient colour contrast
- Resizable text
- No flashing content

---

## 10. Contact Information

### Privacy Enquiries
For questions about your data or to make a request:
- Email: privacy@agentsform.ai
- Response time: Within 30 days

### Complaints
If unsatisfied with our response:
- Office of the Australian Information Commissioner (OAIC)
- www.oaic.gov.au
- Phone: 1300 363 992

### General Support
- Website: tutor.agentsform.ai
- Email: support@agentsform.ai

---

## 11. Document Control

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2 Jan 2026 | Initial release |

This document is reviewed quarterly and updated as required.

---

## Legal Disclaimer

This document is for informational purposes and does not constitute legal advice. StudyMate operates under the laws of Victoria, Australia. For specific legal questions, consult a qualified legal professional.
