require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client();

const commands = require('./commands')

// Channel ids 
const CHANNELS = {
  SCORE_BOARD: '866272690766610442'
}


client.login(process.env.TOKEN)

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
  if (msg.author.bot) return 
  console.log('+++++++')
  console.log(JSON.stringify(msg, null, 2))
  console.log('+++++++')
  console.log(msg.cleanContent, msg.type, msg.author.tag, msg.content)
  console.log("isBot", msg.author.bot)

  console.log(msg.mentions.toJSON())
  console.log(msg.mentions)
  console.log(msg.content)
  console.log("Channel ID", msg.channel.id)
  console.log("Role", msg.guild.roles)
  console.log('++++++++')
  const channel = client.channels.cache.get(CHANNELS.SCORE_BOARD)
  channel.send("Notify")
  commands.score()
})

client.on('messageReactionAdd', async (reaction, user) => {

  console.log("User", user)
  console.log("reaction", JSON.stringify(reaction))
  console.log("reaction emoji name", reaction.emoji.name)

  // When a reaction is received, check if the structure is partial
  if (reaction.partial) {
   // If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
   try {
    await reaction.fetch();
   } catch (error) {
    console.error('Something went wrong when fetching the message: ', error);
    // Return as `reaction.message.author` may be undefined/null
    return;
   }
  }
  // Now the message has been cached and is fully available
  console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
  // The reaction is now also fully available and the properties will be reflected accurately:
  console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
 });


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
	}
});
