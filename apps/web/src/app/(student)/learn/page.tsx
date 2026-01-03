'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSelectedChild, isAuthenticatedSync, getChildProfile } from '@/lib/auth'
import {
  getProgress,
  submitAnswer,
  getAIExplanation,
  saveSectionQuiz,
  getSectionQuizzes,
  chatWithAI,
  getCurriculumSections,
  getCurriculumSection,
  getCurriculumQuestions,
  recordCurriculumAttempt,
  recordDetailedAttempt,
  type SubjectProgress,
  type AnswerResponse,
  type SectionQuizResult,
  type QuizAnswer as ApiQuizAnswer,
  type CurriculumSectionSummary,
  type CurriculumSectionFull,
  type CurriculumQuestion,
} from '@/lib/api'
import ReactMarkdown from 'react-markdown'

// Types for reconstructed curriculum hierarchy
interface CurriculumSection extends CurriculumSectionSummary {
  content?: string;
  keyPoints?: string[];
  examples?: Array<{ problem: string; solution: string; explanation: string }>;
  questions?: CurriculumQuestion[];
}

interface CurriculumChapter {
  id: string;
  title: string;
  description: string;
  sections: CurriculumSection[];
}

interface CurriculumStrand {
  id: string;
  name: string;
  chapters: CurriculumChapter[];
}

interface YearLevelCurriculum {
  yearLevel: number;
  subject: string;
  strands: CurriculumStrand[];
}

// Mapping for strand names based on ID
const STRAND_NAMES: Record<string, string> = {
  'number-algebra': 'Number and Algebra',
  'measurement-geometry': 'Measurement and Geometry',
  'statistics-probability': 'Statistics and Probability',
};

// Mapping for chapter titles based on ID
const CHAPTER_TITLES: Record<string, { title: string; description: string }> = {
  'place-value': { title: 'Place Value and Large Numbers', description: 'Understanding numbers and their values' },
  'multiplication-division': { title: 'Multiplication and Division', description: 'Strategies for multiplying and dividing' },
  'fractions-decimals': { title: 'Fractions and Decimals', description: 'Working with fractions and decimal numbers' },
  'using-units': { title: 'Using Units of Measurement', description: 'Measuring length, area, volume and capacity' },
  'geometric-reasoning': { title: 'Geometric Reasoning', description: 'Understanding shapes, angles and spatial relationships' },
  'chance': { title: 'Chance and Probability', description: 'Understanding probability and chance events' },
};

// Helper function to reconstruct curriculum hierarchy from flat sections
function buildCurriculumHierarchy(sections: CurriculumSectionSummary[], yearLevel: number): YearLevelCurriculum {
  const strandsMap: Record<string, Record<string, CurriculumSection[]>> = {};

  for (const section of sections) {
    if (!strandsMap[section.strandId]) {
      strandsMap[section.strandId] = {};
    }
    if (!strandsMap[section.strandId][section.chapterId]) {
      strandsMap[section.strandId][section.chapterId] = [];
    }
    strandsMap[section.strandId][section.chapterId].push(section);
  }

  const strands: CurriculumStrand[] = Object.entries(strandsMap).map(([strandId, chaptersObj]) => {
    const chapters: CurriculumChapter[] = Object.entries(chaptersObj).map(([chapterId, sectionsList]) => {
      const chapterInfo = CHAPTER_TITLES[chapterId] || { title: chapterId, description: '' };
      return {
        id: chapterId,
        title: chapterInfo.title,
        description: chapterInfo.description,
        sections: sectionsList,
      };
    });

    return {
      id: strandId,
      name: STRAND_NAMES[strandId] || strandId,
      chapters,
    };
  });

  return {
    yearLevel,
    subject: 'maths',
    strands,
  };
}

interface ChildProfile {
  id: string
  name: string
  avatar?: string
  yearLevel?: number
}

// Track quiz results per question (use API type)
type QuizAnswer = ApiQuizAnswer

// Track section progress (use API type)
type SectionProgress = SectionQuizResult

