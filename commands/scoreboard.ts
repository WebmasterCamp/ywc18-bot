import fetch from 'node-fetch'

import { BaseCommander } from './base'

import { CHANNELS } from '../config'

export class ScoreboardCommander extends BaseCommander {
  async execute() {
    if (this.message.channel.id !== CHANNELS.COMMANDER) {
      return
    }

    const [_command, query] = this.message.content.split(' ') // `!scoreboard ${individual | group | major}`

    if (!['individual', 'group', 'group'].includes(query)) {
      return
    }
    try {
      // const result = await fetch(`https://activity.ywc18.ywc.in.th/api/scoreboard/${query}`)
      const result = await fetch(
        `https://ywc18.ywc.in.th/images/gallery/ywc18/14.jpg`
      )
      const buffer = await result.buffer()
      this.message.channel.send('', { files: [buffer] })
      console.log('Buffer ::', buffer)
    } catch (error) {
      console.log('[ERROR] Cannot get scoreboard data buffer ::', error)
    }
  }
}
