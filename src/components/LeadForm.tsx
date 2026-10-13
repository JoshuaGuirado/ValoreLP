import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, ChevronDown, LoaderCircle, Lock } from 'lucide-react'
import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { consentText } from '../config'
import { maskPhone, regimes, submitLead, validateLead, type LeadErrors, type LeadInput } from '../lib/lead'
import { Button } from './Button'

const empty: LeadInput = { nome: '', empresa: '', regime: '', email: '', whatsapp: '', consentimento: false }

function Field({
  label,
  error,
  children,
  id,
}: {
  label: string
  error?: string
  children: ReactNode
  id: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.68rem] font-semibold tracking-[0.18em] text-white/55 uppercase">
        {label}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p
            id={`${id}-err`}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-1.5 text-xs text-[#f0a48a]"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border bg-white/[0.04] px-4 py-3.5 text-[0.95rem] text-white placeholder:text-white/25 outline-none transition duration-300 focus:border-gold focus:bg-white/[0.07] focus:shadow-[0_0_0_4px_rgb(197_161_85/0.15)]'

export function LeadForm({ id = 'formulario' }: { id?: string }) {
  const uid = useId()
  const [values, setValues] = useState<LeadInput>(empty)
  const [errors, setErrors] = useState<LeadErrors>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  const set = (key: keyof LeadInput) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value =
      key === 'consentimento'
        ? (e.target as HTMLInputElement).checked
        : key === 'whatsapp'
          ? maskPhone(e.target.value)
          : e.target.value
    setValues((v) => ({ ...v, [key]: value }))
    if (errors[key]) setErrors((er) => ({ ...er, [key]: undefined }))
  }

  const border = (key: keyof LeadInput) => (errors[key] ? 'border-[#f0a48a]/70' : 'border-white/10')
  const aria = (key: keyof LeadInput) => ({
    'aria-invalid': !!errors[key],
    'aria-describedby': errors[key] ? `${uid}-${key}-err` : undefined,
  })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validateLead(values)
    setErrors(found)
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0]
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    setStatus('sending')
    try {
      await submitLead(values)
      setStatus('done')
      setTimeout(() => window.location.assign('/obrigado/'), 1100)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div id={id} className="relative scroll-mt-28">
      {/* borda dourada animada */}
      <div aria-hidden="true" className="absolute -inset-px overflow-hidden rounded-[1.75rem]">
        <div className="absolute top-1/2 left-1/2 aspect-square w-[180%] -translate-x-1/2 -translate-y-1/2 animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,transparent_250deg,#c5a155_300deg,#f0dca4_330deg,transparent_360deg)]" />
      </div>
      <div aria-hidden="true" className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gold/10 blur-3xl" />

      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(160deg,rgb(42_41_39/0.97),rgb(18_17_16/0.98))] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <AnimatePresence mode="wait">
          {status === 'done' ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-[28rem] flex-col items-center justify-center text-center"
              role="status"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                className="grid size-20 place-items-center rounded-full bg-gold text-ink shadow-[0_0_60px_rgb(197_161_85/0.6)]"
              >
                <Check className="size-10" strokeWidth={3} />
              </motion.div>
              <p className="mt-6 text-lg font-semibold text-white">Recebemos os seus dados.</p>
              <p className="mt-2 text-sm text-white/60">Liberando o seu guia…</p>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <Field label="Nome" id={`${uid}-nome`} error={errors.nome}>
                <input
                  id={`${uid}-nome`}
                  name="nome"
                  autoComplete="name"
                  placeholder="Seu nome completo"
                  value={values.nome}
                  onChange={set('nome')}
                  className={`${inputCls} ${border('nome')}`}
                  {...aria('nome')}
                />
              </Field>
              <Field label="Empresa" id={`${uid}-empresa`} error={errors.empresa}>
                <input
                  id={`${uid}-empresa`}
                  name="empresa"
                  autoComplete="organization"
                  placeholder="Nome da empresa"
                  value={values.empresa}
                  onChange={set('empresa')}
                  className={`${inputCls} ${border('empresa')}`}
                  {...aria('empresa')}
                />
              </Field>
              <Field label="Regime tributário" id={`${uid}-regime`} error={errors.regime}>
                <div className="relative">
                  <select
                    id={`${uid}-regime`}
                    name="regime"
                    value={values.regime}
                    onChange={set('regime')}
                    className={`${inputCls} ${border('regime')} cursor-pointer appearance-none pr-11 ${values.regime ? '' : 'text-white/35'}`}
                    {...aria('regime')}
                  >
                    <option value="" disabled>
                      Selecione
                    </option>
                    {regimes.map((r) => (
                      <option key={r} value={r} className="bg-ink-2 text-white">
                        {r}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-gold" />
                </div>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="E-mail" id={`${uid}-email`} error={errors.email}>
                  <input
                    id={`${uid}-email`}
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    value={values.email}
                    onChange={set('email')}
                    className={`${inputCls} ${border('email')}`}
                    {...aria('email')}
                  />
                </Field>
                <Field label="WhatsApp" id={`${uid}-whatsapp`} error={errors.whatsapp}>
                  <input
                    id={`${uid}-whatsapp`}
                    name="whatsapp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="(44) 99999-9999"
                    value={values.whatsapp}
                    onChange={set('whatsapp')}
                    className={`${inputCls} ${border('whatsapp')}`}
                    {...aria('whatsapp')}
                  />
                </Field>
              </div>

              <div className="pt-1">
                <label htmlFor={`${uid}-consentimento`} className="group flex cursor-pointer items-start gap-3">
                  <span className="relative mt-0.5 shrink-0">
                    <input
                      id={`${uid}-consentimento`}
                      name="consentimento"
                      type="checkbox"
                      checked={values.consentimento}
                      onChange={set('consentimento')}
                      className="peer sr-only"
                      {...aria('consentimento')}
                    />
                    <span
                      className={`grid size-5 place-items-center rounded-md border transition duration-200 peer-checked:border-gold peer-checked:bg-gold peer-focus-visible:ring-2 peer-focus-visible:ring-gold/60 ${
                        errors.consentimento ? 'border-[#f0a48a]' : 'border-white/30 group-hover:border-gold/70'
                      }`}
                    >
                      <Check className={`size-3.5 text-ink transition ${values.consentimento ? 'scale-100' : 'scale-0'}`} strokeWidth={3.5} />
                    </span>
                  </span>
                  <span className="text-[0.78rem] leading-relaxed text-white/60">
                    {consentText.replace('Política de Privacidade', '')}
                    <a
                      href="/politica-de-privacidade/"
                      target="_blank"
                      rel="noopener"
                      className="text-gold-light underline decoration-gold/40 underline-offset-2 hover:decoration-gold"
                    >
                      Política de Privacidade
                    </a>
                    .
                  </span>
                </label>
                <AnimatePresence initial={false}>
                  {errors.consentimento && (
                    <motion.p
                      id={`${uid}-consentimento-err`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-1.5 pl-8 text-xs text-[#f0a48a]"
                    >
                      {errors.consentimento}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={status === 'sending'}
                  block
                  className="w-full py-[1.1rem]"
                  icon={status === 'sending' ? <LoaderCircle className="size-4 animate-spin" /> : <ArrowRight className="size-4" />}
                >
                  Quero receber o guia gratuito
                </Button>
              </div>

              {status === 'error' && (
                <p role="alert" className="text-center text-xs text-[#f0a48a]">
                  Não foi possível enviar agora. Verifique a sua conexão e tente novamente.
                </p>
              )}

              <p className="flex items-center justify-center gap-2 text-center text-[0.75rem] text-white/50">
                <Lock className="size-3.5 text-gold" />
                Enviamos o material para o seu e-mail e para o seu WhatsApp
              </p>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
