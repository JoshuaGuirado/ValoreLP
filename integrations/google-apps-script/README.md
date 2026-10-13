# Leads da landing page → Google Planilhas + e-mail automático

Cada envio do formulário vira uma linha em uma planilha do Google (visível para toda a equipe, com filtros e exportação) e o lead recebe automaticamente um e-mail com o link do guia.

## Instalação (cerca de 10 minutos)

1. Crie uma planilha no Google Drive da Valore, por exemplo **"Leads — Guia Reforma Tributária"**.
2. Na planilha, abra **Extensões → Apps Script**.
3. Apague o conteúdo do arquivo `Código.gs` e cole todo o conteúdo de [`Code.gs`](./Code.gs).
4. No topo do script, preencha o bloco `CONFIG`:
   - `GUIDE_URL`: link público do PDF do guia. No Drive, use **Compartilhar → Qualquer pessoa com o link**.
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

## Limites

- Contas Gmail gratuitas enviam até 100 e-mails por dia pelo Apps Script; contas Google Workspace, até 1.500.
- O envio automático pelo **WhatsApp** exige uma API de WhatsApp (por exemplo, a API oficial do WhatsApp Business ou serviços como Z-API e Evolution API). Quando a Valore escolher o serviço, basta acrescentar a chamada na função `doPost`.
