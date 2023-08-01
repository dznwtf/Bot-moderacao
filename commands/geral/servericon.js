const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const config = require('./../../config.json');


module.exports = {
  name: 'servericon',
  description: 'Exibe o ícone do servidor.',
  aliases: ['serverav', 'guildicon', 'guildav'],
  category: 'geral', 


  execute(message) {

    const server = message.guild;
    const serverIcon = server.iconURL({ dynamic: true, size: 1024 });
  
    const embed = new MessageEmbed()
      .setColor(config.embedColor)
      .setTitle(`Ícone do Servidor - ${server.name}`);
  
    if (serverIcon) {
      embed.setImage(serverIcon);
      const downloadButton = new MessageButton()
        .setLabel('Download')
        .setStyle('LINK')
        .setEmoji('🖼️')
        .setURL(serverIcon);
  
      const row = new MessageActionRow().addComponents(downloadButton);
      message.channel.send({ embeds: [embed], components: [row] }).then((sentMessage) => {
        setTimeout(() => {
          sentMessage.delete().catch(console.error);
        }, 8000);
      });
    } else {
      embed.setDescription('O servidor não possui um ícone definido.');
      message.channel.send({ embeds: [embed] }).then((sentMessage) => {
        setTimeout(() => {
          sentMessage.delete().catch(console.error);
        }, 8000);
      });
    }
  },
}