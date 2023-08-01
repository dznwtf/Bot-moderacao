const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');

module.exports = {
  name: 'eval',
  description: 'Executa código JavaScript diretamente no bot (somente o dono pode usar).',
  category: 'dono',
  aliases: ['ev'],

  execute(message, args) {
    if (message.author.id !== config.ownerID) {
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

    try {
      const result = eval(args.join(' '));

      const evalResultEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription(`\`\`\`js\n${result}\n\`\`\``);

      message.channel.send({ embeds: [evalResultEmbed] });
    } catch (error) {
      const errorEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription(`Erro ao executar o código:\n\`\`\`js\n${error}\n\`\`\``);

      message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
