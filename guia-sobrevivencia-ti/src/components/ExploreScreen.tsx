import marketReality from '../data/market_reality.json'

interface ExploreScreenProps {
  onBack: () => void
}

export default function ExploreScreen({ onBack }: ExploreScreenProps) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">

        {/* Nav */}
        <button
          onClick={onBack}
          className="text-zinc-600 hover:text-zinc-400 font-mono text-xs transition-colors flex items-center gap-1.5"
        >
          ← Voltar
        </button>

        {/* Header */}
        <div>
          <p className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-2">
            Panorama 2026
          </p>
          <h2 className="text-xl font-bold text-zinc-100">O Mercado de TI Hoje</h2>
        </div>

        {/* Realidade geral */}
        <div className="p-5 rounded-xl border border-zinc-700 bg-zinc-900 space-y-4">
          <div>
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-wider mb-2">
              Realidade Geral
            </p>
            <p className="text-zinc-200 text-sm leading-relaxed">
              {marketReality.general.status_2026}
            </p>
          </div>
          <div className="border-t border-zinc-800 pt-4">
            <p className="text-zinc-400 text-sm leading-relaxed">
              {marketReality.general.requirement}
            </p>
          </div>
        </div>

        {/* Alerta Cibersegurança */}
        <div className="p-5 rounded-xl border border-amber-500/30 bg-amber-500/5 space-y-2">
          <p className="text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            ⚠ {marketReality.security_alert.title}
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed">
            {marketReality.security_alert.message}
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onBack}
          className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 active:bg-cyan-600 text-zinc-950 text-sm font-bold rounded-lg transition-colors duration-150"
        >
          Escolher meu modo de entrada
        </button>

      </div>
    </div>
  )
}
