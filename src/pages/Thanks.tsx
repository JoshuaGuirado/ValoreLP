import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight, Check, Download, Gift, Layers, Mail, Scale, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import { HeroBackdrop } from '../components/Backdrop'
import { LinkButton } from '../components/Button'
import { WhatsAppIcon } from '../components/icons'
import { Footer, Header } from '../components/Layout'
import { LogoMark } from '../components/Logo'
import { ease, Reveal, SplitHeading } from '../components/motion'
import { SpotlightCard } from '../components/SpotlightCard'
import { config } from '../config'
import { readStoredLead } from '../lib/lead'
import { whatsappLink } from '../lib/whatsapp'

/** Ilustração decorativa dos três cenários da modulação (sem valores reais). */
function ScenarioChart() {
  const years = ['2027', '2028', '2029', '2030', '2031', '2032', '2033']
  const series = [
    { name: 'Cenário base', color: 'bg-gold', h: [38, 42, 50, 56, 63, 70, 78] },
    { name: 'Cenário conservador', color: 'bg-steel', h: [48, 54, 63, 71, 80, 88, 96] },
    { name: 'Cenário favorável', color: 'bg-gold-deep', h: [30, 33, 38, 42, 47, 52, 58] },
  ]
  return (
    <div aria-hidden="true" className="rounded-3xl border border-white/10 bg-ink/70 p-6 backdrop-blur-xl sm:p-8">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-[0.2em] text-white/50 uppercase">Modulação de cenários</p>
        <LogoMark className="h-5 w-auto" />
      </div>
      <div className="mt-8 flex h-56 items-end gap-3 border-b border-white/10 pb-px sm:gap-4">
        {years.map((y, yi) => (
          <div key={y} className="flex h-full flex-1 items-end justify-center gap-[3px]">
            {series.map((s, si) => (
              <motion.div
                key={s.name}
                className={`w-full max-w-3 rounded-t-sm ${s.color}`}
                initial={{ height: 0 }}
                whileInView={{ height: `${s.h[yi]}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease, delay: 0.3 + yi * 0.08 + si * 0.05 }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3 sm:gap-4">
        {years.map((y) => (
          <span key={y} className="flex-1 text-center text-[0.6rem] text-white/40 tabular-nums">
            {y}
          </span>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
        {series.map((s) => (
          <span key={s.name} className="flex items-center gap-2 text-xs text-white/60">
            <span className={`size-2.5 rounded-full ${s.color}`} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function ThanksPage() {
  const lead = useMemo(readStoredLead, [])
  const firstName = lead?.nome?.split(' ')[0]
  const regime = lead?.regime

  const intro = lead ? `Meu nome é ${lead.nome}, da empresa ${lead.empresa} (${lead.regime}). ` : ''
  const specialistMsg = `Olá! ${intro}Baixei o guia da reforma tributária e quero conversar com um especialista sobre a Modulação de Cenários para a Reforma Tributária.`
  const diagnosisMsg = `Olá! ${intro}Quero solicitar o Diagnóstico Preliminar Gratuito de PIS e Cofins para empresas do Lucro Real.`

  const regimeCards = [
    {
      icon: Scale,
      title: 'Simples Nacional ou Lucro Presumido',
      match: regime === 'Simples Nacional' || regime === 'Lucro Presumido',
      text: 'Se a sua empresa está no Simples Nacional ou no Lucro Presumido, a simulação responde se o regime atual continua sendo o melhor em 2027 e quanto custa cada opção.',
    },
    {
      icon: Layers,
      title: 'Lucro Real',
      match: regime === 'Lucro Real',
      text: 'Se a sua empresa está no Lucro Real, ela mostra o efeito combinado dos créditos por fornecedor, do novo preço, do fim dos benefícios de ICMS e do split payment sobre o resultado.',
    },
  ]

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <main>
        {/* GUIA LIBERADO */}
        <section className="grain relative isolate overflow-hidden pt-36 pb-24 md:pt-44 md:pb-32">
          <HeroBackdrop />
          <div className="container-lp relative text-center">
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.2 }}
              className="relative mx-auto grid size-20 place-items-center rounded-full bg-gold text-ink"
            >
              <motion.span
                className="absolute inset-0 rounded-full border border-gold"
                animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              />
              <Check className="size-9" strokeWidth={3} />
            </motion.div>

            {firstName && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease, delay: 0.5 }}
                className="eyebrow mt-10 justify-center"
              >
                Tudo certo, {firstName}
              </motion.p>
            )}

            <SplitHeading
              as="h1"
              immediate
              delay={0.55}
              text="O seu guia está *liberado.*"
              className="mt-6 text-5xl font-extrabold tracking-tight text-white sm:text-7xl"
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 1 }}
              className="mt-10 flex flex-col items-center gap-5"
            >
              {config.guideUrl && (
                <LinkButton href={config.guideUrl} target="_blank" rel="noopener" icon={<Download className="size-4" />}>
                  Baixar o guia agora
                </LinkButton>
              )}
              <p className="flex items-center gap-2 text-sm text-white/55">
                <Mail className="size-4 text-gold" />
                Enviamos o material para o seu e-mail e para o seu WhatsApp
              </p>
            </motion.div>
          </div>
        </section>

        {/* PERGUNTA */}
        <section className="relative py-20 md:py-28">
          <div className="container-lp max-w-4xl text-center">
            <Reveal>
              <p className="font-serif text-2xl text-gold-light italic sm:text-3xl">Agora, a pergunta mais importante:</p>
            </Reveal>
            <SplitHeading
              text="quanto a reforma representa nos *números da sua empresa?*"
              className="mt-4 text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-[3.4rem]"
            />
            <Reveal delay={0.15}>
              <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
                O guia mostra o que muda. O efeito sobre a sua carga, a sua margem e o seu caixa depende de dados que só
                a sua operação tem.
              </p>
            </Reveal>
          </div>
        </section>

        {/* MODULAÇÃO DE CENÁRIOS */}
        <section className="relative overflow-hidden bg-ink-2 py-24 md:py-32">
          <div aria-hidden="true" className="grid-lines absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
          <div className="container-lp relative grid items-center gap-16 lg:grid-cols-2">
            <div>
              <Reveal>
                <p className="eyebrow">Próximo passo</p>
              </Reveal>
              <SplitHeading
                text="Modulação de Cenários para a *Reforma Tributária*"
                className="mt-5 text-4xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl"
              />
              <Reveal delay={0.1}>
                <p className="mt-6 text-lg leading-relaxed text-white/65">
                  A Valore projeta, com os números da sua empresa, o resultado de cada ano da transição e compara as
                  alternativas lado a lado.
                </p>
              </Reveal>

              <div className="mt-10 space-y-4">
                {regimeCards.map((c, i) => (
                  <Reveal key={c.title} delay={0.15 + i * 0.1}>
                    <SpotlightCard className={c.match ? 'bg-gold/40' : ''}>
                      <div className="flex gap-5 p-6">
                        <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-gold/25 bg-gold/10 text-gold">
                          <c.icon className="size-5" strokeWidth={1.6} />
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <p className="text-sm font-bold tracking-[0.12em] text-white uppercase">{c.title}</p>
                            {c.match && (
                              <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[0.62rem] font-bold tracking-[0.14em] text-gold-light uppercase ring-1 ring-gold/40">
                                O seu regime
                              </span>
                            )}
                          </div>
                          <p className="mt-2 leading-relaxed text-white/60">{c.text}</p>
                        </div>
                      </div>
                    </SpotlightCard>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={0.3}>
                <p className="mt-8 flex gap-3 font-serif text-xl leading-snug text-white/85 italic">
                  <TrendingUp className="mt-1 size-5 shrink-0 text-gold" />
                  Em qualquer regime, a decisão passa a ser tomada com base em simulação, e não por repetição do ano
                  anterior.
                </p>
              </Reveal>

              <Reveal delay={0.35} className="mt-10">
                <LinkButton
                  href={whatsappLink(specialistMsg)}
                  target="_blank"
                  rel="noopener"
                  icon={<WhatsAppIcon className="size-4" />}
                >
                  Quero conversar com um especialista
                </LinkButton>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <ScenarioChart />
            </Reveal>
          </div>
        </section>

        {/* BÔNUS LUCRO REAL */}
        <section className="relative py-24 md:py-32">
          <div className="container-lp">
            <Reveal>
              <div
                className={`relative overflow-hidden rounded-[2.5rem] border p-8 sm:p-12 md:p-16 ${
                  regime === 'Lucro Real' ? 'border-gold/60' : 'border-gold/25'
                } bg-[radial-gradient(ellipse_at_top_right,rgb(197_161_85/0.25),transparent_55%),linear-gradient(180deg,#22211f,#151413)]`}
              >
                <LogoMark stroke className="pointer-events-none absolute -right-24 -bottom-28 w-[26rem] opacity-15" />
                <div className="relative grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14">
                  <motion.div
                    initial={{ rotate: -12, scale: 0.8, opacity: 0 }}
                    whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 160, damping: 14 }}
                    className="grid size-20 place-items-center rounded-3xl bg-gold text-ink shadow-[0_0_60px_rgb(197_161_85/0.45)]"
                  >
                    <Gift className="size-9" strokeWidth={1.8} />
                  </motion.div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="eyebrow">Bônus</p>
                      {regime === 'Lucro Real' && (
                        <span className="rounded-full bg-gold/15 px-3 py-1 text-[0.62rem] font-bold tracking-[0.14em] text-gold-light uppercase ring-1 ring-gold/40">
                          A sua empresa se enquadra
                        </span>
                      )}
                    </div>
                    <SplitHeading
                      text="Bônus para empresas do *Lucro Real*"
                      className="mt-4 text-3xl leading-tight font-extrabold tracking-tight text-white sm:text-5xl"
                    />
                    <p className="mt-6 max-w-3xl text-lg leading-relaxed text-white/65">
                      Atravessar a transição exige caixa. Por isso, a Valore oferece às empresas do Lucro Real um
                      Diagnóstico Preliminar Gratuito de PIS e Cofins, abrangendo as apurações até dezembro de 2026,
                      último período de vigência dessas contribuições.
                    </p>
                    <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/65">
                      A partir dos dados da sua operação, identificamos créditos que ainda podem ser recuperados e
                      compensados com os tributos federais, inclusive com a CBS.
                    </p>
                    <div className="mt-10">
                      <LinkButton
                        href={whatsappLink(diagnosisMsg)}
                        target="_blank"
                        rel="noopener"
                        icon={<ArrowRight className="size-4" />}
                      >
                        Solicitar o meu diagnóstico gratuito
                      </LinkButton>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />

      {/* WhatsApp flutuante */}
      <motion.a
        href={whatsappLink(specialistMsg)}
        target="_blank"
        rel="noopener"
        aria-label="Conversar com a Valore pelo WhatsApp"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 1.6 }}
        whileHover={{ scale: 1.08 }}
        className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-gold text-ink shadow-[0_10px_40px_-6px_rgb(197_161_85/0.7)]"
      >
        <WhatsAppIcon className="size-7" />
      </motion.a>
    </MotionConfig>
  )
}
