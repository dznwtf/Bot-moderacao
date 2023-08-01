const { Discord, Client, Intents, Collection  } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');   
const { sendLogToWebhook } = require('./util.js');


const client = new Client({ 
    intents: [ 
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
      
    ] 
  });
  

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
  console.log(`Eventos carregados: ${event.name}`);

}

client.commands = new Collection();

const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
    console.log(`Comandos carregados: ${command.name}`);
  }
}

client.on('messageCreate', async (message) => {
    if (!message.guild) {
      // Se a mensagem foi enviada em uma DM, não faça nada
      return;
    }
  
    if (message.guild.id !== config.serverId) {
      // Se a mensagem foi enviada em um servidor diferente do que você deseja, não faça nada
      return;
    }
  
    if (message.author.bot || !message.content.startsWith(config.prefix)) return;
  
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
  
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  
    if (!command) return;
  
    try {
      sendLogToWebhook(message.author, commandName, message.channel);
  
      command.execute(message, args);
    } catch (error) {
      console.error(error);
      console.log('Ocorreu um erro ao executar esse comando.');
    }
  });
  


client.login(config.token);