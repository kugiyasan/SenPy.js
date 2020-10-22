module.exports = {
  name: "pong",
  description: "command template",
  aliases: ["template", "example"],
  args: true,
  cooldown: 3,
  guildOnly: false,
  usage: "<nothing> <here>",
  async execute(message, args) {
    await message.channel.send("It's empty");
  },
};
