import { useState, useCallback, useMemo } from 'react'
import questionsData from '../data/questions.json'
import roadmapsData from '../data/roadmaps.json'
import type {
  Question,
  QuestionType,
  UserStats,
  AnswerFeedback,
  RoadmapPath,
  AppPhase,
  QuizMode,
  RoadmapModule,
} from '../types'

const ALL_QUESTIONS = questionsData as Question[]
const INFRA_THRESHOLD = 80

// Segmentos de perguntas que cada modo percorre, em ordem
const MODE_SEGMENTS: Record<QuizMode, QuestionType[]> = {
  direto:  ['technical_base'],
  bussola: ['technical_base', 'profile'],
}

const PATH_LABELS: Record<RoadmapPath, string> = {
  backend:  'Backend',
  security: 'Cibersegurança',
  frontend: 'Frontend',
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function calcScore(
  answers: Record<string, boolean>,
  type: QuestionType,
): number {
  const relevant = ALL_QUESTIONS.filter((q) => q.type === type)
  if (relevant.length === 0) return 0
  const correct = relevant.filter((q) => answers[q.id] === true).length
  return Math.round((correct / relevant.length) * 100)
}

function buildRoadmap(stats: UserStats): RoadmapModule[] {
  const paths = roadmapsData.paths as Record<RoadmapPath, { focus: string[] }>
  const foundation = roadmapsData.foundation_required

  const chosenModule: RoadmapModule = {
    title: `Trilha: ${PATH_LABELS[stats.chosenPath]}`,
    topics: paths[stats.chosenPath]?.focus ?? [],
    forced: false,
  }

  if (stats.forcedFoundation) {
    return [
      { title: foundation.title, topics: foundation.topics, forced: true },
      chosenModule,
    ]
  }
  return [chosenModule]
}

function finalize(
  path: RoadmapPath,
  answers: Record<string, boolean>,
): { stats: UserStats; roadmap: RoadmapModule[] } {
  const infraScore = calcScore(answers, 'technical_base')
  const resilienceScore = calcScore(answers, 'profile')
  const forcedFoundation = infraScore < INFRA_THRESHOLD
  const stats: UserStats = { infraScore, resilienceScore, forcedFoundation, chosenPath: path }
  return { stats, roadmap: buildRoadmap(stats) }
}

// ─── interface pública ────────────────────────────────────────────────────────

export interface UseQuizReturn {
  appPhase: AppPhase
  mode: QuizMode | null

  // Ações da Home
  startExplore: () => void
  startDireto: () => void
  startBussola: () => void
  goHome: () => void

  // Pré-seleção de trilha (direto)
  confirmPrePath: (path: RoadmapPath) => void

  // Estado do quiz
  currentQuestion: Question | null
  questionIndex: number       // posição dentro do segmento atual
  totalInSegment: number      // total de perguntas do segmento atual
  segmentIndex: number        // índice do segmento atual
  totalSegments: number       // total de segmentos do modo
  segmentLabel: string        // label legível do segmento atual
  isLastQuestion: boolean     // true na última pergunta do último segmento
  feedback: AnswerFeedback | null
  answerQuestion: (optionId: string) => void
  advance: () => void

  // Pós-seleção de trilha (bussola)
  confirmPostPath: (path: RoadmapPath) => void

  // Resultado
  stats: UserStats | null
  roadmap: RoadmapModule[] | null
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export function useQuiz(): UseQuizReturn {
  const [appPhase, setAppPhase]       = useState<AppPhase>('home')
  const [mode, setMode]               = useState<QuizMode | null>(null)
  const [segments, setSegments]       = useState<QuestionType[]>([])
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers]         = useState<Record<string, boolean>>({})
  const [feedback, setFeedback]       = useState<AnswerFeedback | null>(null)
  const [chosenPath, setChosenPath]   = useState<RoadmapPath | null>(null)
  const [stats, setStats]             = useState<UserStats | null>(null)
  const [roadmap, setRoadmap]         = useState<RoadmapModule[] | null>(null)

  const currentSegmentType = segments[segmentIndex] as QuestionType | undefined

  const segmentQuestions = useMemo(
    () => (currentSegmentType ? ALL_QUESTIONS.filter((q) => q.type === currentSegmentType) : []),
    [currentSegmentType],
  )

  const segmentSize    = segmentQuestions.length
  const totalSegments  = segments.length
  const isLastQuestion = segmentIndex === totalSegments - 1 && questionIndex === segmentSize - 1

  const currentQuestion: Question | null =
    appPhase === 'quiz' ? (segmentQuestions[questionIndex] ?? null) : null

  const segmentLabel =
    currentSegmentType === 'technical_base' ? 'Base Técnica' : 'Perfil'

  // ── helpers de reset ──────────────────────────────────────────────────────

  function resetQuizState() {
    setSegmentIndex(0)
    setQuestionIndex(0)
    setAnswers({})
    setFeedback(null)
    setChosenPath(null)
    setStats(null)
    setRoadmap(null)
  }

  // ── navegação da Home ─────────────────────────────────────────────────────

  const startExplore = useCallback(() => setAppPhase('explore'), [])

  const startDireto = useCallback(() => {
    resetQuizState()
    setMode('direto')
    setSegments(MODE_SEGMENTS.direto)
    setAppPhase('pre_path_select')
  }, [])

  const startBussola = useCallback(() => {
    resetQuizState()
    setMode('bussola')
    setSegments(MODE_SEGMENTS.bussola)
    setAppPhase('quiz')
  }, [])

  const goHome = useCallback(() => {
    resetQuizState()
    setMode(null)
    setSegments([])
    setAppPhase('home')
  }, [])

  // ── pré-seleção de trilha (direto) ────────────────────────────────────────

  const confirmPrePath = useCallback((path: RoadmapPath) => {
    setChosenPath(path)
    setAppPhase('quiz')
  }, [])

  // ── quiz ──────────────────────────────────────────────────────────────────

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

  const advance = useCallback(() => {
    setFeedback(null)

    // Ainda há perguntas no segmento atual
    if (questionIndex + 1 < segmentSize) {
      setQuestionIndex((i) => i + 1)
      return
    }

    // Fim do segmento — há próximo segmento?
    if (segmentIndex + 1 < totalSegments) {
      setSegmentIndex((i) => i + 1)
      setQuestionIndex(0)
      return
    }

    // Todos os segmentos concluídos
    if (mode === 'bussola') {
      setAppPhase('post_path_select')
    } else if (mode === 'direto' && chosenPath) {
      const result = finalize(chosenPath, answers)
      setStats(result.stats)
      setRoadmap(result.roadmap)
      setAppPhase('result')
    }
  }, [questionIndex, segmentSize, segmentIndex, totalSegments, mode, chosenPath, answers])

  // ── pós-seleção de trilha (bussola) ──────────────────────────────────────

  const confirmPostPath = useCallback(
    (path: RoadmapPath) => {
      setChosenPath(path)
      const result = finalize(path, answers)
      setStats(result.stats)
      setRoadmap(result.roadmap)
      setAppPhase('result')
    },
    [answers],
  )

  return {
    appPhase,
    mode,
    startExplore,
    startDireto,
    startBussola,
    goHome,
    confirmPrePath,
    currentQuestion,
    questionIndex,
    totalInSegment: segmentSize,
    segmentIndex,
    totalSegments,
    segmentLabel,
    isLastQuestion,
    feedback,
    answerQuestion,
    advance,
    confirmPostPath,
    stats,
    roadmap,
  }
}
