const fs = require('fs');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'channelUpdate',
    once: false,
    async execute(oldChannel, newChannel) {
      if ((oldChannel.type === 'GUILD_TEXT' || oldChannel.type === 'GUILD_VOICE') && (newChannel.type === 'GUILD_TEXT' || newChannel.type === 'GUILD_VOICE')) {
        const logsData = fs.readFileSync('./logs.json', 'utf-8');
        const logs = JSON.parse(logsData);
        const canalEditadoChannelId = logs.CanalEditado;
  
        const canalEditadoChannel = newChannel.guild.channels.cache.get(canalEditadoChannelId);
        if (!canalEditadoChannel) return;
  
        const tipo = newChannel.type === 'GUILD_TEXT' ? 'Texto' : 'Voz';
        const usuario = newChannel.guild.members.cache.get(newChannel.guild.ownerId);
  
        const embed = new MessageEmbed()
          .setAuthor({ name: '| Canal Editado', iconURL: 'https://cdn.discordapp.com/emojis/1048640787354751017.webp?size=44&quality=lossless' })
          .setDescription(` **Canal**:\n<#${newChannel.id}> \`${newChannel.name}\`\n**Tipo**:\n${tipo}\n**Moderador**:\n${usuario} \`${usuario.user.username}\``)
          .addFields(
            { name: '**Antigo Nome**', value: oldChannel.name, inline: true },
            { name: '**Novo Nome**', value: newChannel.name, inline: true }
          )
          .setColor('#06f84b');
  
        canalEditadoChannel.send({ embeds: [embed] });
      }
    },
  };