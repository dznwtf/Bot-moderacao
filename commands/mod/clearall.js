const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');


module.exports = {
  name: 'clearall',
  description: 'Apaga todas as mensagens no canal.',
  aliases: ['limpartudo'],
  category: 'mod', 
  async execute(message) {

    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você não tem permissão para usar esse comando.');

      return message.channel.send({ embeds: [noPermissionEmbed] });
    }

    try {
      let fetched = await message.channel.messages.fetch({ limit: 100 });
      while (fetched.size > 0) {
        const deletableMessages = fetched.filter(msg => !msg.pinned && msg.deletable);
        const channelDeleted = !message.guild.channels.cache.has(message.channelId);

        if (channelDeleted) {
          console.log(`O canal (${message.channelId}) foi excluído durante o processo de limpeza.`);
          break;
        }

        if (deletableMessages.size > 0) {
          await message.channel.bulkDelete(deletableMessages);
        }

        fetched = await message.channel.messages.fetch({ limit: 100 });
      }

      const successEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Todas as mensagens foram apagadas.');

      const reply = await message.channel.send({ embeds: [successEmbed] });

      setTimeout(() => {
        reply.delete().catch(console.error);
      }, 5000);
    } catch (error) {
      if (error.code === 10003) {
        console.log(`O canal (${message.channelId}) foi excluído durante o processo de limpeza.`);
      } else {
        console.error(error);

        const errorEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setDescription('Ocorreu um erro ao apagar as mensagens.');

        return message.channel.send({ embeds: [errorEmbed] });
      }
    }
  },
};
