/**
 * Comprehensive Analytics Schema
 *
 * This schema captures deep insights into student learning patterns:
 * - What specific concepts they struggle with
 * - Which types of mistakes they make repeatedly
 * - Time-based performance trends
 * - Question-level failure patterns
 */

// ============ CONCEPT TAXONOMY ============
// Each question can be tagged with multiple concepts for granular tracking

export const CONCEPT_TAXONOMY = {
  'number-algebra': {
    'place-value': {
      concepts: [
        'place-value-identification',    // "What is the value of 7 in 372,458?"
        'place-value-naming',            // "Which digit is in the ten thousands place?"
        'number-reading',                // Reading numbers in words
        'number-writing',                // Writing numbers from words
        'number-ordering',               // Ordering numbers smallest to largest
        'number-comparing',              // Which is larger/smaller
        'rounding',                       // Rounding to nearest 10, 100, 1000, etc.
        'adding-subtracting-place-value', // "What is 10,000 more than..."
      ],
    },
    'multiplication-division': {
      concepts: [
        'times-tables-recall',           // Basic multiplication facts
        'division-facts',                // Basic division facts
        'multiplication-strategies',     // Mental math strategies
        'division-with-remainders',      // Division leaving remainders
        'word-problems-multiplication',  // Story problems
        'word-problems-division',
        'factors-multiples',             // Understanding factors
        'order-of-operations',           // BODMAS/PEMDAS
      ],
    },
    'fractions-decimals': {
      concepts: [
        'fraction-identification',       // Identifying fractions from diagrams
        'equivalent-fractions',          // Finding equivalent fractions
        'comparing-fractions',           // Which fraction is larger
        'adding-fractions',              // Adding fractions
        'subtracting-fractions',
        'decimal-place-value',           // Understanding tenths, hundredths
        'decimal-ordering',              // Ordering decimals
        'fraction-decimal-conversion',   // Converting between forms
        'fraction-of-quantity',          // Finding 1/4 of 20
      ],
    },
  },
  'measurement-geometry': {
    'using-units': {
      concepts: [
        'length-measurement',
        'area-calculation',
        'volume-capacity',
        'unit-conversion',
        'perimeter',
        'time-calculation',
        'mass-measurement',
      ],
    },
    'geometric-reasoning': {
      concepts: [
        'angle-types',                   // Acute, obtuse, right
        'angle-measurement',
        'shape-properties',
        'symmetry',
        '2d-shapes',
        '3d-shapes',
        'transformation',                // Rotation, reflection
      ],
    },
  },
  'statistics-probability': {
    'chance': {
      concepts: [
        'probability-language',          // Likely, unlikely, certain
        'probability-calculation',
        'probability-fractions',
        'experimental-probability',
        'data-collection',
        'graph-reading',
        'mean-median-mode',
      ],
    },
  },
} as const;

// ============ DynamoDB KEY PATTERNS ============

export const analyticsKeys = {
  // Individual attempt with full context
  attempt: (childId: string, timestamp: string) => ({
    PK: `CHILD#${childId}`,
    SK: `ATTEMPT#${timestamp}`,
  }),

  // Daily aggregated stats for a child
  dailyStats: (childId: string, date: string) => ({
    PK: `CHILD#${childId}`,
    SK: `DAILY#${date}`,
  }),

  // Concept mastery tracking
  conceptMastery: (childId: string, concept: string) => ({
    PK: `CHILD#${childId}`,
    SK: `CONCEPT#${concept}`,
  }),

  // Question-level analytics (aggregated across all children)
  questionAnalytics: (questionId: string) => ({
    PK: `QANALYTICS#${questionId}`,
    SK: 'AGGREGATE',
  }),

  // Child's performance on specific question
  childQuestionHistory: (childId: string, questionId: string) => ({
    PK: `CHILD#${childId}`,
    SK: `QHISTORY#${questionId}`,
  }),

  // Section mastery (enhanced)
  sectionMastery: (childId: string, sectionId: string) => ({
    PK: `CHILD#${childId}`,
    SK: `MASTERY#${sectionId}`,
  }),

  // Error pattern tracking
  errorPattern: (childId: string, patternType: string) => ({
    PK: `CHILD#${childId}`,
    SK: `ERROR#${patternType}`,
  }),

  // Weekly summary for parent reports
  weeklySummary: (childId: string, weekStart: string) => ({
    PK: `CHILD#${childId}`,
    SK: `WEEKLY#${weekStart}`,
  }),

  // Knowledge token mastery tracking (granular skill tracking)
  knowledgeToken: (childId: string, tokenId: string) => ({
    PK: `CHILD#${childId}`,
    SK: `TOKEN#${tokenId}`,
  }),

  // AI-generated insights for a child
  aiInsight: (childId: string, insightDate: string) => ({
    PK: `CHILD#${childId}`,
    SK: `AI_INSIGHT#${insightDate}`,
  }),
};

