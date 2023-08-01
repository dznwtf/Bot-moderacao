const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');
const fs = require('fs');


module.exports = {
  name: 'lock',
  description: 'Bloqueia o canal para todos os usuários, exceto administradores.',
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

    if (channelPermissions.has('SEND_MESSAGES')) {
      message.channel.permissionOverwrites.create(message.guild.roles.everyone, {
        SEND_MESSAGES: false
      })
        .then(() => {
          const lockEmbed = new MessageEmbed()
            .setColor(config.embedColor)
            .setDescription('O canal foi bloqueado. Apenas administradores podem enviar mensagens agora.');

          message.channel.send({ embeds: [lockEmbed] })
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
            .setDescription('Ocorreu um erro ao bloquear o canal.');

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
      const alreadyLockedEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('O canal já está bloqueado. Utilize o comando `!unlock` para desbloquear.');

      return message.channel.send({ embeds: [alreadyLockedEmbed] })
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
