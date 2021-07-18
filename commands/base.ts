import Discord from 'discord.js';

export abstract class BaseCommander {
  client: Discord.Client
  message: Discord.Message

  constructor(client: Discord.Client, message: Discord.Message) {
    this.client = client
    this.message = message
  }

  abstract execute(): unknown
}