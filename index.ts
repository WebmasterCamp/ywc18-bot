import Discord, { Channel } from 'discord.js'
const client = new Discord.Client()

import { ScoreCommander } from './commands'

// Channel ids
const CHANNELS = {
  SCORE_BOARD: '866272690766610442',
  WEBHOOK: '868221763492905042',
}

client.login(process.env.TOKEN)

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('message', (msg) => {
  if (msg.channel.id === CHANNELS.WEBHOOK) {
    console.log(msg.content)
    return
  }

  if (msg.author.bot) return

  // get commander
  if (msg.content.startsWith('!')) {
    // handle with command
    const commandtype = msg.content.substring(1)
    console.log('Command', commandtype)
    const command = new ScoreCommander(client, msg)
    command.execute()
    return
  }

  console.log('+++++++')
  console.log(JSON.stringify(msg, null, 2))
  console.log('+++++++')
  console.log(msg.cleanContent, msg.type, msg.author.tag, msg.content)
  console.log('isBot', msg.author.bot)

  console.log(msg.mentions.toJSON())
  console.log(msg.mentions)
  console.log(msg.content)
  console.log('Channel ID', msg.channel.id)
  console.log('Role', msg.guild?.roles)
  console.log('++++++++')
  const channel: Channel | undefined = client.channels.cache.get(
    CHANNELS.SCORE_BOARD
  )
  // @ts-ignore
  channel && channel.send('Notify')
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
