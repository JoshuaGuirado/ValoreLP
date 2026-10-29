import { StrictMode, type ComponentType } from 'react'
import { renderToString } from 'react-dom/server'
import CapturePage from './pages/Capture'
import PrivacyPage from './pages/Privacy'
import ThanksPage from './pages/Thanks'

/** Gera o HTML estático de cada página no build (SEO: o texto já vem no HTML). */
const pages: Record<string, ComponentType> = {
  'index.html': CapturePage,
  'obrigado/index.html': ThanksPage,
  'politica-de-privacidade/index.html': PrivacyPage,
}

export function render(file: string) {
  const Page = pages[file]
  return renderToString(
    <StrictMode>
      <Page />
    </StrictMode>,
  )
}

export const files = Object.keys(pages)
