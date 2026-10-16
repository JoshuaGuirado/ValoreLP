import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { useLayoutEffect, useRef, useState } from 'react'

const images = [
  { src: '/img/kit-presente.webp', alt: 'Kit Valore em preto e dourado' },
  { src: '/img/aperto-de-maos.webp', alt: 'Aperto de mãos sobre a mesa de reunião' },
  { src: '/img/xicaras.webp', alt: 'Xícaras e cartão de visita Valore' },
  { src: '/img/contrato.webp', alt: 'Assinatura de contrato com balança da justiça ao fundo' },
  { src: '/img/papelaria.webp', alt: 'Papelaria Valore' },
  { src: '/img/canecas.webp', alt: 'Canecas Valore em dourado e grafite' },
  { src: '/img/livros.webp', alt: 'Livros de Direito' },
]

/**
 * Galeria que anda na horizontal enquanto a página rola na vertical (desktop).
 * No celular vira uma faixa que se arrasta com o dedo.
 */
export function Gallery({ title }: { title: string }) {
  const ref = useRef<HTMLElement>(null)
  const rowRef = useRef<HTMLDivElement>(null)
  // distância exata para a última foto parar encostada na borda direita
  const [travel, setTravel] = useState(0)
  useLayoutEffect(() => {
    const measure = () => {
      const row = rowRef.current
      if (row) setTravel(Math.max(0, row.scrollWidth - window.innerWidth))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 })
  const x = useTransform(smooth, [0, 1], [0, -travel])
  const titleX = useTransform(smooth, [0, 1], ['0%', '-20%'])

  return (
    <>
      {/* desktop: rolagem horizontal presa */}
      <section ref={ref} className="relative hidden h-[240vh] bg-graphite-2 md:block">
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          {/* letreiro: corre sozinho e ainda acompanha a rolagem */}
          <motion.div style={{ x: titleX }} aria-hidden="true" className="pointer-events-none mb-10 overflow-visible">
            <motion.p
              animate={{ x: ['0%', '-50%'] }}
              transition={{ duration: 40, ease: 'linear', repeat: Infinity }}
              className="w-max font-serif text-[9vw] leading-none font-semibold whitespace-nowrap text-white/[0.07]"
            >
              {title} · {title} · {title} · {title} ·&nbsp;
            </motion.p>
          </motion.div>
          <motion.div ref={rowRef} style={{ x }} className="flex w-max gap-8 px-[6vw]">
            {images.map((im, i) => (
              <figure
                key={im.src}
                className={`group relative shrink-0 border border-gold/50 p-2 transition-colors duration-500 hover:border-gold ${i % 2 ? 'mt-24 h-[46vh] w-[34vw]' : 'h-[56vh] w-[30vw]'}`}
              >
                <div className="relative h-full w-full overflow-hidden">
                  <img src={im.src} alt={im.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
                  <div className="absolute inset-0 bg-graphite-2/10 transition-colors duration-700 group-hover:bg-transparent" />
                </div>
              </figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* celular: rolagem horizontal com encaixe */}
      <section className="overflow-hidden bg-graphite-2 py-16 md:hidden">
        <div aria-hidden="true" className="mb-8 overflow-hidden">
          <motion.p
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
            className="w-max font-serif text-3xl font-semibold whitespace-nowrap text-white"
          >
            {title} · {title} · {title} · {title} ·&nbsp;
          </motion.p>
        </div>
        <p className="sr-only">{title}</p>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((im, i) => (
            <motion.div
              key={im.src}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: Math.min(i, 3) * 0.08 }}
              className="w-[78vw] max-w-xs shrink-0 snap-center border border-gold/50 p-1.5"
            >
              <img src={im.src} alt={im.alt} loading="lazy" className="h-80 w-full object-cover" />
            </motion.div>
          ))}
        </div>
        <p className="mt-2 px-5 text-xs text-white/40">Deslize para ver mais →</p>
      </section>
    </>
  )
}
