const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');
const fs = require('fs');

module.exports = {
  name: 'unmute',
  description: 'Remove o mute de um usuário no servidor.',
  aliases: ['unsilence'],
  category: 'mod', 
  usage: '@user ou id',

  async execute(message, args) {

    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);

    const logChannelId = logs.Mute;

    const permData = fs.readFileSync('./configperm.json', 'utf-8');
    const permConfig = JSON.parse(permData);

    const isAdmin = message.member.permissions.has('ADMINISTRATOR');
    const isMuteRole = message.member.roles.cache.some(role => permConfig['Mute e Unmute'].includes(role.id));

    if (!isAdmin && !isMuteRole) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você não tem permissão para usar esse comando.');

      const botMessage = await message.channel.send({ embeds: [noPermissionEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
      return;
    }

    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!target) {
      const invalidTargetEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Por favor, mencione um usuário válido ou forneça o ID para remover o mute.');

      const botMessage = await message.channel.send({ embeds: [invalidTargetEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
      return;
    }

    const role = message.guild.roles.cache.find(role => role.name === 'Muted-bot');
    if (!role) {
      const missingRoleEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('O servidor não possui um cargo chamado "Muted-bot".');

      const botMessage = await message.channel.send({ embeds: [missingRoleEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
      return;
    }

    if (!target.roles.cache.has(role.id)) {
      const notMutedEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription(`O usuário ${target} não está mutado.`);

      const botMessage = await message.channel.send({ embeds: [notMutedEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
      return;
    }

    try {
      await target.roles.remove(role);

      if (target.voice.channel) {
        await target.voice.setMute(false);
      }

      const successEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription(`O usuário ${target} foi desmutado com sucesso.`);

      const botMessage = await message.channel.send({ embeds: [successEmbed] });
      setTimeout(() => botMessage.delete(), 15000);

      const motivo = args.slice(1).join(' ') || 'Motivo não fornecido';

      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const logEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setTitle('Usuário Desmutado')
          .setDescription(`**Usuário**: ${target.user.username} (${target.user.id})\n**Moderador**: ${message.author.username} (${message.author.id})`)
          .addFields(
            { name: 'Motivo', value: motivo }
          )
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      console.error(error);

      const errorEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Ocorreu um erro ao desmutar o usuário.');

      const botMessage = await message.channel.send({ embeds: [errorEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
    }
  },
};
