import Discord from 'discord.js'
import fetch from 'node-fetch'
import { max } from 'lodash'

import { BaseCommander } from './base'

import { CHANNELS } from '../config'

interface ScoreboardItem {
  title: string
  icon: string
  discordId: string | null
  score: number
  rank: number
}

export class ScoreboardCommander extends BaseCommander {
  async execute() {
    if (this.message.channel.id !== CHANNELS.COMMANDER) {
      return
    }

    const [_command, query] = this.message.content.split(' ') // `!scoreboard ${individual | group | major | me}`

    if (!['individual', 'group', 'group', 'me'].includes(query)) {
      return
    }
    try {
      const rawFetch = await fetch(
        `https://activity.ywc18.ywc.in.th/api/scoreboard/${
          ['me'].includes(query) ? 'individual' : query
        }`,
        {
          headers: {
            authorization: 'thiskey',
          },
        }
      )
      const parsedFetch: ScoreboardItem[] = await rawFetch.json()

      const getFields = (items: ScoreboardItem[]) => ([
        {
          name:
            query === 'individual'
              ? 'ชื่อ'
              : query === 'group'
              ? 'กลุ่ม'
              : 'สาขา',
          value: items
            .map(
              (item) =>
                `\`${item.rank.toString().padStart(2, '0')}.\` ${
                  item.icon
                } ${item.title}`
            )
            .join('\n'),
          inline: true,
        },
        {
          name: 'แต้มบุญ',
          value: items.map((item) => `\`${item.score}\``).join('\n'),
          inline: true,
        },
      ])

      // find my rank
      if (query === 'me') {
        const targetRank = parsedFetch.find(o => o.discordId == this.message.author.id)

        if (targetRank === undefined) {
          this.message.channel.send(`<@${this.message.author.id}> ยังไม่มีคะแนนแต้มบุญ`)
        } else {
          const getUpperLimit = (rank: number) => rank - 2 <= 0 ? 1 : rank - 2
          const getLowerLimit = (rank: number) => rank + 2 <= (max(parsedFetch.map(o => o.rank)) ?? 1) ? rank + 2 : (max(parsedFetch.map(o => o.rank)) ?? 1)

          const filteredRank = parsedFetch.filter((o, i) => {
            // console.log({
            //   current: targetRank.rank,
            //   upper: getUpperLimit(targetRank.rank),
            //   lower: getLowerLimit(targetRank.rank),
            //   target: o.rank,
            // })
            return getUpperLimit(targetRank.rank) <= o.rank && o.rank <= getLowerLimit(targetRank.rank)
          })

          const embed = new Discord.MessageEmbed({
            description: `<@${this.message.author.id}> อยู่อันดับที่ \`${targetRank.rank.toString().padStart(2, "0")}\``,
            fields: getFields(filteredRank)
          })

          this.message.channel.send(embed)
        }
      } else {
        const rankedData = parsedFetch.filter((item) =>
          query === 'individual' ? item.rank <= 10 : true
        )

        const embed = new Discord.MessageEmbed({
          title: `อันดับแต้มบุญจัดกลุ่มตาม${
            query === 'individual'
              ? 'รายบุคคล'
              : query === 'group'
              ? 'กลุ่ม'
              : 'สาขา'
          }`,
          footer:
            query === 'individual'
              ? {
                  text: 'ไม่พบชื่อตัวเองในนี้? ลอง \`!scoreboard me\` เพื่อหาอันดับตนเองดูสิ',
                }
              : undefined,
          fields: getFields(rankedData),
        })

        this.message.channel.send(embed)
      }
    } catch (error) {
      console.log('[ERROR] Cannot get scoreboard data buffer ::', error)
    }
  }
}
