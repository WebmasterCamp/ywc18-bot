import fetch from 'node-fetch'
import { CHANNELS, ROLE } from '../config'
import { ApiResponse, Camper } from '../interfaces'

import { BaseCommander } from './base'

function getGroupRoleId(group: string) {
  switch (group) {
    case 'A':
      return ROLE.GROUP_A
    case 'B':
      return ROLE.GROUP_B
    case 'C':
      return ROLE.GROUP_C
    case 'D':
      return ROLE.GROUP_D
    case 'E':
      return ROLE.GROUP_E
    case 'F':
      return ROLE.GROUP_F
    case 'G':
      return ROLE.GROUP_G
    case 'H':
      return ROLE.GROUP_H
    case 'I':
      return ROLE.GROUP_I
    case 'J':
      return ROLE.GROUP_J
    default:
      console.error('[Super Commander] No matched role')
      return null
  }
}

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
              break

            case 'CONTENT':
              await user.roles.add(ROLE.CONTENT)
              await this.message.reply(
                `Assigned ${user.displayName} with role CONTENT`
              )
              break

            case 'MARKETING':
              await user.roles.add(ROLE.MARKETING)
              await this.message.reply(
                `Assigned ${user.displayName} with role MARKETING`
              )
              break
            case 'PROGRAMMING':
              await user.roles.add(ROLE.PROGRAMMING)
              await this.message.reply(
                `Assigned ${user.displayName} with role PROGRAMMING`
              )
              break
          }
        }

        // Assign Group
        if (query === 'group') {
          const roleId = getGroupRoleId(camper.group)
          if (roleId) {
            await user.roles.add(roleId)
            await this.message.reply(
              `Assigned ${user.displayName} with group ${camper.group}`
            )
          }
        }
      }

      await this.message.reply('Operation completed')

      return
    } else {
      await this.message.reply(`Failed assign`)
    }
  }
}
