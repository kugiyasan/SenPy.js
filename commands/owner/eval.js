module.exports = {
  hidden: true,
  isOwner: true,
  async execute(message, args) {
    const response = await eval(`(${args.join(" ")})`);
    await message.channel.send(response);
  },
};
