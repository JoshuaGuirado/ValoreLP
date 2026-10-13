import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/** Divide o texto em palavras; trechos entre *asteriscos* ficam em dourado. */
function splitWords(text: string) {
  const words: { w: string; gold: boolean }[] = []
  text
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .forEach((part) => {
      const gold = part.startsWith('*')
      part
        .replaceAll('*', '')
        .split(' ')
        .filter(Boolean)
        .forEach((w) => words.push({ w, gold }))
    })
  return words
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const on = () => setMobile(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return mobile
}

/** Palavra que acende conforme a rolagem avança. */
function Word({ progress, range, gold, children }: { progress: MotionValue<number>; range: [number, number]; gold: boolean; children: string }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  const y = useTransform(progress, range, ['0.3em', '0em'])
  return (
    <motion.span style={{ opacity, y }} className={`inline-block ${gold ? 'text-gold' : ''}`}>
      {children}
    </motion.span>
  )
}

/**
 * Efeito "moldura": a foto começa pequena, dentro de um quadro com fio dourado,
 * e se expande até ocupar a tela inteira enquanto a página rola. Em seguida, a frase
 * acende palavra por palavra. A seção fica presa (sticky) durante a animação.
 */
function FrameZoomAnimated({ src, text, kicker, mobile }: { src: string; text: string; kicker: string; mobile: boolean }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  // Janela inicial: retrato estreito no celular, quadro centralizado no desktop.
  const startY = mobile ? 22 : 18
  const startX = mobile ? 10 : 30
  const insetY = useTransform(p, [0, 0.5], [startY, 0])
  const insetX = useTransform(p, [0, 0.5], [startX, 0])
  const clipPath = useMotionTemplate`inset(${insetY}% ${insetX}% ${insetY}% ${insetX}%)`

  // Moldura dourada acompanha a janela, com um respiro de 14px, e some ao abrir.
  const frameTop = useMotionTemplate`calc(${insetY}% - 14px)`
  const frameLeft = useMotionTemplate`calc(${insetX}% - 14px)`
  const frameOpacity = useTransform(p, [0, 0.32, 0.44], [1, 1, 0])

  // Foto começa aproximada e "recua" enquanto a janela cresce.
  const scale = useTransform(p, [0, 0.55], [1.35, 1.05])
  const veil = useTransform(p, [0.2, 0.55], [0.1, 0.74])

  // Legendas sobre o fundo claro, antes da abertura.
  const introOpacity = useTransform(p, [0, 0.18], [1, 0])
  const introY = useTransform(p, [0, 0.18], [0, -30])

  // Frase e rodapé da seção, depois da abertura.
  const textOpacity = useTransform(p, [0.42, 0.52], [0, 1])
  const metaOpacity = useTransform(p, [0.85, 0.95], [0, 1])

  const words = splitWords(text)
  const from = 0.5
  const to = 0.88
  const step = (to - from) / words.length

  return (
    <section ref={ref} className="relative h-[240vh] bg-paper md:h-[260vh]">
      <div className="sticky top-0 h-svh overflow-hidden">
        <motion.div style={{ opacity: introOpacity, y: introY }} className="absolute inset-x-0 top-24 md:top-28">
          <div className="container-lp flex items-center justify-between gap-6">
            <p className="kicker">{kicker}</p>
            <p className="text-[0.62rem] font-semibold tracking-[0.22em] text-graphite/45 uppercase">Role para revelar</p>
          </div>
        </motion.div>

        <motion.div
          aria-hidden="true"
          style={{ top: frameTop, bottom: frameTop, left: frameLeft, right: frameLeft, opacity: frameOpacity }}
          className="pointer-events-none absolute border border-gold/70"
        />

        <motion.div style={{ clipPath }} className="absolute inset-0 will-change-[clip-path]">
          <motion.img src={src} alt="" aria-hidden="true" style={{ scale }} className="h-full w-full object-cover blur-[1.5px]" />
          <motion.div style={{ opacity: veil }} className="absolute inset-0 bg-graphite-2" />
        </motion.div>

        <motion.div style={{ opacity: textOpacity }} className="on-dark absolute inset-0 flex items-center">
          <div className="container-lp text-center">
            <h2 aria-label={text.replaceAll('*', '')} className="heading mx-auto max-w-4xl text-3xl text-white sm:text-5xl">
              {words.map(({ w, gold }, i) => {
                const start = from + i * step
                return (
                  <span key={i} aria-hidden="true">
                    <Word progress={p} range={[start, Math.min(start + step * 4, to)]} gold={gold}>
                      {w}
                    </Word>
                    {i < words.length - 1 ? ' ' : ''}
                  </span>
                )
              })}
            </h2>
          </div>
        </motion.div>

        <motion.div style={{ opacity: metaOpacity }} aria-hidden="true" className="absolute inset-x-0 bottom-24 md:bottom-10">
          <div className="container-lp flex items-center justify-between gap-6 text-[0.62rem] font-semibold tracking-[0.22em] text-white/55 uppercase">
            <span>Valore · Soluções Tributárias</span>
            <span className="hidden sm:inline">Maringá · PR</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/** Versão estática para quem prefere menos movimento no sistema. */
function FrameZoomStatic({ src, text }: { src: string; text: string }) {
  return (
    <section className="on-dark relative isolate overflow-hidden py-28 text-white md:py-40">
      <img src={src} alt="" aria-hidden="true" className="absolute inset-0 -z-10 h-full w-full object-cover blur-[1.5px]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-graphite-2/75" />
      <div className="container-lp text-center">
        <h2 className="heading mx-auto max-w-4xl text-3xl sm:text-5xl">
          {splitWords(text).map(({ w, gold }, i) => (
            <span key={i} className={gold ? 'text-gold' : ''}>
              {w}{' '}
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}

export function FrameZoom({ src, text, kicker = 'Nosso propósito' }: { src: string; text: string; kicker?: string }) {
  const reduce = useReducedMotion()
  const mobile = useIsMobile()
  if (reduce) return <FrameZoomStatic src={src} text={text} />
  // `key` remonta o componente ao trocar de layout, para recalcular a janela inicial.
  return <FrameZoomAnimated key={mobile ? 'm' : 'd'} src={src} text={text} kicker={kicker} mobile={mobile} />
}
