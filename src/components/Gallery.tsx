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
          <motion.p
            style={{ x: titleX }}
            className="pointer-events-none mb-10 font-serif text-[9vw] leading-none font-semibold whitespace-nowrap text-white/[0.07]"
            aria-hidden="true"
          >
            {title} · {title}
          </motion.p>
          <motion.div ref={rowRef} style={{ x }} className="flex w-max gap-8 px-[6vw]">
            {images.map((im, i) => (
              <figure
                key={im.src}
                className={`group relative shrink-0 overflow-hidden ${i % 2 ? 'mt-24 h-[46vh] w-[34vw]' : 'h-[56vh] w-[30vw]'}`}
              >
                <img src={im.src} alt={im.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.06]" />
                <div className="absolute inset-0 bg-graphite-2/10 transition-colors duration-700 group-hover:bg-transparent" />
              </figure>
            ))}
          </motion.div>
        </div>
      </section>

      {/* celular: rolagem horizontal com encaixe */}
      <section className="overflow-hidden bg-graphite-2 py-16 md:hidden">
        <p className="mb-8 px-5 font-serif text-3xl font-semibold text-white">{title}</p>
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {images.map((im, i) => (
            <motion.img
              key={im.src}
              src={im.src}
              alt={im.alt}
              loading="lazy"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: Math.min(i, 3) * 0.08 }}
              className="h-80 w-[78vw] max-w-xs shrink-0 snap-center object-cover"
            />
          ))}
        </div>
        <p className="mt-2 px-5 text-xs text-white/40">Deslize para ver mais →</p>
      </section>
    </>
  )
}
