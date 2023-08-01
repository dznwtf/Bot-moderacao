const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('./../../config.json');
const fs = require('fs');

module.exports = {
  name: 'ban',
  description: 'Bane um usuário do servidor.',
  category: 'mod',
  aliases: ['banir', "punir"],

  usage: '@user ou id',

  async execute(message, args) {

    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);

    const permData = fs.readFileSync('./configperm.json', 'utf-8');
    const permConfig = JSON.parse(permData);

    const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const motivo = args.slice(1).join(' ') || 'sem motivo';


  const isAdmin = message.member.permissions.has('ADMINISTRATOR');
   const isBanRole = message.member.roles.cache.some(role => permConfig['Ban e Unban'].includes(role.id));

   if (!isAdmin && !isBanRole) {
      const noPerm = new MessageEmbed()
        .setDescription(`${message.author}, você não tem a permissão necessária!`)
        .setColor(config.embedColor);

      return message.channel.send({ embeds: [noPerm] }).then((msg) => {
        setTimeout(() => msg.delete(), 8000);
      });
    }

    if (!Member) {
      const noMember = new MessageEmbed()
        .setDescription(`${message.author}, você precisa mencionar um membro.`)
        .setColor(config.embedColor);

      return message.channel.send({ embeds: [noMember] }).then((msg) => {
        setTimeout(() => msg.delete(), 8000);
      });
    }

    if (message.member.roles.highest.position <= Member.roles.highest.position) {
      const permBaixa = new MessageEmbed()
        .setDescription(`${message.author}, não pode banir um membro com cargo acima do seu!`)
        .setColor(config.embedColor);

      return message.channel.send({ embeds: [permBaixa] }).then((msg) => {
        setTimeout(() => msg.delete(), 8000);
      });
    } else {
      const banConfirmationEmbed = new MessageEmbed()
        .setDescription(`Confirmação para banir ${Member}!\nConfirme clicando no \`\`Martelo\`\`!`)
        .setColor(config.embedColor)
        .setTimestamp();

      const rowBan = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("banir")
            .setLabel('Martelo')
            .setStyle('PRIMARY')
            .setEmoji('🔨')
        );

      const MESSAGE = await message.channel.send({ embeds: [banConfirmationEmbed], components: [rowBan] });
      const filter = (i) => i.user.id === message.author.id;
      const collector = MESSAGE.createMessageComponentCollector({ filter });

      collector.on('collect', async (b) => {
        if (b.customId === 'banir') {
          MESSAGE.delete();

          const embedBan = new MessageEmbed()
     .setAuthor({ name: '| Banido', iconURL: 'https://cdn.discordapp.com/emojis/1060262142395306094.png' })
  .setDescription(`**Membro**:\n${Member.user.username} (${Member.user.id})\n**Moderador**:\n${message.author.username} (${message.author.id})\n**Motivo**:\n\`\`\`${motivo}\`\`\``)
  .setColor(config.embedColor)
  .setTimestamp();


          message.channel.send({ embeds: [embedBan] }).then((msg) => {
            setTimeout(() => msg.delete(), 60000);
          });

       
          const Banimentos = logs.Banimentos;
          const logChannel = message.guild.channels.cache.find(channel => channel.name === Banimentos);
          if (!logChannel) {
            const embedLog = new MessageEmbed()
              .setAuthor({ name: '| Banido', iconURL: 'https://cdn.discordapp.com/emojis/1060262142395306094.png' })
              .setDescription(`**Membro**:\n${Member.user.username} (${Member.user.id})\n**Moderador**:\n${message.author.username} (${message.author.id})\n**Motivo**:\n${motivo}`)
              .setColor(config.embedColor)
              .setThumbnail(Member.user.avatarURL({ dynamic: true }))
              .setTimestamp();
          
            message.channel.send({ embeds: [embedLog] }).catch(console.error);
          } else {
            const embedLog = new MessageEmbed()
              .setAuthor({ name: '| Banido', iconURL: 'https://cdn.discordapp.com/emojis/1060262142395306094.png' })
              .setDescription(`**Membro**:\n${Member.user.username} (${Member.user.id})\n**Moderador**:\n${message.author.username} (${message.author.id})\n**Motivo**:\n${motivo}`)
              .setColor(config.embedColor)
              .setThumbnail(Member.user.avatarURL({ dynamic: true }))
              .setTimestamp();
          
            logChannel.send({ embeds: [embedLog] }).catch(console.error);
          }

          Member.ban({ reason: motivo }).catch(console.error);
        }
      });
    }
  },
};