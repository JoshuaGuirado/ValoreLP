import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef, type PointerEvent } from 'react'
import { Logo } from './Logo'

const spring = { stiffness: 160, damping: 18, mass: 0.6 }

/**
 * Capa do guia em papel, com sombra real e leve deslocamento ao rolar.
 * No desktop, inclina em 3D seguindo o mouse, com um reflexo de luz sobre a capa.
 */
export function GuideCover({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [30, -30])

  // Posição do mouse relativa à capa, de -0.5 a 0.5.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), spring)
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), spring)
  const glareX = useTransform(mx, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(my, [-0.5, 0.5], [0, 100])
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.22), transparent 55%)`
  const glareOpacity = useSpring(0, spring)

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
    glareOpacity.set(1)
  }
  function onLeave() {
    mx.set(0)
    my.set(0)
    glareOpacity.set(0)
  }

  return (
    <div ref={ref} className={`relative [perspective:1100px] ${className}`}>
      <motion.div
        style={{ y, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative mx-auto w-full max-w-[22rem]"
      >
        {/* folhas por baixo */}
        <div aria-hidden="true" className="absolute inset-0 translate-x-2.5 translate-y-2.5 bg-[#e9e5dc] shadow-sm" />
        <div aria-hidden="true" className="absolute inset-0 translate-x-1.5 translate-y-1.5 bg-[#f1eee8]" />

        <div className="relative aspect-[210/297] overflow-hidden bg-graphite shadow-[0_40px_60px_-30px_rgb(44_43_41/0.55)]">
          <img src="/img/sala-reuniao.webp" alt="" className="absolute inset-0 h-full w-full object-cover opacity-45" />
          <div className="absolute inset-0 bg-gradient-to-b from-graphite/30 via-graphite/60 to-graphite" />
          <div className="relative flex h-full flex-col p-[10%] text-white">
            <Logo className="w-[58%]" subtitleColor="#b4b5b1" />
            <div className="mt-auto">
              <div className="mb-5 h-px w-14 bg-gold" />
              <p className="font-serif text-[1.65rem] leading-[1.1] font-semibold">Reforma Tributária</p>
              <p className="mt-3 text-[0.78rem] leading-relaxed text-white/80">
                Os principais insights de planejamento tributário para empresas
              </p>
              <p className="mt-6 text-[0.58rem] font-semibold tracking-[0.24em] text-gold uppercase">Guia executivo</p>
            </div>
          </div>
          <motion.div aria-hidden="true" style={{ background: glare, opacity: glareOpacity }} className="pointer-events-none absolute inset-0" />
        </div>
      </motion.div>
    </div>
  )
}
