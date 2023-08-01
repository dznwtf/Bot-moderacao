const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');
const fs = require('fs');

module.exports = {
  name: 'unlock',
  description: 'Desbloqueia o canal para que todos os usuários possam enviar mensagens.',
  category: 'mod', 
  execute(message, args) {

    const permData = fs.readFileSync('./configperm.json', 'utf-8');
    const permConfig = JSON.parse(permData);

    const isAdmin = message.member.permissions.has('ADMINISTRATOR');
    const isLockRole = message.member.roles.cache.some(role => permConfig['Lock e Unlock'].includes(role.id));

    if (!isAdmin && !isLockRole) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você não tem permissão para usar esse comando.');

      return message.channel.send({ embeds: [noPermissionEmbed] })
        .then(msg => {
          setTimeout(() => {
            msg.delete();
          }, 15000);
        })
        .catch(error => {
          console.error(error);
        });
    }

    const channelPermissions = message.channel.permissionsFor(message.guild.roles.everyone);

    if (!channelPermissions.has('SEND_MESSAGES')) {
      message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
        SEND_MESSAGES: null
      })
        .then(() => {
          const unlockEmbed = new MessageEmbed()
            .setColor(config.embedColor)
            .setDescription('O canal foi desbloqueado. Todos os usuários podem enviar mensagens novamente.');

          message.channel.send({ embeds: [unlockEmbed] })
            .then(msg => {
              setTimeout(() => {
                msg.delete();
              }, 15000);
            })
            .catch(error => {
              console.error(error);
            });
        })
        .catch(error => {
          console.error(error);
          const errorEmbed = new MessageEmbed()
            .setColor(config.embedColor)
            .setDescription('Ocorreu um erro ao desbloquear o canal.');

          message.channel.send({ embeds: [errorEmbed] })
            .then(msg => {
              setTimeout(() => {
                msg.delete();
              }, 15000);
            })
            .catch(error => {
              console.error(error);
            });
        });
    } else {
      const alreadyUnlockedEmbed = new MessageEmbed()
      .setColor(config.embedColor)
        .setDescription('O canal já está desbloqueado.');

      return message.channel.send({ embeds: [alreadyUnlockedEmbed] })
        .then(msg => {
          setTimeout(() => {
            msg.delete();
          }, 15000);
        })
        .catch(error => {
          console.error(error);
        });
    }
  },
};
