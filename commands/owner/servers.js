module.exports = {
  hidden: true,
  isOwner: true,
  async execute(message, args) {
    const title = `Running on ${message.client.guilds.cache.size} servers`;
    const guilds = message.client.guilds.cache.map(
      (g) => `${g.name} memberCount: ${g.memberCount}`
    );
    await message.channel.send([title, ...guilds]);
  },
};
