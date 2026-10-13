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

function Digit({ value, label }: { value: number; label: string }) {
  const str = String(value).padStart(2, '0')
  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-[4.5rem] min-w-[4.2rem] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] px-3 sm:h-24 sm:min-w-[5.5rem]">
        <div className="absolute inset-x-0 top-1/2 h-px bg-black/40" />
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={str}
            initial={{ y: '-60%', opacity: 0, filter: 'blur(4px)' }}
            animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '60%', opacity: 0, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease }}
            className="text-3xl font-bold text-white tabular-nums sm:text-5xl"
          >
            {str}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 text-[0.62rem] font-semibold tracking-[0.2em] text-white/45 uppercase">{label}</span>
    </div>
  )
}

export function Countdown() {
  const now = useNow()
  const diff = Math.max(0, TARGET - now)
  const d = Math.floor(diff / 86_400_000)
  const h = Math.floor((diff / 3_600_000) % 24)
  const m = Math.floor((diff / 60_000) % 60)
  const s = Math.floor((diff / 1000) % 60)

  if (diff === 0) return null
  return (
    <div>
      <p className="mb-4 text-center text-xs font-semibold tracking-[0.2em] text-gold uppercase lg:text-left">
        1º de janeiro de 2027 · PIS e Cofins são extintos
      </p>
      <div className="flex justify-center gap-2.5 sm:gap-4 lg:justify-start" role="timer" aria-label={`Faltam ${d} dias para 1º de janeiro de 2027`}>
        <Digit value={d} label="dias" />
        <Digit value={h} label="horas" />
        <Digit value={m} label="min" />
        <Digit value={s} label="seg" />
      </div>
    </div>
  )
}

export function DeadlineList() {
  const now = useNow(60_000)
  return (
    <div>
      <ul className="divide-y divide-white/8 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
        {deadlines.map((dl, i) => {
          const end = endOfDay(dl.end)
          const start = dl.start ? startOfDay(dl.start) : 0
          const closed = now > end
          const open = !closed && now >= start
          const daysLeft = Math.floor((end - now) / 86_400_000)
          return (
            <motion.li
              key={dl.when}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease, delay: i * 0.08 }}
              className={`flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:gap-6 ${closed ? 'opacity-45' : ''}`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">{dl.when}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/55">{dl.what}</p>
              </div>
              <span
                className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1 text-[0.65rem] font-bold tracking-[0.14em] uppercase ${
                  closed
                    ? 'bg-white/5 text-white/40'
                    : open
                      ? 'bg-gold/15 text-gold-light ring-1 ring-gold/40'
                      : 'bg-white/5 text-white/60'
                }`}
              >
                {open && (
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-gold opacity-75" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-gold" />
                  </span>
                )}
                {closed ? 'Encerrado' : open ? (daysLeft < 1 ? 'Último dia' : daysLeft === 1 ? 'Falta 1 dia' : `Faltam ${daysLeft} dias`) : 'Em breve'}
              </span>
            </motion.li>
          )
        })}
      </ul>
      <p className="mt-3 text-xs text-white/35">Prazos prorrogados pela Resolução CGSN 194/2026, publicada em 28 de setembro de 2026.</p>
    </div>
  )
}
