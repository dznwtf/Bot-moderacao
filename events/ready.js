module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Bot está pronto como ${client.user.tag}`);

    client.user.setPresence({
      activities: [{
        name: 'dzn#0001',
        type: 'PLAYING',
      }],
      status: 'online',
    });
  },

};
