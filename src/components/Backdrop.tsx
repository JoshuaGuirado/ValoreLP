import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { useEffect } from 'react'
import { LogoMark } from './Logo'

/**
 * Fundo do hero: grade dourada que se revela ao redor do cursor, halos de luz
 * e o símbolo "V" em linha fina desenhando-se ao carregar.
 */
export function HeroBackdrop() {
  const mx = useMotionValue(-1000)
  const my = useMotionValue(-1000)
  const x = useSpring(mx, { stiffness: 80, damping: 20 })
  const y = useSpring(my, { stiffness: 80, damping: 20 })
  const mask = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, black 0%, transparent 70%)`
  const glow = useMotionTemplate`radial-gradient(600px circle at ${x}px ${y}px, rgb(197 161 85 / 0.10), transparent 60%)`

  useEffect(() => {
    const move = (e: PointerEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY + window.scrollY)
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [mx, my])

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* grade base, bem discreta */}
      <div className="grid-lines absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_75%)]" />
      {/* grade iluminada pelo cursor */}
      <motion.div className="grid-lines absolute inset-0 opacity-100" style={{ maskImage: mask, WebkitMaskImage: mask }} />
      <motion.div className="absolute inset-0" style={{ background: glow }} />

      {/* halos */}
      <motion.div
        className="absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full bg-gold/12 blur-[140px]"
        animate={{ opacity: [0.55, 0.9, 0.55], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <div className="absolute -bottom-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-gold-deep/15 blur-[120px]" />

      {/* símbolo V em traço */}
      <motion.div
        className="absolute top-24 -right-24 hidden w-[44rem] opacity-[0.16] lg:block"
        initial={{ opacity: 0, rotate: -4 }}
        animate={{ opacity: 0.16, rotate: 0 }}
        transition={{ duration: 2.4, ease: 'easeOut' }}
      >
        <LogoMark stroke className="h-auto w-full" />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink" />
    </div>
  )
}
