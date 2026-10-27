# Valore — Landing page do guia da Reforma Tributária

Landing page de captura da **Valore Soluções Tributárias** para o guia executivo *"Reforma tributária: as seis decisões que a sua empresa precisa tomar agora"*.

| Página | Caminho | Conteúdo |
| --- | --- | --- |
| Captura | `/` | Hero com formulário, o que o guia ensina, cronograma da reforma, prazos com contagem regressiva, sócias, sobre a Valore e CTA final |
| Agradecimento | `/obrigado/` | Guia liberado, Modulação de Cenários e bônus do Lucro Real, com botões para o WhatsApp |
| Política de Privacidade | `/politica-de-privacidade/` | Texto em conformidade com a LGPD |

Stack: React 19, Vite, Tailwind CSS 4 e Framer Motion. O site é estático (HTML, CSS e JS), então pode ser hospedado em Vercel, Netlify, Hostinger, cPanel ou qualquer servidor.

## Rodar localmente

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # gera a pasta dist/ para publicar
npm run preview    # serve a pasta dist/
```

## Configuração

Copie `.env.example` para `.env` e preencha:

| Variável | Para que serve |
| --- | --- |
| `VITE_WHATSAPP` | Número dos botões de WhatsApp (somente dígitos, com 55 e DDD). Padrão: `554498441083` |
| `VITE_LEAD_ENDPOINT` | URL do Google Apps Script que grava os leads na planilha e envia o guia por e-mail |
| `VITE_GUIDE_URL` | Link do PDF do guia no botão "Baixar o guia agora". Padrão: `/guia-reforma-tributaria-valore.pdf`, que já está em `public/` |
| `VITE_CNPJ` / `VITE_EMAIL_PRIVACIDADE` | Dados exibidos na Política de Privacidade |

Depois de alterar o `.env`, rode `npm run build` de novo.

## Para onde vão os leads

Os dados do formulário vão para uma **planilha do Google**, e o lead recebe o guia por **e-mail** automaticamente. O passo a passo (cerca de 10 minutos) está em [`integrations/google-apps-script/README.md`](integrations/google-apps-script/README.md).

A planilha também registra UTMs (`utm_source`, `utm_campaign` etc.), `gclid` e `fbclid`, para saber de qual campanha veio cada lead.

## Estrutura

```
index.html, obrigado/, politica-de-privacidade/   páginas
src/config.ts                                     dados da empresa, WhatsApp, links
src/pages/                                        conteúdo de cada página
src/components/                                   formulário, mockup 3D do guia, cronograma, prazos, sócias...
src/lib/lead.ts                                   validação, máscara e envio do formulário
public/                                           logo (SVG vetorizado), favicon, fotos, imagem de compartilhamento
integrations/google-apps-script/                  script da planilha de leads
```

## Identidade visual

Paleta do manual de marca: dourado `#C5A155`, dourado escuro `#8E7743`, grafite `#3A3937`, cinza `#6A696D` e cinza claro `#CACACA`. Tipografia: Noto Serif nos títulos (alternativa gratuita à Argent CF das propostas) e Montserrat no texto (alternativa à Gotham). Fotos: sala de reunião da capa das propostas, fotos das sócias e imagens do manual de marca. O logotipo foi vetorizado a partir do arquivo original da marca (`public/logo-valore.svg`).
