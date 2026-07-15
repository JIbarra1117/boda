import type { WeddingSettings, RsvpPayload, Guest, RsvpRecord } from '@/types'

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

  getGuests: (): Promise<Guest[]> => fetchJson(`${API_URL}/guests`),

  getGuestByToken: (token: string): Promise<Guest> =>
    fetchJson(`${API_URL}/guests/by-token/${token}`),

  createGuest: (data: { fullName: string; email?: string; phone?: string; origin?: string }) =>
    fetchJson(`${API_URL}/guests`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  createGuestsBulk: (
    guests: Array<{ fullName: string; email?: string; phone?: string; origin?: string }>
  ) =>
    fetchJson(`${API_URL}/guests/bulk`, {
      method: 'POST',
      body: JSON.stringify({ guests }),
    }),

  updateGuest: (
    id: number,
    data: { fullName?: string; email?: string; phone?: string; origin?: string }
  ) =>
    fetchJson(`${API_URL}/guests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteGuest: (id: number) =>
    fetchJson(`${API_URL}/guests/${id}`, {
      method: 'DELETE',
    }),

  getRsvps: (): Promise<RsvpRecord[]> => fetchJson(`${API_URL}/rsvp`),

  createRsvp: (data: RsvpPayload) =>
    fetchJson(`${API_URL}/rsvp`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
}
