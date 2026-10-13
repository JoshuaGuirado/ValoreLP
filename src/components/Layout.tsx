import { motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { useState, type ReactNode } from 'react'
import { MapPin, Phone, Globe } from 'lucide-react'
import { config } from '../config'
import { Logo, LogoMark } from './Logo'
import { InstagramIcon } from './icons'

export function Header({ cta }: { cta?: ReactNode }) {
  const { scrollY } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 24))

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled ? 'border-b border-white/5 bg-ink/75 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="container-lp flex h-18 items-center justify-between gap-4 md:h-20">
        <a href="/" aria-label="Valore Soluções Tributárias — início" className="shrink-0">
          <Logo className="h-10 w-auto md:h-13" />
        </a>
        {cta}
      </div>
    </motion.header>
  )
}

export function Footer() {
  const { empresa } = config
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink pt-20 pb-10">
      <LogoMark className="pointer-events-none absolute -right-24 -bottom-40 h-[28rem] w-auto opacity-[0.04]" />
      <div className="container-lp relative">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Logo className="h-12 w-auto" />
            <p className="mt-6 max-w-sm font-serif text-2xl leading-snug text-white/85 italic">
              Agregar valor respeitando valores.
            </p>
          </div>
          <div className="space-y-4 text-sm text-white/65">
            <p className="eyebrow">Contato</p>
            <a href={empresa.telefoneLink} className="flex items-center gap-3 transition hover:text-gold-light">
              <Phone className="size-4 text-gold" /> {empresa.telefone}
            </a>
            <a href={empresa.site} className="flex items-center gap-3 transition hover:text-gold-light" target="_blank" rel="noopener">
              <Globe className="size-4 text-gold" /> {empresa.siteLabel}
            </a>
            <a href={empresa.instagram} className="flex items-center gap-3 transition hover:text-gold-light" target="_blank" rel="noopener">
              <InstagramIcon className="size-4 text-gold" /> {empresa.instagramLabel}
            </a>
          </div>
          <div className="space-y-4 text-sm text-white/65">
            <p className="eyebrow">Endereço</p>
            <p className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
              <span>{empresa.endereco}</span>
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/5 pt-8 text-xs text-white/40 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {empresa.razaoSocial} Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <a href="/politica-de-privacidade/" className="transition hover:text-gold-light">
              Política de Privacidade
            </a>
            <span>Porque mais do que números, geramos valor para o seu negócio.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
