const config = require('../../config.json');

module.exports = {
  name: 'restart',
  description: 'Reinicia o bot (disponível apenas para o dono).',
  category: 'dono',

  execute(message) {
    if (message.author.id !== config.ownerID) {
      return message.reply('kkk o trouxa tentando reiniciar');
    }

    message.channel.send('Reiniciando o bot...').then(() => {
      process.exit();
    });
  },
};
