// Victorian Curriculum Types

/**
 * Knowledge Token - A granular unit of knowledge that can be tested
 *
 * Knowledge tokens represent specific skills or concepts within a topic.
 * For example, "Angles" (VCMMG202) breaks down into:
 * - acute-angle-identification: Recognising angles less than 90°
 * - obtuse-angle-identification: Recognising angles between 90° and 180°
 * - reflex-angle-identification: Recognising angles greater than 180°
 * - angle-addition: Adding angles together
 * - triangle-angle-sum: Understanding that triangle angles sum to 180°
 *
 * This enables granular analytics like:
 * "Student correctly identifies obtuse angles but confuses acute with right angles"
 */
export interface KnowledgeToken {
  id: string;                    // e.g., "acute-angle-identification"
  name: string;                  // e.g., "Acute Angle Identification"
  description: string;           // e.g., "Recognising angles less than 90°"
  prerequisites?: string[];      // Token IDs that should be mastered first
}

/**
 * Knowledge tokens associated with a question and its answer options
 */
export interface QuestionKnowledge {
  /** Tokens being tested by this question */
  questionTokens: string[];
  /** Token demonstrated by selecting the correct answer */
  correctToken: string;
  /** Tokens indicated by selecting each wrong answer (indexed by option) */
  incorrectTokens: (string | null)[];
}

export interface CurriculumSection {
  id: string;
  code: string; // e.g., "VCMNA181"
  title: string;
  description: string; // Official curriculum description
  content: string; // Textbook-style reading content for kids
  keyPoints: string[]; // Bullet points of key concepts
  examples: Example[];
  questions: Question[];
  /** Knowledge tokens covered in this section */
  knowledgeTokens?: KnowledgeToken[];
}

export interface Example {
  problem: string;
  solution: string;
  explanation: string;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 1 | 2 | 3; // Easy, Medium, Hard
  /** Knowledge token tagging for granular analytics */
  knowledge?: QuestionKnowledge;
}

export interface CurriculumChapter {
  id: string;
  title: string;
  description: string;
  sections: CurriculumSection[];
}

export interface CurriculumStrand {
  id: string;
  name: string; // e.g., "Number and Algebra"
  chapters: CurriculumChapter[];
}

export interface YearLevelCurriculum {
  yearLevel: number;
  subject: 'maths' | 'english';
  strands: CurriculumStrand[];
}

export interface ExamQuestion extends Question {
  sectionId: string;
  sectionTitle: string;
  chapterId: string;
}

export interface ExamResult {
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  sectionBreakdown: {
    sectionId: string;
    sectionTitle: string;
    correct: number;
    total: number;
    needsRevision: boolean;
  }[];
  recommendedSections: string[];
}
