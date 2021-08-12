import { ApiResponse, Camper } from './../interfaces/index'
/**
 * หมวดคัดสรร
 */

import { CHANNELS, ROLE } from '../config'
import { BaseCommander } from './base'
import { getGroupRoleId } from '../mappers/role'

export class SortingHatCommander extends BaseCommander {
  async execute() {
    if (this.message.channel.id !== CHANNELS.SORTING_HAT) {
      return
    }

    const author = await this.message.guild?.members.fetch(
      this.message.author.id
    )

    if (!author?.roles.cache.get(ROLE.CAMPER)) {
      console.log('[Sorting Hat Commander] Permission Denied (CAMPER Only)')
      return
    }

    const message = this.message.content.trim()

    const listedWords = ['ลงเลือกตั้ง', 'เลือกตั้ง']

    if (!listedWords.includes(message)) {
      const replyTexts = ['ไม่รู้ ไม่รู้ ไม่รู้', 'ก็บอกว่าไม่รู้ไง']
      const randomIndex = Math.floor(Math.random() * replyTexts.length)
      const replyText = replyTexts[randomIndex]
      await this.message.reply(replyText)
      return
    }

    // Fetch all campers
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
      const camper = data.payload.find(({ discordId }) => discordId === author.id)

      if (!camper) {
        this.message.channel.send(`<@${this.message.author.id}> ไม่มีสิทธิเข้ารับการจัดสรร`)
        return
      }

      const roleId = getGroupRoleId(camper.group)
      if (roleId) {
        
        const party = {
          PROGRAMMING: 'พรรคอนาโค้ดใหม่',
          CONTENT: 'พรรคพลังประชาดราฟ',
          DESIGN: 'พรรคดีไซน์พัฒนา',
          MARKETING: 'พรรคเพื่อเงิน'
        }[camper.major]
        
        const isAssiged = author?.roles.cache.get(roleId)
        if (!isAssiged) {
          await author.roles.add(roleId)
          await this.message.reply(
            `ยินดีด้วย! ประชาชนเลือกคุณเป็นสมาชิกสภาผู้แทนราษฎรราชอาณาจักรยังแคมป์ สังกัด${party} และอยู่คณะอนุกรรมการ ${camper.group}`
          )
        } else {
          await this.message.reply(
            `คุณเป็นสมาชิกสภาผู้แทนราษฎรราชอาณาจักรยังแคมป์ สังกัด${party} และอยู่คณะอนุกรรมการ ${camper.group}`
          )
        }
      }
      return
    } else {
      await this.message.reply(`Failed to assign`)
    }
  }
}