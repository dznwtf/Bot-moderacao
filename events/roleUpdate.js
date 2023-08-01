const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'roleUpdate',
  once: false,
  async execute(oldCargo, newCargo) {
    if (oldCargo.name === newCargo.name) return;

    const user = await newCargo.guild.fetchAuditLogs({ type: 'ROLE_UPDATE' }).then(auditoria => auditoria.entries.first());
    const usuario = newCargo.guild.members.cache.get(user.executor.id);

    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);
    const canalEditadoChannelId = logs.CargosEditados;

    const canalEditadoChannel = newCargo.guild.channels.cache.get(canalEditadoChannelId);
    if (!canalEditadoChannel) return;

    const embed = new MessageEmbed()
    .setAuthor({ name: 'Cargo Editado', iconURL: 'https://cdn.discordapp.com/emojis/1014736030269702234.webp' })
    .setColor('#00ff00')
      .setDescription(`**Cargo**:\n${newCargo} \`${newCargo.id}\`\n**Moderador**:\n${usuario} \`${usuario.user.username}\``)
      .addFields(
        { name: '**Antigo Nome**', value: oldCargo.name, inline: true },
        { name: '**Novo Nome**', value: newCargo.name, inline: true }
      );

    canalEditadoChannel.send({ embeds: [embed] });
  },
};
