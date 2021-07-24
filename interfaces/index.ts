export interface WebhookEvent {
  event: string
  payload: unknown
}

export interface VerifyCamperWebhookPayload {
  userId: string
  discordId: string
}
