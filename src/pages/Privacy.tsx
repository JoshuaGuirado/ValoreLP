import { MotionConfig } from 'framer-motion'
import type { ReactNode } from 'react'
import { Footer, Header } from '../components/Layout'
import { Reveal } from '../components/motion'
import { config } from '../config'

const UPDATED = '13 de outubro de 2026'

function Section({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <Reveal>
      <section id={`s${n}`} className="scroll-mt-28 border-t border-line py-10">
        <h2 className="heading flex items-baseline gap-4 text-xl text-graphite sm:text-2xl">
          <span className="font-serif text-lg text-gold-deep">{String(n).padStart(2, '0')}</span>
          {title}
        </h2>
        <div className="mt-5 space-y-4 text-[0.98rem] leading-relaxed text-graphite/75 [&_li]:pl-1 [&_strong]:text-graphite [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:marker:text-gold-deep">
          {children}
        </div>
      </section>
    </Reveal>
  )
}

export default function PrivacyPage() {
  const { empresa } = config
  const canal = (
    <>
      pelo telefone <a className="text-gold-ink underline underline-offset-2" href={empresa.telefoneLink}>{empresa.telefone}</a>
      {empresa.emailPrivacidade && (
        <>
          {' '}ou pelo e-mail{' '}
          <a className="text-gold-ink underline underline-offset-2" href={`mailto:${empresa.emailPrivacidade}`}>
            {empresa.emailPrivacidade}
          </a>
        </>
      )}
    </>
  )

  return (
    <MotionConfig reducedMotion="user">
      <Header overDark={false} />
      <main className="relative pt-36 pb-24 md:pt-44">
        <article className="container-lp relative max-w-3xl">
          <Reveal>
            <p className="kicker">LGPD · Lei nº 13.709/2018</p>
            <h1 className="heading mt-6 text-4xl text-graphite sm:text-5xl">Política de Privacidade</h1>
            <p className="mt-4 text-sm text-graphite/55">Última atualização: {UPDATED}</p>
            <p className="mt-8 text-lg leading-relaxed text-graphite/80">
              A {empresa.razaoSocial.replace(/\.$/, '')} ("Valore") respeita a sua privacidade. Esta política explica,
              de forma clara, quais dados pessoais coletamos neste site, para que os utilizamos, com quem podem ser
              compartilhados e como você pode exercer os seus direitos previstos na Lei Geral de Proteção de Dados
              Pessoais (LGPD).
            </p>
          </Reveal>

          <div className="mt-12">
            <Section n={1} title="Quem é o controlador dos dados">
              <p>
                O controlador dos dados pessoais tratados neste site é a <strong>{empresa.razaoSocial}</strong>
                {empresa.cnpj && <>, inscrita no CNPJ sob o nº {empresa.cnpj}</>}, com sede na {empresa.endereco}.
              </p>
              <p>Dúvidas e solicitações sobre privacidade podem ser enviadas {canal}.</p>
            </Section>

            <Section n={2} title="Quais dados coletamos">
              <p>Ao solicitar o guia executivo pelo formulário, você nos informa:</p>
              <ul>
                <li>nome;</li>
                <li>nome da empresa;</li>
                <li>regime tributário da empresa (Simples Nacional, Lucro Presumido ou Lucro Real);</li>
                <li>e-mail;</li>
                <li>número de WhatsApp.</li>
              </ul>
              <p>
                Também registramos, de forma automática, a data e a hora do envio, a página de origem e os parâmetros
                de campanha presentes no link de acesso (por exemplo, utm_source e utm_campaign), para entender por
                quais canais o material foi encontrado.
              </p>
              <p>Não coletamos dados pessoais sensíveis nem dados de crianças e adolescentes.</p>
            </Section>

            <Section n={3} title="Para que usamos os seus dados">
              <ul>
                <li>
                  <strong>Enviar o material solicitado</strong> para o seu e-mail e para o seu WhatsApp.
                </li>
                <li>
                  <strong>Enviar comunicações</strong> sobre os conteúdos e serviços da Valore, como materiais
                  informativos, convites e novidades sobre a reforma tributária.
                </li>
                <li>
                  <strong>Responder a contatos</strong> que você iniciar, por exemplo, ao solicitar uma conversa com um
                  especialista ou o diagnóstico gratuito.
                </li>
                <li>
                  <strong>Personalizar a abordagem</strong> de acordo com o regime tributário informado, para que o
                  conteúdo seja relevante para a sua empresa.
                </li>
              </ul>
            </Section>

            <Section n={4} title="Base legal">
              <p>
                O tratamento é realizado com base no seu <strong>consentimento</strong> (art. 7º, inciso I, da LGPD),
                manifestado ao marcar a caixa de autorização do formulário, que vem desmarcada por padrão. Quando você
                nos procura para contratar ou conhecer um serviço, os dados também podem ser tratados para a execução
                de procedimentos preliminares relacionados a contrato (art. 7º, inciso V).
              </p>
            </Section>

            <Section n={5} title="Com quem compartilhamos">
              <p>A Valore não vende nem aluga dados pessoais. Os dados podem ser tratados por fornecedores que nos ajudam a operar este site e a nos comunicar com você, sempre limitados a essa finalidade:</p>
              <ul>
                <li>serviço de hospedagem do site;</li>
                <li>ferramentas de armazenamento e envio de e-mails (Google Workspace / Google Planilhas);</li>
                <li>WhatsApp, para o envio do material e para as conversas que você iniciar.</li>
              </ul>
              <p>
                Alguns desses fornecedores podem armazenar dados em servidores localizados fora do Brasil. Nesses casos,
                a transferência observa as hipóteses do art. 33 da LGPD. Os dados também poderão ser compartilhados por
                determinação legal ou de autoridade competente.
              </p>
            </Section>

            <Section n={6} title="Por quanto tempo guardamos">
              <p>
                Mantemos os seus dados enquanto o consentimento estiver vigente ou pelo tempo necessário para cumprir as
                finalidades descritas nesta política. Após a revogação do consentimento ou o fim da finalidade, os
                dados são eliminados, salvo quando a lei exigir ou autorizar a sua conservação.
              </p>
            </Section>

            <Section n={7} title="Os seus direitos">
              <p>Nos termos do art. 18 da LGPD, você pode, a qualquer momento e gratuitamente:</p>
              <ul>
                <li>confirmar a existência de tratamento e acessar os seus dados;</li>
                <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
                <li>solicitar a anonimização, o bloqueio ou a eliminação de dados desnecessários ou excessivos;</li>
                <li>solicitar a portabilidade dos dados;</li>
                <li>obter informações sobre com quem os seus dados foram compartilhados;</li>
                <li>revogar o consentimento e pedir a eliminação dos dados tratados com base nele;</li>
                <li>deixar de receber comunicações, respondendo a qualquer mensagem com o pedido de descadastro.</li>
              </ul>
              <p>Para exercer esses direitos, entre em contato {canal}. Você também pode apresentar reclamação à Autoridade Nacional de Proteção de Dados (ANPD).</p>
            </Section>

            <Section n={8} title="Segurança">
              <p>
                Adotamos medidas técnicas e administrativas para proteger os dados pessoais contra acessos não
                autorizados e situações acidentais ou ilícitas de perda, alteração ou divulgação. O site utiliza conexão
                criptografada (HTTPS) e o acesso aos dados é restrito às pessoas que precisam deles para as finalidades
                desta política.
              </p>
            </Section>

            <Section n={9} title="Cookies">
              <p>
                Este site não utiliza cookies de publicidade. Caso venham a ser adotadas ferramentas de medição de
                audiência ou de anúncios, esta política será atualizada para informar quais são e como desativá-las.
              </p>
            </Section>

            <Section n={10} title="Alterações desta política">
              <p>
                Esta política pode ser atualizada para refletir mudanças legais ou nos nossos serviços. A data da última
                atualização está sempre indicada no início desta página.
              </p>
            </Section>
          </div>

          <div className="mt-6 border-t border-line pt-10">
            <a href="/" className="text-sm font-semibold tracking-[0.14em] text-gold-ink uppercase hover:text-graphite">
              ← Voltar para a página inicial
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </MotionConfig>
  )
}
