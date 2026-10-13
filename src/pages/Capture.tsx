import { AnimatePresence, motion, MotionConfig, useScroll, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Button, LinkButton } from '../components/Button'
import { Countdown, DeadlineList } from '../components/Deadlines'
import { Gallery } from '../components/Gallery'
import { GuideCover } from '../components/GuideCover'
import { Footer, Header } from '../components/Layout'
import { LeadForm } from '../components/LeadForm'
import { CountUp, ease, MaskText, Reveal, RevealImage, Rule } from '../components/motion'
import { Partners } from '../components/Partners'
import { Timeline } from '../components/Timeline'

const discoveries = [
  'Por que dois orçamentos de mesmo valor passam a ter custos diferentes para a sua empresa.',
  'Por que repetir o regime tributário do ano anterior se tornou a decisão mais arriscada do momento.',
  'Qual cláusula precisa constar nos contratos que avançam para 2027.',
  'Quanto de capital de giro o split payment retira do seu caixa.',
  'O que muda no seu segmento: indústria, serviços, comércio, agronegócio, construção, saúde e educação.',
  'As oito providências para executar ainda neste trimestre.',
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
      className="hidden rounded-[3px] bg-gold px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-graphite-2 uppercase transition-colors hover:bg-white sm:inline-flex"
    >
      Receber o guia
    </button>
  )
}

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
      setShow(!formVisible && !finalVisible && window.scrollY > 500)
    })
    io.observe(form)
    if (final) io.observe(final)
    return () => io.disconnect()
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 90 }}
          animate={{ y: 0 }}
          exit={{ y: 90 }}
          transition={{ duration: 0.4, ease }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper p-3 md:hidden"
        >
          <Button onClick={scrollToForm} className="w-full">
            Quero receber o guia gratuito
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Seção com foto de fundo em parallax e véu grafite. */
function PhotoSection({
  src,
  children,
  className = '',
  overlay = 'bg-graphite-2/80',
  id,
  soften = false,
}: {
  src: string
  children: React.ReactNode
  className?: string
  overlay?: string
  id?: string
  /** Desfoque leve para fotos de resolução menor em telas grandes. */
  soften?: boolean
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  return (
    <section ref={ref} id={id} className={`on-dark relative isolate overflow-hidden text-white ${className}`}>
      <motion.img src={src} alt="" aria-hidden="true" style={{ y }} className={`absolute inset-x-0 top-[-12%] -z-10 h-[124%] w-full object-cover ${soften ? 'scale-105 blur-[2px]' : ''}`} />
      <div aria-hidden="true" className={`absolute inset-0 -z-10 ${overlay}`} />
      {children}
    </section>
  )
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="on-dark relative isolate overflow-hidden bg-graphite-2 pt-32 pb-20 text-white md:pt-40 lg:min-h-screen lg:pb-28">
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <motion.img
          src="/img/sala-reuniao.webp"
          alt=""
          aria-hidden="true"
          initial={{ scale: 1.25 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          className="h-[120%] w-full object-cover object-[50%_62%] blur-[1.5px]"
        />
      </motion.div>
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(44_43_41/0.93)_0%,rgb(44_43_41/0.8)_50%,rgb(44_43_41/0.45)_100%)]" />
      <motion.img
        src="/img/v-dourado.webp"
        alt=""
        aria-hidden="true"
        initial={{ opacity: 0, x: -60, rotate: -8 }}
        animate={{ opacity: 0.14, x: 0, rotate: 0 }}
        transition={{ duration: 2, ease, delay: 0.5 }}
        className="pointer-events-none absolute -bottom-24 -left-24 -z-10 hidden w-[28rem] lg:block"
      />

      <div className="container-lp grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <motion.div style={{ y: textY, opacity: fade }}>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="kicker">
            Guia executivo gratuito
          </motion.p>
          <MaskText
            as="h1"
            immediate
            delay={0.35}
            text="Reforma tributária: as *seis decisões* que a sua empresa precisa tomar agora"
            className="heading mt-7 text-[2.3rem] sm:text-5xl lg:text-[3.5rem]"
          />
          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease, delay: 1 }} className="mt-9 h-px w-24 origin-left bg-gold" />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 1.1 }}
            className="mt-9 max-w-xl text-lg leading-relaxed font-medium text-white/90 sm:text-xl"
          >
            O planejamento tributário que protege a sua margem hoje foi construído para um sistema que está sendo
            desmontado.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 1.25 }}
            className="mt-5 max-w-xl leading-relaxed text-white/70 sm:text-lg"
          >
            Baixe gratuitamente o guia executivo da Valore e veja, em cerca de 15 minutos, o que avaliar para proteger
            margem, caixa e créditos durante a transição.
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease, delay: 0.7 }}>
          <LeadForm />
        </motion.div>
      </div>
    </section>
  )
}

