import { AnimatePresence, motion, MotionConfig, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button, LinkButton } from '../components/Button'
import { Countdown, DeadlineList } from '../components/Deadlines'
import { GuideCover } from '../components/GuideCover'
import { Footer, Header } from '../components/Layout'
import { LeadForm } from '../components/LeadForm'
import { ease, Reveal, RevealImage, Rule } from '../components/motion'
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
      className="hidden rounded-[3px] bg-gold px-5 py-2.5 text-[0.68rem] font-semibold tracking-[0.16em] text-graphite-2 uppercase transition-colors hover:bg-graphite hover:text-white sm:inline-flex"
    >
      Receber o guia
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

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])

  return (
    <section ref={ref} className="on-dark relative isolate overflow-hidden bg-graphite-2 pt-32 pb-20 text-white md:pt-40 lg:pb-28">
      <motion.img
        src="/img/sala-reuniao.webp"
        alt=""
        aria-hidden="true"
        style={{ y }}
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1.04, opacity: 1 }}
        transition={{ duration: 2.2, ease }}
        className="absolute inset-0 -z-10 h-[120%] w-full object-cover object-[50%_62%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(44_43_41/0.94)_0%,rgb(44_43_41/0.86)_45%,rgb(44_43_41/0.55)_100%)]" />
      <img
        src="/img/v-dourado.webp"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 -z-10 hidden w-[26rem] opacity-[0.12] lg:block"
      />

      <div className="container-lp grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.3 }} className="kicker">
            Guia executivo gratuito
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.4 }}
            className="heading mt-7 text-[2.3rem] text-balance sm:text-5xl lg:text-[3.4rem]"
          >
            Reforma tributária: as <span className="text-gold">seis decisões</span> que a sua empresa precisa tomar agora
          </motion.h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease, delay: 0.8 }}
            className="mt-9 h-px w-24 origin-left bg-gold"
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.9 }}
            className="mt-9 max-w-xl text-lg leading-relaxed font-medium text-white/90 sm:text-xl"
          >
            O planejamento tributário que protege a sua margem hoje foi construído para um sistema que está sendo
            desmontado.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease, delay: 1.05 }}
            className="mt-5 max-w-xl leading-relaxed text-white/70 sm:text-lg"
          >
            Baixe gratuitamente o guia executivo da Valore e veja, em cerca de 15 minutos, o que avaliar para proteger
            margem, caixa e créditos durante a transição.
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease, delay: 0.6 }}>
          <LeadForm />
        </motion.div>
      </div>
    </section>
  )
}

