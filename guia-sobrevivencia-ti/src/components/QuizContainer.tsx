import { useState, useCallback } from 'react'
import { useQuiz } from '../hooks/useQuiz'
import type { Option, AnswerFeedback, UserStats, RoadmapModule } from '../types'

// ─── ProgressBar ──────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full h-0.5 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className="h-full bg-cyan-500 transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ─── OptionButton ─────────────────────────────────────────────────────────────

interface OptionButtonProps {
  option: Option
  isSelected: boolean
  isDisabled: boolean
  feedback: AnswerFeedback | null
  onClick: () => void
}

function OptionButton({ option, isSelected, isDisabled, feedback, onClick }: OptionButtonProps) {
  const base =
    'w-full text-left px-4 py-3 rounded-lg border text-sm transition-all duration-200 flex items-start gap-2'

  let variant: string
  if (isSelected && feedback) {
    variant = feedback.correct
      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
      : 'border-red-500 bg-red-500/10 text-red-300'
  } else if (isDisabled) {
    variant = 'border-zinc-800 text-zinc-600 cursor-not-allowed'
  } else {
    variant =
      'border-zinc-700 text-zinc-300 hover:border-cyan-500/60 hover:text-zinc-100 hover:bg-zinc-800/50 cursor-pointer'
  }

  return (
    <button onClick={onClick} disabled={isDisabled} className={`${base} ${variant}`}>
      <span className="font-mono text-xs text-zinc-600 pt-0.5 shrink-0 uppercase">{option.id}.</span>
      <span>{option.text}</span>
    </button>
  )
}

// ─── InsightPanel ─────────────────────────────────────────────────────────────

