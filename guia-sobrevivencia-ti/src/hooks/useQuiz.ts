import { useState, useCallback } from 'react'
import questionsData from '../data/questions.json'
import roadmapsData from '../data/roadmaps.json'
import type {
  Question,
  UserStats,
  AnswerFeedback,
  RoadmapPath,
  QuizPhase,
  RoadmapModule,
} from '../types'

const QUESTIONS = questionsData as Question[]
const INFRA_THRESHOLD = 80

// ----- helpers -----

function calcScore(
  questions: Question[],
  answers: Record<string, boolean>,
  type: 'technical_base' | 'profile',
): number {
  const relevant = questions.filter((q) => q.type === type)
  if (relevant.length === 0) return 0
  const correct = relevant.filter((q) => answers[q.id] === true).length
  return Math.round((correct / relevant.length) * 100)
}

function buildRoadmap(stats: UserStats): RoadmapModule[] {
  const paths = roadmapsData.paths as Record<RoadmapPath, { focus: string[] }>
  const foundation = roadmapsData.foundation_required

  const pathLabel = stats.chosenPath === 'backend' ? 'Backend' : 'Cibersegurança'
  const chosenModule: RoadmapModule = {
    title: `Trilha: ${pathLabel}`,
    topics: paths[stats.chosenPath].focus,
    forced: false,
  }

  if (stats.forcedFoundation) {
    // Regra de Ouro: Base de Ferro entra ANTES da trilha escolhida
    return [
      { title: foundation.title, topics: foundation.topics, forced: true },
      chosenModule,
    ]
  }

  return [chosenModule]
}

// ----- hook -----

export interface UseQuizReturn {
  phase: QuizPhase
  currentQuestion: Question | null
  questionIndex: number
  totalQuestions: number
  feedback: AnswerFeedback | null
  stats: UserStats | null
  roadmap: RoadmapModule[] | null
  answerQuestion: (optionId: string) => void
  advance: () => void
  confirmPath: (path: RoadmapPath) => void
  reset: () => void
}

export function useQuiz(): UseQuizReturn {
  const [phase, setPhase] = useState<QuizPhase>('quiz')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [roadmap, setRoadmap] = useState<RoadmapModule[] | null>(null)

  const currentQuestion: Question | null =
    phase === 'quiz' ? (QUESTIONS[questionIndex] ?? null) : null

  const answerQuestion = useCallback(
    (optionId: string) => {
      if (!currentQuestion || feedback !== null) return

      const option = currentQuestion.options.find((o) => o.id === optionId)
      if (!option) return

      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option.correct }))
      setFeedback({ correct: option.correct, insight: option.insight })
    },
    [currentQuestion, feedback],
  )

  // Avança para a próxima pergunta ou para seleção de trilha
  const advance = useCallback(() => {
    setFeedback(null)
    const next = questionIndex + 1
    if (next >= QUESTIONS.length) {
      setPhase('path_selection')
    } else {
      setQuestionIndex(next)
    }
  }, [questionIndex])

  // Recebe a trilha escolhida, calcula scores e aplica a Regra de Ouro
  const confirmPath = useCallback(
    (path: RoadmapPath) => {
      const infraScore = calcScore(QUESTIONS, answers, 'technical_base')
      const resilienceScore = calcScore(QUESTIONS, answers, 'profile')
      const forcedFoundation = infraScore < INFRA_THRESHOLD

      const newStats: UserStats = {
        infraScore,
        resilienceScore,
        forcedFoundation,
        chosenPath: path,
      }

      setStats(newStats)
      setRoadmap(buildRoadmap(newStats))
      setPhase('result')
    },
    [answers],
  )

  const reset = useCallback(() => {
    setPhase('quiz')
    setQuestionIndex(0)
    setAnswers({})
    setFeedback(null)
    setStats(null)
    setRoadmap(null)
  }, [])

  return {
    phase,
    currentQuestion,
    questionIndex,
    totalQuestions: QUESTIONS.length,
    feedback,
    stats,
    roadmap,
    answerQuestion,
    advance,
    confirmPath,
    reset,
  }
}
