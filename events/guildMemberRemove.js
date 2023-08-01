const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const fs = require('fs');

module.exports = {
  name: 'guildMemberRemove',
  once: false,

  async execute(member) {
    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);
    const saidaChannelId = logs.Saida; 

    const saidaChannel = member.guild.channels.cache.get(saidaChannelId);
    if (!saidaChannel) return;



    const createdDaysAgo = moment().diff(member.user.createdAt, 'days');



    const saidaEmbed = new MessageEmbed()
      .setAuthor({
        name: 'Saiu do servidor',
        iconURL: 'https://cdn.discordapp.com/emojis/1119475851784896582.png',
      })
      .setDescription(`${member} **Membro**:\n${member.user.username}\n**Criado há**: ${createdDaysAgo} dias`)
      .setColor('#ff0000')
      .setTimestamp();

    saidaChannel.send({ embeds: [saidaEmbed] }).catch(console.error);
  },
};
