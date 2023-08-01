const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const config = require('./../../config.json');

module.exports = {
  name: 'serverbanner',
  description: 'Exibe o banner do servidor.',
  aliases: ['guildbanner'],
  category: 'geral', 

  async execute(message) {
    const server = message.guild;
    const bannerURL = server.bannerURL({ format: 'png', size: 4096 });

    if (bannerURL) {
      const embed = new MessageEmbed()
        .setColor(config.embedColor)
        .setTitle(`Banner do Servidor - ${server.name}`)
        .setImage(bannerURL);

      const downloadButton = new MessageButton()
        .setLabel('Download')
        .setStyle('LINK')
        .setEmoji('🖼️')
        .setURL(bannerURL);

      const row = new MessageActionRow().addComponents(downloadButton);

      const sentMessage = await message.channel.send({ embeds: [embed], components: [row] });

      setTimeout(() => {
        sentMessage.delete().catch(console.error);
      }, 8000);
    } else {
      const embed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('O servidor não possui um banner definido.');

      const sentMessage = await message.channel.send({ embeds: [embed] });

      setTimeout(() => {
        sentMessage.delete().catch(console.error);
      }, 8000);
    }
  },
};
