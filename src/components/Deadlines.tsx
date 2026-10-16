import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
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

/** Permite conferir os prazos em outra data: ?data=2026-11-05 */
function simulatedOffset() {
  if (typeof window === 'undefined') return 0
  const d = new URLSearchParams(window.location.search).get('data')
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return 0
  return new Date(`${d}T12:00:00-03:00`).getTime() - Date.now()
}
const OFFSET = simulatedOffset()

function useNow(interval = 1000) {
  const [now, setNow] = useState(() => Date.now() + OFFSET)
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now() + OFFSET), interval)
    return () => clearInterval(t)
  }, [interval])
  return now
}

/** Contagem regressiva até a extinção do PIS e da Cofins. */
export function Countdown({ dark = false }: { dark?: boolean }) {
  const now = useNow()
  const diff = Math.max(0, TARGET - now)
  if (diff === 0)
    return (
      <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`font-serif text-xl ${dark ? 'text-white' : 'text-graphite'}`}>
        PIS e Cofins foram extintos em 1º de janeiro de 2027. A CBS já está em vigor.
      </motion.p>
    )
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
                className={`font-serif text-3xl font-semibold tabular-nums sm:text-5xl ${dark ? 'text-white' : 'text-graphite'}`}
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

/** Status do prazo em texto curto. */
function statusOf(now: number, start: number, end: number) {
  if (now > end) return 'Encerrado'
  if (now < start) return 'Em breve'
  const daysLeft = Math.floor((end - now) / 86_400_000)
  return daysLeft < 1 ? 'Último dia' : daysLeft === 1 ? 'Falta 1 dia' : `Faltam ${daysLeft} dias`
}

const PUBLISHED = new Date('2026-09-28T00:00:00-03:00').getTime()

/**
 * Lista de prazos. O prazo encerrado aparece riscado por um instante e some;
 * os seguintes sobem e o primeiro em aberto vira o destaque "Próximo prazo".
 * Quando todos terminam, a lista dá lugar a uma mensagem de próximo passo.
 */
export function DeadlineList({ dark = false }: { dark?: boolean }) {
  const now = useNow(60_000)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  // Depois de visto, os prazos encerrados saem da lista.
  const [cleared, setCleared] = useState(false)
  useEffect(() => {
    if (!inView) return
    const t = setTimeout(() => setCleared(true), 1600)
    return () => clearTimeout(t)
  }, [inView])

  const items = deadlines.map((dl) => {
    const start = dl.start ? startOfDay(dl.start) : PUBLISHED
    const end = endOfDay(dl.end)
    return { ...dl, startTs: start, endTs: end, closed: now > end, status: statusOf(now, dl.start ? start : 0, end) }
  })
  const visible = items.filter((it) => !(cleared && it.closed))
  const nextKey = items.find((it) => !it.closed)?.when
  const allClosed = items.every((it) => it.closed)

  const line = dark ? 'border-white/15' : 'border-line'
  const strong = dark ? 'text-white' : 'text-graphite'
  const soft = dark ? 'text-white/65' : 'text-graphite/65'

  return (
    <div ref={ref}>
      <motion.ul layout className={`border-t ${dark ? 'border-white/40' : 'border-graphite/80'}`}>
        <AnimatePresence initial={false}>
          {visible.map((it, i) => {
            const isNext = cleared && it.when === nextKey
            const total = Math.max(1, it.endTs - it.startTs)
            const elapsed = Math.min(1, Math.max(0, (now - it.startTs) / total))
            return (
              <motion.li
                key={it.when}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                exit={{ opacity: 0, x: -60, height: 0, paddingTop: 0, paddingBottom: 0, transition: { duration: 0.7, ease } }}
                transition={{ duration: 0.7, ease, delay: inView && !cleared ? i * 0.1 : 0 }}
                className={`relative overflow-hidden border-b py-5 ${line} ${isNext ? 'pl-5' : ''}`}
              >
                {isNext && (
                  <motion.span
                    layoutId="next-deadline"
                    aria-hidden="true"
                    className="absolute top-0 bottom-0 left-0 w-[3px] bg-gold"
                  />
                )}
                <div className="grid gap-1 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-6">
                  <div>
                    <AnimatePresence>
                      {isNext && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mb-1 text-[0.62rem] font-semibold tracking-[0.2em] text-gold-deep uppercase"
                        >
                          Próximo prazo
                        </motion.p>
                      )}
                    </AnimatePresence>
                    <p className={`relative inline-block font-serif text-lg font-semibold ${strong}`}>
                      {it.when}
                      {it.closed && (
                        <motion.span
                          aria-hidden="true"
                          initial={{ scaleX: 0 }}
                          animate={inView ? { scaleX: 1 } : undefined}
                          transition={{ duration: 0.6, ease, delay: 0.5 }}
                          className="absolute top-1/2 right-0 left-0 h-px origin-left bg-graphite/60"
                        />
                      )}
                    </p>
                    <p className={`mt-1 text-[0.92rem] leading-relaxed ${soft}`}>{it.what}</p>
                  </div>
                  <p
                    className={`text-[0.7rem] font-semibold tracking-[0.14em] uppercase ${
                      it.closed ? 'text-[#a8442f]' : isNext ? 'text-gold-ink' : dark ? 'text-white/45' : 'text-graphite/45'
                    }`}
                  >
                    {it.status}
                  </p>
                </div>
                {isNext && (
                  <div className="mt-4 h-[3px] w-full overflow-hidden bg-graphite/10">
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: elapsed }}
                      transition={{ duration: 1.4, ease, delay: 0.3 }}
                      className="h-full origin-left bg-gold"
                    />
                  </div>
                )}
              </motion.li>
            )
          })}
        </AnimatePresence>
      </motion.ul>

      <AnimatePresence>
        {cleared && allClosed && (
          <motion.div
            key="all-closed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease }}
            className={`border-b py-6 ${line}`}
          >
            <p className={`font-serif text-lg font-semibold ${strong}`}>Os prazos de opção se encerraram.</p>
            <p className={`mt-1 text-[0.92rem] leading-relaxed ${soft}`}>
              O próximo passo é simular a carga de 2027 com os números da sua empresa.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p className={`mt-4 text-xs ${dark ? 'text-white/45' : 'text-graphite/50'}`}>Prazos prorrogados pela Resolução CGSN 194/2026, publicada em 28 de setembro de 2026.</p>
    </div>
  )
}
