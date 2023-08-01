const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'avatar',
  description: 'Mostra o avatar de um usuário',
  aliases: ['av'],
  category: 'geral', 
  usage: '@user ou id',


  execute(message, args) {
    let user;

    if (args.length > 0) {
      const id = args[0];
      user = message.client.users.cache.get(id);
    }

    if (!user) {
      user = message.mentions.users.first() || message.author;
    }

    const avatar = user.displayAvatarURL({ dynamic: true, size: 4096 });

    const embed = new MessageEmbed()
      .setColor(config.embedColor)
      .setTitle(`Avatar de ${user.username}`)
      .setImage(avatar)
      .setFooter({ text: 'Comando requisitado por: ' + message.author.username });

 

    const button = new MessageButton()
      .setLabel('Download')
      .setStyle('LINK')
      .setURL(avatar)
      .setEmoji('📷');


    const row = new MessageActionRow().addComponents(button);

    message.channel.send({ embeds: [embed], components: [row] }).then(msg => {
        setTimeout(() => {
          msg.delete();
        }, 15000);
    });
  },
};
