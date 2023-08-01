const { MessageEmbed, Util } = require('discord.js');
const config = require('./../../config.json');
const fs = require('fs');

module.exports = {
  name: 'mute',
  description: 'Silencia um usuário no servidor.',
  aliases: ['silence'],
  category: 'mod', 
  usage: '@user ou id',

  async execute(message, args) {
    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);

    const logChannelId = logs.Mute;
    
    const permData = fs.readFileSync('./configperm.json', 'utf-8');
    const permConfig = JSON.parse(permData);

    const isAdmin = message.member.permissions.has('ADMINISTRATOR');
    const isMuteRole = message.member.roles.cache.some(role => permConfig['Mute e Unmute'].includes(role.id));

    if (!isAdmin && !isMuteRole) {
      const noPermissionEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você não tem permissão para usar esse comando.');

      const botMessage = await message.channel.send({ embeds: [noPermissionEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
      return;
    }

    let target;
    const targetMention = args[0];

    if (!targetMention) {
      const invalidTargetEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Por favor, mencione um usuário válido para mutar ou forneça o ID do usuário.');

      const botMessage = await message.channel.send({ embeds: [invalidTargetEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
      return;
    }

    const mentionRegex = /<@!?(\d+)>/;
    const matches = targetMention.match(mentionRegex);
    const targetId = matches ? matches[1] : targetMention;

    try {
      target = await message.guild.members.fetch(targetId);
    } catch (error) {
      console.error(error);
      const invalidTargetEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Não foi possível encontrar o usuário.');

      const botMessage = await message.channel.send({ embeds: [invalidTargetEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
      return;
    }

    let role = message.guild.roles.cache.find(role => role.name === 'Muted-bot');
    if (!role) {
      try {
        role = await message.guild.roles.create({
          name: 'Muted-bot',
          permissions: ['VIEW_CHANNEL']
        });

        message.guild.channels.cache.forEach(channel => {
          channel.permissionOverwrites.create(role, {
            SEND_MESSAGES: false,
            ADD_REACTIONS: false,
            STREAM: false
          });

          if (channel.type === 'GUILD_VOICE') {
            channel.permissionOverwrites.create(role, {
              SPEAK: false
            });
          }
        });

        const roleCreatedEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setDescription('O cargo "Muted-bot" foi criado e configurado com sucesso.');

        await message.channel.send({ embeds: [roleCreatedEmbed] });
      } catch (error) {
        console.error(error);

        const roleErrorEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setDescription('Ocorreu um erro ao criar e configurar o cargo de Muted-bot.');

        const botMessage = await message.channel.send({ embeds: [roleErrorEmbed] });
        setTimeout(() => botMessage.delete(), 15000);
        return;
      }
    }

    if (target.roles.cache.has(role.id)) {
      const alreadyMutedEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription(`O usuário ${target} já está mutado.`);

      const botMessage = await message.channel.send({ embeds: [alreadyMutedEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
      return;
    }

    if (target.roles.highest.comparePositionTo(message.member.roles.highest) >= 0) {
      const higherRoleEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você não pode mutar um usuário com um cargo igual ou maior que o seu.');

      const botMessage = await message.channel.send({ embeds: [higherRoleEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
      return;
    }

    args.shift(); 

    const motivo = args.length > 0 ? Util.cleanContent(args.join(' '), message) : 'Motivo não inserido';

    try {
      await target.roles.add(role);
      
      if (target.voice.channel) {
        await target.voice.setMute(true);
      }

      const successEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription(`O usuário ${target} foi mutado com sucesso.`);

      const botMessage = await message.channel.send({ embeds: [successEmbed] });
      setTimeout(() => botMessage.delete(), 15000);

      const motivo = args.length > 0 ? Util.cleanContent(args.join(' '), message) : 'Motivo não inserido';

      const logChannel = message.guild.channels.cache.get(logChannelId);
      if (logChannel) {
        const logEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setTitle('Usuário Mutado')
          .setDescription(`**Usuário**: ${target.user.username} (${target.user.id})\n**Moderador**: ${message.author.username} (${message.author.id})`)
          .addFields(
            { name: 'Motivo', value: motivo }
          )
          .setTimestamp();

        logChannel.send({ embeds: [logEmbed] });
      }
    } catch (error) {
      console.error(error);

      const errorEmbed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Ocorreu um erro ao silenciar o usuário.');

      const botMessage = await message.channel.send({ embeds: [errorEmbed] });
      setTimeout(() => botMessage.delete(), 15000);
    }
  },
};
