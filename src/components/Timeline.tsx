import { motion, useScroll, useSpring } from 'framer-motion'
import { useRef } from 'react'

/** Cronograma da reforma — conteúdo do guia (EC 132/2023 e LC 214/2025). */
const steps = [
  { year: '2026', tag: 'Ano de teste' },
  { year: '2027', tag: 'PIS e Cofins são extintos' },
  { year: '2028', tag: 'Mesmas regras de 2027' },
  { year: '2029–2032', tag: 'ICMS e ISS caem para 90%, 80%, 70% e 60%' },
  { year: '2033', tag: 'CBS e IBS passam a valer integralmente' },
]

export function Timeline() {
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 60%'] })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 25 })

  return (
    <ol ref={ref} className="relative grid lg:grid-cols-5">
      <div aria-hidden="true" className="absolute top-0 bottom-0 left-[5px] w-px bg-white/20 lg:top-[5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
      <motion.div aria-hidden="true" style={{ scaleY: progress }} className="absolute top-0 bottom-0 left-[5px] w-px origin-top bg-gold lg:hidden" />
      <motion.div aria-hidden="true" style={{ scaleX: progress }} className="absolute top-[5px] right-0 left-0 hidden h-px origin-left bg-gold lg:block" />

      {steps.map((s, i) => (
        <motion.li
          key={s.year}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
          className="relative pb-10 pl-9 last:pb-0 lg:pt-10 lg:pr-6 lg:pb-0 lg:pl-0"
        >
          <motion.span
            aria-hidden="true"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.2 + i * 0.12 }}
            className="absolute top-1.5 left-0 size-[11px] rounded-full bg-gold lg:top-0"
          />
          <p className="font-serif text-4xl font-semibold text-white lg:text-[2.6rem]">{s.year}</p>
          <p className="mt-3 text-sm leading-snug text-white/70">{s.tag}</p>
        </motion.li>
      ))}
    </ol>
  )
}
