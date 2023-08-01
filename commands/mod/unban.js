const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');
const fs = require('fs');

const logsData = fs.readFileSync('./logs.json', 'utf-8');
const logs = JSON.parse(logsData);
const logChannelId = logs.Desbanimentos;

module.exports = {
  name: 'unban',
  description: 'Desbane um usuário do servidor.',
  category: 'mod',
  aliases: ['desbanir'],
  usage: 'id',

  async execute(message, args) {
    const authorMember = message.member;
    const bannedUserID = args[0];

    const permData = fs.readFileSync('./configperm.json', 'utf-8');
    const permConfig = JSON.parse(permData);

  const isAdmin = message.member.permissions.has('ADMINISTRATOR');
   const isBanRole = message.member.roles.cache.some(role => permConfig['Ban e Unban'].includes(role.id));

   if (!isAdmin && !isBanRole) {
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

    if (!bannedUserID || !/^\d+$/.test(bannedUserID)) {
      const invalidUserIDEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você precisa fornecer um ID de usuário válido. Exemplo: `!unban 1234567890`.');

      return message.channel.send({ embeds: [invalidUserIDEmbed] })
        .then(msg => {
          setTimeout(() => {
            msg.delete();
          }, 15000);
        })
        .catch(error => {
          console.error(error);
        });
    }

    try {
      const bannedUsers = await message.guild.bans.fetch();
      const banInfo = bannedUsers.get(bannedUserID);

      if (!banInfo) {
        
        const userNotBannedEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setDescription('O usuário não está banido.');

        return message.channel.send({ embeds: [userNotBannedEmbed] })
          .then(msg => {
            setTimeout(() => {
              msg.delete();
            }, 10000);
          })
          .catch(error => {
            console.error(error);
          });
      }

      const userTag = banInfo.user.tag;

      const unbanEmbed = new MessageEmbed()
        .setAuthor({ name: '| Desbanido', iconURL: 'https://cdn.discordapp.com/emojis/1060262142395306094.png' })
        .setDescription(`**Membro**: ${userTag} (${bannedUserID})\n**Moderador**: ${message.author.tag} (${message.author.id})`)
        .setColor(config.embedColor)
        .setThumbnail(banInfo.user.avatarURL({ dynamic: true }))
        .setTimestamp();

      await message.guild.members.unban(bannedUserID);

      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        logChannel.send({ embeds: [unbanEmbed] });
      }

      message.channel.send({ embeds: [unbanEmbed] })
        .then(msg => {
          setTimeout(() => {
            msg.delete();
          }, 10000);
        })
        .catch(error => {
          console.error(error);
        });
    } catch (error) {
      console.error(error);
      const userNotBannedEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('O usuário não está banido ou ocorreu um erro ao buscar informações do banimento.');

      return message.channel.send({ embeds: [userNotBannedEmbed] })
        .then(msg => {
          setTimeout(() => {
            msg.delete();
          }, 10000);
        })
        .catch(error => {
          console.error(error);
        });
    };
  },
};
