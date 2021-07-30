import Discord from 'discord.js'
import { CHANNELS, ROLE } from '../config'

import { BaseCommander } from './base'

export class ScoreCommander extends BaseCommander {
  async execute() {
    if (this.message.channel.id !== CHANNELS.SCOREBOARD) {
      return
    }

    const author = await this.message.guild?.members.fetch(
      this.message.author.id
    )

    if (!author?.roles.cache.get(ROLE.STAFF)) {
      console.log('[Score] Permission Denied')
      return
    }

    const [_command, _mention, score] = this.message.content.split(' ')

    const user = this.message.mentions.users.first()
    const role = this.message.mentions.roles.first()

    let userIds: string[] = []

    if (role) {
      const members = (await this.message.guild?.members.fetch())
        ?.array()
        .filter((m) => m.roles.cache.array().find((r) => r.id === role.id))
      const memberIds = members?.map((m) => m.id)

      if (memberIds?.length) {
        userIds = memberIds
      }
    }

    if (user) {
      userIds = [user.id]
    }

    const mention = user ? `<@${user?.id}>` : `<@&${role?.id}>`
    // Reply with mentioned
    await this.message.channel.send(`${mention} ได้แต้มบุญเพิ่ม ${score} แต้ม`)
  }
}
