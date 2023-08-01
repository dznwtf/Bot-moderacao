const { MessageEmbed, MessageButton, MessageActionRow, Permissions } = require('discord.js');
const moment = require('moment');
const config = require('../../config.json');

module.exports = {
  name: 'userinfo',
  description: 'Mostra informações sobre um usuário.',
  aliases: ['ui'],
  category: 'geral', 
  usage: '@user ou id',


  async execute(message, args) {
    const target = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

    const joinedAt = moment.utc(target.joinedAt).format('DD/MM/YYYY, HH:mm:ss');
    const createdAt = moment.utc(target.user.createdAt).format('DD/MM/YYYY, HH:mm:ss');

    const roles = target.roles.cache
      .filter(role => role.id !== message.guild.id)
      .map(role => role.name)
      .join(', ');

      const userEmbed = new MessageEmbed()
      .setColor(config.embedColor)
      .setTitle(`Informações de ${target.user.username}`)
      .setThumbnail(target.user.displayAvatarURL({ dynamic: true, size: 128 }))
      .addFields(
        { name: ':label: Nome do Usuário', value: target.user.username, inline: true },
        { name: ':id: ID', value: target.user.id, inline: false },
        { name: ':date: Entrou em', value: joinedAt, inline: true },
        { name: ':calendar_spiral:  Criado em', value: createdAt, inline: true }
      )
      .setFooter({ text: `Comando requisitado por: ${message.author.username}` });
    

    const avatarButton = new MessageButton()
      .setCustomId('avatar_global')
      .setLabel('Ver avatar global')
      .setStyle('PRIMARY');

    const permissionsButton = new MessageButton()
      .setCustomId('permissions_server')
      .setLabel('Ver permissões no servidor')
      .setStyle('PRIMARY');

    const buttonRow = new MessageActionRow()
      .addComponents(avatarButton, permissionsButton);

    try {
      const sentMessage = await message.channel.send({ embeds: [userEmbed], components: [buttonRow] });

      setTimeout(() => {
        sentMessage.delete();
      }, 20000);

      const filter = (interaction) => interaction.isButton() && interaction.message.id === sentMessage.id;

      const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'avatar_global') {
            const avatarEmbed = new MessageEmbed()
            .setColor(config.embedColor)
            .setTitle(`Avatar de ${target.user.username}`)
            .setImage(target.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setFooter({ text: `Avatar solicitado por: ${interaction.user.username}` });
          

          await interaction.reply({ embeds: [avatarEmbed], ephemeral: true });
        } else if (interaction.customId === 'permissions_server') {
          const permissions = target.permissions.serialize();
          const permissionKeys = Object.keys(permissions);
          const allowedPermissions = permissionKeys.filter((key) => permissions[key] === true);
          const deniedPermissions = permissionKeys.filter((key) => permissions[key] === false);

          const permissionsEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setTitle(`Permissões de ${target.user.username}`)
          .addField('Permissões Permitidas', allowedPermissions.join(', ') || 'Nenhuma', true)
          .addField('Permissões Negadas', deniedPermissions.join(', ') || 'Nenhuma', true)
          .setFooter({ text: `Permissões solicitadas por: ${interaction.user.username}` });
        

          await interaction.reply({ embeds: [permissionsEmbed], ephemeral: true });
        }
      });

     
    } catch (error) {
      console.error('deu erro aqui vei kk:', error);
    }
  },
};
