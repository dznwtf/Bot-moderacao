const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: 'messageDelete',
  async execute(message) {
    if (message.channel?.type === 'DM' || message.author?.id === message.client.user.id) return;

    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);

    const logChannelId = logs.messageDeletada;

    const logChannel = message.client.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new Discord.MessageEmbed()
      .setAuthor({
        name: 'Mensagem deletada',
        iconURL: 'https://cdn.discordapp.com/emojis/1065308067174043779.png',
      })
      .setDescription(`**Membro**:\n${message.author ? message.author : 'Unknown User'} ${message.author ? `\`${message.author.username}\`` : ''}\n**Canal**:\n${message.channel} \`${message.channel.name}\`\n**Mensagem deletada**:\n \`\`\`${message.content}\`\`\``)
      .setImage(message.attachments.first()?.url || '')
      .setColor('#ff0000')
      .setTimestamp();

    logChannel.send({ embeds: [embed] });
  },
};
