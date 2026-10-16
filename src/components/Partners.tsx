import { motion } from 'framer-motion'
import { ease } from './motion'

/** Fotos e textos conforme o site oficial da Valore (valoretribut.com). */
const partners = [
  {
    name: 'Virgínia Dalla Flora',
    src: '/img/virginia-720.webp',
    alt: 'Virgínia Dalla Flora, sócia fundadora da Valore, de blazer marrom e braços cruzados',
    role: 'Jurídico',
    bio: [
      'Especialista em Direito Tributário pelo IBET, com mais de 17 anos de experiência',
      'Responsável pelo jurídico consultivo e contencioso administrativo e judicial',
    ],
  },
  {
    name: 'Katrin Arrais',
    src: '/img/katrin-700.webp',
    alt: 'Katrin Arrais, sócia fundadora da Valore, de blazer bege',
    role: 'Comercial e financeiro',
    bio: ['Advogada e administradora de empresas, pós-graduada em Direito Tributário e Direito Público', 'Responsável pela área comercial e financeira'],
  },
]

const card = {
  hide: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.35 } },
}
const line = {
  hide: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.7, ease } },
}

/**
 * Cartões das sócias em formato compacto: foto emoldurada com fio dourado ao lado
 * do texto, para ler e ver ao mesmo tempo. A moldura se desenha, a foto abre como
 * cortina e os textos entram em sequência.
 */
export function Partners() {
  return (
    <div className="grid gap-12 lg:grid-cols-2 lg:gap-10">
      {partners.map((p, i) => (
        <motion.article
          key={p.name}
          initial="hide"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          variants={card}
          className="group grid grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] items-center gap-6 sm:gap-8"
        >
          {/* foto com moldura fina */}
          <div className="relative p-2">
            <motion.span
              aria-hidden="true"
              variants={{ hide: { opacity: 0, scale: 0.92 }, show: { opacity: 1, scale: 1, transition: { duration: 0.9, ease, delay: i * 0.1 } } }}
              className="absolute inset-0 border border-gold/60 transition-colors duration-500 group-hover:border-gold"
            />
            <motion.div
              variants={{
                hide: { clipPath: 'inset(0% 0% 100% 0%)' },
                show: { clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 1.2, ease: [0.65, 0, 0.35, 1], delay: 0.15 + i * 0.1 } },
              }}
              className="relative aspect-[7/10] overflow-hidden bg-[#141414]"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.05]"
              />
            </motion.div>
          </div>

          {/* texto */}
          <div>
            <motion.p variants={line} className="text-[0.66rem] font-semibold tracking-[0.2em] text-gold-deep uppercase">
              Sócia fundadora · {p.role}
            </motion.p>
            <motion.h3 variants={line} className="heading mt-3 text-2xl text-graphite sm:text-[1.9rem]">
              {p.name}
            </motion.h3>
            <motion.div
              variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 0.9, ease } } }}
              className="mt-4 h-px w-14 origin-left bg-gold"
            />
            <ul className="mt-4 space-y-2.5">
              {p.bio.map((b) => (
                <motion.li key={b} variants={line} className="text-[0.92rem] leading-relaxed text-graphite/70">
                  {b}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.article>
      ))}
    </div>
  )
}
