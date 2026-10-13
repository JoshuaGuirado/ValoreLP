import { AnimatePresence, motion, MotionConfig } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  Clock,
  FileSignature,
  ListChecks,
  Scale,
  Wallet,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { HeroBackdrop } from '../components/Backdrop'
import { Button, LinkButton } from '../components/Button'
import { Countdown, DeadlineList } from '../components/Deadlines'
import { EbookMockup } from '../components/EbookMockup'
import { Footer, Header } from '../components/Layout'
import { LeadForm } from '../components/LeadForm'
import { LogoMark } from '../components/Logo'
import { Marquee } from '../components/Marquee'
import { ease, Reveal, SplitHeading } from '../components/motion'
import { Partners } from '../components/Partners'
import { SpotlightCard } from '../components/SpotlightCard'
import { Timeline } from '../components/Timeline'

const discoveries = [
  { icon: Scale, text: 'Por que dois orçamentos de mesmo valor passam a ter custos diferentes para a sua empresa.' },
  { icon: Building2, text: 'Por que repetir o regime tributário do ano anterior se tornou a decisão mais arriscada do momento.' },
  { icon: FileSignature, text: 'Qual cláusula precisa constar nos contratos que avançam para 2027.' },
  { icon: Wallet, text: 'Quanto de capital de giro o split payment retira do seu caixa.' },
  {
    icon: CalendarClock,
    text: 'O que muda no seu segmento: indústria, serviços, comércio, agronegócio, construção, saúde e educação.',
    chips: ['Indústria', 'Serviços', 'Comércio', 'Agronegócio', 'Construção', 'Saúde', 'Educação'],
  },
  { icon: ListChecks, text: 'As oito providências para executar ainda neste trimestre.' },
]

function scrollToForm() {
  const el = document.getElementById('formulario')
  el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  setTimeout(() => el?.querySelector('input')?.focus({ preventScroll: true }), 700)
}

function HeaderCta() {
  return (
    <button
      onClick={scrollToForm}
      className="hidden items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-[0.7rem] font-bold tracking-[0.16em] text-gold-light uppercase transition hover:border-gold hover:bg-gold/10 sm:inline-flex"
    >
      Receber o guia <ArrowRight className="size-3.5" />
    </button>
  )
}

