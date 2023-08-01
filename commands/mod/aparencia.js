const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'aparencia',
  description: 'Configuração da Aparência do Bot.',
  aliases: ["setavatar", "setusername"],
  category: 'mod', 

  async execute(message) {
    if (!message.member.permissions.has('ADMINISTRATOR')) {
      const embed = new MessageEmbed()
        .setColor(config.embedColor)
        .setDescription('Você não tem permissão para usar esse comando.');

      const sentMessage = await message.reply({ embeds: [embed], ephemeral: true });

      setTimeout(() => {
        sentMessage.delete().catch(console.error);
      }, 5000);

      return;
    }

    const initialMenuEmbed = new MessageEmbed()
      .setColor(config.embedColor)
      .setTitle('Configuração da Aparência.')
      .setDescription('Escolha uma das opção abaixo para configurar o bot.')
      .addFields(
        {
          name: 'Alterar Avatar',
          value: 'Clique no botão abaixo para alterar o avatar do bot.',
        },
        {
          name: 'Alterar Nome do Bot',
          value: 'Clique no botão abaixo para alterar o nome do bot.',
        }
      );

    const components = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('change_avatar')
          .setLabel('Alterar Avatar')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId('change_name')
          .setLabel('Alterar Nome do Bot')
          .setStyle('PRIMARY')
      );

    const sentMessage = await message.channel.send({ embeds: [initialMenuEmbed], components: [components] });

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
      if (interaction.isSelectMenu()) {
        const selectedValue = interaction.values[0];

        if (selectedValue === 'appearance') {
          await interaction.deferUpdate();
          await sentMessage.edit({ embeds: [appearanceEmbed], components: [] });

          const appearanceComponents = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId('change_avatar')
                .setLabel('Alterar Avatar')
                .setStyle('PRIMARY'),
              new MessageButton()
                .setCustomId('change_name')
                .setLabel('Alterar Nome do Bot')
                .setStyle('PRIMARY'),
              new MessageButton()
                .setCustomId('initial_menu')
                .setLabel('Voltar ao Menu Inicial')
                .setStyle('SECONDARY')
            );

          await sentMessage.edit({ components: [appearanceComponents] });
        
        }
      } else if (interaction.customId === 'change_avatar') {
        await interaction.deferReply({ ephemeral: true });
        interaction.followUp({ content: 'Insira o novo avatar do bot ou digite "cancelar" para cancelar o comando.', ephemeral: true });

        const avatarFilter = (msg) => msg.author.id === interaction.user.id;
        const avatarCollector = interaction.channel.createMessageCollector({ filter: avatarFilter, time: 60000 });

        avatarCollector.on('collect', async (msg) => {
          if (msg.content.toLowerCase() === 'cancelar') {
            avatarCollector.stop();
            await interaction.followUp({ content: 'Comando cancelado.', ephemeral: true });
            msg.delete().catch(console.error); 
            return;
          }

          if (!msg.attachments.first()) {
            await interaction.followUp({ content: 'Nenhuma imagem foi enviada. O comando foi cancelado.', ephemeral: true });
            msg.delete().catch(console.error); 
            avatarCollector.stop();
            return;
          }

          await interaction.client.user.setAvatar(msg.attachments.first().url)
            .then(() => interaction.followUp({ content: 'Avatar do bot definido com sucesso!', ephemeral: true }))
            .catch((err) => interaction.followUp({ content: 'Erro ao definir o avatar do bot: ' + err }));
          avatarCollector.stop();
        });

        avatarCollector.on('end', (collected, reason) => {
          if (reason === 'time') {
            interaction.followUp({ content: 'Tempo limite atingido. O comando foi cancelado.', ephemeral: true });
          }
        });
      } else if (interaction.customId === 'change_name') {
        await interaction.deferReply({ ephemeral: true });
        interaction.followUp({ content: 'Insira o novo nome do bot ou digite "cancelar" para cancelar o comando.', ephemeral: true });

        const nameFilter = (msg) => msg.author.id === interaction.user.id;
        const nameCollector = interaction.channel.createMessageCollector({ filter: nameFilter, time: 60000 });

        nameCollector.on('collect', async (msg) => {
          if (msg.content.toLowerCase() === 'cancelar') {
            nameCollector.stop();
            await interaction.followUp({ content: 'Comando cancelado.', ephemeral: true });
            msg.delete().catch(console.error); 
            return;
          }

          try {
            await interaction.client.user.setUsername(msg.content);
            await interaction.followUp({ content: 'Nome do bot definido com sucesso!', ephemeral: true });
          } catch (err) {
            await interaction.followUp({ content: 'Erro ao definir o nome do bot: ' + err });
          }

          nameCollector.stop();
        });

        nameCollector.on('end', async (collected, reason) => {
          if (reason === 'time') {
            await interaction.followUp({ content: 'Tempo limite atingido. O comando foi cancelado.', ephemeral: true });
          }
        });
      } else if (interaction.customId === 'initial_menu') {
        await interaction.deferUpdate();
        await sentMessage.edit({ embeds: [initialMenuEmbed], components: [components] });
      }
    });

 
  },
};
