module.exports = {
  name: "load",
  description: "loads a command",
  async execute(message, args) {
    if (!args.length)
      return message.channel.send(
        `You didn't pass any command to load, ${message.author}!`
      );
    const commandName = args[0].toLowerCase();
    
    try {
      const newCommand = require(`./${commandName}.js`);
      message.client.commands.set(newCommand.name, newCommand);
    } catch (error) {
      console.log(error);
      message.channel.send(
        `There was an error while loading command \`${command.name}\`:\n\`${error.message}\``
      );
    }

    await message.react("✅")
  },
};
