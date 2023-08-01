const { WebhookClient, MessageEmbed } = require('discord.js');
const config = require('./config.json');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(config.sqlite.filename);

function addAllowedChannel(channelId) {
    const sql = 'INSERT INTO allowed_channels (channel_id) VALUES (?)';
    db.run(sql, [channelId], (err) => {
      if (err) {
        console.error('Erro ao adicionar canal ao banco de dados:', err);
      } else {
        console.log(`Canal ${channelId} adicionado ao banco de dados.`);
      }
    });
  }

async function sendLogToWebhook(user, command, channel) {
  try {
    const webhook = new WebhookClient({ url: config.logWebhookURL });

    const logEmbed = new MessageEmbed()
      .setColor(config.embedColor)
      .setTitle('Log de Comando')
      .addFields(
        { name: 'Usuário', value: `${user.tag} (${user.id})` },
        { name: 'Comando', value: command },
        { name: 'Canal', value: `<#${channel.id}> (${channel.name})` },
        { name: 'ID do Servidor', value: channel.guild.id }
      )
      .setTimestamp();

    await webhook.send({ embeds: [logEmbed] });
  } catch (error) {
    console.error('Erro ao enviar o log para a webhook:', error);
  }
}

module.exports = {
  sendLogToWebhook,
  addAllowedChannel,
};
