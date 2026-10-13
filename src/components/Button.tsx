import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Magnetic } from './motion'

const base =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full px-6 py-4 text-[0.76rem] font-bold uppercase tracking-[0.1em] sm:px-7 sm:text-[0.8rem] sm:tracking-[0.14em] transition-[transform,box-shadow,background-color,color] duration-300 disabled:cursor-not-allowed disabled:opacity-70'

const variants = {
  gold:
    'bg-[linear-gradient(110deg,#8e7743,#c5a155_35%,#e4cc8e_55%,#c5a155_75%,#8e7743)] bg-[length:200%_100%] bg-left text-ink shadow-[0_10px_40px_-10px_rgb(197_161_85/0.7)] hover:bg-right hover:shadow-[0_14px_50px_-8px_rgb(197_161_85/0.85)]',
  outline:
    'border border-gold/50 text-gold-light hover:border-gold hover:bg-gold/10 hover:text-white',
  dark: 'bg-ink text-gold-light hover:bg-graphite-2',
}

type Variant = keyof typeof variants

function Inner({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-shine bg-gradient-to-r from-transparent via-white/45 to-transparent"
      />
      <span className="relative">{children}</span>
      {icon && <span className="relative transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
    </>
  )
}

export function Button({
  variant = 'gold',
  icon,
  className = '',
  magnetic = true,
  block = false,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: ReactNode; magnetic?: boolean; block?: boolean }) {
  const btn = (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  )
  return magnetic ? <Magnetic className={`inline-block w-full [&>button]:w-full ${block ? '' : 'sm:w-auto'}`}>{btn}</Magnetic> : btn
}

export function LinkButton({
  variant = 'gold',
  icon,
  className = '',
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; icon?: ReactNode }) {
  return (
    <Magnetic className="inline-block w-full sm:w-auto [&>a]:w-full">
      <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
        <Inner icon={icon}>{children}</Inner>
      </a>
    </Magnetic>
  )
}
