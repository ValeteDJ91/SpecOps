const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const channelList = require('./channels.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
  clearMessage()
  setInterval(clearMessage, 300000);
});

const clearMessage = async () => {
  let deleted = 0
  const guild = client.guilds.cache.get("1200440029449826325")
  const channels = await guild.channels.fetch();
  for (const channel of channels.values()) {
    if (channel.type != 0) continue
    let channelInfo = channelList.find(c => c.id == channel.id)
    if (!channelInfo) continue
    const messages = await channel.messages.fetch();
    for (const message of messages.values()) {
      if (message.author.system) continue
      if (message.createdTimestamp < Date.now() - channelInfo.timeout) /* 28800000 */ {
        message.delete()
        deleted++
      }
    }
  }
  if (deleted) console.log(`${deleted} messages supprimé(s)`)
}

client.login(token);