import { StrictMode, type ComponentType } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

export function mount(Page: ComponentType) {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Page />
    </StrictMode>,
  )
}