export default function LearnPage() {
  const router = useRouter()
  const [childProfile, setChildProfile] = useState<ChildProfile | null>(null)
  const [childId, setChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Curriculum state
  const [curriculum, setCurriculum] = useState<YearLevelCurriculum | null>(null)
  const [selectedStrand, setSelectedStrand] = useState<CurriculumStrand | null>(null)
  const [selectedChapter, setSelectedChapter] = useState<CurriculumChapter | null>(null)
  const [selectedSection, setSelectedSection] = useState<CurriculumSection | null>(null)
  const [showMenu, setShowMenu] = useState(true)

  // Quiz state
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [quizScore, setQuizScore] = useState(0)
  const [quizComplete, setQuizComplete] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([])
  const [showDetailedResults, setShowDetailedResults] = useState(false)

  // Section progress state
  const [sectionProgress, setSectionProgress] = useState<Record<string, SectionProgress>>({})

  // Progress state
  const [totalXp, setTotalXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [currentLevel, setCurrentLevel] = useState(5)

  // AI explanation
  const [aiExplanation, setAiExplanation] = useState<string | null>(null)
  const [loadingExplanation, setLoadingExplanation] = useState(false)

  // AI Chat for reading section
  const [showAiChat, setShowAiChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([])
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)

  // Time tracking for analytics
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [aiExplanationRequested, setAiExplanationRequested] = useState(false)

  // Load curriculum from API
  const loadCurriculum = async (yearLevel: number) => {
    try {
      const response = await getCurriculumSections(yearLevel)
      const curriculumData = buildCurriculumHierarchy(response.sections, yearLevel)
      setCurriculum(curriculumData)
      // Auto-select first strand
      if (curriculumData.strands.length > 0) {
        setSelectedStrand(curriculumData.strands[0])
      }
    } catch (err) {
      console.error('Failed to load curriculum:', err)
      setError('Failed to load curriculum. Please try again.')
    }
  }

  useEffect(() => {
    // Check for child profile first (child login flow)
    const profile = getChildProfile()
    if (profile) {
      setChildProfile(profile)
      setChildId(profile.id)

      // Load curriculum based on year level from API
      const yearLevel = profile.yearLevel || 5
      loadCurriculum(yearLevel)
      loadProgress(profile.id)
      loadSectionQuizzes(profile.id)
      return
    }

    // Check for parent auth with selected child
    if (!isAuthenticatedSync()) {
      router.push('/child-login')
      return
    }

    const id = getSelectedChild()
    if (!id) {
      setError('No child selected. Please select a child from the dashboard.')
      setLoading(false)
      return
    }
    setChildId(id)

    // Default curriculum for Year 5 if no profile
    loadCurriculum(5)
    loadProgress(id)
    loadSectionQuizzes(id)
  }, [router])

  const loadSectionQuizzes = async (id: string) => {
    try {
      const response = await getSectionQuizzes(id)
      setSectionProgress(response.quizzes || {})
    } catch (err) {
      console.error('Failed to load section quizzes:', err)
    }
  }

  const loadProgress = async (id: string) => {
    try {
      const response = await getProgress(id)
      const mathsProgress = response.progress.find(p => p.subject === 'maths')
      if (mathsProgress) {
        // Check if benchmark is completed - redirect to benchmark if not
        if (!mathsProgress.benchmarkCompleted) {
          router.push('/benchmark?subject=maths')
          return
        }
        setCurrentLevel(mathsProgress.level)
        setTotalXp(mathsProgress.xp)
        setStreak(mathsProgress.streak)
      } else {
        // No progress record means benchmark hasn't been done
        router.push('/benchmark?subject=maths')
        return
      }
    } catch (err) {
      console.error('Failed to load progress:', err)
    } finally {
      setLoading(false)
    }
  }

  // State for loading section content
  const [loadingSection, setLoadingSection] = useState(false)

  const handleSelectSection = async (strand: CurriculumStrand, chapter: CurriculumChapter, section: CurriculumSection) => {
    setSelectedStrand(strand)
    setSelectedChapter(chapter)
    setShowQuiz(false)
    setQuizComplete(false)
    setCurrentQuestionIndex(0)
    setQuizScore(0)
    setShowMenu(false)
    setAiExplanation(null)
    // Reset AI chat
    setShowAiChat(false)
    setChatMessages([])
    setChatInput('')

    // Load full section content from API
    setLoadingSection(true)
    try {
      const yearLevel = childProfile?.yearLevel || 5
      const [sectionResponse, questionsResponse] = await Promise.all([
        getCurriculumSection(yearLevel, section.id),
        getCurriculumQuestions(yearLevel, section.id, childId || undefined),
      ])

      // Combine section content with questions
      const fullSection: CurriculumSection = {
        ...section,
        content: sectionResponse.section.content,
        keyPoints: sectionResponse.section.keyPoints,
        examples: sectionResponse.section.examples,
        questions: questionsResponse.questions,
      }
      setSelectedSection(fullSection)
    } catch (err) {
      console.error('Failed to load section:', err)
      // Fallback to section without full content
      setSelectedSection(section)
    } finally {
      setLoadingSection(false)
    }
  }

  const handleStartQuiz = () => {
    setShowQuiz(true)
    setCurrentQuestionIndex(0)
    setQuizScore(0)
    setQuizComplete(false)
    setSelectedAnswer(null)
    setShowResult(false)
    setAiExplanation(null)
    setQuizAnswers([])
    setShowDetailedResults(false)
    setQuestionStartTime(Date.now())
    setAiExplanationRequested(false)
  }

  const handleSubmitAnswer = async () => {
    if (selectedAnswer === null || !selectedSection || !selectedSection.questions) return

    const question = selectedSection.questions[currentQuestionIndex]
    const isCorrect = selectedAnswer === question.correctAnswer
    const timeSpentSeconds = Math.round((Date.now() - questionStartTime) / 1000)

    if (isCorrect) {
      setQuizScore(prev => prev + 1)
      setTotalXp(prev => prev + 10)
    }

    // Record the answer
    const newAnswer: QuizAnswer = {
      questionIndex: currentQuestionIndex,
      questionText: question.question,
      userAnswer: selectedAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      options: question.options,
    }
    setQuizAnswers(prev => [...prev, newAnswer])

    setShowResult(true)

    // Record attempt to both APIs (curriculum for mastery, analytics for detailed tracking)
    if (childId) {
      // Record to curriculum API (for mastery tracking)
      try {
        await recordCurriculumAttempt({
          childId,
          questionId: question.id,
          sectionId: selectedSection.id,
          selectedAnswer,
          correctAnswer: question.correctAnswer,
          timeSpentSeconds,
          difficulty: question.difficulty || 1,
        })
      } catch (err) {
        console.error('Failed to record curriculum attempt:', err)
      }

      // Record to detailed analytics API (for comprehensive tracking)
      try {
        await recordDetailedAttempt({
          childId,
          questionId: question.id,
          sectionId: selectedSection.id,
          selectedAnswer,
          correctAnswer: question.correctAnswer,
          timeSpentSeconds,
          difficulty: question.difficulty || 1,
          questionText: question.question,
          options: question.options,
          explanation: question.explanation,
          sessionType: 'quiz',
          aiExplanationRequested: false, // Will be updated when AI is requested
          // Pass knowledge token data for misconception tracking
          knowledge: question.knowledge,
        })
      } catch (err) {
        console.error('Failed to record detailed analytics:', err)
      }
    }
  }

  const handleNextQuestion = async () => {
    if (!selectedSection || !childId || !selectedSection.questions) return

    if (currentQuestionIndex + 1 >= selectedSection.questions.length) {
      setQuizComplete(true)

      // Save section progress to API
      const finalScore = quizScore + (selectedAnswer === selectedSection.questions[currentQuestionIndex].correctAnswer ? 1 : 0)
      const newProgress: SectionProgress = {
        sectionId: selectedSection.id,
        sectionTitle: selectedSection.title,
        chapterTitle: selectedChapter?.title || '',
        strandName: selectedStrand?.name || '',
        completed: true,
        score: finalScore,
        totalQuestions: selectedSection.questions.length,
        lastAttempt: new Date().toISOString(),
        answers: quizAnswers,
      }

      // Update local state immediately for responsive UI
      setSectionProgress(prev => ({
        ...prev,
        [selectedSection.id]: newProgress,
      }))

      // Save to API in background
      try {
        await saveSectionQuiz(childId, newProgress)
      } catch (err) {
        console.error('Failed to save quiz result:', err)
      }
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setAiExplanation(null)
      setQuestionStartTime(Date.now())
      setAiExplanationRequested(false)
    }
  }

  const handleExplainMore = async () => {
    if (!selectedSection || !childId || !selectedSection.questions) return

    const question = selectedSection.questions[currentQuestionIndex]
    setLoadingExplanation(true)
    setAiExplanationRequested(true)

    try {
      const response = await getAIExplanation({
        childId,
        questionId: question.id,
        question: question.question,
        options: question.options,
        userAnswer: selectedAnswer || 0,
        correctAnswer: question.correctAnswer,
        subject: 'maths',
        yearLevel: childProfile?.yearLevel || 5,
        topic: selectedSection.title,
      })
      setAiExplanation(response.explanation)
    } catch (err) {
      console.error('Failed to get AI explanation:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      if (errorMessage.includes('limit reached')) {
        setAiExplanation("You've reached your daily AI limit. Here's the basic explanation: " + question.explanation)
      } else {
        setAiExplanation("Let me help you understand: " + question.explanation)
      }
    } finally {
      setLoadingExplanation(false)
    }
  }

  const handleSendChat = async (messageOverride?: string) => {
    const message = messageOverride || chatInput.trim()
    if (!message || !childId || !selectedSection) return

    setChatInput('')
    setChatMessages(prev => [...prev, { role: 'user', content: message }])
    setChatLoading(true)

    try {
      const response = await chatWithAI({
        childId,
        message,
        subject: 'maths',
        yearLevel: childProfile?.yearLevel || 5,
        context: `The student is reading about "${selectedSection.title}" which covers: ${selectedSection.description}. Key points: ${(selectedSection.keyPoints || []).join(', ')}. The content discusses: ${(selectedSection.content || '').substring(0, 500)}...`,
      })
      setChatMessages(prev => [...prev, { role: 'assistant', content: response.response }])
    } catch (err) {
      console.error('Failed to get AI response:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      let userMessage = "I'm sorry, I had trouble understanding that. Can you try asking in a different way?"
      if (errorMessage.includes('limit reached')) {
        userMessage = "You've reached your daily AI chat limit. Try again tomorrow or ask a parent to upgrade your plan."
      }
      setChatMessages(prev => [...prev, { role: 'assistant', content: userMessage }])
    } finally {
      setChatLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('selectedChild')
    localStorage.removeItem('childProfile')
    router.push('/child-login')
  }

  const handleBackToMenu = () => {
    setShowMenu(true)
    setSelectedSection(null)
    setShowQuiz(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/dashboard">
            <Button className="rounded-full px-6">Go to Dashboard</Button>
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-lg font-semibold">
              StudyMate
            </Link>
            {curriculum && (
              <span className="text-sm text-neutral-500">
                Year {curriculum.yearLevel} Maths
              </span>
            )}
          </div>
          <div className="flex items-center gap-6">
            {/* Stats */}
            <div className="hidden sm:flex items-center gap-4 text-sm">
              <span className="text-neutral-500">Level <span className="font-semibold text-black">{currentLevel}</span></span>
              <span className="w-px h-4 bg-neutral-200" />
              <span className="text-neutral-500"><span className="font-semibold text-black">{totalXp}</span> XP</span>
              <span className="w-px h-4 bg-neutral-200" />
              <span className="text-neutral-500"><span className="font-semibold text-black">{streak}</span> streak</span>
            </div>

            {/* Child Profile */}
            {childProfile && (
              <div className="flex items-center gap-2">
                <span className="text-2xl">{childProfile.avatar || '👤'}</span>
                <span className="text-sm font-medium hidden sm:block">{childProfile.name}</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={handleLogout}
            >
              Exit
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Menu */}
        <aside className={`${showMenu ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-neutral-100 bg-neutral-50 min-h-[calc(100vh-56px)]`}>
          <div className="p-4 w-80">
            <h2 className="font-semibold text-lg mb-4">Curriculum Topics</h2>

            {curriculum?.strands.map((strand) => (
              <div key={strand.id} className="mb-4">
                <h3 className="font-medium text-sm text-neutral-700 mb-2 px-2">{strand.name}</h3>

                {strand.chapters.map((chapter) => (
                  <div key={chapter.id} className="mb-2">
                    <div className="text-xs font-medium text-neutral-500 px-2 py-1">{chapter.title}</div>

                    {chapter.sections.map((section) => {
                      const progress = sectionProgress[section.id]
                      return (
                        <button
                          key={section.id}
                          onClick={() => handleSelectSection(strand, chapter, section)}
                          className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                            selectedSection?.id === section.id
                              ? 'bg-black text-white'
                              : 'hover:bg-neutral-200 text-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{section.title}</div>
                            {progress?.completed && (
                              <span className={`text-xs font-semibold ${
                                selectedSection?.id === section.id ? 'text-white' :
                                progress.score === progress.totalQuestions ? 'text-green-600' :
                                progress.score >= progress.totalQuestions / 2 ? 'text-yellow-600' : 'text-red-500'
                              }`}>
                                {progress.score}/{progress.totalQuestions}
                              </span>
                            )}
                          </div>
                          <div className={`text-xs flex items-center gap-2 ${selectedSection?.id === section.id ? 'text-neutral-300' : 'text-neutral-500'}`}>
                            <span>{section.questionCount} questions</span>
                            {progress?.completed && (
                              <span className={`${
                                selectedSection?.id === section.id ? 'text-green-300' : 'text-green-600'
                              }`}>✓</span>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-h-[calc(100vh-56px)] flex">
          <div className="flex-1">
          {/* Mobile menu toggle */}
          {!showMenu && (
            <button
              onClick={() => setShowMenu(true)}
              className="fixed bottom-6 left-6 z-40 bg-black text-white p-3 rounded-full shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {loadingSection ? (
            <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
              <div className="text-neutral-400">Loading section...</div>
            </div>
          ) : selectedSection ? (
            <div className="max-w-3xl mx-auto px-6 py-8">
              {/* Back button */}
              <button
                onClick={handleBackToMenu}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-black mb-6"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to topics
              </button>

              {/* Section Header */}
              <div className="mb-8">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-600 rounded-full mb-3">
                  {selectedSection.code}
                </span>
                <h1 className="text-3xl font-semibold mb-2">{selectedSection.title}</h1>
                <p className="text-neutral-500">{selectedSection.description}</p>
              </div>

              {!showQuiz ? (
                <>
                  {/* Previous attempt info */}
                  {sectionProgress[selectedSection.id]?.completed && (
                    <div className="mb-6 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-sm text-neutral-500">Previous attempt: </span>
                          <span className={`font-semibold ${
                            sectionProgress[selectedSection.id].score === sectionProgress[selectedSection.id].totalQuestions ? 'text-green-600' :
                            sectionProgress[selectedSection.id].score >= sectionProgress[selectedSection.id].totalQuestions / 2 ? 'text-yellow-600' : 'text-red-500'
                          }`}>
                            {sectionProgress[selectedSection.id].score}/{sectionProgress[selectedSection.id].totalQuestions}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => {
                            setShowQuiz(true)
                            setQuizComplete(true)
                            setQuizScore(sectionProgress[selectedSection.id].score)
                            setQuizAnswers(sectionProgress[selectedSection.id].answers)
                            setShowDetailedResults(true)
                          }}
                        >
                          View Results
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Notes/Content */}
                  {selectedSection.content && (
                    <div className="prose prose-neutral max-w-none mb-8">
                      <ReactMarkdown>{selectedSection.content}</ReactMarkdown>
                    </div>
                  )}

                  {/* Key Points */}
                  {selectedSection.keyPoints && selectedSection.keyPoints.length > 0 && (
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8">
                      <h3 className="font-semibold text-blue-800 mb-3">Key Points to Remember</h3>
                      <ul className="space-y-2">
                        {selectedSection.keyPoints.map((point, index) => (
                          <li key={index} className="flex gap-2 text-sm text-blue-700">
                            <span className="text-blue-400">•</span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Examples */}
                  {selectedSection.examples && selectedSection.examples.length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-semibold text-lg mb-4">Worked Examples</h3>
                      <div className="space-y-4">
                        {selectedSection.examples.map((example, index) => (
                          <div key={index} className="bg-neutral-50 border border-neutral-200 rounded-xl p-5">
                            <div className="font-medium mb-2">{example.problem}</div>
                            <div className="text-green-700 font-semibold mb-2">Answer: {example.solution}</div>
                            <div className="text-sm text-neutral-600">{example.explanation}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Start Quiz Button */}
                  {selectedSection.questions && selectedSection.questions.length > 0 && (
                    <div className="text-center py-8 border-t border-neutral-200">
                      <h3 className="text-xl font-semibold mb-2">Ready to practice?</h3>
                      <p className="text-neutral-500 mb-6">
                        Test your understanding with {selectedSection.questions.length} practice questions
                      </p>
                      <Button onClick={handleStartQuiz} className="rounded-full px-8">
                        {sectionProgress[selectedSection.id]?.completed ? 'Retake Quiz' : 'Start Practice Quiz'}
                      </Button>
                    </div>
                  )}
                </>
              ) : quizComplete && selectedSection.questions ? (
                /* Quiz Complete */
                showDetailedResults ? (
                  /* Detailed Results View */
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-semibold mb-2">Quiz Results</h2>
                      <p className="text-xl">
                        Score: <span className={`font-bold ${
                          quizScore === selectedSection.questions.length ? 'text-green-600' :
                          quizScore >= selectedSection.questions.length / 2 ? 'text-yellow-600' : 'text-red-500'
                        }`}>{quizScore}</span> / {selectedSection.questions.length}
                        <span className="text-neutral-500 ml-2">
                          ({Math.round((quizScore / selectedSection.questions.length) * 100)}%)
                        </span>
                      </p>
                    </div>

                    {/* Question-by-question breakdown */}
                    <div className="space-y-4">
                      {quizAnswers.map((answer, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-xl border ${
                            answer.isCorrect
                              ? 'bg-green-50 border-green-200'
                              : 'bg-red-50 border-red-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <span className={`text-lg ${answer.isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                              {answer.isCorrect ? '✓' : '✗'}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium mb-2">Q{index + 1}: {answer.questionText}</div>
                              <div className="text-sm space-y-1">
                                <div className={answer.isCorrect ? 'text-green-700' : 'text-red-600'}>
                                  Your answer: {String.fromCharCode(65 + answer.userAnswer)}. {answer.options[answer.userAnswer]}
                                </div>
                                {!answer.isCorrect && (
                                  <div className="text-green-700">
                                    Correct answer: {String.fromCharCode(65 + answer.correctAnswer)}. {answer.options[answer.correctAnswer]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4 justify-center pt-6">
                      <Button variant="outline" onClick={() => setShowDetailedResults(false)} className="rounded-full px-6">
                        Summary
                      </Button>
                      <Button variant="outline" onClick={() => setShowQuiz(false)} className="rounded-full px-6">
                        Review Notes
                      </Button>
                      <Button onClick={handleStartQuiz} className="rounded-full px-6">
                        Try Again
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Summary View */
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">
                      {quizScore === selectedSection.questions.length ? '🎉' : quizScore >= selectedSection.questions.length / 2 ? '👍' : '💪'}
                    </div>
                    <h2 className="text-2xl font-semibold mb-2">Quiz Complete!</h2>
                    <p className="text-xl mb-2">
                      You scored <span className={`font-bold ${
                        quizScore === selectedSection.questions.length ? 'text-green-600' :
                        quizScore >= selectedSection.questions.length / 2 ? 'text-yellow-600' : 'text-red-500'
                      }`}>{quizScore}</span> out of{' '}
                      <span className="font-bold">{selectedSection.questions.length}</span>
                    </p>
                    <p className="text-neutral-500 mb-6">
                      {quizScore === selectedSection.questions.length
                        ? 'Perfect score! Amazing work!'
                        : quizScore >= selectedSection.questions.length / 2
                        ? 'Good effort! Keep practicing to improve.'
                        : 'Keep trying! Review the notes and try again.'}
                    </p>
                    <div className="flex gap-4 justify-center flex-wrap">
                      <Button variant="outline" onClick={() => setShowDetailedResults(true)} className="rounded-full px-6">
                        View Details
                      </Button>
                      <Button variant="outline" onClick={() => setShowQuiz(false)} className="rounded-full px-6">
                        Review Notes
                      </Button>
                      <Button onClick={handleStartQuiz} className="rounded-full px-6">
                        Try Again
                      </Button>
                    </div>
                  </div>
                )
              ) : selectedSection.questions && selectedSection.questions.length > 0 ? (
                /* Quiz Question */
                (() => {
                  const questions = selectedSection.questions!;
                  const currentQuestion = questions[currentQuestionIndex];
                  return (
                <div className="space-y-6">
                  {/* Progress */}
                  <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
                    <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                    <span>Score: {quizScore}/{currentQuestionIndex + (showResult ? 1 : 0)}</span>
                  </div>

                  <div className="w-full bg-neutral-100 rounded-full h-2 mb-6">
                    <div
                      className="bg-black h-2 rounded-full transition-all"
                      style={{ width: `${((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
                    />
                  </div>

                  {/* Question */}
                  <h2 className="text-xl font-semibold">
                    {currentQuestion.question}
                  </h2>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => !showResult && setSelectedAnswer(index)}
                        disabled={showResult}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                          showResult
                            ? index === currentQuestion.correctAnswer
                              ? 'border-green-500 bg-green-50'
                              : index === selectedAnswer
                              ? 'border-red-500 bg-red-50'
                              : 'border-neutral-100'
                            : selectedAnswer === index
                            ? 'border-black bg-neutral-50'
                            : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <span className="font-medium text-neutral-400 mr-3">
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    ))}
                  </div>

                  {/* Result */}
                  {showResult && (
                    <div className="space-y-4">
                      <div
                        className={`p-6 rounded-xl ${
                          selectedAnswer === currentQuestion.correctAnswer
                            ? 'bg-green-50 border border-green-100'
                            : 'bg-red-50 border border-red-100'
                        }`}
                      >
                        <div className={`font-semibold mb-2 ${
                          selectedAnswer === currentQuestion.correctAnswer
                            ? 'text-green-700'
                            : 'text-red-700'
                        }`}>
                          {selectedAnswer === currentQuestion.correctAnswer
                            ? 'Correct! 🎉'
                            : 'Not quite right'}
                        </div>
                        <div className={`text-sm ${
                          selectedAnswer === currentQuestion.correctAnswer
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {currentQuestion.explanation}
                        </div>
                      </div>

                      {/* AI Explanation for wrong answers */}
                      {selectedAnswer !== currentQuestion.correctAnswer && (
                        <div className="space-y-3">
                          {aiExplanation ? (
                            <div className="p-6 rounded-xl bg-blue-50 border border-blue-100">
                              <div className="font-semibold text-blue-700 mb-2">Let me explain...</div>
                              <div className="text-sm text-blue-600 whitespace-pre-wrap">{aiExplanation}</div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              className="w-full rounded-xl"
                              onClick={handleExplainMore}
                              disabled={loadingExplanation}
                            >
                              {loadingExplanation ? 'Thinking...' : 'Explain this to me'}
                            </Button>
                          )}
                        </div>
                      )}

                      <Button onClick={handleNextQuestion} className="w-full h-12 rounded-xl">
                        {currentQuestionIndex + 1 >= questions.length ? 'Finish Quiz' : 'Next Question'}
                      </Button>
                    </div>
                  )}

                  {/* Submit Button */}
                  {!showResult && (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className="w-full h-12 rounded-xl"
                    >
                      Submit Answer
                    </Button>
                  )}
                </div>
                  );
                })()
              ) : (
                /* No questions available */
                <div className="text-center py-12">
                  <p className="text-neutral-500">Loading questions...</p>
                </div>
              )}
            </div>
          ) : (
            /* No section selected - Welcome screen */
            <div className="flex items-center justify-center min-h-[calc(100vh-56px)] px-6">
              <div className="text-center max-w-md">
                <div className="text-6xl mb-6">📚</div>
                <h2 className="text-2xl font-semibold mb-3">Welcome to Learning!</h2>
                <p className="text-neutral-500 mb-6">
                  Select a topic from the menu to start learning. Each topic has notes to read and practice questions to test your understanding.
                </p>
                {!showMenu && (
                  <Button onClick={() => setShowMenu(true)} className="rounded-full px-6">
                    Open Topics Menu
                  </Button>
                )}
              </div>
            </div>
          )}
          </div>

          {/* AI Chat Sidebar - Only visible when section is selected */}
          {selectedSection && (
            <>
              {/* Toggle Button */}
              <button
                onClick={() => setShowAiChat(!showAiChat)}
                className={`fixed bottom-6 right-6 z-40 p-3 rounded-full shadow-lg transition-colors ${
                  showAiChat ? 'bg-neutral-100 text-neutral-600' : 'bg-black text-white'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>

              {/* AI Chat Sidebar */}
              <aside className={`${showAiChat ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-l border-neutral-200 bg-white h-[calc(100vh-56px)] sticky top-14 flex flex-col`}>
                <div className="w-80 flex flex-col h-full">
                  {/* Chat Header */}
                  <div className="px-4 py-3 border-b border-neutral-200 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                      </svg>
                      <span className="font-medium text-sm">AI Tutor</span>
                    </div>
                    <button
                      onClick={() => setShowAiChat(false)}
                      className="text-neutral-400 hover:text-black"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {chatMessages.length === 0 && (
                      <div className="text-center py-6">
                        <p className="text-sm text-neutral-500 mb-4">Ask me anything about</p>
                        <p className="text-sm font-medium mb-6">{selectedSection.title}</p>
                        <div className="space-y-2">
                          <button
                            onClick={() => handleSendChat("Can you explain this in simpler terms?")}
                            className="w-full text-left px-3 py-2.5 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                          >
                            Explain this simply
                          </button>
                          <button
                            onClick={() => handleSendChat("Can you give me another example?")}
                            className="w-full text-left px-3 py-2.5 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                          >
                            Give me an example
                          </button>
                          <button
                            onClick={() => handleSendChat("Why is this important to learn?")}
                            className="w-full text-left px-3 py-2.5 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                          >
                            Why is this important?
                          </button>
                        </div>
                      </div>
                    )}
                    {chatMessages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                            msg.role === 'user'
                              ? 'bg-black text-white'
                              : 'bg-neutral-100 text-neutral-900'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="flex justify-start">
                        <div className="bg-neutral-100 text-neutral-900 rounded-2xl px-3 py-2 text-sm">
                          <span className="animate-pulse">Thinking...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <div className="border-t border-neutral-200 p-3 shrink-0">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                        placeholder="Ask a question..."
                        className="flex-1 px-3 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-neutral-400"
                        disabled={chatLoading}
                      />
                      <Button
                        onClick={() => handleSendChat()}
                        disabled={!chatInput.trim() || chatLoading}
                        className="rounded-full px-3"
                        size="sm"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              </aside>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
