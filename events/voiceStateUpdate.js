const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: 'voiceStateUpdate',
  execute(oldState, newState) {
    const guild = newState.guild;
    const member = newState.member;

    if (!guild) return;

    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);

    const logChannelId = logs.TrafegoDeVoz;

    const logChannel = guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const oldChannel = oldState.channel;
    const newChannel = newState.channel;

    if (!oldChannel) {

      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: '| Entrou no canal', iconURL: 'https://cdn.discordapp.com/emojis/1048643688508690583.png' })
        .setDescription(`Entrou no canal <#${newChannel.id}> \`${newChannel.name}\`\n**Membro**: ${member} \`${member.user.username}\``)
        .setColor('#00ff00')
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    } else if (!newChannel) {

      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: '| Saiu do canal', iconURL: 'https://cdn.discordapp.com/emojis/1048643688508690583.png' })
        .setDescription(`<@${member.id}> saiu do canal de voz <#${oldChannel.id}> \`${oldChannel.name}\`\n**Membro**: ${member} \`${member.user.username}\``)
        .setColor('#ff0000')
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    } else if (oldChannel.id !== newChannel.id) {

      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: '| Trocou de canal', iconURL: 'https://cdn.discordapp.com/emojis/1048643688508690583.png' })
        .setDescription(`Mudou de <#${oldChannel.id}> \`${oldChannel.name}\` para <#${newChannel.id}> \`${newChannel.name}\`\n**Membro**: ${member} \`${member.user.username}\``)
        .setColor('#ffff00')
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }

    if (!oldState.mute && newState.mute) {
      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: '| Microfone silenciado', iconURL: 'https://cdn.discordapp.com/emojis/1135703258434916453.png' })
        .setDescription(`<@${member.id}> silenciou o microfone.`)
        .setColor('#ff0000')
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }

    if (oldState.mute && !newState.mute) {
      const embed = new Discord.MessageEmbed()
        .setAuthor({ name: '| Microfone ativado', iconURL: 'https://cdn.discordapp.com/emojis/1135703231612321862.png' })
        .setDescription(`<@${member.id}> ativou o microfone.`)
        .setColor('#00ff00')
        .setTimestamp();
      logChannel.send({ embeds: [embed] });
    }
  },
};
