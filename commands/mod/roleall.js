const { MessageEmbed, Permissions } = require('discord.js');
const config = require('./../../config.json');

module.exports = {
  name: 'roleall',
  description: 'Adiciona um cargo a todos os membros do servidor.',
  category: 'mod',
  usage: '@cargo',

  async execute(message, args) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você precisa da permissão de **ADMINISTRADOR** para executar esta função.');

      return message.reply({ embeds: [noPermissionEmbed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 5000);
      });
    } else if (!message.guild.members.me.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {

      const botNoPermissionEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Eu preciso da permissão de **ADMINISTRADOR** para executar esta função.');

      return message.reply({ embeds: [botNoPermissionEmbed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 5000);
      });
    }

    let cargo;
    const roleId = args[0];
    const roleName = args.join(' ');

    if (!roleId && !roleName) {
      const noRoleProvidedEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você precisa fornecer o ID ou nome do cargo.');

      return message.reply({ embeds: [noRoleProvidedEmbed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 5000);
      });
    }

    if (roleId) {
      cargo = message.guild.roles.cache.get(roleId);
    } else if (roleName) {
      cargo = message.guild.roles.cache.find((role) => role.name.toLowerCase() === roleName.toLowerCase());
    }

    if (!cargo) {
      const mentionRegex = /^<@&(\d+)>$/;
      const mentionMatch = mentionRegex.exec(roleName);

      if (mentionMatch) {
        cargo = message.guild.roles.cache.get(mentionMatch[1]);
      }

      if (!cargo) {
        const invalidRoleEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setDescription('Não foi possível encontrar o cargo especificado.');

        return message.reply({ embeds: [invalidRoleEmbed] }).then((msg) => {
          setTimeout(() => {
            msg.delete();
          }, 5000);
        });
      }
    }

    try {
      message.guild.members.fetch().then((members) => {
        const promises = [];

        members.forEach((member) => {
          promises.push(member.roles.add(cargo.id));
        });

        Promise.all(promises)
          .then(() => {
            const successEmbed = new MessageEmbed()
              .setColor(config.embedColor)
              .setDescription(`Foram adicionados ${members.size} usuários ao cargo ${cargo}`);

            message.reply({ embeds: [successEmbed] }).then((msg) => {
              setTimeout(() => {
                msg.delete();
              }, 15000);
            });
          })
          .catch((error) => {
            console.log(error);
          });
      });

      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const logEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setTitle('Adição de Cargo em Massa')
          .addFields(
            { name: 'Moderador', value: `${message.author.tag}\n (${message.author.id})`, inline: true },
            { name: 'Cargo Adicionado', value: `${cargo.name}\n (${cargo.id})`, inline: false },
            { name: 'Número de Membros', value: message.guild.memberCount, inline: false }
          )
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      console.error(error);

      const errorEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Ocorreu um erro ao adicionar o cargo aos membros.');

      return message.reply({ embeds: [errorEmbed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 5000);
      });
    }
  },
};
