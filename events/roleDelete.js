const { MessageEmbed } = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'roleDelete',
  once: false,
  async execute(cargo) {
    const user = await cargo.guild.fetchAuditLogs({ type: 'ROLE_DELETE' }).then(auditoria => auditoria.entries.first());
    const usuario = cargo.guild.members.cache.get(user.executor.id);

    const logsData = fs.readFileSync('./logs.json', 'utf-8');
    const logs = JSON.parse(logsData);
    const canalExcluidoChannelId = logs.CargosDeletados;

    const canalExcluidoChannel = cargo.guild.channels.cache.get(canalExcluidoChannelId);
    if (!canalExcluidoChannel) return;

    const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setDescription(`**Cargo Excluído**:\n${cargo.name} \`${cargo.id}\`\n**Moderador**:\n${usuario} \`${usuario.user.username}\``)
      .setAuthor({ name: 'Cargo Excluído', iconURL: 'https://cdn.discordapp.com/emojis/1127341782666072186.webp' })
      .setThumbnail('https://cdn.discordapp.com/emojis/1014736293009293318.webp');

    canalExcluidoChannel.send({ embeds: [embed] });
  },
};
