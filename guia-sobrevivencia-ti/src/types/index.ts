export type QuestionType = 'technical_base' | 'profile'

export type RoadmapPath = 'backend' | 'security' | 'frontend'

export type QuizMode = 'direto' | 'bussola'

// Cada valor representa uma tela distinta no fluxo
export type AppPhase =
  | 'home'
  | 'explore'
  | 'pre_path_select'   // direto: usuário escolhe trilha ANTES do quiz
  | 'quiz'
  | 'post_path_select'  // bussola: usuário escolhe trilha APÓS o quiz
  | 'result'

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
  infraScore: number       // 0–100, perguntas technical_base
  resilienceScore: number  // 0–100, perguntas profile
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
