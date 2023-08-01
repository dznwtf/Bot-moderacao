
module.exports = {
  name: 'cl',
  description: 'Limpa suas mensagens no canal dado o comando.',
  aliases: [''],
  category: 'geral', 
  usage: '',

  async execute(message, args) {

      const messages = await message.channel.messages.fetch();
  
      const userMessages = messages.filter(m => m.author.id === message.author.id);
  
      await message.channel.bulkDelete(userMessages, true);
    },
  };
  