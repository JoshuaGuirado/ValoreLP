import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { ease } from './motion'

/** Fotos e textos conforme o site oficial da Valore (valoretribut.com). */
const partners = [
  {
    name: 'Virgínia Dalla Flora',
    src: '/img/virginia-1080.webp',
    srcSet: '/img/virginia-720.webp 720w, /img/virginia-1080.webp 1080w',
    alt: 'Virgínia Dalla Flora, sócia fundadora da Valore, de blazer marrom e braços cruzados',
    bio: [
      'Especialista em Direito Tributário pelo IBET, com mais de 17 anos de experiência',
      'Responsável pelo jurídico consultivo e contencioso administrativo e judicial',
    ],
  },
  {
    name: 'Katrin Arrais',
    src: '/img/katrin-700.webp',
    srcSet: undefined,
    alt: 'Katrin Arrais, sócia fundadora da Valore, de blazer bege',
    bio: ['Advogada e administradora de empresas, pós-graduada em Direito Tributário e Direito Público', 'Responsável pela área comercial e financeira'],
  },
]

function Card({ p, i }: { p: (typeof partners)[number]; i: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const on = () => setDesktop(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const shift = desktop && i ? 60 : 0
  const y = useTransform(scrollYProgress, [0, 1], [shift, -shift])

  return (
    <motion.article ref={ref} style={{ y }} className="group">
      <motion.div
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: i * 0.15 }}
        className="relative aspect-[7/10] overflow-hidden bg-[#141414]"
      >
        <motion.img
          src={p.src}
          srcSet={p.srcSet}
          sizes="(min-width: 768px) 45vw, 92vw"
          alt={p.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {/* nome sobre a foto */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite-2/85 via-graphite-2/30 to-transparent p-7 pt-24 sm:p-9 sm:pt-32">
          <h3 className="heading text-3xl text-white sm:text-4xl">{p.name}</h3>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: 0.8 + i * 0.15 }}
            className="mt-4 h-px w-16 origin-left bg-gold"
          />
        </div>
      </motion.div>
      <ul className="mt-6 space-y-1.5">
        {p.bio.map((b) => (
          <li key={b} className="text-[0.95rem] text-graphite/75">
            {b}
          </li>
        ))}
      </ul>
    </motion.article>
  )
}

/** Fotos inteiras das sócias (proporção original 7:10). */
export function Partners() {
  return (
    <div className="grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-16">
      {partners.map((p, i) => (
        <Card key={p.name} p={p} i={i} />
      ))}
    </div>
  )
}
