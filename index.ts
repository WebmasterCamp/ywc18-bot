import Discord, { Channel } from 'discord.js'
import ApiClient from './api'
const client = new Discord.Client()

import { ScoreCommander } from './commands'
import { CHANNELS, BOT, ROLE } from './config'

import {
  SubmitEventPayload,
  VerifyCamperWebhookPayload,
  WebhookEvent,
} from './interfaces'

function createCommander(
  command: string,
  client: Discord.Client,
  message: Discord.Message
) {
  switch (command) {
    case 'score':
      return new ScoreCommander(client, message)
    default:
      console.error('No matched commander')
  }
}

client.login(process.env.TOKEN)

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('message', async (msg) => {
  if (msg.channel.id === CHANNELS.WEBHOOK && msg.author.id === BOT.WEBHOOK) {
    const event: WebhookEvent = JSON.parse(msg.content)

    switch (event.event) {
      case 'verifyCamper':
        const payload = event.payload as VerifyCamperWebhookPayload
        const user = await msg.guild?.members.fetch(payload.discordId)

        if (!user) {
          console.error('CANNOT FIND USER') // Case verify before join discord server
          return
        }

        user.roles.add(ROLE.CAMPER)

        break
      default:
        break
    }

    return
  }

  if (msg.author.bot) return

  const isCamper = msg.member?.roles.cache.some((r) => r.id === ROLE.CAMPER)
  if (msg.channel.id === CHANNELS.ONBOARD && isCamper) {
    try {
      const payload: SubmitEventPayload = {
        dateTime: new Date().toISOString(),
        content: msg.content,
        discordId: msg.author.id,
        channelId: msg.channel.id,
        event: 'onboarding',
      }

      /**
       * @todo - call an api to add new score (1 record per user)
       */
      // const result = await ApiClient.submitEvent(payload)

      // console.log("Result", result.json())
    } catch (error) {
    } finally {
      return
    }
  }

  // get commander
  if (msg.content.startsWith('!')) {
    // handle with command
    const commandtype = msg.content.substring(1).split(' ')[0]
    console.log('Command', commandtype)
    const commander = createCommander(commandtype, client, msg)
    if (commander) {
      commander.execute()
    }
    return
  }

  console.log('[MESSAGE] Message from unlisted Group', msg.content)

  // console.log('+++++++')
  // console.log(JSON.stringify(msg, null, 2))
  // console.log('+++++++')
  // console.log(msg.cleanContent, msg.type, msg.author.tag, msg.content)
  // console.log('isBot', msg.author.bot)

  // console.log(msg.mentions.toJSON())
  // console.log(msg.mentions)
  // console.log(msg.content)
  // console.log('Channel ID', msg.channel.id)
  // console.log('Role', msg.guild?.roles)
  // console.log('++++++++')
  // const channel: Channel | undefined = client.channels.cache.get(
  //   CHANNELS.SCORE_BOARD
  // )
  // @ts-ignore
  // channel && channel.send('Notify')
})

client.on('messageReactionAdd', async (reaction, user) => {
  console.log('User', user)
  console.log('reaction', JSON.stringify(reaction))
  console.log('reaction emoji name', reaction.emoji.name)

  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
    // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
    try {
      await reaction.fetch()
    } catch (error) {
      console.error('Something went wrong when fetching the message: ', error)
      // Return as `reaction.message.author` may be undefined/null
      return
    }
  }
  // Now the message has been cached and is fully available
  console.log(
    `${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`
  )
  // The reaction is now also fully available and the properties will be reflected accurately:
  console.log(
    `${reaction.count} user(s) have given the same reaction to this message!`
  )
})
