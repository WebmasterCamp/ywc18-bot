import fetch from 'node-fetch'
import { CHANNELS, ROLE } from '../config'

import { BaseCommander } from './base'

export class ScoreCommander extends BaseCommander {
  async execute() {
    if (this.message.channel.id !== CHANNELS.SCORE) {
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

    if (!user && !role) {
      await this.message.reply(`เพิ่มตะแนนไม่สำเร็จ`)
      return
    }

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

    const body = {
      userIds,
      score: Number.parseInt(score),
      submitBy: this.message.author.id,
    }

    const headers = {
      Authorization: process.env.INTERNAL_TOKEN,
      'Content-Type': 'application/json',
    } as { [key: string]: string }

    const response = await fetch('https://activity.ywc18.ywc.in.th/api/score', {
      headers,
      method: 'POST',
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (data.success) {
      const mention = user ? `<@${user?.id}>` : `<@&${role?.id}>`
      // Reply with mentioned
      await this.message.channel.send(
        `${mention} ได้แต้มบุญเพิ่ม ${score} แต้ม`
      )

      return
    } else {
      await this.message.reply(`เพิ่มตะแนนไม่สำเร็จ`)
    }
  }
}