function Credentials() {
  const items = [
    'Mais de 18 anos de atuação em planejamento tributário',
    'Coordenação do Grupo de Estudos sobre a Reforma Tributária da OAB/Maringá',
    'Sede em Maringá, Paraná',
  ]
  return (
    <section className="border-b border-line bg-white">
      <div className="container-lp grid divide-y divide-line md:grid-cols-3 md:divide-x md:divide-y-0">
        {items.map((t, i) => (
          <Reveal key={t} delay={i * 0.1} className="flex items-center gap-4 py-6 md:px-8 md:first:pl-0">
            <img src="/img/v-dourado.webp" alt="" aria-hidden="true" className="h-5 w-auto" />
            <p className="text-sm leading-snug font-medium text-graphite/80">{t}</p>
          </Reveal>
        ))}
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

        {/* NESTE MATERIAL */}
        <section className="py-24 md:py-32">
          <div className="container-lp grid items-start gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
            <Reveal className="lg:sticky lg:top-32">
              <GuideCover />
            </Reveal>
            <div>
              <Reveal>
                <p className="kicker">O guia</p>
                <h2 className="heading mt-6 text-4xl text-graphite sm:text-[2.75rem]">Neste material, você vai descobrir:</h2>
              </Reveal>
              <ol className="mt-12">
                {discoveries.map((d, i) => (
                  <li key={d} className="group">
                    <Rule className="bg-line" delay={i * 0.05} />
                    <Reveal delay={0.1 + i * 0.05} className="flex gap-6 py-6 sm:gap-10">
                      <span className="w-8 shrink-0 font-serif text-xl font-semibold text-gold-deep">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-[1.05rem] leading-relaxed text-graphite/85 transition-colors group-hover:text-graphite">{d}</p>
                    </Reveal>
                  </li>
                ))}
                <Rule className="bg-line" />
              </ol>
              <Reveal className="mt-12">
                <Button onClick={scrollToForm}>Quero receber o guia gratuito</Button>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAIXA COM FOTO */}
        <section className="relative">
          <RevealImage src="/img/martelo.webp" alt="Martelo de juiz e documentos sobre a mesa" className="h-[22rem] md:h-[30rem]" imgClassName="object-cover" parallax={8} />
          <div className="on-dark absolute inset-0 flex items-center bg-graphite-2/70">
            <div className="container-lp">
              <Reveal className="max-w-3xl">
                <p className="kicker">Manifesto Valore</p>
                <blockquote className="mt-6 font-serif text-2xl leading-snug text-white sm:text-[2.1rem]">
                  “Acreditamos que segurança tributária não é um detalhe, mas a base sólida sobre a qual o sucesso de um
                  negócio se constrói.”
                </blockquote>
              </Reveal>
            </div>
          </div>
        </section>

        {/* O QUE MUDA E QUANDO */}
        <section className="on-dark bg-graphite py-24 text-white md:py-32">
          <div className="container-lp">
            <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
              <Reveal>
                <p className="kicker">Cronograma da transição</p>
                <h2 className="heading mt-6 text-4xl sm:text-[2.75rem]">O que muda e quando</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="leading-relaxed text-white/70 sm:text-lg">
                  Cinco tributos sobre o consumo (PIS, Cofins, IPI, ICMS e ISS) serão substituídos por dois: a CBS,
                  federal, e o IBS, de estados e municípios. De 2027 a 2032, a empresa apura o sistema antigo e o novo
                  simultaneamente.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.15} className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-3 border-y border-white/15 py-6 text-sm">
              <span className="mr-2 text-[0.7rem] font-semibold tracking-[0.18em] text-white/50 uppercase">Saem</span>
              {['PIS', 'Cofins', 'IPI', 'ICMS', 'ISS'].map((t) => (
                <span key={t} className="text-white/60 line-through decoration-gold/80">
                  {t}
                </span>
              ))}
              <ArrowRight className="mx-2 size-4 text-gold" strokeWidth={1.5} />
              <span className="mr-2 text-[0.7rem] font-semibold tracking-[0.18em] text-white/50 uppercase">Entram</span>
              <span className="font-semibold text-gold">CBS</span>
              <span className="font-semibold text-gold">IBS</span>
            </Reveal>

            <div className="mt-16">
              <Timeline />
            </div>
            <p className="mt-14 text-xs text-white/45">Fontes: EC 132/2023 e LC 214/2025</p>
          </div>
        </section>

        {/* URGÊNCIA */}
        <section className="py-24 md:py-32">
          <div className="container-lp grid items-start gap-16 lg:grid-cols-2 lg:gap-24">
            <div>
              <Reveal>
                <p className="kicker">Prazos em curso</p>
                <h2 className="heading mt-6 text-3xl text-graphite sm:text-[2.6rem]">
                  A alíquota de 2027 ainda nem foi fixada, e os prazos de decisão já estão correndo.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-graphite/75">
                  Não espere a primeira apuração para descobrir o impacto no seu negócio.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="mt-12">
                <Countdown />
              </Reveal>
              <Reveal delay={0.2} className="mt-10">
                <Button onClick={scrollToForm}>Quero receber o guia gratuito</Button>
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <DeadlineList />
            </Reveal>
          </div>
        </section>

        {/* SÓCIAS */}
        <section className="bg-white py-24 md:py-32">
          <div className="container-lp">
            <div className="grid gap-8 lg:grid-cols-2 lg:items-end lg:gap-24">
              <Reveal>
                <p className="kicker">Sócias fundadoras</p>
                <h2 className="heading mt-6 text-4xl text-graphite sm:text-[2.75rem]">Agregar valor respeitando valores</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="leading-relaxed text-graphite/70 sm:text-lg">
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
        <section className="py-24 md:py-32">
          <div className="container-lp grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
            <div className="relative pb-16 sm:pb-24">
              <RevealImage src="/img/kit-presente.webp" alt="Kit Valore em preto e dourado, com canecas e garrafa" className="aspect-[4/3] w-[88%]" imgClassName="object-cover" />
              <div className="absolute right-0 bottom-0 w-[52%] bg-paper p-1.5">
                <RevealImage
                  src="/img/papelaria.webp"
                  alt="Papelaria Valore: cartões de visita, envelope e papel timbrado"
                  className="aspect-[4/3]"
                  imgClassName="object-cover"
                  delay={0.25}
                />
              </div>
            </div>
            <div>
              <Reveal>
                <p className="kicker">Sobre a Valore</p>
                <h2 className="heading mt-6 text-3xl text-graphite sm:text-[2.6rem]">
                  Extensão estratégica do departamento fiscal das empresas
                </h2>
                <p className="mt-6 leading-relaxed text-graphite/75 sm:text-lg">
                  A Valore Soluções Tributárias é uma consultoria sediada em Maringá, Paraná. Nossos profissionais
                  contam com mais de 18 anos de atuação em planejamento tributário, recuperação de créditos e
                  assessoria tributária.
                </p>
                <p className="mt-4 leading-relaxed text-graphite/75 sm:text-lg">
                  Atuamos como extensão estratégica do departamento fiscal das empresas. Cada projeto parte dos números
                  da própria empresa, sem pacotes genéricos.
                </p>
              </Reveal>
              <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
                {[
                  ['Excelência técnica', 'Especialistas em tributação, contabilidade, planejamento financeiro e jurídico.'],
                  ['Transparência e confiança', 'Clareza em cada etapa do trabalho.'],
                  ['Soluções personalizadas', 'Cada estratégia é desenhada sob medida.'],
                ].map(([t, d], i) => (
                  <Reveal key={t} delay={0.1 + i * 0.08}>
                    <dt className="font-serif text-lg font-semibold text-graphite">{t}</dt>
                    <dd className="mt-2 text-sm leading-relaxed text-graphite/65">{d}</dd>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* CTA FINAL */}
        <section id="cta-final" className="on-dark relative isolate overflow-hidden bg-graphite-2 py-24 text-white md:py-32">
          <img src="/img/livros.webp" alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-25" />
          <img src="/img/v-dourado.webp" alt="" aria-hidden="true" className="pointer-events-none absolute -right-20 -bottom-20 -z-10 w-80 opacity-20" />
          <div className="container-lp text-center">
            <Reveal>
              <p className="kicker justify-center">Guia executivo gratuito</p>
              <h2 className="heading mx-auto mt-6 max-w-3xl text-3xl sm:text-5xl">
                Reforma tributária: as seis decisões que a sua empresa precisa tomar agora
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-white/70">Não espere a primeira apuração para descobrir o impacto no seu negócio.</p>
              <div className="mt-10">
                <LinkButton
                  href="#formulario"
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToForm()
                  }}
                >
                  Quero receber o guia gratuito
                </LinkButton>
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
