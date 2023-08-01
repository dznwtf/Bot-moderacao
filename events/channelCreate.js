const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
    name: 'channelCreate',
    once: false,
    async execute(channel) {
      const logsData = fs.readFileSync('./logs.json', 'utf-8');
      const logs = JSON.parse(logsData);
      const canalCriadoChannelId = logs.CanalCriado;
  
      const canalCriadoChannel = channel.guild.channels.cache.get(canalCriadoChannelId);
      if (!canalCriadoChannel) return;
  
      const tipo = channel.type === 'GUILD_TEXT' ? 'Texto' : 'Voz';
      const usuario = channel.guild.members.cache.get(channel.guild.ownerId);
  
      const embed = new MessageEmbed()
        .setAuthor({ name: '| Canal Criado', iconURL: 'https://cdn.discordapp.com/emojis/1048640787354751017.webp?size=44&quality=lossless' })
        .setDescription(` **Canal**:\n<#${channel.id}> \`${channel.name}\`\n**Tipo**:\n${tipo}\n **Moderador**:\n${usuario} \`${usuario.user.username}\``)
        .setColor('#06f84b');
  
      canalCriadoChannel.send({ embeds: [embed] });
    },
  };