// ============ DATA TYPES ============

export interface DetailedAttempt {
  PK: string;
  SK: string;
  type: 'ATTEMPT';
  childId: string;
  questionId: string;
  sectionId: string;

  // Answer details
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;

  // Question metadata (stored for historical analysis)
  questionText: string;
  options: string[];
  explanation: string;
  difficulty: 1 | 2 | 3;

  // Concept tags for this question
  concepts: string[];

  // Performance metrics
  timeSpentSeconds: number;
  attemptNumber: number;  // 1st, 2nd, 3rd try on this question

  // Context
  sessionType: 'quiz' | 'practice' | 'exam' | 'adaptive';
  aiExplanationRequested: boolean;
  aiExplanationHelpful?: boolean;

  createdAt: string;
}

export interface ConceptMastery {
  PK: string;
  SK: string;
  type: 'CONCEPT_MASTERY';
  childId: string;
  concept: string;

  // Performance metrics
  totalAttempts: number;
  correctAttempts: number;
  masteryScore: number;  // 0-100

  // Trend tracking
  recentAttempts: number;      // Last 10 attempts
  recentCorrect: number;       // Correct in last 10
  trend: 'improving' | 'stable' | 'declining';

  // Time tracking
  avgTimeSeconds: number;

  // Last activity
  lastAttemptAt: string;
  firstAttemptAt: string;
}

export interface QuestionAnalytics {
  PK: string;
  SK: string;
  type: 'QUESTION_ANALYTICS';
  questionId: string;
  sectionId: string;

  // Global stats
  totalAttempts: number;
  totalCorrect: number;
  successRate: number;
  avgTimeSeconds: number;

  // Answer distribution (how many chose each option)
  answerDistribution: number[];  // [count_A, count_B, count_C, count_D]

  // Common wrong answer patterns
  mostCommonWrongAnswer: number;
  wrongAnswerReasons?: string[];  // AI-generated insights

  // Difficulty validation
  actualDifficulty: number;  // Calculated from success rate
  designedDifficulty: number;

  lastUpdated: string;
}

export interface ChildQuestionHistory {
  PK: string;
  SK: string;
  type: 'QUESTION_HISTORY';
  childId: string;
  questionId: string;

  // Attempt history
  attempts: Array<{
    timestamp: string;
    selectedAnswer: number;
    isCorrect: boolean;
    timeSeconds: number;
  }>;

  totalAttempts: number;
  correctAttempts: number;
  lastAttemptAt: string;

  // Has this child mastered this question?
  mastered: boolean;  // True if answered correctly 2+ times consecutively
}

export interface ErrorPattern {
  PK: string;
  SK: string;
  type: 'ERROR_PATTERN';
  childId: string;
  patternType: string;

  // Pattern details
  description: string;
  occurrences: number;

  // Examples of this error
  examples: Array<{
    questionId: string;
    questionText: string;
    wrongAnswer: string;
    correctAnswer: string;
    timestamp: string;
  }>;

  // Recommendations
  suggestedFocus: string;
  aiRecommendation?: string;

  lastOccurrence: string;
  firstOccurrence: string;
}

export interface DailyStats {
  PK: string;
  SK: string;
  type: 'DAILY_STATS';
  childId: string;
  date: string;

  // Activity metrics
  questionsAttempted: number;
  questionsCorrect: number;
  timeSpentMinutes: number;

  // Breakdown by section
  sectionBreakdown: Record<string, {
    attempted: number;
    correct: number;
  }>;

  // Concept performance
  conceptBreakdown: Record<string, {
    attempted: number;
    correct: number;
  }>;