function InsightPanel({
  feedback,
  isLast,
  onContinue,
}: {
  feedback: AnswerFeedback
  isLast: boolean
  onContinue: () => void
}) {
  return (
    <div className="mt-4 space-y-3">
      <div
        className={`p-4 rounded-lg border ${
          feedback.correct
            ? 'border-emerald-500/30 bg-emerald-500/5'
            : 'border-red-500/30 bg-red-500/5'
        }`}
      >
        <p
          className={`text-xs font-bold font-mono mb-2 ${
            feedback.correct ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {feedback.correct ? '✓ Correto' : '✗ Incorreto'}
        </p>
        <p className="font-mono text-xs text-zinc-400 leading-relaxed">{feedback.insight}</p>
      </div>
      <button
        onClick={onContinue}
        className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-zinc-950 text-sm font-bold rounded-lg transition-colors duration-150"
      >
        {isLast ? 'Ver Diagnóstico →' : 'Continuar →'}
      </button>
    </div>
  )
}

// ─── PathSelection ────────────────────────────────────────────────────────────

const PATH_OPTIONS = [
  {
    path: 'backend' as const,
    icon: '</>',
    label: 'Backend',
    desc: 'Sistemas, Concorrência, Rust/Java, SQL Avançado',
  },
  {
    path: 'security' as const,
    icon: '[#]',
    label: 'Cibersegurança',
    desc: 'Pentest, AppSec, Criptografia, Defesa de Redes',
  },
]

function PathSelection({ onSelect }: { onSelect: (path: 'backend' | 'security') => void }) {
  return (
    <div className="space-y-6 text-center">
      <div>
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
          Fase técnica concluída
        </p>
        <h2 className="text-xl font-bold text-zinc-100">Qual trilha você quer seguir?</h2>
        <p className="text-zinc-500 text-sm mt-1.5">
          Seu roadmap será montado com base nos seus resultados.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {PATH_OPTIONS.map(({ path, icon, label, desc }) => (
          <button
            key={path}
            onClick={() => onSelect(path)}
            className="p-4 rounded-xl border border-zinc-700 hover:border-cyan-500/60 hover:bg-zinc-800/40 transition-all duration-200 text-left"
          >
            <p className="text-cyan-400 font-mono text-xl mb-2">{icon}</p>
            <p className="text-zinc-100 font-semibold text-sm">{label}</p>
            <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{desc}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── DiagnosisResult ──────────────────────────────────────────────────────────

function DiagnosisResult({
  stats,
  roadmap,
  onReset,
}: {
  stats: UserStats
  roadmap: RoadmapModule[]
  onReset: () => void
}) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-1">
          Diagnóstico Final
        </p>
        <h2 className="text-xl font-bold text-zinc-100">Seu Roadmap Personalizado</h2>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
          <p className="text-zinc-500 text-xs font-mono mb-1">INFRA SCORE</p>
          <p
            className={`text-3xl font-bold tabular-nums ${
              stats.infraScore >= 80 ? 'text-emerald-400' : 'text-red-400'
            }`}
          >
            {stats.infraScore}%
          </p>
          <p className="text-zinc-600 text-xs mt-1">
            {stats.infraScore >= 80 ? 'Base sólida' : 'Abaixo do mínimo'}
          </p>
        </div>
        <div className="p-3 rounded-xl bg-zinc-800/50 border border-zinc-700">
          <p className="text-zinc-500 text-xs font-mono mb-1">RESILIÊNCIA</p>
          <p className="text-3xl font-bold tabular-nums text-cyan-400">{stats.resilienceScore}%</p>
          <p className="text-zinc-600 text-xs mt-1">Score de perfil</p>
        </div>
      </div>

      {/* Golden Rule alert */}
      {stats.forcedFoundation && (
        <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/5">
          <p className="text-amber-400 text-xs font-mono font-bold mb-1">⚠ REGRA DE OURO ATIVADA</p>
          <p className="text-zinc-400 text-xs leading-relaxed">
            InfraScore abaixo de 80%. O módulo{' '}
            <span className="text-amber-300 font-mono">Base de Ferro</span> foi adicionado
            obrigatoriamente ao início do seu roadmap.
          </p>
        </div>
      )}

      {/* Roadmap modules */}
      <div className="space-y-3">
        {roadmap.map((module, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${
              module.forced
                ? 'border-amber-500/40 bg-amber-500/5'
                : 'border-cyan-500/30 bg-cyan-500/5'
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              {module.forced && (
                <span className="text-amber-500 font-mono text-xs font-bold">[OBRIGATÓRIO]</span>
              )}
              <h3
                className={`font-bold text-sm ${
                  module.forced ? 'text-amber-300' : 'text-cyan-300'
                }`}
              >
                {module.title}
              </h3>
            </div>
            <ul className="space-y-1.5">
              {module.topics.map((topic, j) => (
                <li key={j} className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                  <span className={module.forced ? 'text-amber-600' : 'text-cyan-600'}>→</span>
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full py-2.5 border border-zinc-700 hover:border-zinc-600 text-zinc-500 hover:text-zinc-300 text-sm rounded-lg transition-all duration-200"
      >
        Refazer diagnóstico
      </button>
    </div>
  )
}

// ─── QuizContainer ────────────────────────────────────────────────────────────

export default function QuizContainer() {
  const {
    phase,
    currentQuestion,
    questionIndex,
    totalQuestions,
    feedback,
    stats,
    roadmap,
    answerQuestion,
    advance,
    confirmPath,
    reset,
  } = useQuiz()

  const [visible, setVisible] = useState(true)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const handleAnswer = useCallback(
    (optionId: string) => {
      if (feedback !== null) return
      setSelectedOption(optionId)
      answerQuestion(optionId)
    },
    [feedback, answerQuestion],
  )

  // Fade out → troca pergunta → fade in
  const handleAdvance = useCallback(() => {
    setVisible(false)
    setTimeout(() => {
      setSelectedOption(null)
      advance()
      setVisible(true)
    }, 280)
  }, [advance])

  const handleReset = useCallback(() => {
    setSelectedOption(null)
    setVisible(true)
    reset()
  }, [reset])

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Brand header */}
        <p className="text-center text-zinc-700 font-mono text-xs tracking-widest uppercase mb-8">
          Tech-Forge / Diagnóstico
        </p>

        {/* ── Quiz Phase ── */}
        {phase === 'quiz' && currentQuestion && (
          <>
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-600 font-mono text-xs">
                {questionIndex + 1} / {totalQuestions}
              </span>
              <span
                className={`font-mono text-xs uppercase tracking-wider ${
                  currentQuestion.type === 'technical_base' ? 'text-cyan-700' : 'text-violet-700'
                }`}
              >
                {currentQuestion.type === 'technical_base' ? 'Base Técnica' : 'Perfil'}
              </span>
            </div>

            <ProgressBar current={questionIndex + 1} total={totalQuestions} />

            <div
              className={`mt-5 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 transition-all duration-300 ease-in-out ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              <p className="text-zinc-100 font-semibold text-base leading-relaxed mb-5">
                {currentQuestion.question}
              </p>

              <div className="space-y-2">
                {currentQuestion.options.map((option) => (
                  <OptionButton
                    key={option.id}
                    option={option}
                    isSelected={selectedOption === option.id}
                    isDisabled={feedback !== null}
                    feedback={selectedOption === option.id ? feedback : null}
                    onClick={() => handleAnswer(option.id)}
                  />
                ))}
              </div>

              {feedback && (
                <InsightPanel
                  feedback={feedback}
                  isLast={questionIndex === totalQuestions - 1}
                  onContinue={handleAdvance}
                />
              )}
            </div>
          </>
        )}

        {/* ── Path Selection Phase ── */}
        {phase === 'path_selection' && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <PathSelection onSelect={confirmPath} />
          </div>
        )}

        {/* ── Result Phase ── */}
        {phase === 'result' && stats && roadmap && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <DiagnosisResult stats={stats} roadmap={roadmap} onReset={handleReset} />
          </div>
        )}

      </div>
    </div>
  )
}
