# Implementation Plan: Progress Reports & Cross-Year Adaptive Grading

## Overview

This plan covers three interconnected features:
1. **Email Progress Reports** - Automated school-like reports sent to parents
2. **Cross-Year Adaptive Grading** - Students graded on Prep-Year 12 scale based on actual performance
3. **Curriculum Expansion** - Content from Prep to Year 12 for adaptive assessment

---

## Phase 1: Cross-Year Grading System

### 1.1 Grade Level Detection Algorithm

The system will assess students across year levels, adjusting their "working level" based on performance:

```typescript
interface StudentGradeLevel {
  childId: string;
  subject: string;

  // Enrolled year level (what parent set)
  enrolledYearLevel: number;  // e.g., 5

  // Working level (calculated from performance)
  workingYearLevel: number;   // e.g., 4.7 (slightly below Year 5)
  workingLevelLabel: string;  // "Year 4-5" or "Working at Year 4 level"

  // Performance breakdown by year level
  yearLevelPerformance: Record<number, {
    questionsAttempted: number;
    accuracy: number;
    masteryScore: number;  // 0-100
  }>;

  // Trend
  levelTrend: 'advancing' | 'stable' | 'needs-support';

  lastAssessed: string;
}
```

**Algorithm:**
1. Track performance on questions tagged by year level
2. If accuracy > 80% at current level for 20+ questions → try questions from next level up
3. If accuracy < 50% at current level for 10+ questions → include questions from level below
4. Calculate "working level" as weighted average based on recent performance
5. Display as school-style grade: "Working at Year 4-5 level" or "Exceeding Year 5 expectations"

### 1.2 Database Changes

Add new key pattern to `db.ts`:
```typescript
// Student's working grade level per subject
gradeLevel: (childId: string, subject: string) => ({
  PK: `CHILD#${childId}`,
  SK: `GRADELEVEL#${subject}`,
}),

// Year-level performance breakdown
yearPerformance: (childId: string, subject: string, yearLevel: number) => ({
  PK: `CHILD#${childId}`,
  SK: `YEARPERF#${subject}#Y${yearLevel}`,
}),
```

### 1.3 Files to Modify

| File | Changes |
|------|---------|
| `packages/api/src/lib/db.ts` | Add grade level key patterns |
| `packages/api/src/lib/analytics-schema.ts` | Add StudentGradeLevel interface |
| `packages/api/src/handlers/analytics.ts` | Add grade level calculation endpoint |
| `packages/api/src/handlers/curriculum.ts` | Modify adaptive question selection to pull from any year level |

---

## Phase 2: Curriculum Expansion (Prep - Year 12)

### 2.1 Current State
- **Implemented**: Year 3, 4, 5, 6 (Victorian Curriculum Maths)
- **Structure**: Strands → Chapters → Sections → Questions with knowledge tokens

### 2.2 Expansion Strategy

**Priority Order** (based on common user base):
1. **Year 5** ✅ (Complete - 340 questions, 17 sections)
2. **Year 6** (Partial)
3. **Year 4** (Partial)
4. **Year 3** (Partial)
5. **Year 7** (Foundation secondary)
6. **Prep, Year 1, Year 2** (Lower primary)
7. **Year 8-12** (Secondary)

**Content per Year Level**:
- 4-6 Strands (Number & Algebra, Measurement & Geometry, Statistics & Probability)
- 10-20 Sections per strand
- 20 questions per section (varied difficulty 1-3)
- Knowledge tokens for misconception tracking

### 2.3 Year Level Tags for Questions

Modify question schema to include explicit year level:
```typescript
interface Question {
  // Existing fields...
  yearLevel: number;           // 0 = Prep, 1-12 = Year levels
  yearLevelRange?: [number, number]; // For questions spanning levels, e.g., [4, 5]
}
```

### 2.4 Files to Create/Modify

| File | Action |
|------|--------|
| `packages/curriculum/src/maths/year0.ts` | Create (Prep) |
| `packages/curriculum/src/maths/year1.ts` | Create |
| `packages/curriculum/src/maths/year2.ts` | Create |
| `packages/curriculum/src/maths/year7.ts` | Create |
| `packages/curriculum/src/maths/year8.ts` | Create (future) |
| `packages/curriculum/src/types.ts` | Add yearLevel to Question interface |

---

## Phase 3: School-Style Progress Reports

### 3.1 Report Structure

```typescript
interface SchoolStyleReport {
  // Header
  childName: string;
  childAvatar: string;
  reportPeriod: { start: string; end: string };
  generatedAt: string;

  // Overall Grade Summary
  overallGrade: {
    workingLevel: string;           // "Year 4-5"
    enrolledLevel: number;          // 5
    gradeStatus: 'above' | 'at' | 'below';  // Relative to enrolled level
    gradeComment: string;           // "Working slightly below Year 5 expectations"
  };

  // Subject Breakdown (school report card style)
  subjects: Array<{
    subject: string;                // "Mathematics"
    workingLevel: string;           // "Year 4"
    grade: 'A' | 'B' | 'C' | 'D' | 'E';  // Traditional letter grade
    effort: 'Excellent' | 'Good' | 'Satisfactory' | 'Needs Improvement';

    // Strand breakdown (like school subjects have topics)
    strands: Array<{
      name: string;                 // "Number and Algebra"
      grade: 'A' | 'B' | 'C' | 'D' | 'E';
      comment: string;              // "Shows strong understanding of place value"
      areasOfStrength: string[];
      areasForImprovement: string[];
    }>;

    teacherComment: string;         // AI-generated personalized comment
  }>;

