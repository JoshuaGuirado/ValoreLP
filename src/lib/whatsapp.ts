import { config } from '../config'

export function whatsappLink(message: string) {
  return `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(message)}`
}
