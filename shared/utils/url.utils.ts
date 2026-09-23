import { API_BASE_URL } from '../constants/api.constants'

/**
 * Racine du serveur (sans le préfixe /api/v1) — nécessaire pour tout ce qui
 * n'est PAS servi sous /api/v1 : fichiers statiques (/files/...), WebSocket (/ws/...).
 */
export function getServerOrigin(): string {
  return API_BASE_URL.replace(/\/api\/v\d+\/?$/, '')
}

/**
 * Convertit un chemin renvoyé par le backend (ex. "/files/xxx.jpg") en URL absolue.
 * Laisse intactes les URLs déjà absolues (http/https).
 */
export function toAbsoluteFileUrl(path?: string | null): string | undefined {
  if (!path) return undefined
  if (/^https?:\/\//.test(path)) return path
  return `${getServerOrigin()}${path}`
}
