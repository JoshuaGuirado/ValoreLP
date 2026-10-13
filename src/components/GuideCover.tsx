import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Logo } from './Logo'

/** Capa do guia em papel, com sombra real e leve deslocamento ao rolar. */
export function GuideCover({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [30, -30])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <motion.div style={{ y }} className="relative mx-auto w-full max-w-[22rem]">
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
        </div>
      </motion.div>
    </div>
  )
}
