const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: 'messageUpdate',
  async execute(oM, nM) {
    if (nM.channel?.type === 'DM' || nM.author?.id === nM.client.user.id) return;

    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);

    const logChannelId = logs.MensagemEditada;

    const logChannel = nM.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new Discord.MessageEmbed()
      .setAuthor({ name: '| Mensagem atualizada', iconURL: 'https://cdn.discordapp.com/emojis/1048643929064615986.png' })
      .setDescription(`**Membro**:\n${oM.author} \`${oM.author.username}\`\n**Canal**:\n${oM.channel} \`${oM.channel.name}\`\n**Antiga**:\n \`\`\`${oM.content}\`\`\`\n**Nova**:\n \`\`\`${nM.content}\`\`\``)
      .setColor('#fd7324');

    await logChannel.send({ embeds: [embed] });
  },
};
