import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import type { ReactNode } from 'react'

/** Cartão com borda e brilho dourado que seguem o cursor. */
export function SpotlightCard({ children, className = '' }: { children: ReactNode; className?: string }) {
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const bg = useMotionTemplate`radial-gradient(360px circle at ${x}px ${y}px, rgb(197 161 85 / 0.14), transparent 65%)`
  const border = useMotionTemplate`radial-gradient(260px circle at ${x}px ${y}px, rgb(228 204 142 / 0.7), transparent 70%)`

  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set(e.clientX - r.left)
        y.set(e.clientY - r.top)
      }}
      onPointerLeave={() => {
        x.set(-400)
        y.set(-400)
      }}
      className={`group relative rounded-3xl bg-white/[0.06] p-px ${className}`}
    >
      <motion.div aria-hidden="true" className="absolute inset-0 rounded-3xl" style={{ background: border }} />
      <div className="relative h-full overflow-hidden rounded-[calc(1.5rem-1px)] bg-ink-2/95">
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: bg }} />
        <div className="relative h-full">{children}</div>
      </div>
    </div>
  )
}
