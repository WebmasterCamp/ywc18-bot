import Discord from 'discord.js'

import { BaseCommander } from './base'

export class ScoreCommander extends BaseCommander {
  execute() {
    console.log("AYO")
    const channel: Discord.Channel | undefined = this.client.channels.cache.get('866272690766610442')

    // Send message to channel
    this.message.channel.send('This is score commander!')

    // Reply with mentioned
    this.message.channel.send(`Hi, <@${'264281954499821568'}> get 112 points`)

    // @ts-ignore
    channel && channel.send('This is score commander!')
  }
}
