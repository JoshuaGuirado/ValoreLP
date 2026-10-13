import { config, consentText } from '../config'

export const regimes = ['Simples Nacional', 'Lucro Presumido', 'Lucro Real'] as const
export type Regime = (typeof regimes)[number]

export type LeadInput = {
  nome: string
  empresa: string
  regime: Regime | ''
  email: string
  whatsapp: string
  consentimento: boolean
}

export type LeadErrors = Partial<Record<keyof LeadInput, string>>

const STORAGE_KEY = 'valore-lead'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const onlyDigits = (v: string) => v.replace(/\D/g, '')

/** Máscara (44) 99999-9999 / (44) 3122-0433 */
export function maskPhone(value: string) {
  const d = onlyDigits(value).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function validateLead(v: LeadInput): LeadErrors {
  const e: LeadErrors = {}
  if (v.nome.trim().length < 3) e.nome = 'Informe o seu nome.'
  if (v.empresa.trim().length < 2) e.empresa = 'Informe o nome da empresa.'
  if (!v.regime) e.regime = 'Selecione o regime tributário.'
  if (!EMAIL_RE.test(v.email.trim())) e.email = 'Informe um e-mail válido.'
  const phone = onlyDigits(v.whatsapp)
  if (phone.length < 10 || phone.length > 11) e.whatsapp = 'Informe o WhatsApp com DDD.'
  if (!v.consentimento) e.consentimento = 'Para receber o material, é preciso autorizar o uso dos dados.'
  return e
}

function trackingParams() {
  const params = new URLSearchParams(window.location.search)
  const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']
  return Object.fromEntries(keys.map((k) => [k, params.get(k) ?? '']))
}

/**
 * Envia o lead ao Google Apps Script (planilha + e-mail com o guia).
 * O envio usa `text/plain` para evitar o preflight de CORS do Apps Script.
 */
export async function submitLead(v: LeadInput) {
  const payload = {
    nome: v.nome.trim(),
    empresa: v.empresa.trim(),
    regime: v.regime,
    email: v.email.trim().toLowerCase(),
    whatsapp: `+55${onlyDigits(v.whatsapp)}`,
    consentimento: v.consentimento ? 'Sim' : 'Não',
    consentimento_texto: consentText,
    data: new Date().toISOString(),
    pagina: window.location.href,
    referencia: document.referrer,
    ...trackingParams(),
  }

  if (config.leadEndpoint) {
    await fetch(config.leadEndpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    })
  } else if (import.meta.env.DEV) {
    console.warn('[Valore] VITE_LEAD_ENDPOINT não configurado. Lead não enviado:', payload)
  }

  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ nome: payload.nome, empresa: payload.empresa, regime: payload.regime }),
    )
  } catch {
    /* navegação privada: segue sem personalização */
  }
}

export function readStoredLead(): { nome: string; empresa: string; regime: Regime | '' } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
