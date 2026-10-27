/**
 * Valore — recebimento de leads da landing page.
 *
 * O que este script faz a cada envio do formulário:
 *  1. grava o lead na aba "Leads" da planilha (cria a aba e o cabeçalho se não existirem);
 *  2. envia ao lead um e-mail com o guia em PDF anexado (e um botão para baixar);
 *  3. avisa a equipe da Valore por e-mail.
 *
 * Instalação: ver README.md nesta pasta.
 */

// ===== CONFIGURAÇÃO =====
const CONFIG = {
  SHEET_NAME: 'Leads',
  /**
   * E-mail que aparece como remetente. Deixe vazio para usar a própria conta Google
   * que publicou o script. Se preencher com outro endereço, ele precisa estar
   * cadastrado nessa conta em Gmail → Configurações → Contas → "Enviar e-mail como".
   */
  SENDER_EMAIL: 'katrin@valoretribut.com',
  /** Para onde vão as respostas do lead (vazio = o próprio remetente). */
  REPLY_TO: 'katrin@valoretribut.com',
  /**
   * Endereço do site na Vercel + /guia-reforma-tributaria-valore.pdf
   * O PDF é baixado daqui e vai anexado ao e-mail.
   */
  GUIDE_URL: 'COLE_AQUI_O_LINK_DO_SITE/guia-reforma-tributaria-valore.pdf',
  /** Opcional: ID de uma cópia do PDF no Google Drive. Se preenchido, é usada no lugar do link acima. */
  GUIDE_FILE_ID: '',
  /** Quem recebe o aviso de novo lead (separe vários por vírgula). Deixe vazio para não avisar. */
  NOTIFY_TO: '',
  /** WhatsApp da Valore exibido no e-mail (somente dígitos). */
  WHATSAPP: '5544998441083',
  SENDER_NAME: 'Valore Soluções Tributárias',
}

const HEADERS = [
  'Data', 'Nome', 'Empresa', 'Regime tributário', 'E-mail', 'WhatsApp',
  'Consentimento', 'Texto do consentimento', 'Página', 'Referência',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid',
  'E-mail enviado',
]

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.tryLock(10000)
  try {
    const data = JSON.parse(e.postData.contents)
    const sheet = getSheet_()
    let emailStatus = 'não'

    try {
      sendGuideEmail_(data)
      emailStatus = 'sim'
    } catch (err) {
      emailStatus = 'erro: ' + err
    }

    // Evita que textos iniciados por = + - @ virem fórmulas na planilha
    const cell = (v) => (typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v == null ? '' : v)
    sheet.appendRow([
      new Date(), data.nome, data.empresa, data.regime, data.email, data.whatsapp,
      data.consentimento, data.consentimento_texto, data.pagina, data.referencia,
      data.utm_source, data.utm_medium, data.utm_campaign, data.utm_term, data.utm_content, data.gclid, data.fbclid,
      emailStatus,
    ].map(cell))

    if (CONFIG.NOTIFY_TO) notifyTeam_(data)

    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  } finally {
    lock.releaseLock()
  }
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet()
  let sheet = ss.getSheetByName(CONFIG.SHEET_NAME)
  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#3A3937').setFontColor('#C5A155')
    sheet.setFrozenRows(1)
  }
  return sheet
}

function esc_(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
}

