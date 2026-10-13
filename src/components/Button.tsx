import { ArrowRight } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

const base =
  'group inline-flex items-center justify-center gap-3 rounded-[3px] px-5 py-4 text-[0.7rem] font-semibold uppercase tracking-[0.1em] sm:px-7 sm:text-[0.74rem] sm:tracking-[0.16em] transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-70'

const variants = {
  gold: 'bg-gold text-graphite-2 hover:bg-graphite hover:text-white',
  dark: 'bg-graphite text-white hover:bg-gold hover:text-graphite-2',
  outline: 'border border-graphite text-graphite hover:bg-graphite hover:text-white',
  'outline-light': 'border border-white/50 text-white hover:bg-white hover:text-graphite',
}

type Variant = keyof typeof variants

function Inner({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      <span>{children}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-1">
        {icon ?? <ArrowRight className="size-4" strokeWidth={1.75} />}
      </span>
    </>
  )
}

export function Button({
  variant = 'gold',
  icon,
  className = '',
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: ReactNode }) {
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  )
}

export function LinkButton({
  variant = 'gold',
  icon,
  className = '',
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; icon?: ReactNode }) {
  return (
    <a className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </a>
  )
}
