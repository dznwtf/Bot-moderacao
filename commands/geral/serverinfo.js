const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const moment = require('moment');
const config = require('../../config.json');

module.exports = {
  name: 'serverinfo',
  description: 'Mostra informações sobre o servidor.',
  category: 'geral', 

  async execute(message) {
    const server = message.guild;

    const owner = await server.members.fetch(server.ownerId);

    const channels = {
      text: server.channels.cache.filter(channel => channel.type === 'GUILD_TEXT').size,
      voice: server.channels.cache.filter(channel => channel.type === 'GUILD_VOICE').size,
    };

    const createdAt = moment.utc(server.createdAt).format('DD [de] MMMM [de] YYYY [às] HH:mm');

    const joinedAt = message.member ? moment.utc(message.member.joinedAt).format('DD [de] MMMM [de] YYYY [às] HH:mm') : 'N/A';

    const members = {
      total: server.memberCount,
      online: server.members.cache.filter(member => member.presence?.status === 'online').size,
      bots: server.members.cache.filter(member => member.user.bot).size,
    };

    const serverEmbed = new MessageEmbed()
      .setColor(config.embedColor)
      .setTitle(`${server.name}`)
      .addFields(
        { name: '💻 ID', value: server.id, inline: true },
        { name: '👑 Dono', value: `${owner.user.username} (${owner.user.id})`, inline: false },
        { name: '💬 Canais', value: `📝 Texto: ${channels.text}\n🗣 Voz: ${channels.voice}`, inline: false },
        { name: '📅 Criado em', value: createdAt, inline: true },
        { name: '🌟 Entrei aqui em', value: joinedAt, inline: false },
        { name: '👥 Membros', value: `Total: ${members.total}\n🟢 Online: ${members.online}\n🤖 Bots: ${members.bots}`, inline: true }
      )
      .setFooter({ text: `Comando requisitado por: ${message.author.tag}` });

    const avatarButton = new MessageButton()
      .setCustomId('server_avatar')
      .setLabel('Ver Avatar do Servidor')
      .setStyle('PRIMARY');

    const bannerButton = new MessageButton()
      .setCustomId('server_banner')
      .setLabel('Ver Banner do Servidor')
      .setStyle('PRIMARY');

    const buttonRow = new MessageActionRow()
      .addComponents(avatarButton, bannerButton);

    const sentMessage = await message.channel.send({ embeds: [serverEmbed], components: [buttonRow] });

    const filter = (interaction) => interaction.isButton() && interaction.message.id === sentMessage.id;
    const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'server_avatar') {
        if (server.icon) {
          const avatarEmbed = new MessageEmbed()
            .setColor(config.embedColor)
            .setTitle(`Avatar do Servidor ${server.name}`)
            .setImage(server.iconURL({ dynamic: true, size: 256 }))
            .setFooter(`Avatar solicitado por: ${interaction.user.tag}`);

          await interaction.reply({ embeds: [avatarEmbed], ephemeral: true });
        } else {
          await interaction.reply({ content: 'O servidor não possui um avatar.', ephemeral: true });
        }
      } else if (interaction.customId === 'server_banner') {
        if (server.banner) {
          const bannerEmbed = new MessageEmbed()
            .setColor(config.embedColor)
            .setTitle(`Banner do Servidor ${server.name}`)
            .setImage(server.bannerURL({ dynamic: true, size: 256 }))
            .setFooter({ text: `Banner solicitado por: ${interaction.user.tag}` });

          await interaction.reply({ embeds: [bannerEmbed], ephemeral: true });
        } else {
          await interaction.reply({ content: 'O servidor não possui um banner.', ephemeral: true });
        }
      }
    });

    setTimeout(() => {
      sentMessage.delete();
    }, 20000);
  },
};
