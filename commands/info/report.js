module.exports = {
  description: "Send your thoughts about this bot to the bot dev",
  aliases: ["suggest", "comment", "feedback"],
  args: true,
  usage: "blah blah blah",
  async execute(message, args) {
    const { owner } = await message.client.fetchApplication();
    await owner.send(
      `***${message.author}*** has some feedback!\n${args.join(" ")}`
    );
    await message.channel.send("Your feedback was sent successfully!");
  },
};
