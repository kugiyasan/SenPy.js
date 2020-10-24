module.exports = {
  hidden: true,
  isOwner: true,
  async execute(message, args) {
    const response = await Function(
      `"use strict";return (${args.join(" ")})`
    )();
    await message.channel.send(response);
  },
};