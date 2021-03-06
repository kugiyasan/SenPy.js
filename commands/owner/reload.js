module.exports = {
  description: "Reloads a command",
  aliases: ["rl"],
  args: true,
  hidden: true,
  isOwner: true,
  async execute(message, args) {
    const commandName = args[0].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command)
      return message.channel.send(
        `There is no command with name or alias \`${commandName}\`, ${message.author}!`
      );

    delete require.cache[
      require.resolve(`../../${command.directory}/${command.name}`)
    ];

    try {
      const newCommand = require(`../../${command.directory}/${command.name}`);

      newCommand.category = command.category;
      newCommand.directory = command.directory;
      newCommand.name = command.name;

      message.client.commands.set(newCommand.name, newCommand);
    } catch (error) {
      console.log(error);
      message.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
      );
    }

    await message.react("✅");
  },
};
