import { StrictMode, type ComponentType } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './styles.css'

export function mount(Page: ComponentType) {
  const container = document.getElementById('root')!
  const app = (
    <StrictMode>
      <Page />
    </StrictMode>
  )
  // O HTML vem pré-renderizado do build; contagem regressiva e prazos mudam com o
  // horário, então diferenças na hidratação são esperadas e resolvidas no cliente.
  if (container.hasChildNodes()) hydrateRoot(container, app, { onRecoverableError: () => {} })
  else createRoot(container).render(app)
}
