module.exports = {
  description: "Make this little innocent bot speak for you, you pervert",
  guildOnly: false,
  usage: "<text>",
  async execute(message, args) {
    try {
      await message.channel.send(args.join(" "));
      await message.delete();
    } catch (error) {
      console.log("error in say\n", error);
    }
  },
};
