const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');

module.exports = {
  name: 'clear',
  description: 'Apaga uma quantidade específica de mensagens no canal.',
  aliases: ['purge'],
  category: 'mod', 
  usage: '0 - 99',

  async execute(message, args) {
    if (!message.member.permissions.has('MANAGE_MESSAGES')) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você não tem permissão para usar esse comando.');

      return message.channel.send({ embeds: [noPermissionEmbed] });
    }

    const amount = parseInt(args[0]);

    if (isNaN(amount) || amount < 0 || amount > 99) {
      const invalidAmountEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Por favor, forneça um número entre 0 e 99 para limpar as mensagens.');

      const reply = await message.channel.send({ embeds: [invalidAmountEmbed] });

      setTimeout(() => {
        reply.delete().catch(console.error);
      }, 6000);

      return;
    }

    try {
      const messages = await message.channel.messages.fetch({ limit: amount + 1 });

      const olderThan14Days = messages.filter((msg) => Date.now() - msg.createdTimestamp > 1209600000);

      if (olderThan14Days.size > 0) {
        const cannotDeleteEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setDescription(`Não é possível apagar mensagens que são mais antigas do que 14 dias.`);
          
        return message.channel.send({ embeds: [cannotDeleteEmbed] });
      }

      await message.channel.bulkDelete(messages);

      const successEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription(`Foram apagadas ${amount} mensagens.`);

      const reply = await message.channel.send({ embeds: [successEmbed] });

      setTimeout(() => {
        reply.delete().catch(console.error);
      }, 5000);
    } catch (error) {
      console.error(error);

      const errorEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Ocorreu um erro ao apagar as mensagens.');

      return message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
