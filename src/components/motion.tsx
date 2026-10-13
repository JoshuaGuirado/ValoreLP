import { motion, useScroll, useTransform, type HTMLMotionProps } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

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
