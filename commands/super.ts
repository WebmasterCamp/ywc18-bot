import fetch from 'node-fetch'
import { CHANNELS, ROLE } from '../config'
import { ApiResponse, Camper } from '../interfaces'

import { BaseCommander } from './base'

export class SuperCommander extends BaseCommander {
  async execute() {
    if (this.message.channel.id !== CHANNELS.SUPERCOMMANDER) {
      return
    }

    const author = await this.message.guild?.members.fetch(
      this.message.author.id
    )

    if (!author?.roles.cache.get(ROLE.ADMIN)) {
      console.log('[Super Commander] Permission Denied')
      return
    }

    const [_command, command, query] = this.message.content.split(' ')

    if (command !== 'assign') {
      return
    }

    if (!['group', 'major'].includes(query)) {
      return
    }

    const headers = {
      Authorization: process.env.INTERNAL_TOKEN,
      'Content-Type': 'application/json',
    } as { [key: string]: string }

    const response = await fetch(
      'https://activity.ywc18.ywc.in.th/api/camper',
      {
        headers,
      }
    )

    const data: ApiResponse<Camper[]> = await response.json()

    if (data.success) {
      for (const camper of data.payload) {
        const user = await this.message.guild?.members.fetch(camper.discordId)

        if (!user) {
          return
        }

        // Assign Major
        if (query === 'major') {
          switch (camper.major) {
            case 'DESIGN':
              await user.roles.add(ROLE.DESIGN)
              await this.message.reply(
                `Assigned ${user.displayName} with role DESIGN`
              )
              return
            case 'CONTENT':
              await user.roles.add(ROLE.CONTENT)
              await this.message.reply(
                `Assigned ${user.displayName} with role CONTENT`
              )
              return
            case 'MARKETING':
              await user.roles.add(ROLE.MARKETING)
              await this.message.reply(
                `Assigned ${user.displayName} with role MARKETING`
              )
              return
            case 'PROGRAMMING':
              await user.roles.add(ROLE.PROGRAMMING)
              await this.message.reply(
                `Assigned ${user.displayName} with role PROGRAMMING`
              )
              return
          }
        }
      }

      return
    } else {
      await this.message.reply(`Failed assign`)
    }
  }
}
