import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

/** Cronograma da reforma — conteúdo do guia (EC 132/2023 e LC 214/2025). */
const steps = [
  { year: '2026', from: 2026, tag: 'Ano de teste' },
  { year: '2027', from: 2027, tag: 'PIS e Cofins são extintos' },
  { year: '2028', from: 2028, tag: 'Mesmas regras de 2027' },
  { year: '2029–2032', from: 2029, tag: 'ICMS e ISS caem para 90%, 80%, 70% e 60%', bars: [90, 80, 70, 60] },
  { year: '2033', from: 2033, tag: 'CBS e IBS passam a valer integralmente' },
]

/** Mini gráfico: ICMS/ISS encolhendo enquanto o IBS ocupa o espaço. */
function TransitionBars({ values, delay }: { values: number[]; delay: number }) {
  return (
    <div className="mt-5 flex h-16 items-end gap-1.5" aria-hidden="true">
      {values.map((v, i) => (
        <div key={v} className="flex h-full flex-1 flex-col justify-end overflow-hidden bg-gold/80">
          <motion.div
            initial={{ height: '100%' }}
            whileInView={{ height: `${v}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease, delay: delay + 0.4 + i * 0.18 }}
            className="w-full bg-white/30"
          />
        </div>
      ))}
    </div>
  )
}

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })

  return (
    <>
      <ol ref={ref} className="relative grid lg:grid-cols-5">
        <div aria-hidden="true" className="absolute top-0 bottom-0 left-[5px] w-px bg-white/20 lg:top-[5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
        <motion.div aria-hidden="true" style={{ scaleY: progress }} className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-gold lg:hidden" />
        <motion.div aria-hidden="true" style={{ scaleX: progress }} className="absolute top-[5px] right-0 left-0 hidden h-px origin-left bg-gold lg:block" />

        {steps.map((s, i) => {
          const year = new Date().getFullYear()
          const nextFrom = steps[i + 1]?.from ?? Infinity
          const current = year >= s.from && year < nextFrom
          const delay = i * 0.12
          return (
            <motion.li
              key={s.year}
              initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 0.9, ease, delay }}
              whileHover={{ y: -6 }}
              className="group relative pb-10 pl-9 last:pb-0 lg:pt-10 lg:pr-6 lg:pb-0 lg:pl-0"
            >
              {/* marcador; o ano atual pulsa */}
              <motion.span
                aria-hidden="true"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 + delay }}
                className="absolute top-1.5 left-0 size-[11px] rounded-full bg-gold lg:top-0"
              />
              {current && (
                <motion.span
                  aria-hidden="true"
                  animate={{ scale: [1, 2.6], opacity: [0.7, 0] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute top-1.5 left-0 size-[11px] rounded-full border border-gold lg:top-0"
                />
              )}

              <div className="flex items-baseline gap-3">
                <p className="font-serif text-4xl font-semibold text-white transition-colors duration-300 group-hover:text-gold lg:text-[2.6rem]">{s.year}</p>
                {current && (
                  <motion.span
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="rounded-[2px] bg-gold px-1.5 py-0.5 text-[0.58rem] font-bold tracking-[0.14em] text-graphite-2 uppercase"
                  >
                    Agora
                  </motion.span>
                )}
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease, delay: 0.35 + delay }}
                className="mt-3 h-px w-10 origin-left bg-gold/70 transition-[width] duration-500 group-hover:w-20"
              />
              <p className="mt-3 text-sm leading-snug text-white/70">{s.tag}</p>
              {s.bars && <TransitionBars values={s.bars} delay={delay} />}
            </motion.li>
          )
        })}
      </ol>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-10 flex items-center gap-5 text-[0.65rem] font-semibold tracking-[0.16em] text-white/50 uppercase"
      >
        <span className="flex items-center gap-2">
          <span className="size-2.5 bg-white/30" /> ICMS e ISS
        </span>
        <span className="flex items-center gap-2">
          <span className="size-2.5 bg-gold/80" /> IBS
        </span>
      </motion.div>
    </>
  )
}
