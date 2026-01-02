# Learning Analytics Feature

## Overview

StudyMate's Learning Analytics is a premium feature (Scholar plan - $5/month) that provides detailed insights into a child's learning journey, going far beyond basic "you got 7/10" feedback.

## Key Features

### 1. Concept Mastery Tracking
- Breaks down performance by specific mathematical concepts (place value, rounding, fractions, etc.)
- Shows mastery percentage for each concept
- Tracks improvement trends (improving/stable/declining)

### 2. Knowledge Token Analytics (NEW)
Granular skill-level tracking within each concept. For example, "Angles" breaks down into:
- Acute angle identification
- Right angle identification
- Obtuse angle identification
- Reflex angle identification
- Angle addition
- Triangle angle sum

This enables insights like: "Your child correctly identifies obtuse angles but confuses acute angles with right angles."

### 3. Confusion Pattern Detection (NEW)
When a student selects a wrong answer, we track what misconception that indicates:
- Selecting "Right angle" for a 45° angle → "acute-right-confusion"
- Selecting "Obtuse" for a 60° angle → "acute-obtuse-confusion"
- Selecting "Reflex" for a 120° angle → "obtuse-reflex-confusion"

These patterns accumulate to reveal specific misconceptions.

### 4. AI-Generated Insights (NEW)
Automatically generated parent-friendly insights based on pattern analysis:
- **Misconceptions**: "Your child often confuses acute angles with right angles. They may think any 'small' angle is 90°."
- **Strengths**: "Shows strong understanding of Identifying Obtuse Angles, Identifying Right Angles"
- **Patterns**: "Tends to answer too quickly on questions they get wrong - encourage taking more time to read carefully"
- **Recommendations**: "Use a set square to show exactly 90°, then compare smaller angles to it"

### 5. Error Pattern Detection
Identifies recurring mistakes such as:
- "Always rounds down when should round up"
- "Confuses place value when comparing numbers"
- "Adds instead of subtracts in word problems"
- "Misreads the question"

### 6. Daily Activity Charts
- Visual bar charts showing daily question attempts
- Colour-coded by accuracy (green/yellow/red)
- Tracks time spent learning
- Shows active days count

### 7. Personalised Recommendations
- Priority-based suggestions (high/medium/low)
- Specific activities to address weak areas
- Estimated time for each recommendation
- Parent-friendly language

### 8. Parent Reports
- Weekly/monthly summary reports
- Overall progress status (excellent/good/needs-attention/struggling)
- Key insights in plain language (now including AI-generated insights)
- Achievement tracking
- Knowledge token breakdown

---

## Technical Architecture

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/analytics/attempt` | POST | Record detailed attempt with question data and knowledge tokens |
| `/analytics/child/:childId/concepts` | GET | Concept mastery breakdown + knowledge tokens |
| `/analytics/child/:childId/weaknesses` | GET | Identify struggling areas + AI insights |
| `/analytics/child/:childId/patterns` | GET | Error pattern analysis |
| `/analytics/child/:childId/report` | GET | Full parent report with AI insights |
| `/analytics/child/:childId/daily` | GET | Daily activity stats |
| `/analytics/child/:childId/tokens` | GET | Knowledge token mastery (NEW) |
| `/analytics/child/:childId/insights` | GET | AI-generated insights (NEW) |
| `/analytics/child/:childId/question/:questionId` | GET | Question history for child |
| `/analytics/question/:questionId` | GET | Global question analytics |

### Data Tracked Per Attempt
- Question text, options, and explanation
- Selected answer vs correct answer
- Time spent on question
- Whether AI explanation was requested
- Session type (quiz/practice/exam)
- **Knowledge token data (NEW)**:
  - `knowledgeToken`: The skill being tested
  - `confusionToken`: The misconception indicated by wrong answer
  - `questionTokens`: All tokens relevant to the question

### DynamoDB Schema

```
CHILD#{childId}
├── CONCEPT#{concept}          # Concept-level mastery
├── TOKEN#{tokenId}            # Knowledge token mastery (NEW)
├── ERROR#{errorType}          # Error patterns
├── QUESTION#{questionId}      # Per-question history
├── DAILY#{date}               # Daily stats
├── ATTEMPT#{timestamp}        # Individual attempts
└── AI_INSIGHT#{date}          # Cached AI insights (future)