  // Streak info
  correctStreak: number;
  longestStreak: number;

  // AI usage
  aiExplanationsRequested: number;
}

export interface WeeklySummary {
  PK: string;
  SK: string;
  type: 'WEEKLY_SUMMARY';
  childId: string;
  weekStart: string;  // Monday date
  weekEnd: string;

  // Overall metrics
  totalQuestions: number;
  totalCorrect: number;
  accuracy: number;
  totalTimeMinutes: number;
  daysActive: number;

  // Progress indicators
  improvement: number;  // Percentage change from previous week

  // Strengths
  strongestConcepts: Array<{
    concept: string;
    accuracy: number;
    attempts: number;
  }>;

  // Areas needing attention
  weakestConcepts: Array<{
    concept: string;
    accuracy: number;
    attempts: number;
    suggestedActions: string[];
  }>;

  // Specific struggles
  strugglingQuestions: Array<{
    questionId: string;
    questionText: string;
    attempts: number;
    correctAttempts: number;
    concepts: string[];
  }>;

  // Parent-friendly insights
  parentSummary: string;
  recommendations: string[];

  generatedAt: string;
}

// ============ PARENT REPORT TYPES ============

export interface ParentReport {
  childId: string;
  childName: string;
  reportPeriod: {
    start: string;
    end: string;
  };

  // Executive summary
  summary: {
    overallProgress: 'excellent' | 'good' | 'needs-attention' | 'struggling';
    headline: string;  // "Sarah is excelling in fractions but needs help with place value"
    keyInsights: string[];
  };

  // Detailed breakdown
  conceptAnalysis: Array<{
    concept: string;
    conceptName: string;  // Human readable
    status: 'mastered' | 'progressing' | 'needs-practice' | 'struggling';
    accuracy: number;
    trend: 'improving' | 'stable' | 'declining';
    specificGaps?: string[];  // "Consistently confuses place value when rounding"
    suggestedActivities?: string[];
  }>;

  // Learning patterns
  learningPatterns: {
    bestTimeOfDay?: string;
    averageSessionLength: number;
    preferredDifficulty: number;
    respondsWellToAI: boolean;
  };

  // Actionable recommendations
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    area: string;
    issue: string;
    suggestion: string;
    estimatedTimeMinutes: number;
  }>;

  // Celebration points
  achievements: Array<{
    title: string;
    description: string;
    date: string;
  }>;

  // AI-generated deep insights (optional, for premium users)
  aiInsights?: AIGeneratedInsight;
}

// ============ KNOWLEDGE TOKEN TYPES ============

/**
 * Tracks mastery of a specific knowledge token (granular skill)
 * e.g., "acute-angle-identification" within the "Angles" section
 */
export interface KnowledgeTokenMastery {
  PK: string;
  SK: string;
  type: 'TOKEN_MASTERY';
  childId: string;
  tokenId: string;
  sectionId: string;

  // Human-readable info
  tokenName: string;
  tokenDescription: string;

  // Performance metrics
  totalAttempts: number;
  correctAttempts: number;
  masteryScore: number;  // 0-100

  // Confusion tracking - what does the student choose instead?
  confusionPatterns: Record<string, number>;  // e.g., { "acute-right-confusion": 3 }

  // Trend tracking
  recentAttempts: number;      // Last 5 attempts
  recentCorrect: number;       // Correct in last 5
  trend: 'improving' | 'stable' | 'declining';

  // Time tracking
  avgTimeSeconds: number;
  lastAttemptAt: string;
  firstAttemptAt: string;
}

/**
 * AI-generated insights based on attempt analysis
 */
export interface AIGeneratedInsight {
  generatedAt: string;
  model: string;  // e.g., "gpt-4o-mini" or "claude-3-haiku"

  // High-level summary
  summary: string;

  // Specific misconceptions identified
  misconceptions: Array<{
    area: string;           // e.g., "Angle Classification"
    description: string;    // e.g., "Confuses acute angles with right angles"
    evidence: string[];     // Question IDs that show this pattern
    severity: 'mild' | 'moderate' | 'significant';
    suggestion: string;     // Parent-friendly recommendation
  }>;

  // Strengths identified
  strengths: Array<{
    area: string;
    description: string;
    evidence: string[];
  }>;

