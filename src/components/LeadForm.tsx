import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, LoaderCircle } from 'lucide-react'
import { useId, useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react'
import { consentText } from '../config'
import { maskPhone, regimes, submitLead, validateLead, type LeadErrors, type LeadInput } from '../lib/lead'
import { Button } from './Button'

const empty: LeadInput = { nome: '', empresa: '', regime: '', email: '', whatsapp: '', consentimento: false }
const ERR = 'text-[#a8442f]'

function Field({ label, error, children, id }: { label: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[0.7rem] font-semibold tracking-[0.12em] text-graphite/70 uppercase">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className={`mt-1.5 text-xs ${ERR}`}>
          {error}
        </p>
      )}
    </div>
  )
}

const inputCls =
  'w-full rounded-[3px] border bg-white px-4 py-3 text-[0.95rem] text-graphite placeholder:text-graphite/35 outline-none transition-colors duration-200 focus:border-gold-deep'

/** Formulário de captura, no padrão das propostas: fundo branco, campos retos, botão dourado. */
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

  const border = (key: keyof LeadInput) => (errors[key] ? 'border-[#a8442f]' : 'border-line')
  const aria = (key: keyof LeadInput) => ({
    'aria-invalid': !!errors[key],
    'aria-describedby': errors[key] ? `${uid}-${key}-err` : undefined,
  })

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validateLead(values)
    setErrors(found)
    const first = Object.keys(found)[0]
    if (first) {
      document.getElementById(`${uid}-${first}`)?.focus()
      return
    }
    setStatus('sending')
    try {
      await submitLead(values)
      setStatus('done')
      setTimeout(() => window.location.assign('/obrigado/'), 900)
    } catch {
      setStatus('error')
    }
  }

  return (
    <div id={id} className="scroll-mt-28 bg-white p-6 shadow-[0_30px_60px_-30px_rgb(44_43_41/0.35)] sm:p-9">
      <AnimatePresence mode="wait">
        {status === 'done' ? (
          <motion.div
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex min-h-[26rem] flex-col items-center justify-center text-center"
            role="status"
          >
            <span className="grid size-14 place-items-center rounded-full border border-gold text-gold-deep">
              <Check className="size-6" strokeWidth={2} />
            </span>
            <p className="heading mt-6 text-2xl text-graphite">Recebemos os seus dados.</p>
            <p className="mt-2 text-sm text-graphite/60">Liberando o seu guia…</p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={onSubmit} noValidate exit={{ opacity: 0 }} className="space-y-4">
            <div className="mb-6 border-b border-line pb-5">
              <p className="heading text-[1.35rem] text-graphite">Receba o guia gratuito</p>
            </div>

            <Field label="Nome" id={`${uid}-nome`} error={errors.nome}>
              <input id={`${uid}-nome`} name="nome" autoComplete="name" value={values.nome} onChange={set('nome')} className={`${inputCls} ${border('nome')}`} {...aria('nome')} />
            </Field>
            <Field label="Empresa" id={`${uid}-empresa`} error={errors.empresa}>
              <input id={`${uid}-empresa`} name="empresa" autoComplete="organization" value={values.empresa} onChange={set('empresa')} className={`${inputCls} ${border('empresa')}`} {...aria('empresa')} />
            </Field>
            <Field label="Regime tributário" id={`${uid}-regime`} error={errors.regime}>
              <div className="relative">
                <select
                  id={`${uid}-regime`}
                  name="regime"
                  value={values.regime}
                  onChange={set('regime')}
                  className={`${inputCls} ${border('regime')} cursor-pointer appearance-none pr-11 ${values.regime ? '' : 'text-graphite/45'}`}
                  {...aria('regime')}
                >
                  <option value="" disabled>
                    Selecione
                  </option>
                  {regimes.map((r) => (
                    <option key={r} value={r} className="text-graphite">
                      {r}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-graphite/50" />
              </div>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="E-mail" id={`${uid}-email`} error={errors.email}>
                <input id={`${uid}-email`} name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={set('email')} className={`${inputCls} ${border('email')}`} {...aria('email')} />
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

            <div className="pt-2">
              <label htmlFor={`${uid}-consentimento`} className="flex cursor-pointer items-start gap-3">
                <input
                  id={`${uid}-consentimento`}
                  name="consentimento"
                  type="checkbox"
                  checked={values.consentimento}
                  onChange={set('consentimento')}
                  className={`mt-0.5 size-4 shrink-0 cursor-pointer accent-[#8e7743] ${errors.consentimento ? 'outline outline-1 outline-[#a8442f]' : ''}`}
                  {...aria('consentimento')}
                />
                <span className="text-[0.78rem] leading-relaxed text-graphite/70">
                  {consentText.replace('Política de Privacidade', '')}
                  <a
                    href="/politica-de-privacidade/"
                    target="_blank"
                    rel="noopener"
                    className="font-medium text-gold-ink underline underline-offset-2 hover:text-graphite"
                  >
                    Política de Privacidade
                  </a>
                  .
                </span>
              </label>
              {errors.consentimento && (
                <p id={`${uid}-consentimento-err`} className={`mt-1.5 pl-7 text-xs ${ERR}`}>
                  {errors.consentimento}
                </p>
              )}
            </div>

            <div className="pt-3">
              <Button
                type="submit"
                disabled={status === 'sending'}
                className="w-full"
                icon={status === 'sending' ? <LoaderCircle className="size-4 animate-spin" /> : undefined}
              >
                Quero receber o guia gratuito
              </Button>
            </div>

            {status === 'error' && (
              <p role="alert" className={`text-center text-xs ${ERR}`}>
                Não foi possível enviar agora. Verifique a sua conexão e tente novamente.
              </p>
            )}

            <p className="text-center text-[0.75rem] text-graphite/55">Enviamos o material para o seu e-mail e para o seu WhatsApp</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}
