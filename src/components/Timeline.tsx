import { AnimatePresence, motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const ease = [0.22, 1, 0.36, 1] as const
const AUTOPLAY_MS = 3200

/** Cronograma da reforma — conteúdo do guia (EC 132/2023 e LC 214/2025). */
const steps = [
  {
    year: '2026',
    from: 2026,
    tag: 'Ano de teste',
    text: 'CBS de 0,9% e IBS de 0,1%, com destaque nas notas fiscais. O recolhimento fica dispensado para o contribuinte que cumprir as obrigações acessórias.',
  },
  {
    year: '2027',
    from: 2027,
    tag: 'PIS e Cofins são extintos',
    text: 'A CBS passa a ser cobrada pela alíquota de referência, reduzida em 0,1 p.p.; o Imposto Seletivo entra em vigor e o IPI é zerado, exceto para produtos com fabricação incentivada na Zona Franca de Manaus.',
  },
  { year: '2028', from: 2028, tag: 'Mesmas regras de 2027', text: 'A empresa segue apurando o sistema antigo e o novo simultaneamente.' },
  {
    year: '2029–2032',
    from: 2029,
    tag: 'Transição do ICMS e do ISS',
    text: 'ICMS e ISS caem para 90%, 80%, 70% e 60% das alíquotas atuais, enquanto o IBS sobe na mesma proporção.',
    bars: [90, 80, 70, 60],
  },
  { year: '2033', from: 2033, tag: 'Sistema pleno', text: 'ICMS e ISS são extintos. CBS e IBS passam a valer integralmente.' },
]

function currentIndex() {
  const y = new Date().getFullYear()
  const i = steps.findIndex((s, k) => y >= s.from && y < (steps[k + 1]?.from ?? Infinity))
  return Math.max(0, i)
}

/** Mini gráfico: ICMS/ISS encolhendo enquanto o IBS ocupa o espaço. */
function TransitionBars({ values }: { values: number[] }) {
  return (
    <div className="mt-6 max-w-sm">
      <div className="flex h-20 items-end gap-2" aria-hidden="true">
        {values.map((v, i) => (
          <div key={v} className="flex h-full flex-1 flex-col justify-end overflow-hidden bg-gold/85">
            <motion.div
              initial={{ height: '100%' }}
              animate={{ height: `${v}%` }}
              transition={{ duration: 1, ease, delay: 0.2 + i * 0.15 }}
              className="w-full bg-white/30"
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2 text-[0.6rem] text-white/50 tabular-nums">
        {values.map((v, i) => (
          <span key={v} className="flex-1 text-center">
            {2029 + i} · {v}%
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center gap-5 text-[0.6rem] font-semibold tracking-[0.16em] text-white/50 uppercase">
        <span className="flex items-center gap-2">
          <span className="size-2.5 bg-white/30" /> ICMS e ISS
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 bg-gold/85" /> IBS
        </span>
      </div>
    </div>
  )
}

/**
 * Cronograma que se apresenta sozinho: a cada poucos segundos destaca o próximo
 * ano, avança o fio dourado e troca o painel de detalhe. Ao passar o mouse ou
 * tocar em um ano, ele assume o controle e pausa por alguns segundos.
 */
export function Timeline() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '0px 0px -25% 0px' })
  const now = currentIndex()
  const [active, setActive] = useState(now)
  const [pausedUntil, setPausedUntil] = useState(0)

  useEffect(() => {
    if (!inView) return
    const t = setInterval(() => {
      if (Date.now() < pausedUntil) return
      setActive((a) => (a + 1) % steps.length)
    }, AUTOPLAY_MS)
    return () => clearInterval(t)
  }, [inView, pausedUntil])

  const choose = (i: number) => {
    setActive(i)
    setPausedUntil(Date.now() + 8000)
  }
  const step = steps[active]

  return (
    <div ref={ref}>
      <ol className="relative grid grid-cols-5">
        {/* trilho e progresso automático */}
        <div aria-hidden="true" className="absolute top-[7px] right-0 left-0 h-px bg-white/20" />
        <motion.div
          aria-hidden="true"
          animate={{ scaleX: (active + 1) / steps.length }}
          transition={{ duration: 0.9, ease }}
          className="absolute top-[7px] right-0 left-0 h-[2px] origin-left bg-gold shadow-[0_0_12px_rgb(197_161_85/0.6)]"
        />

        {steps.map((s, i) => {
          const isActive = i === active
          const done = i < active
          return (
            <motion.li
              key={s.year}
              initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 0.9, ease, delay: i * 0.1 }}
              className="relative pt-8 pr-2"
            >
              <button
                type="button"
                onClick={() => choose(i)}
                onMouseEnter={() => choose(i)}
                aria-pressed={isActive}
                className="group block w-full cursor-pointer text-left"
              >
                {/* marcador */}
                <motion.span
                  aria-hidden="true"
                  animate={{ scale: isActive ? 1.35 : 1, backgroundColor: isActive || done ? '#c5a155' : '#5a5956' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="absolute top-0 left-0 size-[15px] rounded-full border-2 border-graphite-2"
                />
                {isActive && (
                  <motion.span
                    key={`ring-${active}`}
                    aria-hidden="true"
                    initial={{ scale: 1, opacity: 0.8 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    className="absolute top-0 left-0 size-[15px] rounded-full border border-gold"
                  />
                )}
                <motion.p
                  animate={{ color: isActive ? '#c5a155' : '#ffffff', opacity: isActive ? 1 : 0.55 }}
                  transition={{ duration: 0.5 }}
                  className="font-serif text-lg font-semibold sm:text-3xl lg:text-[2.6rem]"
                >
                  {s.year}
                </motion.p>
                <p className="mt-2 hidden text-sm leading-snug text-white/60 md:block">{s.tag}</p>
                {i === now && (
                  <span className="mt-2 inline-block rounded-[2px] bg-gold px-1.5 py-0.5 text-[0.55rem] font-bold tracking-[0.14em] text-graphite-2 uppercase">
                    Agora
                  </span>
                )}
              </button>
            </motion.li>
          )
        })}
      </ol>

      {/* painel de detalhe que troca sozinho */}
      <div className="relative mt-12 min-h-[15rem] border-l-2 border-gold pl-6 sm:pl-10 md:min-h-[12rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.55, ease }}
          >
            <p className="text-[0.68rem] font-semibold tracking-[0.2em] text-gold uppercase">{step.year}</p>
            <p className="heading mt-2 text-2xl text-white sm:text-3xl">{step.tag}</p>
            <p className="mt-4 max-w-2xl leading-relaxed text-white/70">{step.text}</p>
            {step.bars && <TransitionBars values={step.bars} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
