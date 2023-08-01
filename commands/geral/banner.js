const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js');
const axios = require('axios');
const config = require('../../config.json');

module.exports = {
  name: 'banner',
  description: 'Mostra o banner de um usuário',
  aliases: ['bn'],
  category: 'geral', 
  usage: '@user ou id',

  async execute(message, args) {
    let member;

    if (!args.length) {
      member = message.member;
    } else {
      const userId = args[0];
      const isValidId = /^\d+$/.test(userId);

      if (message.mentions.members.size) {
        member = message.mentions.members.first();
      } else if (isValidId) {
        try {
          member = await message.guild.members.fetch(userId);
        } catch (error) {
          console.error(error);
        }
      }

      if (!member) {
        member = message.member;
      }
    }

    axios.get(`https://discord.com/api/v9/users/${member.user.id}`, {
      headers: {
        Authorization: `Bot ${message.client.token}`
      }
    })
      .then(response => {
        const user = response.data;

        const bannerEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setTitle(`Banner de ${member.user.username}`)
          .setFooter({ text: 'Comando requisitado por: ' + message.author.username });

        if (!user.banner) {
          const noBannerEmbed = new MessageEmbed()
            .setColor(config.embedColor)
            .setDescription(`${member.user.username} não possui um banner.`)

          return message.channel.send({ embeds: [noBannerEmbed] })
            .then(sentMessage => {
              setTimeout(() => {
                sentMessage.delete();
              }, 5000);
            })
            .catch(error => {
              console.error(error);
            });
        }

        const bannerURL = `https://cdn.discordapp.com/banners/${member.user.id}/${user.banner}?size=4096`;
        bannerEmbed.setImage(bannerURL);

        const downloadButton = new MessageButton()
          .setLabel('Download')
          .setStyle('LINK')
          .setEmoji('📷')
          .setURL(bannerURL);

        const row = new MessageActionRow()
          .addComponents(downloadButton);

        message.channel.send({ embeds: [bannerEmbed], components: [row] });
      })
      .catch(error => {
        console.error(error);
      });
  },
};