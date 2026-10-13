import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ease } from './motion'

const partners = [
  {
    name: 'Virgínia D. Flora',
    img: 'virginia',
    alt: 'Virgínia D. Flora, sócia fundadora da Valore, sentada à mesa com o notebook da Valore',
    bio: ['Advogada especialista em Direito Tributário pelo IBET', 'Coordenadora do Grupo de Estudos sobre a Reforma Tributária da OAB/Maringá'],
  },
  {
    name: 'Katrin Arrais',
    img: 'katrin',
    alt: 'Katrin Arrais, sócia fundadora da Valore, sentada em uma banqueta',
    bio: ['Administradora e Advogada', 'Especialista em Direito Público e Tributário'],
  },
]

function Card({ p, i }: { p: (typeof partners)[number]; i: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [i ? 60 : 0, i ? -60 : 0])

  return (
    <motion.article ref={ref} style={{ y }} className="group">
      <motion.div
        initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: i * 0.15 }}
        className="relative aspect-[2/3] overflow-hidden bg-paper-2"
      >
        <motion.img
          src={`/img/${p.img}-1080.webp`}
          srcSet={`/img/${p.img}-720.webp 720w, /img/${p.img}-1080.webp 1080w`}
          sizes="(min-width: 768px) 45vw, 92vw"
          alt={p.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
        {/* nome sobre a foto */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite-2/85 via-graphite-2/30 to-transparent p-7 pt-24 sm:p-9 sm:pt-32">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease, delay: 0.6 + i * 0.15 }}
            className="heading text-3xl text-white sm:text-4xl"
          >
            {p.name}
          </motion.h3>
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

/** Fotos inteiras das sócias (proporção original 2:3). */
export function Partners() {
  return (
    <div className="grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-16">
      {partners.map((p, i) => (
        <Card key={p.name} p={p} i={i} />
      ))}
    </div>
  )
}
