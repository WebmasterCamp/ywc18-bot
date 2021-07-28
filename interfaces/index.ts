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
  dateTime: string,
  content: string,
  discordId: string,
  channelId: string,
  event: EventType
}