  // Activity Summary
  activitySummary: {
    daysActive: number;
    questionsCompleted: number;
    timeSpentMinutes: number;
    streakDays: number;
    aiTutorSessions: number;
  };

  // Achievements & Badges
  achievements: Array<{
    title: string;
    description: string;
    earnedAt: string;
    icon: string;
  }>;

  // Recommendations
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    area: string;
    suggestion: string;
    homeActivity?: string;          // "Practice times tables for 10 minutes daily"
  }>;

  // Parent Message
  parentMessage: string;            // AI-generated summary for parents
}
```

### 3.2 Grade Calculation

**Letter Grade Mapping** (based on accuracy within their working level):
| Accuracy | Grade | Description |
|----------|-------|-------------|
| 90-100%  | A     | Outstanding |
| 75-89%   | B     | Good |
| 60-74%   | C     | Satisfactory |
| 45-59%   | D     | Needs Improvement |
| 0-44%    | E     | Significant Support Needed |

**Working Level Calculation**:
- Below enrolled level by 1+ year = "Working towards Year X"
- At enrolled level (±0.5) = "Working at Year X level"
- Above enrolled level by 1+ year = "Exceeding Year X expectations"

### 3.3 Files to Create

| File | Purpose |
|------|---------|
| `packages/api/src/handlers/reports.ts` | Report generation endpoint |
| `packages/api/src/lib/report-generator.ts` | Core report logic |
| `packages/api/src/lib/grade-calculator.ts` | Grade calculation logic |
| `packages/api/src/templates/report-email.html` | Email HTML template |

---

## Phase 4: Email Delivery System

### 4.1 AWS SES Setup

**Current State**:
- SES is configured in `ap-southeast-2`
- Verified sender: `tendai@agentsform.ai`
- Email forwarding Lambda exists

**Required**:
- New Lambda for sending progress reports
- Email templates stored in S3 or inline
- Scheduled trigger (weekly/monthly)

### 4.2 Email Configuration

```typescript
interface EmailConfig {
  from: 'reports@agentsform.ai' | 'noreply@agentsform.ai';
  replyTo: 'support@agentsform.ai';
  templateBucket?: string;
}

interface ReportEmailRequest {
  parentEmail: string;
  parentName: string;
  childName: string;
  report: SchoolStyleReport;
  frequency: 'weekly' | 'fortnightly' | 'monthly';
}
```

### 4.3 Scheduling Options

1. **On-Demand**: Parent clicks "Send Report" in dashboard
2. **Scheduled**: Weekly/monthly automatic reports (EventBridge rule)
3. **Milestone**: After completing sections or achieving badges

### 4.4 Files to Create

| File | Purpose |
|------|---------|
| `packages/api/src/handlers/email.ts` | Email sending handler |
| `packages/api/src/lib/email-service.ts` | SES integration |
| `infrastructure/cdk/src/stacks/email-stack.ts` | SES resources & scheduled Lambda |

---

## Phase 5: Frontend Updates

### 5.1 Parent Dashboard Enhancements

| Component | Changes |
|-----------|---------|
| `/dashboard` | Add "View Report" button, show working grade level |
| `/progress` | Show cross-year performance chart |
| `/analytics` | Display grade comparison to enrolled level |

### 5.2 New Pages

| Page | Purpose |
|------|---------|
| `/report/:childId` | View/print school-style report |
| `/settings/reports` | Configure email frequency preferences |

---

## Implementation Order

### Sprint 1: Grade Level System (Foundation)
1. Add database key patterns for grade level tracking
2. Implement grade level calculation algorithm
3. Modify adaptive question selection to use cross-year questions
4. Update analytics endpoint to return working level

### Sprint 2: Report Generation
1. Create report generator service
2. Implement school-style report structure
3. Add AI-generated comments using Groq
4. Create HTML email template

### Sprint 3: Email Delivery
1. Set up SES email sending Lambda
2. Add CDK infrastructure for scheduled emails
3. Implement on-demand report sending
4. Add email preference settings for parents

### Sprint 4: Curriculum Expansion
1. Create Year 7 curriculum (bridge to secondary)
2. Create Year 1-2 curriculum (lower primary)
3. Create Prep curriculum
4. Expand Year 3, 4, 6 question banks

### Sprint 5: Frontend
1. Add report view page
2. Update dashboard with grade level display
3. Add email settings page
4. Cross-year performance visualization

---

## Deployment Notes

**Important**:
- Always run `pnpm build` in `packages/api` before CDK deploy
- Delete `cdk.out` folder to force Lambda code updates
- Source `.env` file for environment variables before deploy

```bash
# Correct deployment sequence
cd packages/api && pnpm build
cd ../../infrastructure/cdk
rm -rf cdk.out
source ../../.env
npx cdk deploy AgentsFormApi --require-approval never
```

---

## Risk Considerations

1. **Curriculum Content Volume**: Creating quality questions for 13 year levels is significant work
2. **Grade Accuracy**: Ensure algorithm is tested to avoid incorrectly labeling students
3. **Email Deliverability**: SES sandbox mode limits - may need production access request
4. **Parent Expectations**: Clear messaging that "working level" is skill-based, not a judgment

---

## Success Metrics

- Parents receive weekly/monthly progress emails
- Students are assessed across year levels with accurate working level
- Report format matches school report cards for familiarity
- AI-generated comments are helpful and personalized

---

*Created: January 4, 2026*
*Status: Ready for Implementation*