/** Barra fixa no celular quando o formulário sai da tela. */
function MobileStickyCta() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const form = document.getElementById('formulario')
    const final = document.getElementById('cta-final')
    if (!form) return
    const seen = new Map<Element, boolean>()
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => seen.set(e.target, e.isIntersecting))
      const formVisible = seen.get(form) ?? true
      const finalVisible = final ? (seen.get(final) ?? false) : false
      setShow(!formVisible && !finalVisible && window.scrollY > 400)
    })
    io.observe(form)
    if (final) io.observe(final)
    return () => io.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ duration: 0.5, ease }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 p-3 backdrop-blur-xl md:hidden"
        >
          <Button onClick={scrollToForm} className="w-full" magnetic={false} icon={<ArrowRight className="size-4" />}>
            Quero receber o guia gratuito
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function CapturePage() {
  return (
    <MotionConfig reducedMotion="user">
      <Header cta={<HeaderCta />} />

      <main>
        {/* HERO + FORMULÁRIO */}
        <section className="grain relative isolate overflow-hidden pt-32 pb-24 md:pt-40 lg:pb-32">
          <HeroBackdrop />
          <div className="container-lp relative grid items-start gap-14 lg:grid-cols-[1.12fr_0.88fr] lg:gap-16">
            <div className="lg:pt-6">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.2 }}
                className="eyebrow"
              >
                Guia executivo gratuito
              </motion.p>

              <SplitHeading
                as="h1"
                immediate
                delay={0.3}
                text="Reforma tributária: as *seis decisões* que a sua empresa precisa tomar agora"
                className="mt-6 text-[2.35rem] leading-[1.06] font-extrabold tracking-[-0.025em] text-balance text-white sm:text-5xl xl:text-[3.6rem]"
              />

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 0.95 }}
                className="mt-7 max-w-xl font-serif text-xl leading-snug text-white/85 italic sm:text-2xl"
              >
                O planejamento tributário que protege a sua margem hoje foi construído para um sistema que está sendo
                desmontado.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease, delay: 1.1 }}
                className="mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg"
              >
                Baixe gratuitamente o guia executivo da Valore e veja, em cerca de 15 minutos, o que avaliar para
                proteger margem, caixa e créditos durante a transição.
              </motion.p>

              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.3 }}
                className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm text-white/55"
              >
                <li className="flex items-center gap-2.5">
                  <Clock className="size-4 text-gold" /> Leitura de cerca de 15 minutos
                </li>
                <li className="flex items-center gap-2.5">
                  <BadgeCheck className="size-4 text-gold" /> EC 132/2023 e LC 214/2025
                </li>
              </motion.ul>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.6 }}
            >
              <LeadForm />
            </motion.div>
          </div>
        </section>

        <Marquee />

        {/* NESTE MATERIAL */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="container-lp grid items-center gap-16 lg:grid-cols-[0.8fr_1.2fr]">
            <Reveal className="lg:sticky lg:top-28">
              <EbookMockup />
            </Reveal>

            <div>
              <Reveal>
                <p className="eyebrow">O que você recebe</p>
              </Reveal>
              <SplitHeading
                text="Neste material, você vai *descobrir:*"
                className="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl"
              />

              <ol className="mt-12 grid gap-4 sm:grid-cols-2">
                {discoveries.map((d, i) => (
                  <Reveal key={d.text} delay={i * 0.07} className={d.chips ? 'sm:col-span-2' : ''}>
                    <SpotlightCard className="h-full">
                      <div className="flex h-full flex-col p-6 sm:p-7">
                        <div className="flex items-center justify-between">
                          <span className="grid size-11 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                            <d.icon className="size-5" strokeWidth={1.6} />
                          </span>
                          <span className="font-serif text-3xl text-white/15 italic">0{i + 1}</span>
                        </div>
                        <p className="mt-6 text-[1.02rem] leading-relaxed font-medium text-white/85">{d.text}</p>
                        {d.chips && (
                          <div className="mt-5 flex flex-wrap gap-2" aria-hidden="true">
                            {d.chips.map((c) => (
                              <span
                                key={c}
                                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/55 transition group-hover:border-gold/30"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </SpotlightCard>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* O QUE MUDA E QUANDO */}
        <section className="relative overflow-hidden bg-ink-2 py-24 md:py-32">
          <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <div className="container-lp relative">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <p className="eyebrow justify-center">Cronograma da transição</p>
              </Reveal>
              <SplitHeading
                text="O que muda e *quando*"
                className="mt-5 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
              />
              <Reveal delay={0.1}>
                <p className="mt-6 text-lg leading-relaxed text-white/60">
                  Cinco tributos sobre o consumo (PIS, Cofins, IPI, ICMS e ISS) serão substituídos por dois: a CBS,
                  federal, e o IBS, de estados e municípios. De 2027 a 2032, a empresa apura o sistema antigo e o novo
                  simultaneamente.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-center gap-3 sm:gap-4">
              {['PIS', 'Cofins', 'IPI', 'ICMS', 'ISS'].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 1 }}
                  whileInView={{ opacity: 0.35 }}
                  viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 line-through decoration-gold/70"
                >
                  {t}
                </motion.span>
              ))}
              <ArrowRight className="mx-1 size-5 text-gold" />
              {['CBS', 'IBS'].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 1.2 + i * 0.12 }}
                  className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-ink shadow-[0_0_30px_rgb(197_161_85/0.45)]"
                >
                  {t}
                </motion.span>
              ))}
            </Reveal>

            <div className="mt-20">
              <Timeline />
            </div>
            <p className="mt-14 text-center text-xs text-white/35">Fontes: EC 132/2023 e LC 214/2025</p>
          </div>
        </section>

        {/* URGÊNCIA */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div aria-hidden="true" className="absolute top-1/2 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/8 blur-[140px]" />
          <div className="container-lp relative grid items-start gap-14 lg:grid-cols-2 lg:gap-20">
            <div>
              <Reveal>
                <p className="eyebrow">Prazos em curso</p>
              </Reveal>
              <SplitHeading
                text="A alíquota de 2027 ainda nem foi fixada, e os *prazos de decisão* já estão correndo."
                className="mt-5 text-3xl leading-[1.15] font-extrabold tracking-tight text-white sm:text-[2.6rem]"
              />
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-lg font-serif text-xl text-white/75 italic">
                  Não espere a primeira apuração para descobrir o impacto no seu negócio.
                </p>
              </Reveal>
              <Reveal delay={0.2} className="mt-12">
                <Countdown />
              </Reveal>
              <Reveal delay={0.3} className="mt-12">
                <Button onClick={scrollToForm} icon={<ArrowRight className="size-4" />}>
                  Quero receber o guia gratuito
                </Button>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <DeadlineList />
            </Reveal>
          </div>
        </section>

        {/* SÓCIAS */}
        <section className="relative overflow-hidden bg-ink-2 py-24 md:py-32">
          <div className="container-lp">
            <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <Reveal>
                  <p className="eyebrow">Sócias fundadoras</p>
                </Reveal>
                <SplitHeading
                  text="Agregar valor *respeitando valores*"
                  className="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl"
                />
              </div>
              <Reveal delay={0.1}>
                <p className="text-lg leading-relaxed text-white/60">
                  Agregar valor respeitando valores: foi esse o desejo dos sócios fundadores ao constituir a Valore
                  Soluções Tributárias — sempre guiados pelos valores que nortearam sua trajetória profissional:
                  transparência, ética e responsabilidade.
                </p>
              </Reveal>
            </div>
            <div className="mt-20">
              <Partners />
            </div>
          </div>
        </section>

        {/* SOBRE A VALORE */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="container-lp grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <Reveal className="relative">
              <div className="relative overflow-hidden rounded-[2rem] ring-1 ring-white/10">
                <motion.img
                  src="/img/brand-kit.webp"
                  alt="Kit de identidade Valore em preto e dourado"
                  loading="lazy"
                  initial={{ scale: 1.15 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.8, ease }}
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-ink/60 via-transparent to-transparent" />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease, delay: 0.4 }}
                className="absolute -bottom-8 left-6 rounded-2xl border border-white/10 bg-ink/85 px-7 py-5 backdrop-blur-xl sm:left-10"
              >
                <p className="text-5xl font-extrabold text-gold-gradient">18+</p>
                <p className="mt-1 text-xs font-semibold tracking-[0.16em] text-white/60 uppercase">anos de atuação</p>
              </motion.div>
            </Reveal>

            <div className="pt-8 lg:pt-0">
              <Reveal>
                <p className="eyebrow">Sobre a Valore</p>
              </Reveal>
              <SplitHeading
                text="Extensão estratégica do *departamento fiscal* das empresas"
                className="mt-5 text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-[2.6rem]"
              />
              <Reveal delay={0.1}>
                <p className="mt-6 text-lg leading-relaxed text-white/60">
                  A Valore Soluções Tributárias é uma consultoria sediada em Maringá, Paraná. Nossos profissionais contam
                  com mais de 18 anos de atuação em planejamento tributário, recuperação de créditos e assessoria
                  tributária. Cada projeto parte dos números da própria empresa, sem pacotes genéricos.
                </p>
              </Reveal>
              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {['Excelência técnica', 'Transparência e confiança', 'Soluções personalizadas'].map((t, i) => (
                  <Reveal key={t} delay={0.15 + i * 0.08}>
                    <div className="h-full rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition duration-500 hover:-translate-y-1 hover:border-gold/40">
                      <LogoMark className="h-6 w-auto" />
                      <p className="mt-4 text-sm font-semibold text-white/85">{t}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="cta-final" className="grain relative overflow-hidden py-24 md:py-32">
          <div className="container-lp">
            <Reveal>
              <div className="relative overflow-hidden rounded-[2.5rem] border border-gold/25 bg-[radial-gradient(ellipse_at_top,rgb(197_161_85/0.22),transparent_60%),linear-gradient(180deg,#22211f,#151413)] px-6 py-16 text-center sm:px-12 md:py-24">
                <LogoMark stroke className="pointer-events-none absolute -top-20 -left-16 w-72 opacity-20" />
                <LogoMark stroke className="pointer-events-none absolute -right-20 -bottom-24 w-96 opacity-15" />
                <p className="eyebrow justify-center">Guia executivo gratuito</p>
                <SplitHeading
                  text="Reforma tributária: as seis decisões que a sua empresa precisa tomar *agora*"
                  className="mx-auto mt-6 max-w-3xl text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl"
                />
                <p className="mx-auto mt-6 max-w-xl text-white/60">
                  Não espere a primeira apuração para descobrir o impacto no seu negócio.
                </p>
                <div className="mt-10 flex justify-center">
                  <LinkButton
                    href="#formulario"
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToForm()
                    }}
                    icon={<ArrowRight className="size-4" />}
                  >
                    Quero receber o guia gratuito
                  </LinkButton>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
      <MobileStickyCta />
    </MotionConfig>
  )
}
