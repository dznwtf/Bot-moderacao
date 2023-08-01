const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'roleCreate',
  once: false,
  async execute(cargo) {
    const user = await cargo.guild.fetchAuditLogs({ type: 'ROLE_CREATE' }).then(auditoria => auditoria.entries.first());
    const usuario = cargo.guild.members.cache.get(user.executor.id);

    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);
    const canalCriadoChannelId = logs.CargosCriados;

    const canalCriadoChannel = cargo.guild.channels.cache.get(canalCriadoChannelId);
    if (!canalCriadoChannel) return;

    const embed = new MessageEmbed()
    .setAuthor({ name: 'Cargo Criado', iconURL: 'https://cdn.discordapp.com/emojis/1014736030269702234.webp'})
      .setColor('#00ff00')
      .setDescription(`**Cargo**:\n${cargo} \`${cargo.id}\`\n**Moderador**:\n${usuario} \`${usuario.user.username}\``);

    canalCriadoChannel.send({ embeds: [embed] });
  },
};
