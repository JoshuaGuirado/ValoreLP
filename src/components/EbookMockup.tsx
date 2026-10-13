import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Logo, LogoMark } from './Logo'

/** Capa 3D do guia, inclina conforme o cursor. */
export function EbookMockup({ className = '' }: { className?: string }) {
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-28, 8]), { stiffness: 120, damping: 16 })
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 16 })
  const shineX = useTransform(mx, [-0.5, 0.5], ['-30%', '60%'])

  return (
    <div
      className={`relative [perspective:1600px] ${className}`}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        mx.set((e.clientX - r.left) / r.width - 0.5)
        my.set((e.clientY - r.top) / r.height - 0.5)
      }}
      onPointerLeave={() => {
        mx.set(0)
        my.set(0)
      }}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative mx-auto w-[min(78vw,20rem)]"
      >
        <motion.div
          style={{ rotateY: rotY, rotateX: rotX, transformStyle: 'preserve-3d' }}
          initial={{ rotateY: -18 }}
          className="relative aspect-[3/4.1]"
        >
          {/* páginas (espessura) */}
          <div
            className="absolute inset-y-[1.2%] right-0 w-6 origin-right rounded-r-sm bg-[repeating-linear-gradient(to_bottom,#e9e4d8_0px,#e9e4d8_2px,#cfc8b8_3px)]"
            style={{ transform: 'rotateY(90deg) translateX(12px)' }}
          />
          {/* contracapa */}
          <div className="absolute inset-0 rounded-r-md rounded-l-sm bg-ink" style={{ transform: 'translateZ(-24px)' }} />

          {/* capa */}
          <div className="absolute inset-0 overflow-hidden rounded-r-md rounded-l-sm bg-[linear-gradient(160deg,#2c2b29_0%,#1a1917_55%,#0f0e0d_100%)] shadow-[30px_40px_80px_-20px_rgb(0_0_0/0.8)] ring-1 ring-white/10">
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/60 via-white/10 to-transparent" />
            <LogoMark className="absolute -right-10 -bottom-6 w-[85%] opacity-[0.13]" />
            <div className="grid-lines absolute inset-0 opacity-30" />

            <div className="relative flex h-full flex-col p-[9%]">
              <Logo className="w-[52%]" subtitleColor="#a5a6a2" />
              <div className="mt-auto">
                <p className="text-[0.55rem] font-semibold tracking-[0.32em] text-gold uppercase">Guia executivo</p>
                <p className="mt-3 text-[1.55rem] leading-[1.02] font-extrabold tracking-tight text-white uppercase sm:text-[1.75rem]">
                  Reforma
                  <br />
                  <span className="text-gold-gradient">Tributária</span>
                </p>
                <div className="my-4 h-px w-12 bg-gold" />
                <p className="font-serif text-[0.8rem] leading-snug text-white/75 italic">
                  os principais insights de planejamento tributário para empresas
                </p>
              </div>
            </div>
            {/* reflexo */}
            <motion.div
              className="pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent"
              style={{ left: shineX, skewX: -12 }}
            />
          </div>
        </motion.div>
      </motion.div>
      {/* sombra no chão */}
      <motion.div
        aria-hidden="true"
        className="mx-auto mt-8 h-6 w-[60%] rounded-[100%] bg-black/70 blur-xl"
        animate={{ scaleX: [1, 0.85, 1], opacity: [0.8, 0.55, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  )
}
