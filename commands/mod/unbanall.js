const { MessageEmbed } = require('discord.js');
const config = require('./../../config.json');

module.exports = {
  name: 'unbanall',
  category: 'mod', 

  async execute(message) {

    if (message.author.id !== message.guild.ownerId) {
      const embed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Somente o proprietário do servidor pode usar esse comando.');
    
      message.channel.send({ embeds: [embed] })
        .then((sentMessage) => {
          setTimeout(() => {
            sentMessage.delete();
          }, 10000);
        });
      return;
    }

    const banList = await message.guild.bans.fetch();
    const bannedUsers = banList.map((banEntry) => banEntry.user);

    if (bannedUsers.length === 0) {
      const embed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Não há usuários banidos neste servidor.');
    
      message.channel.send({ embeds: [embed] })
        .then((sentMessage) => {
          setTimeout(() => {
            sentMessage.delete();
          }, 10000);
        });
      return;
    }

    let unbannedCount = 0;

    await Promise.all(
      bannedUsers.map(async (user) => {
        try {
          await message.guild.members.unban(user);
          unbannedCount++;
        } catch (error) {
          console.error(`Erro ao desbanir o usuário ${user.tag}:`, error);
        }
      })
    );

    const embed = new MessageEmbed()
      .setColor(config.embedColor)
      .setDescription(`Foram desbanidos ${unbannedCount} usuários.`);

    message.channel.send({ embeds: [embed] });
  },
};
