import { motion } from 'framer-motion'
import { ease } from './motion'

/** Fotos e textos conforme o site oficial da Valore (valoretribut.com). */
const partners = [
  {
    name: 'Virgínia Dalla Flora',
    src: '/img/virginia-1080.webp',
    srcSet: '/img/virginia-720.webp 720w, /img/virginia-1080.webp 1080w',
    alt: 'Virgínia Dalla Flora, sócia fundadora da Valore, de blazer marrom e braços cruzados',
    role: 'Jurídico',
    stat: { value: '17+', label: 'anos de advocacia e consultoria tributária' },
    bio: [
      'Advogada, pós-graduada pela Escola da Magistratura do Paraná e especialista em Direito Tributário pelo IBET',
      'Responsável pelo jurídico consultivo e contencioso administrativo e judicial',
    ],
  },
  {
    name: 'Katrin Arrais',
    src: '/img/katrin-700.webp',
    srcSet: undefined,
    alt: 'Katrin Arrais, sócia fundadora da Valore, de blazer bege',
    role: 'Comercial e financeiro',
    stat: { value: '6', label: 'anos de atuação no setor financeiro' },
    bio: ['Advogada e administradora de empresas, pós-graduada em Direito Tributário e Direito Público', 'Responsável pela área comercial e financeira'],
  },
]

/** Foto inteira (proporção original 7:10) com moldura dourada fixa e cantos dourados. */
function Portrait({ p }: { p: (typeof partners)[number] }) {
  return (
    <div className="relative">
      {/* moldura dourada deslocada */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0, x: 0, y: 0 }}
        whileInView={{ opacity: 1, x: 16, y: 16 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease, delay: 0.5 }}
        className="absolute inset-0 border border-gold"
      />
      <motion.div
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        className="group relative aspect-[7/10] overflow-hidden bg-[#141414] shadow-[0_30px_60px_-30px_rgb(0_0_0/0.5)]"
      >
        <img
          src={p.src}
          srcSet={p.srcSet}
          sizes="(min-width: 768px) 24rem, 90vw"
          alt={p.alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.03]"
        />
        {/* cantos dourados */}
        <span aria-hidden="true" className="absolute top-4 left-4 size-6 border-t border-l border-gold/80" />
        <span aria-hidden="true" className="absolute right-4 bottom-4 size-6 border-r border-b border-gold/80" />
      </motion.div>
    </div>
  )
}

const text = {
  hide: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
}
const item = {
  hide: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
}

/**
 * Sócias em linhas alternadas: foto grande de um lado e texto do outro, para ver
 * e ler ao mesmo tempo.
 */
export function Partners() {
  return (
    <div className="space-y-24 md:space-y-32">
      {partners.map((p) => {
        return (
          <article key={p.name} className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-20">
            <div className="mx-auto w-full max-w-[19rem] sm:max-w-sm md:mx-0 md:ml-auto">
              <Portrait p={p} />
            </div>
            <motion.div
              initial="hide"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              variants={text}
            >
              <motion.p variants={item} className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold-deep uppercase">
                Sócia fundadora · {p.role}
              </motion.p>
              <motion.h3 variants={item} className="heading mt-4 text-4xl text-graphite sm:text-5xl">
                {p.name}
              </motion.h3>
              <motion.div
                variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, ease } } }}
                className="mt-6 h-px w-20 origin-left bg-gold"
              />
              <motion.div variants={item} className="mt-8 flex items-baseline gap-4">
                <span className="font-serif text-5xl font-semibold text-gold-deep">{p.stat.value}</span>
                <span className="max-w-[12rem] text-sm leading-snug text-graphite/70">{p.stat.label}</span>
              </motion.div>
              <ul className="mt-8 space-y-3">
                {p.bio.map((b) => (
                  <motion.li key={b} variants={item} className="leading-relaxed text-graphite/75 sm:text-lg">
                    {b}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </article>
        )
      })}
    </div>
  )
}