function Credentials() {
  return (
    <section className="border-b border-line bg-white">
      <div className="container-lp grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        <Reveal className="flex items-center gap-5 py-7 md:pr-8">
          <CountUp to={18} suffix="+" className="font-serif text-5xl font-semibold text-gold-deep" />
          <p className="text-sm leading-snug font-medium text-graphite/80">anos de atuação em planejamento tributário</p>
        </Reveal>
        <Reveal delay={0.1} className="flex items-center gap-5 py-7 md:px-8">
          <img src="/img/v-dourado.webp" alt="" aria-hidden="true" className="h-9 w-auto" />
          <p className="text-sm leading-snug font-medium text-graphite/80">Grupo de Estudos sobre a Reforma Tributária da OAB/Maringá</p>
        </Reveal>
        <Reveal delay={0.2} className="flex items-center gap-5 py-7 md:pl-8">
          <CountUp to={7} className="font-serif text-5xl font-semibold text-gold-deep" />
          <p className="text-sm leading-snug font-medium text-graphite/80">segmentos analisados no guia</p>
        </Reveal>
      </div>
    </section>
  )
}

export default function CapturePage() {
  return (
    <MotionConfig reducedMotion="user">
      <Header cta={<HeaderCta />} />

      <main>
        <Hero />
        <Credentials />

        {/* NESTE MATERIAL — capa do guia sobre foto */}
        <section className="relative overflow-hidden py-24 md:py-32">
          <div className="container-lp grid items-center gap-16 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
            <div className="relative">
              <RevealImage src="/img/xicaras.webp" alt="Xícaras e cartão de visita da Valore" className="aspect-[4/5] w-[85%]" imgClassName="object-cover" parallax={6} />
              <div className="absolute top-1/2 right-0 w-[55%] -translate-y-1/2">
                <GuideCover />
              </div>
            </div>
            <div>
              <Reveal>
                <p className="kicker">O guia</p>
              </Reveal>
              <MaskText text="Neste material, você vai *descobrir:*" className="heading mt-6 text-4xl text-graphite sm:text-[2.75rem]" goldClass="text-gold-deep" />
              <ol className="mt-10">
                {discoveries.map((d, i) => (
                  <li key={d} className="group">
                    <Rule className="bg-line" delay={i * 0.05} />
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                      transition={{ duration: 0.8, ease, delay: 0.1 + i * 0.07 }}
                      className="flex gap-6 py-5 transition-transform duration-500 group-hover:translate-x-2"
                    >
                      <span className="w-8 shrink-0 font-serif text-xl font-semibold text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                      <p className="leading-relaxed text-graphite/85">{d}</p>
                    </motion.div>
                  </li>
                ))}
                <Rule className="bg-line" />
              </ol>
            </div>
          </div>
        </section>

        {/* GALERIA HORIZONTAL */}
        <Gallery title="Agregar valor respeitando valores" />

        {/* O QUE MUDA E QUANDO — foto dos prédios ao fundo */}
        <PhotoSection src="/img/predios.webp" className="py-24 md:py-36" overlay="bg-graphite-2/85" soften>
          <div className="container-lp">
            <Reveal>
              <p className="kicker">Cronograma da transição</p>
            </Reveal>
            <MaskText text="O que muda e *quando*" className="heading mt-6 text-4xl sm:text-6xl" />

            <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3 text-lg">
              {['PIS', 'Cofins', 'IPI', 'ICMS', 'ISS'].map((t, i) => (
                <span key={t} className="relative text-white/70">
                  {t}
                  <motion.span
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                    transition={{ duration: 0.5, ease, delay: 0.4 + i * 0.15 }}
                    className="absolute top-1/2 right-0 left-0 h-[2px] origin-left bg-gold"
                  />
                </span>
              ))}
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                transition={{ duration: 0.6, delay: 1.3 }}
                className="text-gold"
              >
                →
              </motion.span>
              {['CBS', 'IBS'].map((t, i) => (
                <motion.span
                  key={t}
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '0px 0px -20% 0px' }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14, delay: 1.5 + i * 0.15 }}
                  className="rounded-[3px] bg-gold px-4 py-1.5 font-semibold text-graphite-2"
                >
                  {t}
                </motion.span>
              ))}
            </div>

            <div className="mt-16">
              <Timeline />
            </div>
            <p className="mt-14 text-xs text-white/45">Fontes: EC 132/2023 e LC 214/2025</p>
          </div>
        </PhotoSection>

        {/* URGÊNCIA — foto do contrato ao fundo */}
        <section className="py-24 md:py-32">
          <div className="container-lp grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="relative">
              <RevealImage src="/img/contrato.webp" alt="Assinatura de contrato com balança da justiça e martelo" className="aspect-[4/5] lg:aspect-[3/4]" imgClassName="object-cover" parallax={8} />
              <div className="on-dark absolute inset-x-4 bottom-4 bg-graphite-2/90 p-6 backdrop-blur-sm sm:inset-x-6 sm:bottom-6">
                <Countdown dark />
              </div>
            </div>
            <div>
              <Reveal>
                <p className="kicker">Prazos em curso</p>
              </Reveal>
              <MaskText
                text="A alíquota de 2027 ainda nem foi fixada, e os *prazos de decisão* já estão correndo."
                className="heading mt-6 text-3xl text-graphite sm:text-[2.5rem]"
                goldClass="text-gold-deep"
              />
              <Reveal delay={0.2}>
                <p className="mt-5 text-lg text-graphite/70">Não espere a primeira apuração para descobrir o impacto no seu negócio.</p>
              </Reveal>
              <Reveal delay={0.25} className="mt-10">
                <DeadlineList />
              </Reveal>
              <Reveal delay={0.3} className="mt-10">
                <Button onClick={scrollToForm}>Quero receber o guia gratuito</Button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* SÓCIAS */}
        <section className="bg-white py-24 md:py-32">
          <div className="container-lp">
            <Reveal>
              <p className="kicker">Sócias fundadoras</p>
            </Reveal>
            <MaskText text="Quem conduz a *Valore*" className="heading mt-6 mb-16 text-4xl text-graphite sm:text-6xl" goldClass="text-gold-deep" />
            <Partners />
          </div>
        </section>

        {/* FAIXA MANIFESTO */}
        <PhotoSection src="/img/martelo.webp" className="py-28 md:py-40" overlay="bg-graphite-2/75" soften>
          <div className="container-lp text-center">
            <MaskText text="Porque mais do que números, geramos *valor* para o seu negócio." className="heading mx-auto max-w-4xl text-3xl sm:text-5xl" />
          </div>
        </PhotoSection>

        {/* SOBRE A VALORE */}
        <section className="py-24 md:py-32">
          <div className="container-lp grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
            <div className="relative pb-20 sm:pb-28">
              <RevealImage src="/img/kit-presente.webp" alt="Kit Valore em preto e dourado, com canecas e garrafa" className="aspect-[4/3] w-[86%]" imgClassName="object-cover" parallax={6} />
              <div className="absolute right-0 bottom-0 w-[50%] bg-paper p-1.5">
                <RevealImage src="/img/papelaria.webp" alt="Papelaria Valore" className="aspect-[4/3]" imgClassName="object-cover" delay={0.3} />
              </div>
            </div>
            <div>
              <Reveal>
                <p className="kicker">Sobre a Valore</p>
              </Reveal>
              <MaskText text="Extensão estratégica do *departamento fiscal* das empresas" className="heading mt-6 text-3xl text-graphite sm:text-[2.6rem]" goldClass="text-gold-deep" />
              <Reveal delay={0.2}>
                <p className="mt-6 leading-relaxed text-graphite/75 sm:text-lg">
                  Consultoria sediada em Maringá, Paraná. Cada projeto parte dos números da própria empresa, sem pacotes
                  genéricos.
                </p>
              </Reveal>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
                {['Excelência técnica', 'Transparência e confiança', 'Soluções personalizadas'].map((t, i) => (
                  <Reveal key={t} delay={0.2 + i * 0.1}>
                    <img src="/img/v-dourado.webp" alt="" aria-hidden="true" className="h-6 w-auto" />
                    <p className="mt-3 font-serif text-base leading-snug font-semibold text-graphite sm:text-lg">{t}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <PhotoSection src="/img/kit-presente.webp" id="cta-final" className="py-28 md:py-36" overlay="bg-graphite-2/70">
          <motion.img
            src="/img/v-dourado.webp"
            alt=""
            aria-hidden="true"
            initial={{ opacity: 0, rotate: 10, scale: 0.8 }}
            whileInView={{ opacity: 0.18, rotate: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.6, ease }}
            className="pointer-events-none absolute -right-16 -bottom-16 -z-10 w-80"
          />
          <div className="container-lp text-center">
            <Reveal>
              <p className="kicker justify-center">Guia executivo gratuito</p>
            </Reveal>
            <MaskText
              text="Reforma tributária: as seis decisões que a sua empresa precisa tomar *agora*"
              className="heading mx-auto mt-6 max-w-3xl text-3xl sm:text-5xl"
            />
            <Reveal delay={0.3} className="mt-10">
              <LinkButton
                href="#formulario"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToForm()
                }}
              >
                Quero receber o guia gratuito
              </LinkButton>
            </Reveal>
          </div>
        </PhotoSection>
      </main>

      <Footer />
      <MobileStickyCta />
    </MotionConfig>
  )
}
