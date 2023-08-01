const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');

module.exports = {
  name: 'ping',
  description: 'Mostra a latência do bot',
  category: 'info', 

  execute(message) {
    const embed = new MessageEmbed()
      .setColor(config.embedColor)
      .setTitle('Ping')
      .setDescription('Calculando latência...')
      .setTimestamp();

    message.reply({ embeds: [embed] }).then(reply => {
      const latency = reply.createdTimestamp - message.createdTimestamp;
      const websocketLatency = message.client.ws.ping;

      embed.setDescription(`:zap: Latência: ${latency}ms\n:stopwatch: Latência do WebSocket: ${websocketLatency}ms`);
      reply.edit({ embeds: [embed] });

      setTimeout(() => {
        reply.delete();
      }, 15000);
    });
  },
};