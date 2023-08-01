const { Permissions, MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'nuke',
  description: 'Clona o canal atual com as mesmas permissões, mesmo lugar e mesmo nome.',
  category: 'mod', 

  async execute(message) {
    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
      return;
    }

    if (!message.channel.isText()) {
      const errorEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Esse comando só pode ser usado em canais de texto.');
  
      return message.channel.send({ embeds: [errorEmbed] });
    }

    const channel = message.channel;
    const channelName = channel.name;

    try {
      const clonedChannel = await channel.clone();

      await clonedChannel.setPosition(channel.position);

      await channel.delete();

      const successEmbed = new MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Chat Nukado!')
        .setDescription(`O canal "${channelName}" foi nukado com sucesso!`)
        .setImage('https://i.pinimg.com/originals/0a/7a/da/0a7adad62ecd9e15365889eb8c20cfd1.gif')
        .setFooter({ text: 'Comando requisitado por: ' + message.author.username });

      const sentMessage = await clonedChannel.send({ embeds: [successEmbed] });

      sentMessage.react('💣');
    } catch (error) {
      console.error('Ocorreu um erro ao clonar o canal:', error);
    }
  },
};
