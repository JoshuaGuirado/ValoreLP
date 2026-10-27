# Leads da landing page → Google Planilhas + e-mail automático

Cada envio do formulário vira uma linha em uma planilha do Google (visível para toda a equipe, com filtros e exportação) e o lead recebe automaticamente um e-mail com o guia em PDF anexado.

## Instalação (cerca de 10 minutos)

> **Qual e-mail envia o guia?** O e-mail sai da conta Google que fizer os passos abaixo. O jeito mais simples de enviar pelo e-mail da Valore é **fazer a instalação logada na conta Google desse e-mail**. Se precisar usar outro endereço, veja "Trocar o e-mail remetente" no fim desta página.

1. Crie uma planilha no Google Drive da Valore, por exemplo **"Leads — Guia Reforma Tributária"**.
2. Na planilha, abra **Extensões → Apps Script**.
3. Apague o conteúdo do arquivo `Código.gs` e cole todo o conteúdo de [`Code.gs`](./Code.gs).
4. No topo do script, preencha o bloco `CONFIG`:
   - `GUIDE_FILE_ID`: envie o PDF do guia (`public/guia-reforma-tributaria-valore.pdf`) para o Google Drive e copie o ID do link (o trecho entre `/d/` e `/view`). É ele que vai anexado ao e-mail.
   - `GUIDE_URL`: link público do PDF, usado no botão "Baixar o guia". Pode ser o endereço do site depois de publicado (`https://seudominio.com.br/guia-reforma-tributaria-valore.pdf`) ou o link do Drive com **Compartilhar → Qualquer pessoa com o link**.
   - `SENDER_EMAIL` e `REPLY_TO`: veja "Trocar o e-mail remetente" abaixo.
   - `NOTIFY_TO`: e-mails da equipe que devem ser avisados a cada novo lead.
   - `WHATSAPP`: número da Valore (somente dígitos, com 55 e DDD).
5. Selecione a função `teste` e clique em **Executar**. Autorize as permissões. Uma linha de teste deve aparecer na aba **Leads** e você deve receber o e-mail.
6. Clique em **Implantar → Nova implantação**:
   - Tipo: **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
7. Copie a **URL do app da Web** (termina em `/exec`).
8. No projeto da landing page, crie o arquivo `.env` (copie de `.env.example`) e cole a URL em `VITE_LEAD_ENDPOINT`. Gere o build de novo (`npm run build`) e publique.

> Sempre que alterar o script, faça **Implantar → Gerenciar implantações → Editar → Nova versão** para que a mudança entre no ar.

## Trocar o e-mail remetente

O script já vem configurado para enviar como **katrin@valoretribut.com** (`SENDER_EMAIL`), com as respostas indo para o mesmo endereço (`REPLY_TO`).

O Google só deixa o script enviar como a própria conta que o publicou ou como um endereço já cadastrado nela. Há dois caminhos:

1. **Mais simples:** faça a instalação inteira (passos 1 a 8) logado na conta Google do e-mail que deve enviar o guia, e deixe `SENDER_EMAIL` vazio.
2. **Outro endereço na mesma conta:** no Gmail da conta que publicou o script, vá em **Configurações → Ver todas as configurações → Contas e importação → Enviar e-mail como → Adicionar outro endereço de e-mail** e confirme o endereço. Depois preencha `SENDER_EMAIL` com ele e publique uma nova versão do script.

`REPLY_TO` define para onde vão as respostas do lead, caso seja diferente do remetente (por exemplo, o e-mail do comercial).

## Limites

- Contas Gmail gratuitas enviam até 100 e-mails por dia pelo Apps Script; contas Google Workspace, até 1.500.
- O envio automático pelo **WhatsApp** exige uma API de WhatsApp (por exemplo, a API oficial do WhatsApp Business ou serviços como Z-API e Evolution API). Quando a Valore escolher o serviço, basta acrescentar a chamada na função `doPost`.
