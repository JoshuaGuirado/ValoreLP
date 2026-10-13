import { useMotionValueEvent, useScroll } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { Globe, MapPin, Phone } from 'lucide-react'
import { config } from '../config'
import { Logo } from './Logo'
import { InstagramIcon } from './icons'

/**
 * Cabeçalho. Sobre o hero fica transparente; ao rolar, ganha fundo grafite, como o rodapé.
 * `overDark=false` deixa o fundo grafite sempre visível (páginas sem hero escuro).
 */
export function Header({ cta, overDark = true }: { cta?: ReactNode; overDark?: boolean }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 40))
  const solid = scrolled || !overDark

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-500 ${
        solid ? 'bg-graphite-2/95 shadow-[0_1px_0_rgb(255_255_255/0.08)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="container-lp flex h-18 items-center justify-between gap-6 md:h-20">
        <a href="/" aria-label="Valore Soluções Tributárias — início" className="shrink-0">
          <Logo className="h-10 w-auto md:h-12" subtitleColor="#b4b5b1" />
        </a>
        <div className="flex items-center gap-8">
          <a
            href={config.empresa.telefoneLink}
            className="hidden items-center gap-2 text-sm text-white/75 transition-colors hover:text-white lg:flex"
          >
            <Phone className="size-4 text-gold" strokeWidth={1.75} />
            {config.empresa.telefone}
          </a>
          {cta}
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  const { empresa } = config
  return (
    <footer className="bg-graphite-2 pt-20 pb-10 text-white/70">
      <div className="container-lp">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="h-12 w-auto" subtitleColor="#a5a6a2" />
            <p className="mt-7 max-w-xs font-serif text-xl leading-snug text-white/85">
              Agregar valor respeitando valores.
            </p>
          </div>
          <div className="space-y-4 text-sm">
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold uppercase">Contato</p>
            <a href={empresa.telefoneLink} className="flex items-center gap-3 transition-colors hover:text-white">
              <Phone className="size-4 text-gold" strokeWidth={1.75} /> {empresa.telefone}
            </a>
            <a href={empresa.site} className="flex items-center gap-3 transition-colors hover:text-white" target="_blank" rel="noopener">
              <Globe className="size-4 text-gold" strokeWidth={1.75} /> {empresa.siteLabel}
            </a>
            <a href={empresa.instagram} className="flex items-center gap-3 transition-colors hover:text-white" target="_blank" rel="noopener">
              <InstagramIcon className="size-4 text-gold" /> {empresa.instagramLabel}
            </a>
          </div>
          <div className="space-y-4 text-sm">
            <p className="text-[0.7rem] font-semibold tracking-[0.22em] text-gold uppercase">Endereço</p>
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" strokeWidth={1.75} />
              <span>{empresa.endereco}</span>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-white/45 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {empresa.razaoSocial} Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="/politica-de-privacidade/" className="transition-colors hover:text-white">
              Política de Privacidade
            </a>
            <span>Porque mais do que números, geramos valor para o seu negócio.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
