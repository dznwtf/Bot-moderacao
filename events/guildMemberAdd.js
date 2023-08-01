const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const fs = require('fs');

const invitedMembers = new Map();

module.exports = {
  name: 'guildMemberAdd',
  once: false,

  async execute(member) {
    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);
    const entradaChannelId = logs.Entrada;

    const entradaChannel = member.guild.channels.cache.get(entradaChannelId);
    if (!entradaChannel) return;

    const fetchedInvites = await member.guild.invites.fetch();

    const usedInvite = fetchedInvites.find((invite) => {
      const oldInvite = invitedMembers.get(invite.code);
      invitedMembers.set(invite.code, invite.uses);
      return oldInvite ? invite.uses > oldInvite.uses : invite.uses > 0;
    });

    const inviterId = usedInvite ? usedInvite.inviter.id : member.guild.ownerId;

    const createdDaysAgo = moment().diff(member.user.createdAt, 'days');

    const inviter = member.guild.members.cache.get(inviterId);
    const inviterInviteCount = invitedMembers.get(inviterId) || 0;
    const inviterTag = inviter ? `${inviter.user.username}#${inviter.user.discriminator}` : 'Unknown';

    const convidadoEmbed = new MessageEmbed()
      .setAuthor({
        name: 'Entrou no servidor',
        iconURL: 'https://cdn.discordapp.com/emojis/1065175771578105857.png',
      })
      .setDescription(`${member} **Membro**:\n${member.user.username}\n**Criado há**: **${createdDaysAgo}** dias`)
      .setColor('#00ff00')
      .setTimestamp();

    entradaChannel.send({ embeds: [convidadoEmbed] }).catch(console.error);

    if (member.user.bot) {
      const autoroleData = fs.readFileSync('./logs.json', 'utf-8');
      const autoroleConfig = JSON.parse(autoroleData);
      const autoroleBotRoleId = autoroleConfig.AutoroleBot;

      const autoroleBotRole = member.guild.roles.cache.get(autoroleBotRoleId);
      if (!autoroleBotRole) return;

      try {
        await member.roles.add(autoroleBotRole);
      } catch (error) {
        console.error('Erro ao adicionar o cargo de autorole para bots:', error);
      }
    } else {

      const autoroleData = fs.readFileSync('./logs.json', 'utf-8');
      const autoroleConfig = JSON.parse(autoroleData);
      const autoroleRoleId = autoroleConfig.AutoroleMembro;

      const autoroleRole = member.guild.roles.cache.get(autoroleRoleId);
      if (!autoroleRole) return;

      try {
        await member.roles.add(autoroleRole);
      } catch (error) {
        console.error('Erro ao adicionar o cargo de autorole para membros:', error);
      }
    }
  },
};
