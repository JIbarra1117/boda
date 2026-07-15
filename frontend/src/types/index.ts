export interface WeddingSettings {
  id?: number
  weddingDate: string
  weddingTime?: string
  brideName: string
  groomName: string
  bankName?: string
  bankAccountName?: string
  bankAccountNumber?: string
  bankAccountId?: string
  bankAccountEmail?: string
  polaroidBrideImage?: string
  polaroidGroomImage?: string
  backgroundMusic?: string
  ceremonyTime?: string
  ceremonyLocation?: string
  ceremonyAddress?: string
  ceremonyMapsUrl?: string
  celebrationTime?: string
  celebrationLocation?: string
  celebrationAddress?: string
  celebrationMapsUrl?: string
  dressCode?: string
  loveQuote?: string
  calendarUrl?: string
}

export interface Guest {
  id: number
  fullName: string
  email?: string
  phone?: string
  origin?: string
  token: string
  code?: string
  hasRsvp: boolean
  createdAt: string
}

export interface RsvpPayload {
  guestToken: string
  attendCeremony: boolean
  attendCelebration: boolean
  musicSuggestion?: string
  message?: string
}

export interface RsvpRecord extends RsvpPayload {
  id: number
  createdAt: string
  guest?: Guest
}
