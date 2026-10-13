/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WHATSAPP?: string
  readonly VITE_LEAD_ENDPOINT?: string
  readonly VITE_GUIDE_URL?: string
  readonly VITE_CNPJ?: string
  readonly VITE_EMAIL_PRIVACIDADE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
