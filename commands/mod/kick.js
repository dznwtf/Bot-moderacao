const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');
const fs = require('fs');

module.exports = {
  name: 'kick',
  aliases: ['expulsar'],
  description: 'Expulsa um usuário.',
  category: 'mod', 
  usage: '@user ou id',

  async execute(message, args) {
    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);

    const logChannelId = logs.Expulsao;

    if (!message.member.permissions.has('KICK_MEMBERS')) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você não tem permissão para expulsar membros.');

      return message.channel.send({ embeds: [noPermissionEmbed] })
        .then(reply => {
          setTimeout(() => {
            reply.delete();
          }, 5000);
        });
    }

    const targetUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const reason = args.slice(1).join(' ');

    if (!targetUser) {
      const invalidUserEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Por favor, mencione um usuário válido para expulsar.');

      return message.channel.send({ embeds: [invalidUserEmbed] })
        .then(reply => {
          setTimeout(() => {
            reply.delete();
          }, 5000);
        });
    }

    if (targetUser.roles.highest.position >= message.member.roles.highest.position) {
      const lowerRoleEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você não tem permissão para expulsar esse usuário.');

      return message.channel.send({ embeds: [lowerRoleEmbed] })
        .then(reply => {
          setTimeout(() => {
            reply.delete();
          }, 5000);
        });
    }

    if (!targetUser.kickable) {
      const unkickableEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Não foi possível expulsar esse usuário.');

      return message.channel.send({ embeds: [unkickableEmbed] })
        .then(reply => {
          setTimeout(() => {
            reply.delete();
          }, 5000);
        });
    }

    targetUser.kick(reason)
      .then(() => {
        const kickEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setDescription(`O usuário ${targetUser.user.tag} foi expulso do servidor.`);

        message.channel.send({ embeds: [kickEmbed] })
          .then(reply => {
            setTimeout(() => {
              reply.delete();
            }, 5000);
          });

        const logChannel = message.guild.channels.cache.get(logChannelId);
        if (logChannel) {
          const reasonText = reason || 'Motivo não fornecido';
          const logEmbed = new MessageEmbed()
            .setColor(config.embedColor)
            .setTitle('Expulsão')
            .addFields(
              { name: 'Moderador', value: `${message.author.tag}\n (${message.author.id})`, inline: true },
              { name: 'Expulso', value: `${targetUser.user.tag}\n (${targetUser.user.id})`, inline: true },
              { name: 'Motivo', value: reasonText, inline: false }
            )
            .setThumbnail(message.guild.iconURL())
            .setTimestamp();

          logChannel.send({ embeds: [logEmbed] })
            .catch(error => {
              console.error(error);
            });
        }
      })
      .catch(error => {
        console.error(error);
        const errorEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setDescription('Ocorreu um erro ao tentar expulsar o usuário.');

        message.channel.send({ embeds: [errorEmbed] })
          .then(reply => {
            setTimeout(() => {
              reply.delete();
            }, 5000);
          });
      });
  },
};
