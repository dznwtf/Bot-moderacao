const fs = require('fs');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'channelDelete',
    once: false,
    async execute(channel) {
      const logsData = fs.readFileSync('./logs.json', 'utf-8');
      const logs = JSON.parse(logsData);
      const canalExcluidoChannelId = logs.CanalExcluido;
  
      const canalExcluidoChannel = channel.guild.channels.cache.get(canalExcluidoChannelId);
      if (!canalExcluidoChannel) return;
  
      const tipo = channel.type === 'GUILD_TEXT' ? 'Texto' : 'Voz';
      const usuario = channel.guild.members.cache.get(channel.guild.ownerId);
  
      const embed = new MessageEmbed()
        .setAuthor({ name: '| Canal Excluído', iconURL: 'https://cdn.discordapp.com/emojis/1048640787354751017.webp?size=44&quality=lossless' })
        .setDescription(` **Canal**:\n${channel.name}\n**Tipo**:\n${tipo}\n **Moderador**:\n${usuario} \`${usuario.user.username}\``)
        .setColor('#06f84b');
  
      canalExcluidoChannel.send({ embeds: [embed] });
    },
  };