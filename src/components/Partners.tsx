import { motion } from 'framer-motion'
import { ease, RevealImage } from './motion'

const partners = [
  {
    name: 'Virgínia D. Flora',
    img: 'virginia',
    alt: 'Virgínia D. Flora, sócia fundadora da Valore, sentada à mesa com o notebook da Valore',
    bio: [
      'Advogada especialista em Direito Tributário pelo IBET.',
      'Membro da Comissão de Direito Tributário da OAB/Maringá e do Instituto de Direito Tributário de Maringá.',
      'Coordenadora do Grupo de Estudos sobre a Reforma Tributária da OAB/Maringá.',
      'Responsável pelo jurídico consultivo e contencioso administrativo e judicial.',
    ],
  },
  {
    name: 'Katrin Arrais',
    img: 'katrin',
    alt: 'Katrin Arrais, sócia fundadora da Valore, sentada em uma banqueta',
    bio: ['Administradora e Advogada.', 'Especialista em Direito Público e Tributário.', 'Responsável pela área comercial e financeira.'],
  },
]

/** Fotos inteiras das sócias (proporção original 2:3, sem cortes). */
export function Partners() {
  return (
    <div className="grid gap-16 md:grid-cols-2 md:gap-10 lg:gap-16">
      {partners.map((p, i) => (
        <article key={p.name} className={i === 1 ? 'md:mt-28' : ''}>
          <RevealImage
            src={`/img/${p.img}-1080.webp`}
            srcSet={`/img/${p.img}-720.webp 720w, /img/${p.img}-1080.webp 1080w`}
            sizes="(min-width: 768px) 45vw, 92vw"
            alt={p.alt}
            className="aspect-[2/3] bg-paper-2"
            imgClassName="object-contain"
            delay={i * 0.15}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.3 + i * 0.15 }}
            className="mt-8"
          >
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold-deep uppercase">Sócia fundadora</p>
            <h3 className="heading mt-2 text-3xl text-graphite sm:text-[2.1rem]">{p.name}</h3>
            <div className="mt-5 h-px w-12 bg-gold" />
            <ul className="mt-5 space-y-2.5">
              {p.bio.map((b) => (
                <li key={b} className="text-[0.95rem] leading-relaxed text-graphite/70">
                  {b}
                </li>
              ))}
            </ul>
          </motion.div>
        </article>
      ))}
    </div>
  )
}
