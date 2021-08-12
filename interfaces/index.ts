export interface WebhookEvent {
  event: string
  payload: unknown
}

export interface VerifyCamperWebhookPayload {
  userId: string
  discordId: string
}

export type EventType = 'onboarding'

export interface SubmitEventPayload {
  dateTime: string
  content: string
  discordId: string
  channelId: string
  event: EventType
}

export interface Camper {
  id: string
  discordId: string
  major: 'CONTENT' | 'DESIGN' | 'MARKETING' | 'PROGRAMMING'
  group: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J'
}

export interface ApiResponse<T> {
  success: boolean
  payload: T
}
