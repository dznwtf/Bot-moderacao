const fs = require('fs');
const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');


module.exports = {
  name: 'setprefix',
  description: 'Altera o prefixo do bot.',
  category: 'mod',
  usage: "prefixo",
  execute(message, args) {

    if (!message.member.permissions.has('ADMINISTRATOR')) {
      return sendErrorEmbed(message, 'Você não tem permissão para usar esse comando.');
    }

    if (!args[0]) {
      return sendErrorEmbed(message, 'Você precisa fornecer um novo prefixo.');
    }

    config.prefix = args[0];

    fs.writeFile('./config.json', JSON.stringify(config, null, 2), (err) => {
      if (err) {
        console.error(err);
        return sendErrorEmbed(message, 'Ocorreu um erro ao salvar o novo prefixo.');
      }

      const embed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription(`O prefixo foi alterado para \`${args[0]}\`.`);

      message.reply({ embeds: [embed] })
        .then((sentMessage) => {
          setTimeout(() => {
            sentMessage.delete();
          }, 30000);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  },
};

function sendErrorEmbed(message, errorMessage) {
  const embed = new MessageEmbed()
    .setColor(config.embedColor)
    .setDescription(errorMessage);

  return message.reply({ embeds: [embed] })
    .then((sentMessage) => {
      setTimeout(() => {
        sentMessage.delete();
      }, 5000);
    })
    .catch((error) => {
      console.error(error);
    });
}