function sendGuideEmail_(d) {
  const firstName = esc_(String(d.nome || '').split(' ')[0])
  const wa = 'https://wa.me/' + CONFIG.WHATSAPP + '?text=' +
    encodeURIComponent('Olá! Baixei o guia da reforma tributária e quero conversar com um especialista sobre a Modulação de Cenários.')

  const html =
    '<div style="background:#121110;padding:40px 0;font-family:Montserrat,Arial,sans-serif">' +
    '<table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#1a1917;border:1px solid #3a3937;border-radius:16px">' +
    '<tr><td style="padding:40px 36px;color:#ece9e3">' +
    '<p style="margin:0;color:#c5a155;font-size:11px;letter-spacing:4px;text-transform:uppercase">Valore Soluções Tributárias</p>' +
    '<h1 style="margin:16px 0 0;font-size:26px;line-height:1.2;color:#fff">O seu guia está liberado.</h1>' +
    '<p style="margin:20px 0 0;font-size:15px;line-height:1.6;color:#bdbab4">Olá, ' + firstName + '! Aqui está o guia executivo ' +
    '<strong style="color:#fff">Reforma tributária: os principais insights de planejamento tributário para empresas</strong>.</p>' +
    '<p style="margin:28px 0"><a href="' + CONFIG.GUIDE_URL + '" style="background:#c5a155;color:#121110;text-decoration:none;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;padding:16px 28px;border-radius:999px;display:inline-block">Baixar o guia</a></p>' +
    '<p style="margin:0;font-size:15px;line-height:1.6;color:#bdbab4">O guia mostra o que muda. O efeito sobre a sua carga, a sua margem e o seu caixa depende de dados que só a sua operação tem.</p>' +
    '<p style="margin:20px 0 0;font-size:15px;line-height:1.6"><a href="' + wa + '" style="color:#e4cc8e">Quero conversar com um especialista →</a></p>' +
    '<hr style="border:none;border-top:1px solid #3a3937;margin:32px 0 20px">' +
    '<p style="margin:0;font-size:12px;line-height:1.6;color:#7d7a75">Avenida Brasil, n. 4312, Sala 1410, Maringá/PR · (44) 3122-0433<br>' +
    'Você recebeu este e-mail porque solicitou o material em nosso site. Para não receber mais comunicações, responda a este e-mail com "descadastrar".</p>' +
    '</td></tr></table></div>'

  const options = {
    htmlBody: html,
    name: CONFIG.SENDER_NAME,
    attachments: guideAttachment_(),
  }
  sendMail_(d.email, 'O seu guia da reforma tributária está liberado', options)
}

/** PDF do guia anexado (vazio se GUIDE_FILE_ID não estiver configurado). */
function guideAttachment_() {
  let blob
  if (CONFIG.GUIDE_FILE_ID) {
    blob = DriveApp.getFileById(CONFIG.GUIDE_FILE_ID).getBlob()
  } else if (/^https?:\/\//.test(CONFIG.GUIDE_URL)) {
    blob = UrlFetchApp.fetch(CONFIG.GUIDE_URL).getBlob()
  } else {
    return []
  }
  blob.setName('Guia Reforma Tributária - Valore.pdf')
  return [blob]
}

/**
 * Envia pelo Gmail. Com SENDER_EMAIL preenchido, usa esse endereço como remetente
 * (precisa ser um "Enviar e-mail como" da conta que publicou o script).
 */
function sendMail_(to, subject, options) {
  const opts = Object.assign({}, options)
  if (CONFIG.REPLY_TO) opts.replyTo = CONFIG.REPLY_TO
  const own = Session.getEffectiveUser().getEmail()
  if (CONFIG.SENDER_EMAIL && CONFIG.SENDER_EMAIL.toLowerCase() !== String(own).toLowerCase()) {
    const aliases = GmailApp.getAliases().map(function (a) { return a.toLowerCase() })
    if (aliases.indexOf(CONFIG.SENDER_EMAIL.toLowerCase()) === -1) {
      throw new Error('O endereço ' + CONFIG.SENDER_EMAIL + ' não está em "Enviar e-mail como" desta conta Google.')
    }
    opts.from = CONFIG.SENDER_EMAIL
  }
  GmailApp.sendEmail(to, subject, 'Abra este e-mail em um leitor compatível com HTML.', opts)
}

function notifyTeam_(d) {
  sendMail_(CONFIG.NOTIFY_TO, 'Novo lead: ' + d.nome + ' — ' + d.empresa + ' (' + d.regime + ')', {
    subject: 'Novo lead: ' + d.nome + ' — ' + d.empresa + ' (' + d.regime + ')',
    htmlBody:
      '<p><strong>Nome:</strong> ' + esc_(d.nome) + '<br><strong>Empresa:</strong> ' + esc_(d.empresa) +
      '<br><strong>Regime:</strong> ' + esc_(d.regime) + '<br><strong>E-mail:</strong> ' + esc_(d.email) +
      '<br><strong>WhatsApp:</strong> <a href="https://wa.me/' + String(d.whatsapp).replace(/\D/g, '') + '">' + esc_(d.whatsapp) + '</a>' +
      '<br><strong>Origem:</strong> ' + esc_(d.utm_source || 'direto') + ' / ' + esc_(d.utm_campaign || '-') + '</p>',
    name: 'Landing page Valore',
  })
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON)
}

/** Rode uma vez pelo editor para autorizar o envio de e-mails e testar a gravação. */
function teste() {
  doPost({ postData: { contents: JSON.stringify({
    nome: 'Teste Valore', empresa: 'Empresa Teste', regime: 'Lucro Real', email: Session.getActiveUser().getEmail(),
    whatsapp: '+5544999999999', consentimento: 'Sim', consentimento_texto: 'teste', pagina: 'teste', referencia: '',
  }) } })
}
