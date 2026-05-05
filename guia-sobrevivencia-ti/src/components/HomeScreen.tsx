interface HomeScreenProps {
  onExplore: () => void
  onDireto: () => void
  onBussola: () => void
}

const MODES = [
  {
    id: 'explore',
    icon: '[?]',
    label: 'Explorar Áreas',
    desc: 'Veja o panorama real do mercado em 2026 antes de decidir sua trilha.',
    tag: 'Sem testes',
    handler: 'onExplore' as const,
    card: 'hover:border-violet-500/50',
    iconColor: 'text-violet-400',
    tagColor: 'text-violet-600',
  },
  {
    id: 'direto',
    icon: '-->',
    label: 'Direto ao Ponto',
    desc: 'Escolha sua trilha agora. A Base Técnica é validada antes do roadmap ser liberado.',
    tag: 'Base Técnica + Área',
    handler: 'onDireto' as const,
    card: 'hover:border-cyan-500/50',
    iconColor: 'text-cyan-400',
    tagColor: 'text-cyan-600',
  },
  {
    id: 'bussola',
    icon: '(+)',
    label: 'Bússola de Perfil',
    desc: 'Avalie sua base técnica e resiliência. Descubra onde você realmente está.',
    tag: 'Base Técnica + Perfil',
    handler: 'onBussola' as const,
    card: 'hover:border-emerald-500/50',
    iconColor: 'text-emerald-400',
    tagColor: 'text-emerald-600',
  },
] as const

export default function HomeScreen({ onExplore, onDireto, onBussola }: HomeScreenProps) {
  const handlers = { onExplore, onDireto, onBussola }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <p className="text-zinc-700 font-mono text-xs tracking-widest uppercase">Tech-Forge</p>
          <h1 className="text-3xl font-bold text-zinc-100 leading-tight">
            Guia de Sobrevivência em TI
          </h1>
          <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mx-auto">
            O mercado de 2026 não perdoa lacunas na base. Descubra onde você está antes de escolher para onde ir.
          </p>
        </div>

        {/* Modo cards */}
        <div className="space-y-3">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={handlers[mode.handler]}
              className={`w-full p-4 rounded-xl border border-zinc-800 bg-zinc-900 text-left transition-all duration-200 ${mode.card}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className={`font-mono text-lg mt-0.5 shrink-0 ${mode.iconColor}`}>
                    {mode.icon}
                  </span>
                  <div>
                    <p className="text-zinc-100 font-semibold text-sm">{mode.label}</p>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{mode.desc}</p>
                  </div>
                </div>
                <span className={`text-xs font-mono shrink-0 pt-0.5 ${mode.tagColor}`}>
                  {mode.tag}
                </span>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-zinc-800 font-mono text-xs">
          2026 · O conhecimento que não pode ser automatizado
        </p>

      </div>
    </div>
  )
}
