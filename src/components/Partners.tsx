import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { ease } from './motion'

const partners = [
  {
    name: 'Virgínia D. Flora',
    role: 'Sócia fundadora',
    img: 'virginia',
    alt: 'Virgínia D. Flora, sócia fundadora da Valore',
    bio: [
      'Advogada especialista em Direito Tributário pelo IBET.',
      'Membro da Comissão de Direito Tributário da OAB/Maringá e do Instituto de Direito Tributário de Maringá.',
      'Coordenadora do Grupo de Estudos sobre a Reforma Tributária da OAB/Maringá.',
      'Responsável pelo jurídico consultivo e contencioso administrativo e judicial.',
    ],
  },
  {
    name: 'Katrin Arrais',
    role: 'Sócia fundadora',
    img: 'katrin',
    alt: 'Katrin Arrais, sócia fundadora da Valore',
    bio: ['Administradora e Advogada.', 'Especialista em Direito Público e Tributário.', 'Responsável pela área comercial e financeira.'],
  },
]

function PartnerCard({ p, index }: { p: (typeof partners)[number]; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease, delay: index * 0.15 }}
      className={`group ${index === 1 ? 'md:mt-24' : ''}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-[#d9d6d1]">
        <motion.img
          src={`/img/${p.img}-720.webp`}
          srcSet={`/img/${p.img}-720.webp 720w, /img/${p.img}-1080.webp 1080w`}
          sizes="(min-width: 768px) 40vw, 90vw"
          alt={p.alt}
          loading="lazy"
          style={{ y }}
          className="absolute inset-x-0 top-[-6%] h-[112%] w-full object-cover object-top transition duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
        <div className="absolute inset-0 rounded-[2rem] ring-1 ring-white/10 ring-inset" />
        <div className="absolute inset-x-0 bottom-0 p-7 sm:p-9">
          <p className="eyebrow">{p.role}</p>
          <h3 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">{p.name}</h3>
        </div>
      </div>
      <ul className="mt-7 space-y-3 px-2">
        {p.bio.map((b) => (
          <li key={b} className="flex gap-3 text-[0.95rem] leading-relaxed text-white/65">
            <span className="mt-[0.6rem] h-px w-4 shrink-0 bg-gold" />
            {b}
          </li>
        ))}
      </ul>
    </motion.article>
  )
}

export function Partners() {
  return (
    <div className="grid gap-16 md:grid-cols-2 md:gap-12 lg:gap-20">
      {partners.map((p, i) => (
        <PartnerCard key={p.name} p={p} index={i} />
      ))}
    </div>
  )
}
