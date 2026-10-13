import { animate, motion, useInView, useMotionValue, useScroll, useSpring, useTransform, type HTMLMotionProps } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'

export const ease = [0.25, 0.1, 0.25, 1] as const
const viewport = { once: true, margin: '0px 0px -10% 0px' }

/** Entrada discreta ao rolar: leve subida e opacidade. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.8, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Fio horizontal que se desenha da esquerda para a direita. */
export function Rule({ className = '', delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={viewport}
      transition={{ duration: 1.1, ease, delay }}
      className={`h-px origin-left ${className}`}
    />
  )
}

/**
 * Foto revelada por uma "cortina" que sobe, com leve aproximação.
 * Mantém a proporção original da imagem (sem cortes) quando `ratio` não é informado.
 */
export function RevealImage({
  src,
  srcSet,
  sizes,
  alt,
  className = '',
  imgClassName = '',
  parallax = 0,
  delay = 0,
  eager = false,
}: {
  src: string
  srcSet?: string
  sizes?: string
  alt: string
  className?: string
  imgClassName?: string
  parallax?: number
  delay?: number
  eager?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`])

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={viewport}
      transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1], delay }}
    >
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        style={parallax ? { y, scale: 1 + parallax / 50 } : undefined}
        initial={{ scale: parallax ? 1 + parallax / 50 + 0.08 : 1.08 }}
        whileInView={{ scale: parallax ? 1 + parallax / 50 : 1 }}
        viewport={viewport}
        transition={{ duration: 1.6, ease, delay }}
        className={`block h-full w-full ${imgClassName}`}
      />
    </motion.div>
  )
}

/**
 * Texto revelado palavra por palavra, cada uma subindo de dentro de uma máscara
 * (efeito editorial de revista). Trechos entre *asteriscos* ficam em dourado.
 */
export function MaskText({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  immediate = false,
  goldClass = 'text-gold',
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p'
  className?: string
  delay?: number
  immediate?: boolean
  goldClass?: string
}) {
  const parts = text.split(/(\*[^*]+\*)/).filter(Boolean)
  const words: { w: string; gold: boolean }[] = []
  parts.forEach((p) => {
    const gold = p.startsWith('*')
    p.replaceAll('*', '')
      .split(' ')
      .filter(Boolean)
      .forEach((w) => words.push({ w, gold }))
  })
  const MotionTag = motion[Tag]
  const anim = immediate ? { animate: 'show' } : { whileInView: 'show', viewport }

  return (
    <MotionTag className={className} aria-label={text.replaceAll('*', '')} initial="hide" {...anim}>
      {words.map(({ w, gold }, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
          <motion.span
            className={`inline-block ${gold ? goldClass : ''}`}
            variants={{ hide: { y: '105%' }, show: { y: '0%' } }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + i * 0.035 }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}

/** Fio dourado no topo da tela que acompanha o progresso de leitura da página. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return <motion.div aria-hidden="true" style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gold" />
}

/** Número que conta de 0 até o valor quando aparece na tela. */
export function CountUp({ to, suffix = '', className = '' }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const value = useMotionValue(0)
  const rounded = useTransform(value, (v) => `${Math.round(v)}${suffix}`)
  useEffect(() => {
    if (!inView) return
    const controls = animate(value, to, { duration: 1.8, ease: [0.22, 1, 0.36, 1] })
    return () => controls.stop()
  }, [inView, to, value])
  return (
    <motion.span ref={ref} className={className}>
      {rounded}
    </motion.span>
  )
}

/**
 * Marcador de capítulo no topo de cada bloco: número em serifa, rótulo e um fio
 * dourado que se desenha até o símbolo da Valore, deixando clara a troca de seção.
 */
export function Chapter({ n, label, dark = false, className = '' }: { n: string; label: string; dark?: boolean; className?: string }) {
  return (
    <motion.div
      initial="hide"
      whileInView="show"
      viewport={viewport}
      className={`flex items-center gap-4 ${className}`}
    >
      <motion.span
        variants={{ hide: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: 0.7, ease }}
        className={`font-serif text-2xl font-semibold tabular-nums ${dark ? 'text-gold' : 'text-gold-deep'}`}
      >
        {n}
      </motion.span>
      <motion.span
        variants={{ hide: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } }}
        transition={{ duration: 0.7, ease, delay: 0.1 }}
        className={`min-w-0 text-[0.7rem] font-semibold tracking-[0.18em] uppercase sm:tracking-[0.22em] sm:whitespace-nowrap ${dark ? 'text-white/70' : 'text-graphite/70'}`}
      >
        {label}
      </motion.span>
      <motion.span
        aria-hidden="true"
        variants={{ hide: { scaleX: 0 }, show: { scaleX: 1 } }}
        transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1], delay: 0.2 }}
        className={`h-px min-w-6 flex-1 origin-left ${dark ? 'bg-white/25' : 'bg-graphite/20'}`}
      />
      <motion.img
        src="/img/v-dourado.webp"
        alt=""
        aria-hidden="true"
        variants={{ hide: { opacity: 0, rotate: -45, scale: 0.4 }, show: { opacity: 1, rotate: 0, scale: 1 } }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 1.1 }}
        className="h-5 w-auto shrink-0"
      />
    </motion.div>
  )
}

/**
 * Divisor entre dois blocos do mesmo tom: dois fios dourados que nascem do centro
 * e o símbolo da Valore girando até se assentar.
 */
export function Divider({ className = '' }: { className?: string }) {
  return (
    <motion.div initial="hide" whileInView="show" viewport={viewport} aria-hidden="true" className={`container-lp flex items-center gap-6 ${className}`}>
      <motion.span variants={{ hide: { scaleX: 0 }, show: { scaleX: 1 } }} transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }} className="h-px flex-1 origin-right bg-gold/60" />
      <motion.img
        src="/img/v-dourado.webp"
        alt=""
        variants={{ hide: { opacity: 0, rotate: 180, scale: 0.3 }, show: { opacity: 1, rotate: 0, scale: 1 } }}
        transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.3 }}
        className="h-8 w-auto"
      />
      <motion.span variants={{ hide: { scaleX: 0 }, show: { scaleX: 1 } }} transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }} className="h-px flex-1 origin-left bg-gold/60" />
    </motion.div>
  )
}
