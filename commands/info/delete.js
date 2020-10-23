module.exports = {
  name: "delete",
  description: "delete the last messages of the bot",
  aliases: ["purge", "del"],
  usage: "<number of messages to delete>",
  async execute(message, args) {
    const count = Math.min(50, parseInt(args[0]) || 1);
    if (count < 1) return;
    var messages = [];

    message.channel.messages.fetch({ limit: 100 }).then(async (msgs) => {
      for (const [_, msg] of msgs)
        if (msg.author.id === message.client.user.id)
          if (messages.push(msg) >= count) break;

      try {
        await message.channel.bulkDelete(messages);
        await message.delete();
      } catch {
        for (const msg of messages) await msg.delete();
      }
    });
  },
};
