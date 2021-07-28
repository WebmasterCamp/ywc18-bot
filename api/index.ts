import fetch from 'node-fetch'
import { SubmitEventPayload } from './../interfaces/index'

class ApiClient {
  submitEvent(payload: SubmitEventPayload) {
    return fetch('https://activity.ywc18.ywc.in.th/api/', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
  }
}

export default new ApiClient()