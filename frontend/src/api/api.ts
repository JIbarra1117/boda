import type { WeddingSettings, RsvpPayload } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.100.175:3000'

async function fetchJson(url: string, options?: RequestInit) {
  const headers: Record<string, string> = {}

  // Solo enviar Content-Type cuando hay body, para evitar preflight innecesarios en GET
  if (options?.body) {
    headers['Content-Type'] = 'application/json'
  }

  if (options?.headers) {
    const extraHeaders = options.headers as Record<string, string>
    Object.assign(headers, extraHeaders)
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(err)
  }
  return res.json()
}

export const getMediaUrl = (path: string | undefined) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_URL}${path}`
}

export const api = {
  getSettings: (): Promise<WeddingSettings> => fetchJson(`${API_URL}/settings`),

  updateSettings: (data: Partial<WeddingSettings>) =>
    fetchJson(`${API_URL}/settings`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  uploadMedia: (formData: FormData) =>
    fetch(`${API_URL}/upload/media`, {
      method: 'POST',
      body: formData,
    }),

  getGuests: () => fetchJson(`${API_URL}/guests`),

  getRsvps: () => fetchJson(`${API_URL}/rsvp`),

  createRsvp: (data: RsvpPayload) =>
    fetchJson(`${API_URL}/rsvp`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
