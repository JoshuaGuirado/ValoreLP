import { motion, useInView, useMotionValue, useSpring, type HTMLMotionProps } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

export const ease = [0.22, 1, 0.36, 1] as const

/** Entrada suave ao rolar a página. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      initial={{ opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Título revelado palavra por palavra. Palavras entre *asteriscos* ficam douradas. */
export function SplitHeading({
  text,
  as: Tag = 'h2',
  className,
  delay = 0,
  immediate = false,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  delay?: number
  immediate?: boolean
}) {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const show = immediate || inView
  const words = text.split(' ')
  let gold = false

  return (
    <Tag ref={ref} className={className} aria-label={text.replaceAll('*', '')}>
      {words.map((raw, i) => {
        const starts = raw.startsWith('*')
        const ends = raw.endsWith('*') || raw.endsWith('*:') || raw.endsWith('*,')
        if (starts) gold = true
        const isGold = gold
        if (ends) gold = false
        const word = raw.replaceAll('*', '')
        return (
          <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className={`inline-block ${isGold ? 'text-gold-gradient' : ''}`}
              initial={{ y: '110%', opacity: 0 }}
              animate={show ? { y: '0%', opacity: 1 } : undefined}
              transition={{ duration: 0.85, ease, delay: delay + i * 0.045 }}
            >
              {word}
              {i < words.length - 1 ? ' ' : ''}
            </motion.span>
          </span>
        )
      })}
    </Tag>
  )
}

/** Elemento que acompanha levemente o cursor (efeito magnético). */
export function Magnetic({ children, strength = 0.25, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return
        const r = ref.current.getBoundingClientRect()
        x.set((e.clientX - (r.left + r.width / 2)) * strength)
        y.set((e.clientY - (r.top + r.height / 2)) * strength)
      }}
      onPointerLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      {children}
    </motion.div>
  )
}
