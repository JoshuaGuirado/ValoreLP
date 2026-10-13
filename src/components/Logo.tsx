import { useId } from 'react'
import paths from '../lib/logo-paths.json'

type Props = {
  className?: string
  /** Cor do "Soluções Tributárias". Em fundo escuro use um cinza mais claro. */
  subtitleColor?: string
  title?: string
}

/** Logotipo oficial Valore, vetorizado a partir do arquivo da marca. */
export function Logo({ className, subtitleColor = '#9a9b97', title = 'Valore Soluções Tributárias' }: Props) {
  const id = useId()
  return (
    <svg viewBox="0 0 2532 1004" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#8a6a2e" />
          <stop offset=".45" stopColor="#b08d47" />
          <stop offset="1" stopColor="#c9a65a" />
        </linearGradient>
      </defs>
      <path fill={`url(#${id})`} fillRule="evenodd" d={paths.gold} />
      <path fill={subtitleColor} fillRule="evenodd" d={paths.grey} />
    </svg>
  )
}

/** Apenas o símbolo "V" com o traço ascendente (check). */
export function LogoMark({ className, stroke = false }: { className?: string; stroke?: boolean }) {
  const id = useId()
  return (
    <svg viewBox="0 0 960 985" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#8e7743" />
          <stop offset=".55" stopColor="#c5a155" />
          <stop offset="1" stopColor="#e4cc8e" />
        </linearGradient>
      </defs>
      <path
        d={paths.mark}
        fillRule="evenodd"
        fill={stroke ? 'none' : `url(#${id})`}
        stroke={stroke ? `url(#${id})` : undefined}
        strokeWidth={stroke ? 3 : undefined}
      />
    </svg>
  )
}
