export type QuestionType = 'technical_base' | 'profile'

export type RoadmapPath = 'backend' | 'security'

export type QuizPhase = 'quiz' | 'path_selection' | 'result'

export interface Option {
  id: string
  text: string
  correct: boolean
  insight: string
}

export interface Question {
  id: string
  type: QuestionType
  question: string
  options: Option[]
}

export interface UserStats {
  infraScore: number       // 0-100, baseado nas perguntas technical_base
  resilienceScore: number  // 0-100, baseado nas perguntas profile
  forcedFoundation: boolean
  chosenPath: RoadmapPath
}

export interface AnswerFeedback {
  correct: boolean
  insight: string
}

export interface RoadmapModule {
  title: string
  topics: string[]
  forced: boolean
}
