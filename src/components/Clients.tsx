import { animate, motion, useInView, useMotionValue, useTransform } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Chapter, ease, SectionNumber } from './motion'

/** Principais cases, conforme o site oficial da Valore. */
const cases = [
  { value: 8.65, unit: 'mi', label: 'recuperados', text: 'Indústria agropecuária, com subvenções para investimento (crédito presumido).' },
  { value: 2.7, unit: 'mi', label: 'recuperados', text: 'Exclusão do ICMS-ST da base do PIS e da Cofins, para distribuidora de alimentos.' },
  { value: 765, unit: 'mil', label: 'de economia', text: 'Transação tributária em dívida ativa, para empresa do segmento de logística.' },
  { value: 500, unit: 'mil', label: 'de economia', text: 'Holding com venda de imóvel e ganho de capital de R$ 4 milhões.' },
]

/** Logos dos clientes, conforme o site oficial da Valore. */
const clients = [
  ['asa-implementos', 'ASA Implementos'],
  ['amifar', 'Amifar Deodápolis Amidos'],
  ['agro-solanum', 'Agro Solanum'],
  ['tug-sushi', 'Tug Sushi'],
  ['yza-nautica', 'YZA Náutica & Offroad'],
  ['agropecuaria-vista-alegre', 'Agropecuária Vista Alegre'],
  ['betterbeef', 'Betterbeef'],
  ['ingalimp', 'Ingalimp'],
  ['nayr', 'Nayr'],
  ['pioneira-alimentos', 'Pioneira Alimentos'],
  ['visolux', 'Visolux Sign Company'],
] as const

function Money({ value, unit }: { value: number; unit: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const mv = useMotionValue(0)
  const decimals = (String(value).split('.')[1] ?? '').length
  const text = useTransform(mv, (v) => v.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }))
  useEffect(() => {
    if (!inView) return
    const c = animate(mv, value, { duration: 2, ease: [0.22, 1, 0.36, 1] })
    return () => c.stop()
  }, [inView, mv, value])
  return (
    <span ref={ref} className="whitespace-nowrap">
      <span className="mr-1 text-[0.5em] text-gold">R$</span>
      <motion.span>{text}</motion.span>
      <span className="ml-1.5 text-[0.5em] text-gold">{unit}</span>
    </span>
  )
}

function LogoRow() {
  const row = [...clients, ...clients]
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <motion.ul
        className="flex w-max items-center gap-16 py-2 md:gap-24"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: 45, ease: 'linear', repeat: Infinity }}
      >
        {row.map(([file, name], i) => (
          <li key={i} className="flex h-14 w-36 shrink-0 items-center justify-center md:h-16 md:w-44" aria-hidden={i >= clients.length}>
            <img
              src={`/img/clientes/${file}.webp`}
              alt={i < clients.length ? name : ''}
              loading="lazy"
              className="max-h-full max-w-full object-contain opacity-50 transition-opacity duration-500 hover:opacity-100"
            />
          </li>
        ))}
      </motion.ul>
    </div>
  )
}

export function CasesAndClients() {
  return (
    <section className="on-dark relative overflow-hidden bg-graphite-2 py-24 text-white md:py-32">
      <SectionNumber n="05" dark />
      <div className="relative container-lp">
        <Chapter n="05" label="Principais cases tributários" dark />
        <div className="mt-12 grid gap-px overflow-hidden bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {cases.map((c, i) => (
            <motion.div
              key={c.text}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ duration: 0.9, ease, delay: i * 0.12 }}
              className="bg-graphite-2 p-7 md:p-8"
            >
              <p className="font-serif text-5xl font-semibold tabular-nums md:text-[3.4rem]">
                <Money value={c.value} unit={c.unit} />
              </p>
              <p className="mt-2 text-[0.7rem] font-semibold tracking-[0.18em] text-gold uppercase">{c.label}</p>
              <p className="mt-5 text-sm leading-relaxed text-white/60">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative mt-24">
        <div className="container-lp">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="kicker mb-10">
            Alguns dos nossos clientes
          </motion.p>
        </div>
        <LogoRow />
      </div>
    </section>
  )
}
