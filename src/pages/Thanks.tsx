import { motion, MotionConfig } from 'framer-motion'
import { Check, Download } from 'lucide-react'
import { useMemo } from 'react'
import { LinkButton } from '../components/Button'
import { WhatsAppIcon } from '../components/icons'
import { Footer, Header } from '../components/Layout'
import { ease, Reveal, Rule } from '../components/motion'
import { config } from '../config'
import { readStoredLead } from '../lib/lead'
import { whatsappLink } from '../lib/whatsapp'

/** Cenários da Modulação — conteúdo da proposta comercial da Valore. */
const scenarioCols = ['Cenário base', 'Cenário conservador', 'Cenário favorável']
const scenarioRows: [string, string[]][] = [
  ['Alíquota de referência', ['Conforme a estimativa oficial vigente.', 'Superior à estimativa oficial.', 'Enquadramento em regime de alíquota reduzida, quando cabível.']],
  ['Repasse de preços', ['Repasse parcial ao mercado.', 'Repasse limitado pela concorrência.', 'Repasse integral.']],
  ['Créditos da cadeia', ['Conforme a composição atual de fornecedores.', 'Créditos reduzidos por fornecedores optantes pelo Simples Nacional.', 'Créditos amplos, com fornecedores no regime regular.']],
  ['Capital de giro', ['Impacto moderado do split payment.', 'Impacto relevante do split payment.', 'Impacto mínimo, com prazos ajustados.']],
]
const colHead = ['bg-gold text-graphite-2', 'bg-steel text-white', 'bg-gold-deep text-white']

function ScenarioTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[40rem] border-separate border-spacing-1.5 text-left text-sm">
        <caption className="sr-only">Variáveis consideradas em cada cenário da modulação</caption>
        <thead>
          <tr>
            <td />
            {scenarioCols.map((c, i) => (
              <th key={c} scope="col" className={`rounded-[3px] px-4 py-3 text-center text-[0.72rem] font-semibold tracking-[0.08em] uppercase ${colHead[i]}`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scenarioRows.map(([label, cells], r) => (
            <motion.tr
              key={label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease, delay: r * 0.1 }}
            >
              <th scope="row" className="w-44 rounded-[3px] bg-paper-2 px-4 py-4 align-middle font-semibold text-graphite">
                {label}
              </th>
              {cells.map((c, i) => (
                <td key={i} className="rounded-[3px] bg-white px-4 py-4 align-middle leading-snug text-graphite/75">
                  {c}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
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

  const regimeBlocks = [
    {
      title: 'Simples Nacional ou Lucro Presumido',
      match: regime === 'Simples Nacional' || regime === 'Lucro Presumido',
      text: 'Se a sua empresa está no Simples Nacional ou no Lucro Presumido, a simulação responde se o regime atual continua sendo o melhor em 2027 e quanto custa cada opção.',
    },
    {
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
        <section className="on-dark relative isolate overflow-hidden bg-graphite-2 pt-36 pb-24 text-white md:pt-44 md:pb-32">
          <motion.img
            src="/img/sala-reuniao.webp"
            alt=""
            aria-hidden="true"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1.02, opacity: 1 }}
            transition={{ duration: 2, ease }}
            className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_35%]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-graphite-2/85" />
          <div className="container-lp max-w-4xl text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
              className="mx-auto grid size-14 place-items-center rounded-full border border-gold text-gold"
            >
              <Check className="size-6" strokeWidth={2} />
            </motion.span>
            {firstName && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} className="kicker mt-8">
                Tudo certo, {firstName}
              </motion.p>
            )}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease, delay: 0.45 }}
              className="heading mt-6 text-5xl sm:text-6xl"
            >
              O seu guia está liberado.
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: 0.8 }}
              className="mt-10 flex flex-col items-center gap-5"
            >
              {config.guideUrl && (
                <LinkButton href={config.guideUrl} target="_blank" rel="noopener" icon={<Download className="size-4" strokeWidth={1.75} />}>
                  Baixar o guia agora
                </LinkButton>
              )}
              <p className="text-sm text-white/65">Enviamos o material para o seu e-mail e para o seu WhatsApp</p>
            </motion.div>
          </div>
        </section>

        {/* PERGUNTA */}
        <section className="bg-white py-24 md:py-28">
          <div className="container-lp grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-24">
            <Reveal>
              <p className="kicker">Agora, a pergunta mais importante</p>
              <h2 className="heading mt-6 text-4xl text-graphite sm:text-[2.9rem]">
                Quanto a reforma representa nos números da sua empresa?
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="leading-relaxed text-graphite/75 sm:text-lg">
                O guia mostra o que muda. O efeito sobre a sua carga, a sua margem e o seu caixa depende de dados que só
                a sua operação tem.
              </p>
            </Reveal>
          </div>
        </section>

        {/* MODULAÇÃO DE CENÁRIOS */}
        <section className="py-24 md:py-32">
          <div className="container-lp">
            <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
              <div>
                <Reveal>
                  <p className="kicker">Próximo passo</p>
                  <h2 className="heading mt-6 text-4xl text-graphite sm:text-[2.75rem]">
                    Modulação de Cenários para a Reforma Tributária
                  </h2>
                  <p className="mt-6 leading-relaxed text-graphite/75 sm:text-lg">
                    A Valore projeta, com os números da sua empresa, o resultado de cada ano da transição e compara as
                    alternativas lado a lado.
                  </p>
                </Reveal>
                <Reveal delay={0.15} className="mt-10">
                  <LinkButton href={whatsappLink(specialistMsg)} target="_blank" rel="noopener" icon={<WhatsAppIcon className="size-4" />}>
                    Quero conversar com um especialista
                  </LinkButton>
                </Reveal>
              </div>

              <div>
                {regimeBlocks.map((b, i) => (
                  <div key={b.title}>
                    <Rule className="bg-graphite/80" delay={i * 0.1} />
                    <Reveal delay={0.1 + i * 0.1} className="py-8">
                      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                        <h3 className="font-serif text-2xl font-semibold text-graphite">{b.title}</h3>
                        {b.match && <span className="text-[0.68rem] font-semibold tracking-[0.16em] text-gold-ink uppercase">O seu regime</span>}
                      </div>
                      <p className="mt-3 leading-relaxed text-graphite/75">{b.text}</p>
                    </Reveal>
                  </div>
                ))}
                <Rule className="bg-graphite/80" />
                <Reveal delay={0.2}>
                  <p className="mt-8 font-serif text-xl leading-snug text-graphite italic">
                    Em qualquer regime, a decisão passa a ser tomada com base em simulação, e não por repetição do ano
                    anterior.
                  </p>
                </Reveal>
              </div>
            </div>

            <Reveal className="mt-20">
              <ScenarioTable />
            </Reveal>
          </div>
        </section>

        {/* BÔNUS LUCRO REAL */}
        <section className="on-dark relative isolate overflow-hidden bg-graphite text-white">
          <div className="container-lp grid items-end gap-12 pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-24">
            <div className="pb-20 lg:pb-24">
              <Reveal>
                <p className="kicker">Bônus{regime === 'Lucro Real' ? ' · a sua empresa se enquadra' : ''}</p>
                <h2 className="heading mt-6 text-4xl sm:text-[2.75rem]">Bônus para empresas do Lucro Real</h2>
                <p className="mt-6 leading-relaxed text-white/75 sm:text-lg">
                  Atravessar a transição exige caixa. Por isso, a Valore oferece às empresas do Lucro Real um
                  Diagnóstico Preliminar Gratuito de PIS e Cofins, abrangendo as apurações até dezembro de 2026, último
                  período de vigência dessas contribuições.
                </p>
                <p className="mt-4 leading-relaxed text-white/75 sm:text-lg">
                  A partir dos dados da sua operação, identificamos créditos que ainda podem ser recuperados e
                  compensados com os tributos federais, inclusive com a CBS.
                </p>
              </Reveal>
              <Reveal delay={0.15} className="mt-10">
                <LinkButton href={whatsappLink(diagnosisMsg)} target="_blank" rel="noopener">
                  Solicitar o meu diagnóstico gratuito
                </LinkButton>
              </Reveal>
            </div>

            {/* sócias recortadas, como na página de apresentação das propostas */}
            <div className="relative mx-auto flex w-full max-w-md items-end justify-center self-end">
              <img src="/img/v-dourado.webp" alt="" aria-hidden="true" className="absolute top-0 left-1/2 w-[85%] -translate-x-1/2 opacity-25" />
              <motion.img
                src="/img/katrin-recorte.webp"
                alt="Katrin Arrais"
                loading="lazy"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease }}
                className="relative z-0 -mr-10 w-1/2"
              />
              <motion.img
                src="/img/virginia-recorte.webp"
                alt="Virgínia D. Flora"
                loading="lazy"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease, delay: 0.15 }}
                className="relative z-10 w-1/2"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* WhatsApp fixo */}
      <a
        href={whatsappLink(specialistMsg)}
        target="_blank"
        rel="noopener"
        aria-label="Conversar com a Valore pelo WhatsApp"
        className="fixed right-5 bottom-5 z-40 grid size-13 place-items-center rounded-full bg-graphite text-gold shadow-lg transition-colors hover:bg-gold hover:text-graphite-2"
      >
        <WhatsAppIcon className="size-6" />
      </a>
    </MotionConfig>
  )
}
