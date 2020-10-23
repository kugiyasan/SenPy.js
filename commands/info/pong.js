module.exports = {
  name: "pong",
  description: "haha ping pong",
  hidden: true,
  async execute(message, args) {
    await message.channel.send("Ping... You ugly btw");
  },
};
