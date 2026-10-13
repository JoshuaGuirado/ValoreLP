import { LogoMark } from './Logo'

const terms = [
  'CBS',
  'IBS',
  'Imposto Seletivo',
  'Split payment',
  'Créditos',
  'Regime tributário',
  'Cláusula fiscal',
  'Formação de preço',
  'Capital de giro',
  'LC 214/2025',
  'EC 132/2023',
]

export function Marquee() {
  const row = [...terms, ...terms]
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden border-y border-white/5 bg-ink-2 py-5 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]"
    >
      <div className="flex w-max animate-marquee items-center gap-10 hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-sm font-semibold tracking-[0.24em] whitespace-nowrap text-white/40 uppercase">
            {t}
            <LogoMark className="h-4 w-auto opacity-70" />
          </span>
        ))}
      </div>
    </div>
  )
}