QUESTION#{questionId}          # Global question analytics
```

### Knowledge Token Schema

```typescript
interface KnowledgeToken {
  id: string;                    // e.g., "acute-angle-identification"
  name: string;                  // e.g., "Acute Angle Identification"
  description: string;           // e.g., "Recognising angles less than 90°"
  prerequisites?: string[];      // Token IDs that should be mastered first
}

interface QuestionKnowledge {
  questionTokens: string[];      // All tokens being tested
  correctToken: string;          // Token demonstrated by correct answer
  incorrectTokens: (string | null)[];  // Misconception per wrong option
}
```

### Token Mastery Record

```typescript
interface KnowledgeTokenMastery {
  PK: string;                    // CHILD#{childId}
  SK: string;                    // TOKEN#{tokenId}
  type: 'TOKEN_MASTERY';
  childId: string;
  tokenId: string;
  sectionId: string;
  totalAttempts: number;
  correctAttempts: number;
  masteryScore: number;          // 0-100
  confusionPatterns: {           // Track misconceptions
    [confusionTokenId: string]: number;  // Count of occurrences
  };
  trend: 'improving' | 'stable' | 'declining';
  avgTimeSeconds: number;
  lastAttemptAt: string;
  firstAttemptAt: string;
}
```

### AI Insight Generation

The system generates insights without calling external AI APIs. Instead, it uses rule-based pattern analysis:

```typescript
interface AIInsight {
  type: 'misconception' | 'strength' | 'pattern' | 'recommendation';
  insight: string;               // Parent-friendly text
  confidence: 'high' | 'medium' | 'low';
  relatedTokens?: string[];
  suggestedAction?: string;      // What parent/child can do
}
```

**Insight Types Generated:**
1. **Misconception insights**: Based on confusion pattern counts
2. **Struggling skill insights**: Based on low mastery scores
3. **Strength insights**: Based on high mastery scores
4. **Time pattern insights**: Rushing vs overthinking analysis
5. **Trend insights**: Improving or declining performance

### Curriculum Integration

Knowledge tokens are defined per curriculum section:

```typescript
// In year5.ts - Angles section
{
  id: 'VCMMG202',
  code: 'VCMMG202',
  title: 'Angles',
  knowledgeTokens: [
    { id: 'acute-angle-identification', name: 'Acute Angle Identification', ... },
    { id: 'right-angle-identification', name: 'Right Angle Identification', ... },
    { id: 'obtuse-angle-identification', name: 'Obtuse Angle Identification', ... },
    // ...
  ],
  questions: [
    {
      id: 'VCMMG202-001',
      question: 'What type of angle is 75°?',
      options: ['Acute', 'Right', 'Obtuse', 'Reflex'],
      correctAnswer: 0,
      knowledge: {
        questionTokens: ['acute-angle-identification', 'right-angle-identification', ...],
        correctToken: 'acute-angle-identification',
        incorrectTokens: [
          null,                        // Option A is correct
          'acute-right-confusion',     // Chose Right
          'acute-obtuse-confusion',    // Chose Obtuse
          'reflex-misunderstanding',   // Chose Reflex
        ],
      },
    },
    // ...
  ],
}
```

### Frontend Integration

To send knowledge tokens with attempts:

```typescript
// When recording an attempt
await fetch('/analytics/attempt', {
  method: 'POST',
  body: JSON.stringify({
    childId,
    questionId: question.id,
    sectionId,
    selectedAnswer,
    correctAnswer: question.correctAnswer,
    timeSpentSeconds,
    difficulty: question.difficulty,
    questionText: question.question,
    options: question.options,
    explanation: question.explanation,
    // NEW: Include knowledge token data if available
    knowledge: question.knowledge,
  }),
});
```

---

## Premium Gating

- **Free (Explorer)**: Basic progress tracking only
- **Scholar ($5/mo)**: Full analytics dashboard with AI insights
- **Achiever ($12/mo)**: Full analytics + PDF reports + priority support

Free users see an upgrade prompt when accessing `/analytics`.

---

## Rollout Plan

### Phase 1: Angles Section (Current)
- Knowledge tokens added to Year 5 Angles (VCMMG202)
- 7 knowledge tokens, 10 questions tagged
- Tracking confusion patterns

### Phase 2: Year 5 Maths (Next)
- Add knowledge tokens to all Year 5 sections
- Priority: Place Value, Rounding, Fractions

### Phase 3: Years 4-6 Maths
- Extend to all year levels
- Build comprehensive token library

---

# Marketing/Social Media Posts

## Post 1: The Problem
**Hook**: "Most tutoring apps just tell you 'You got 7/10'. But that tells you nothing about WHERE your child is struggling."

**Body**: We built something different. StudyMate's Learning Analytics shows you EXACTLY which concepts your child has mastered vs needs work.

Not just "maths is hard" - but "your child consistently confuses place value when comparing 4-digit numbers."

That's actionable. That's what parents need.

**CTA**: Try StudyMate's Learning Analytics - link in bio

---

## Post 2: Error Pattern Detection
**Hook**: "Our AI doesn't just mark answers wrong. It spots PATTERNS in your child's mistakes."

**Body**: Example: After 20 rounding questions, StudyMate noticed something.

"Your child rounds DOWN 80% of the time when they should round UP. They're forgetting the '5 or more' rule."

Now you know EXACTLY what to practise.

**CTA**: This is what personalised learning looks like.

---

## Post 3: Parent-Friendly Insights
**Hook**: "You don't need to be a maths teacher to help your child."

**Body**: StudyMate translates learning data into plain English:

Instead of:
"Accuracy: 45% on place-value-identification"

You see:
"Emma is struggling to identify what each digit represents in large numbers. Try using physical counters to show hundreds, tens, and ones."

**CTA**: Analytics that actually help. Not just numbers.

---

## Post 4: The Differentiator
**Hook**: "What makes StudyMate different from Mathspace, IXL, or Khan Academy?"

**Body**:
1. We track WHY your child gets questions wrong, not just that they did
2. We detect recurring mistake patterns across weeks of learning
3. We give parents specific, actionable recommendations
4. We're aligned to the Victorian curriculum (Years 3-6)

**CTA**: Premium analytics from $5/month. Try free first.

---

## Post 5: Knowledge Tokens (NEW)
**Hook**: "We don't just tell you 'your child is struggling with angles'. We tell you WHICH type of angle."

**Body**: Our new Knowledge Token system breaks down every topic into specific skills:

Angles isn't just "angles". It's:
- Acute angle identification ✓ (85%)
- Obtuse angle identification ✓ (78%)
- **Acute vs Right confusion ✗ (42%)**

Now you know exactly what to practice. Use a set square to show exactly 90°, then compare smaller angles to it.

**CTA**: Granular insights that make a real difference.

---

## Post 6: Real Example
**Hook**: "Here's what a parent saw in their StudyMate dashboard this week:"

**Body**:
- Concept Mastery: Rounding (92%), Place Value (67%), Fractions (45%)
- **AI Insight**: "Your child often confuses acute angles with right angles. They may think any 'small' angle is 90°."
- **Suggested Action**: "Use a set square to show exactly 90°, then compare smaller angles to it"
- Trend: Improving in place value (+12% this week)

This is the visibility every parent deserves.

---

## Key Phrases to Use
- "See exactly which concepts your child struggles with"
- "Detects recurring mistake patterns"
- "Actionable insights, not just numbers"
- "Parent-friendly language"
- "Know what to practise, not just that they need to"
- "Beyond 'you got 7/10'"
- "Granular skill-level tracking" (NEW)
- "Know exactly which type of angle trips them up" (NEW)

## Hashtags
#EdTech #ParentingTips #MathsHelp #PrimarySchool #VictorianCurriculum #LearningAnalytics #PersonalisedLearning #StudyMate
