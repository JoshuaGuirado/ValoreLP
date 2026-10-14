import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useRef } from 'react'

/** Divide o texto em palavras; trechos entre *asteriscos* ficam em dourado. */
function splitWords(text: string) {
  const words: { w: string; gold: boolean }[] = []
  text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .forEach((part) => {
      const gold = part.startsWith('*')
      part
        .replaceAll('*', '')
        .split(' ')
        .filter(Boolean)
        .forEach((w) => words.push({ w, gold }))
    })
  return words
}

/** Palavra que acende conforme a rolagem avança. */
function Word({ progress, range, gold, children }: { progress: MotionValue<number>; range: [number, number]; gold: boolean; children: string }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return (
    <motion.span style={{ opacity }} className={gold ? 'text-gold' : ''}>
      {children}
    </motion.span>
  )
}

/**
 * Faixa do manifesto: foto de fundo com parallax suave (sem zoom, para não
 * evidenciar a resolução da imagem) e a frase acendendo palavra por palavra.
 */
export function Manifesto({ src, text, kicker = 'Nosso propósito' }: { src: string; text: string; kicker?: string }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const { scrollYProgress: read } = useScroll({ target: ref, offset: ['start 75%', 'center 45%'] })

  const words = splitWords(text)
  const step = 1 / words.length

  return (
    <section ref={ref} className="on-dark relative isolate overflow-hidden py-28 text-white md:py-44">
      <motion.img
        src={src}
        alt=""
        aria-hidden="true"
        style={{ y }}
        className="absolute inset-x-0 top-[-8%] -z-10 h-[116%] w-full object-cover blur-[2px]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-graphite-2/80" />
      <div className="container-lp text-center">
        <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="kicker justify-center">
          {kicker}
        </motion.p>
        <h2 aria-label={text.replaceAll('*', '')} className="heading mx-auto mt-8 max-w-4xl text-3xl sm:text-5xl">
          {words.map(({ w, gold }, i) => (
            <span key={i} aria-hidden="true">
              <Word progress={read} range={[i * step, Math.min(1, (i + 3) * step)]} gold={gold}>
                {w}
              </Word>
              {i < words.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}
