import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { ease } from './motion'

/** Cronograma da reforma — conteúdo do guia (EC 132/2023 e LC 214/2025). */
const steps = [
  {
    year: '2026',
    tag: 'Ano de teste',
    text: 'CBS de 0,9% e IBS de 0,1%, com destaque nas notas fiscais. O recolhimento fica dispensado para o contribuinte que cumprir as obrigações acessórias.',
  },
  {
    year: '2027',
    tag: 'PIS e Cofins são extintos',
    text: 'A CBS passa a ser cobrada pela alíquota de referência, reduzida em 0,1 p.p.; o Imposto Seletivo entra em vigor e o IPI é zerado, exceto para produtos com fabricação incentivada na Zona Franca de Manaus. O IBS permanece em 0,1%.',
  },
  { year: '2028', tag: 'Mesmas regras de 2027', text: '' },
  {
    year: '2029 a 2032',
    tag: 'Transição do ICMS e do ISS',
    text: 'ICMS e ISS caem para 90%, 80%, 70% e 60% das alíquotas atuais, enquanto o IBS sobe na mesma proporção.',
  },
  { year: '2033', tag: 'Sistema pleno', text: 'ICMS e ISS são extintos. CBS e IBS passam a valer integralmente.' },
]

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })

  return (
    <ol ref={ref} className="relative grid gap-0 lg:grid-cols-5">
      {/* trilho: vertical no celular, horizontal no desktop */}
      <div aria-hidden="true" className="absolute top-0 bottom-0 left-[5px] w-px bg-white/15 lg:top-[5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
      <motion.div
        aria-hidden="true"
        style={{ scaleY: progress }}
        className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-gold lg:hidden"
      />
      <motion.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute top-[5px] right-0 left-0 hidden h-px origin-left bg-gold lg:block"
      />

      {steps.map((s, i) => (
        <motion.li
          key={s.year}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 0.8, ease, delay: i * 0.08 }}
          className="relative pb-12 pl-9 last:pb-0 lg:pt-10 lg:pr-8 lg:pb-0 lg:pl-0"
        >
          <span aria-hidden="true" className="absolute top-1 left-0 size-[11px] rounded-full border-2 border-gold bg-graphite lg:top-0" />
          <p className="font-serif text-3xl font-semibold text-gold">{s.year}</p>
          <p className="mt-3 text-[0.72rem] font-semibold tracking-[0.16em] text-white uppercase">{s.tag}</p>
          {s.text && <p className="mt-3 text-[0.92rem] leading-relaxed text-white/65">{s.text}</p>}
        </motion.li>
      ))}
    </ol>
  )
}
