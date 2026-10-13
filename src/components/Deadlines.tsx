import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ease } from './motion'

/** Fim do dia em Brasília (UTC-3). */
const endOfDay = (iso: string) => new Date(`${iso}T23:59:59-03:00`).getTime()
const startOfDay = (iso: string) => new Date(`${iso}T00:00:00-03:00`).getTime()

/** Prazos da Resolução CGSN 194/2026 (conteúdo do guia). */
const deadlines = [
  { when: 'Até 15 de outubro de 2026', what: 'Opção pelo Simples Nacional para 2027', start: null, end: '2026-10-15' },
  { when: 'Até 30 de outubro de 2026', what: 'Opção pelo regime regular de IBS e CBS (janeiro a junho de 2027)', start: null, end: '2026-10-30' },
  {
    when: 'De 3 de novembro a 20 de dezembro de 2026',
    what: 'Cancelamento de qualquer das duas opções, em caráter irretratável',
    start: '2026-11-03',
    end: '2026-12-20',
  },
  { when: 'Março de 2027', what: 'Nova janela para o regime regular (segundo semestre de 2027)', start: '2027-03-01', end: '2027-03-31' },
] as const

const TARGET = new Date('2027-01-01T00:00:00-03:00').getTime()

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval)
    return () => clearInterval(t)
  }, [interval])
  return now
}

/** Contagem regressiva até a extinção do PIS e da Cofins. */
export function Countdown({ dark = false }: { dark?: boolean }) {
  const now = useNow()
  const diff = Math.max(0, TARGET - now)
  if (diff === 0) return null
  const parts = [
    { v: Math.floor(diff / 86_400_000), l: 'dias' },
    { v: Math.floor((diff / 3_600_000) % 24), l: 'horas' },
    { v: Math.floor((diff / 60_000) % 60), l: 'min' },
    { v: Math.floor((diff / 1000) % 60), l: 'seg' },
  ]

  return (
    <div>
      <p className={`text-[0.7rem] font-semibold tracking-[0.18em] uppercase ${dark ? 'text-gold' : 'text-graphite/60'}`}>
        Até 1º de janeiro de 2027, quando PIS e Cofins são extintos
      </p>
      <div className={`mt-5 flex divide-x border-y ${dark ? 'divide-white/20 border-white/20' : 'divide-line border-line'}`} role="timer" aria-label={`Faltam ${parts[0].v} dias para 1º de janeiro de 2027`}>
        {parts.map((p) => (
          <div key={p.l} className="flex-1 py-5 text-center">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.p
                key={p.v}
                initial={{ y: -14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 14, opacity: 0 }}
                transition={{ duration: 0.35, ease }}
                className={`font-serif text-4xl font-semibold tabular-nums sm:text-5xl ${dark ? 'text-white' : 'text-graphite'}`}
              >
                {String(p.v).padStart(2, '0')}
              </motion.p>
            </AnimatePresence>
            <p className={`mt-2 text-[0.65rem] tracking-[0.18em] uppercase ${dark ? 'text-white/60' : 'text-graphite/55'}`}>{p.l}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DeadlineList({ dark = false }: { dark?: boolean }) {
  const now = useNow(60_000)
  return (
    <div>
      <ul className={`border-t ${dark ? 'border-white/40' : 'border-graphite/80'}`}>
        {deadlines.map((dl, i) => {
          const end = endOfDay(dl.end)
          const start = dl.start ? startOfDay(dl.start) : 0
          const closed = now > end
          const open = !closed && now >= start
          const daysLeft = Math.floor((end - now) / 86_400_000)
          const status = closed
            ? 'Encerrado'
            : open
              ? daysLeft < 1
                ? 'Último dia'
                : daysLeft === 1
                  ? 'Falta 1 dia'
                  : `Faltam ${daysLeft} dias`
              : 'Em breve'
          return (
            <motion.li
              key={dl.when}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease, delay: i * 0.1 }}
              className={`grid gap-1 border-b py-5 ${dark ? 'border-white/15' : 'border-line'} sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6 ${closed ? 'opacity-50' : ''}`}
            >
              <div>
                <p className={`font-serif text-lg font-semibold ${dark ? 'text-white' : 'text-graphite'}`}>{dl.when}</p>
                <p className={`mt-1 text-[0.92rem] leading-relaxed ${dark ? 'text-white/65' : 'text-graphite/65'}`}>{dl.what}</p>
              </div>
              <p className={`text-[0.7rem] font-semibold tracking-[0.14em] uppercase ${open ? (dark ? 'text-gold' : 'text-gold-ink') : dark ? 'text-white/45' : 'text-graphite/45'}`}>{status}</p>
            </motion.li>
          )
        })}
      </ul>
      <p className={`mt-4 text-xs ${dark ? 'text-white/45' : 'text-graphite/50'}`}>Prazos prorrogados pela Resolução CGSN 194/2026, publicada em 28 de setembro de 2026.</p>
    </div>
  )
}
