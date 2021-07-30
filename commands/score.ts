import Discord from 'discord.js'

import { BaseCommander } from './base'

export class ScoreCommander extends BaseCommander {
  async execute() {
    if (this.message.channel.id !== '870694230295711835') {
      return
    }

    const [_command, _mention, score] = this.message.content.split(' ')
    console.log(
      (await this.message.guild?.members.fetch())?.array()[0].guild.roles
    )

    const user =
      this.message.mentions.roles.first() || this.message.mentions.users.first()

    console.log(user?.id)
    // Reply with mentioned
    this.message.channel.send(`<@${user?.id}> ได้แต้มบุญเพิ่ม ${score} แต้ม`)
  }
}
