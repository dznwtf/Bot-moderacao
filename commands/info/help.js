const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'help',
  description: 'Exibe a lista de comandos do bot.',
  category: 'info',

  async execute(message) {
    const commands = message.client.commands;
    const isDM = message.channel.type === 'DM';

    const categories = ['dono', 'geral', 'info', 'mod'];

    const initialMenuEmbed = new MessageEmbed()
      .setColor(config.embedColor)
      .setTitle('Ajuda - Lista de Comandos')
      .setDescription('Selecione uma categoria para ver os comandos disponíveis.');

    const selectMenu = new MessageSelectMenu()
      .setCustomId('category_select')
      .setPlaceholder('Selecione uma categoria');

    categories.forEach((category) => {
      const shortLabel = category.substring(0, 25);
      let emoji;
      if (category === 'info') {
        emoji = 'ℹ️';
      } else if (category === 'mod') {
        emoji = '🔨';
      } else if (category === 'dono') {
        emoji = '👑'; 
      } else if (category === 'geral') {
        emoji = '🌐';
      } else {
        emoji = '❓';
      }

      selectMenu.addOptions({
        label: shortLabel,
        description: `Comandos da categoria ${category}`,
        value: category,
        emoji: emoji,
      });
    });

    const components = new MessageActionRow().addComponents(selectMenu);



    try {
      const sentMessage = await (isDM ? message.author : message.channel).send({
        embeds: [initialMenuEmbed],
        components: [components],
      });

      if (isDM) {
        const replyEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setDescription('Lista de comandos enviada na sua DM!');
        message.reply({ embeds: [replyEmbed], ephemeral: true });
      }

      const filter = (interaction) => interaction.isSelectMenu();
      const collector = sentMessage.createMessageComponentCollector({ filter, time: 60000 });

      collector.on('collect', async (interaction) => {
        if (interaction.user.id !== message.author.id) {
          await interaction.reply({ content: 'Apenas o autor do comando pode usar esse menu.', ephemeral: true });
          return;
        }

        const selectedCategory = interaction.values[0];
        const categoryCommands = commands.filter((cmd) => cmd.category === selectedCategory);

        const categoryEmbed = new MessageEmbed()
          .setColor(config.embedColor)
          .setTitle(`Ajuda - Comandos da categoria ${selectedCategory}`);

        categoryCommands.forEach((cmd) => {
          categoryEmbed.addFields({
            name: `\`${cmd.name}\``,
            value: `**Descrição**: ${cmd.description || 'Sem descrição.'}\n**Aliases**: ${cmd.aliases ? cmd.aliases.join(', ') : 'Nenhum'}\n**Como Usar**: ${config.prefix}${cmd.name} ${cmd.usage || ''}`,
          });
        });

        await interaction.deferUpdate();
        await sentMessage.edit({ embeds: [categoryEmbed] });
      });

      collector.on('end', () => {
        const disabledComponents = new MessageActionRow().addComponents(selectMenu.setDisabled(true));
        sentMessage.edit({ components: [disabledComponents] });
      });
    } catch (error) {
      message.channel.send({ embeds: [initialMenuEmbed], components: [components] });
    }
  },
};
