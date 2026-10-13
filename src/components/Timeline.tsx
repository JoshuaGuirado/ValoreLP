import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { ease } from './motion'

/** Cronograma da reforma — conteúdo do guia (EC 132/2023 e LC 214/2025). */
const steps = [
  {
    year: '2026',
    tag: 'Ano de teste',
    text: 'CBS de 0,9% e IBS de 0,1%, com destaque nas notas fiscais. O recolhimento fica dispensado para o contribuinte que cumprir as obrigações acessórias.',
    legacy: 100,
  },
  {
    year: '2027',
    tag: 'PIS e Cofins são extintos',
    text: 'A CBS passa a ser cobrada pela alíquota de referência, reduzida em 0,1 p.p.; o Imposto Seletivo entra em vigor e o IPI é zerado, exceto para produtos com fabricação incentivada na Zona Franca de Manaus. O IBS permanece em 0,1%.',
    legacy: 100,
  },
  { year: '2028', tag: 'Mesmas regras de 2027', text: 'A empresa segue apurando o sistema antigo e o novo simultaneamente.', legacy: 100 },
  {
    year: '2029 a 2032',
    tag: 'Transição do ICMS e do ISS',
    text: 'ICMS e ISS caem para 90%, 80%, 70% e 60% das alíquotas atuais, enquanto o IBS sobe na mesma proporção.',
    legacy: 60,
    steps: [90, 80, 70, 60],
  },
  { year: '2033', tag: 'Sistema pleno', text: 'ICMS e ISS são extintos. CBS e IBS passam a valer integralmente.', legacy: 0 },
]

function LegacyBar({ values }: { values: number[] }) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex justify-between text-[0.62rem] font-semibold tracking-[0.16em] text-white/40 uppercase">
        <span>ICMS e ISS</span>
        <span>IBS</span>
      </div>
      <div className="flex gap-1.5">
        {values.map((v, i) => (
          <div key={i} className="flex-1">
            <div className="flex h-2 overflow-hidden rounded-full bg-gold/15">
              <motion.div
                className="h-full bg-white/35"
                initial={{ width: '100%' }}
                whileInView={{ width: `${v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease, delay: 0.3 + i * 0.15 }}
              />
              <div className="h-full flex-1 bg-gradient-to-r from-gold-deep to-gold" />
            </div>
            <p className="mt-1.5 text-center text-[0.65rem] text-white/45 tabular-nums">
              {2029 + i} · {v}%
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      {/* trilho */}
      <div aria-hidden="true" className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-white/10 md:left-1/2" />
      <motion.div
        aria-hidden="true"
        style={{ scaleY: progress }}
        className="absolute top-2 bottom-2 left-[0.6875rem] w-px origin-top bg-gradient-to-b from-gold-light via-gold to-gold-deep shadow-[0_0_12px_rgb(197_161_85/0.8)] md:left-1/2"
      />

      {steps.map((s, i) => {
        const right = i % 2 === 1
        return (
          <li key={s.year} className="relative pb-14 pl-12 last:pb-0 md:grid md:grid-cols-2 md:gap-16 md:pl-0">
            {/* marcador */}
            <motion.span
              aria-hidden="true"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, margin: '0px 0px -30% 0px' }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="absolute top-1.5 left-0 grid size-[1.375rem] place-items-center rounded-full border border-gold/60 bg-ink md:left-1/2 md:-translate-x-1/2"
            >
              <span className="size-2 rounded-full bg-gold shadow-[0_0_10px_#c5a155]" />
            </motion.span>

            <motion.div
              initial={{ opacity: 0, x: right ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              transition={{ duration: 0.9, ease }}
              className={right ? 'md:col-start-2' : 'md:text-right'}
            >
              <p className="font-serif text-4xl text-gold-gradient italic md:text-5xl">{s.year}</p>
              <p className="mt-2 text-sm font-bold tracking-[0.14em] text-white uppercase">{s.tag}</p>
              <p className={`mt-3 text-[0.95rem] leading-relaxed text-white/60 ${right ? '' : 'md:ml-auto'} max-w-md`}>{s.text}</p>
              {s.steps && <LegacyBar values={s.steps} />}
            </motion.div>
          </li>
        )
      })}
    </ol>
  )
}