  // Parent-friendly narrative
  narrativeSummary: string;

  // Specific activities to address gaps
  recommendedActivities: Array<{
    activity: string;
    targetSkill: string;
    estimatedMinutes: number;
    materials?: string;
  }>;
}

// ============ CONCEPT DETECTION HELPERS ============

/**
 * Detect concepts from question content
 * This maps question characteristics to concept tags
 */
export function detectQuestionConcepts(question: {
  id: string;
  question: string;
  options: string[];
  sectionId: string;
}): string[] {
  const concepts: string[] = [];
  const q = question.question.toLowerCase();

  // Place value detection
  if (q.includes('value of') || q.includes('place value')) {
    concepts.push('place-value-identification');
  }
  if (q.includes('which digit') && q.includes('place')) {
    concepts.push('place-value-naming');
  }
  if (q.includes('in words') || q.includes('write') && q.includes('words')) {
    concepts.push('number-reading');
  }
  if (q.includes('as a number') || q.includes('write') && !q.includes('words')) {
    concepts.push('number-writing');
  }
  if (q.includes('order') || q.includes('smallest to largest') || q.includes('largest to smallest')) {
    concepts.push('number-ordering');
  }
  if (q.includes('largest') || q.includes('smallest') || q.includes('greater') || q.includes('less')) {
    concepts.push('number-comparing');
  }
  if (q.includes('round')) {
    concepts.push('rounding');
  }
  if (q.includes('more than') || q.includes('less than') || q.includes('add') || q.includes('subtract')) {
    concepts.push('adding-subtracting-place-value');
  }

  // Multiplication/Division detection
  if (q.includes('times') || q.includes('multiply') || q.includes('×')) {
    concepts.push('times-tables-recall');
  }
  if (q.includes('divide') || q.includes('÷') || q.includes('shared')) {
    concepts.push('division-facts');
  }
  if (q.includes('remainder')) {
    concepts.push('division-with-remainders');
  }
  if (q.includes('factor') || q.includes('multiple')) {
    concepts.push('factors-multiples');
  }

  // Fractions/Decimals detection
  if (q.includes('fraction') || q.includes('/')) {
    if (q.includes('equivalent')) {
      concepts.push('equivalent-fractions');
    } else if (q.includes('compare') || q.includes('larger') || q.includes('smaller')) {
      concepts.push('comparing-fractions');
    } else if (q.includes('add')) {
      concepts.push('adding-fractions');
    } else if (q.includes('subtract')) {
      concepts.push('subtracting-fractions');
    } else {
      concepts.push('fraction-identification');
    }
  }
  if (q.includes('decimal') || q.includes('.')) {
    if (q.includes('order')) {
      concepts.push('decimal-ordering');
    } else {
      concepts.push('decimal-place-value');
    }
  }

  // Default to section-based concept if nothing detected
  if (concepts.length === 0) {
    concepts.push(question.sectionId.toLowerCase());
  }

  return concepts;
}

/**
 * Detect error patterns from wrong answers
 */
export function detectErrorPattern(
  question: string,
  options: string[],
  selectedAnswer: number,
  correctAnswer: number
): string | null {
  const wrongOption = options[selectedAnswer];
  const correctOption = options[correctAnswer];
  const q = question.toLowerCase();

  // Place value confusion patterns
  if (q.includes('value') || q.includes('place')) {
    // Check if wrong answer is a different place value
    if (wrongOption.includes('0') && correctOption.includes('0')) {
      const wrongZeros = (wrongOption.match(/0/g) || []).length;
      const correctZeros = (correctOption.match(/0/g) || []).length;
      if (wrongZeros !== correctZeros) {
        return 'place-value-magnitude-confusion';
      }
    }
  }

  // Rounding errors
  if (q.includes('round')) {
    if (parseInt(wrongOption) > parseInt(correctOption)) {
      return 'rounding-up-when-should-round-down';
    } else {
      return 'rounding-down-when-should-round-up';
    }
  }

  // Ordering errors
  if (q.includes('order') || q.includes('smallest') || q.includes('largest')) {
    return 'number-ordering-confusion';
  }

  // Computation errors
  if (q.includes('more than') || q.includes('less than')) {
    return 'arithmetic-computation-error';
  }

  return null;
}
