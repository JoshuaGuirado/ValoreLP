/**
 * Configurações centrais da landing page.
 * Tudo o que muda com frequência (número de WhatsApp, link do guia, destino dos
 * leads) fica aqui ou em variáveis de ambiente (arquivo .env, ver .env.example).
 */

const env = import.meta.env

export const config = {
  empresa: {
    nome: 'Valore Soluções Tributárias',
    razaoSocial: 'Valore Soluções Tributárias Ltda.',
    /** Preencher quando disponível; aparece na Política de Privacidade. */
    cnpj: env.VITE_CNPJ ?? '',
    endereco: 'Avenida Brasil, n. 4312, Sala 1410, CEP 87.013-000, Maringá/PR',
    telefone: '(44) 3122-0433',
    telefoneLink: 'tel:+554431220433',
    site: 'https://valoretribut.com',
    siteLabel: 'valoretribut.com',
    instagram: 'https://www.instagram.com/valore_st/',
    instagramLabel: '@valore_st',
    /** E-mail para titulares de dados (LGPD). Preencher quando disponível. */
    emailPrivacidade: env.VITE_EMAIL_PRIVACIDADE ?? '',
  },

  /** WhatsApp que recebe os contatos dos botões (somente dígitos, com DDI 55). */
  whatsapp: env.VITE_WHATSAPP || '5544998441083',

  /**
   * Endpoint que recebe os leads (Google Apps Script publicado como app da Web,
   * que grava na planilha e envia o guia por e-mail).
   * Ver integrations/google-apps-script/README.md.
   */
  leadEndpoint: env.VITE_LEAD_ENDPOINT ?? '',

  /** Link do PDF do guia (arquivo em public/). Pode ser trocado por VITE_GUIDE_URL. */
  guideUrl: env.VITE_GUIDE_URL || '/guia-reforma-tributaria-valore.pdf',
} as const

export const consentText =
  'Autorizo a Valore Soluções Tributárias a utilizar os meus dados para o envio deste material e de comunicações sobre os seus conteúdos e serviços, conforme a Política de Privacidade'
