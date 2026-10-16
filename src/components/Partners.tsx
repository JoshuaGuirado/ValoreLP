import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, type PointerEvent } from 'react'
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

const spring = { stiffness: 150, damping: 18, mass: 0.6 }

/** Foto grande com moldura deslocada, parallax interno e inclinação leve ao mouse. */
function Portrait({ p, i }: { p: (typeof partners)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])
  const frameY = useTransform(scrollYProgress, [0, 1], [40, -40])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), spring)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), spring)
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }
  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  const flip = i % 2 === 1
  return (
    <div ref={ref} className="relative [perspective:1200px]" onPointerMove={onMove} onPointerLeave={reset}>
      {/* moldura dourada deslocada, anda em velocidade diferente da foto */}
      <motion.div
        aria-hidden="true"
        style={{ y: frameY }}
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease }}
        className={`absolute inset-0 border border-gold ${flip ? '-translate-x-5 translate-y-5 md:-translate-x-7' : 'translate-x-5 translate-y-5 md:translate-x-7'}`}
      />
      <motion.div
        style={{ rotateX, rotateY }}
        initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
        className="relative aspect-[7/10] overflow-hidden bg-[#141414] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.55)]"
      >
        <motion.img
          src={p.src}
          srcSet={p.srcSet}
          sizes="(min-width: 1024px) 34vw, 90vw"
          alt={p.alt}
          loading="lazy"
          style={{ y: imgY, scale: 1.14 }}
          className="h-full w-full object-cover"
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
      {partners.map((p, i) => {
        const flip = i % 2 === 1
        return (
          <article key={p.name} className="grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
            <div className={`mx-auto w-full max-w-md md:max-w-none ${flip ? 'md:order-2' : ''}`}>
              <Portrait p={p} i={i} />
            </div>
            <motion.div
              initial="hide"
              whileInView="show"
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              variants={text}
              className={flip ? 'md:order-1 md:text-right' : ''}
            >
              <motion.p variants={item} className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold-deep uppercase">
                Sócia fundadora · {p.role}
              </motion.p>
              <motion.h3 variants={item} className="heading mt-4 text-4xl text-graphite sm:text-5xl">
                {p.name}
              </motion.h3>
              <motion.div
                variants={{ hide: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1, ease } } }}
                className={`mt-6 h-px w-20 bg-gold ${flip ? 'origin-right md:ml-auto' : 'origin-left'}`}
              />
              <motion.div variants={item} className={`mt-8 flex items-baseline gap-4 ${flip ? 'md:justify-end' : ''}`}>
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
